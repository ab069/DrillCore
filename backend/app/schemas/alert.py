from datetime import datetime

from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: int
    user_id: int
    rig_id: int
    title: str
    alert_type: str
    severity: str
    status: str
    description: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AlertStats(BaseModel):
    total: int
    active: int
    critical: int
