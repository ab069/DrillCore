from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class Rig(Base):
    __tablename__ = "rigs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    rig_name: Mapped[str] = mapped_column(String(255), nullable=False)
    rig_type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="standby")
    depth_current: Mapped[float] = mapped_column(Float, default=0.0)
    depth_target: Mapped[float] = mapped_column(Float, default=0.0)
    rop_rate_ft_hr: Mapped[float] = mapped_column(Float, default=0.0)
    mud_weight: Mapped[float] = mapped_column(Float, default=0.0)
    bit_type: Mapped[str] = mapped_column(String(50), default="PDC")
    bit_hours: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="rigs")
    operations = relationship("DrillingOperation", back_populates="rig", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="rig", cascade="all, delete-orphan")
