import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.database import get_db, async_session_factory
from ..core.security import decode_token
from ..models.rig import Rig
from ..agents.drill_analyzer import drill_analyzer
from ..services.alert_service import create_alert_from_analysis

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, ws: WebSocket):
        await ws.accept()
        self.active[user_id] = ws

    def disconnect(self, user_id: int):
        self.active.pop(user_id, None)

    async def send_alert(self, user_id: int, alert: dict):
        ws = self.active.get(user_id)
        if ws:
            await ws.send_json(alert)


manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, token: str):
    payload = decode_token(token)
    if payload is None or payload.get("sub") != str(user_id):
        await websocket.close(code=4001)
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg.get("action") == "analyze":
                async with async_session_factory() as db:
                    result = await db.execute(select(Rig).where(Rig.id == int(msg["rig_id"]), Rig.user_id == user_id))
                    rig = result.scalar_one_or_none()
                    if not rig:
                        await websocket.send_json({"error": "Rig not found"})
                        continue

                    rop_analysis = drill_analyzer.analyze_rop(rig.rop_rate_ft_hr, rig.depth_current, rig.bit_hours)
                    mud_analysis = drill_analyzer.analyze_mud_pressure(rig.mud_weight, rig.depth_current)
                    risk_score = drill_analyzer.calculate_risk_score(
                        rop_analysis["efficiency_pct"], mud_analysis["stability"], rop_analysis["bit_wear_pct"]
                    )

                    findings = []
                    if rop_analysis["efficiency_pct"] < 60:
                        findings.append(f"Low ROP efficiency: {rop_analysis['efficiency_pct']}% — {rop_analysis['recommendation']}")
                    if mud_analysis["stability"] != "stable":
                        findings.append(f"Mud instability: margin {mud_analysis['margin_ppg']} ppg — {mud_analysis['recommendation']}")
                    if rop_analysis["bit_wear_pct"] > 60:
                        findings.append(f"Bit wear at {rop_analysis['bit_wear_pct']}% — consider bit replacement")

                    if risk_score >= 50:
                        alert_type = "equipment_fail" if rop_analysis["bit_wear_pct"] > 80 else "mud_loss"
                        severity = "critical" if risk_score >= 75 else "high"
                        alert = await create_alert_from_analysis(
                            db, user_id, rig.id,
                            f"Risk Alert: {rig.rig_name}",
                            alert_type, severity,
                            "; ".join(findings) if findings else "Elevated risk score detected"
                        )
                        await manager.send_alert(user_id, {
                            "type": "alert",
                            "id": alert.id,
                            "title": alert.title,
                            "alert_type": alert.alert_type,
                            "severity": alert.severity,
                            "description": alert.description,
                            "created_at": alert.created_at.isoformat(),
                        })

                    report = drill_analyzer.generate_drill_report(rig.rig_name, risk_score, findings)
                    await websocket.send_json({
                        "type": "analysis",
                        "rig_id": rig.id,
                        "rig_name": rig.rig_name,
                        "rop_analysis": rop_analysis,
                        "mud_analysis": mud_analysis,
                        "risk_score": risk_score,
                        "report": report,
                    })
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception:
        manager.disconnect(user_id)
