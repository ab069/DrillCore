from datetime import datetime

from pydantic import BaseModel


class OperationResponse(BaseModel):
    id: int
    user_id: int
    rig_id: int
    phase: str
    start_time: datetime | None = None
    end_time: datetime | None = None
    progress_pct: float
    issues: dict | None = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
