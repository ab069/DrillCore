from datetime import datetime

from pydantic import BaseModel


class RigCreate(BaseModel):
    rig_name: str
    rig_type: str
    status: str = "standby"
    depth_current: float = 0.0
    depth_target: float = 0.0
    rop_rate_ft_hr: float = 0.0
    mud_weight: float = 0.0
    bit_type: str = "PDC"
    bit_hours: float = 0.0


class RigUpdate(BaseModel):
    rig_name: str | None = None
    rig_type: str | None = None
    status: str | None = None
    depth_current: float | None = None
    depth_target: float | None = None
    rop_rate_ft_hr: float | None = None
    mud_weight: float | None = None
    bit_type: str | None = None
    bit_hours: float | None = None


class RigResponse(BaseModel):
    id: int
    user_id: int
    rig_name: str
    rig_type: str
    status: str
    depth_current: float
    depth_target: float
    rop_rate_ft_hr: float
    mud_weight: float
    bit_type: str
    bit_hours: float
    created_at: datetime

    model_config = {"from_attributes": True}


class RigStats(BaseModel):
    total_rigs: int
    active_drilling: int
    avg_rop: float
    avg_depth: float
