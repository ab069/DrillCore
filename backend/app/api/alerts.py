from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..schemas.alert import AlertResponse, AlertStats
from ..services.alert_service import get_alerts, get_alert_stats, update_alert_status

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/", response_model=list[AlertResponse])
async def list_alerts(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_alerts(db, user.id)


@router.get("/stats", response_model=AlertStats)
async def stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_alert_stats(db, user.id)


@router.patch("/{alert_id}/status", response_model=AlertResponse)
async def update_status(alert_id: int, new_status: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    alert = await update_alert_status(db, alert_id, user.id, new_status)
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")
    return alert
