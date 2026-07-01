from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.alert import Alert
from ..models.rig import Rig
from ..schemas.alert import AlertResponse, AlertStats


async def get_alerts(db: AsyncSession, user_id: int) -> list[AlertResponse]:
    result = await db.execute(
        select(Alert).where(Alert.user_id == user_id).order_by(Alert.created_at.desc())
    )
    return [AlertResponse.model_validate(a) for a in result.scalars().all()]


async def get_alert_stats(db: AsyncSession, user_id: int) -> AlertStats:
    result = await db.execute(select(Alert).where(Alert.user_id == user_id))
    alerts = result.scalars().all()
    return AlertStats(
        total=len(alerts),
        active=sum(1 for a in alerts if a.status == "active"),
        critical=sum(1 for a in alerts if a.severity == "critical"),
    )


async def update_alert_status(db: AsyncSession, alert_id: int, user_id: int, status: str) -> AlertResponse | None:
    result = await db.execute(select(Alert).where(Alert.id == alert_id, Alert.user_id == user_id))
    alert = result.scalar_one_or_none()
    if not alert:
        return None
    alert.status = status
    await db.commit()
    await db.refresh(alert)
    return AlertResponse.model_validate(alert)


async def create_alert_from_analysis(db: AsyncSession, user_id: int, rig_id: int, title: str, alert_type: str, severity: str, description: str) -> Alert:
    alert = Alert(user_id=user_id, rig_id=rig_id, title=title, alert_type=alert_type, severity=severity, description=description)
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    return alert
