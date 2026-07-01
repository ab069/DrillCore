from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.rig import Rig
from ..schemas.rig import RigCreate, RigResponse, RigStats, RigUpdate


async def create_rig(db: AsyncSession, user_id: int, data: RigCreate) -> RigResponse:
    rig = Rig(user_id=user_id, **data.model_dump())
    db.add(rig)
    await db.commit()
    await db.refresh(rig)
    return RigResponse.model_validate(rig)


async def get_rigs(db: AsyncSession, user_id: int) -> list[RigResponse]:
    result = await db.execute(select(Rig).where(Rig.user_id == user_id).order_by(Rig.created_at.desc()))
    rigs = result.scalars().all()
    return [RigResponse.model_validate(r) for r in rigs]


async def get_rig(db: AsyncSession, rig_id: int, user_id: int) -> RigResponse | None:
    result = await db.execute(select(Rig).where(Rig.id == rig_id, Rig.user_id == user_id))
    rig = result.scalar_one_or_none()
    return RigResponse.model_validate(rig) if rig else None


async def update_rig(db: AsyncSession, rig_id: int, user_id: int, data: RigUpdate) -> RigResponse | None:
    result = await db.execute(select(Rig).where(Rig.id == rig_id, Rig.user_id == user_id))
    rig = result.scalar_one_or_none()
    if not rig:
        return None
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(rig, key, val)
    await db.commit()
    await db.refresh(rig)
    return RigResponse.model_validate(rig)


async def delete_rig(db: AsyncSession, rig_id: int, user_id: int) -> bool:
    result = await db.execute(select(Rig).where(Rig.id == rig_id, Rig.user_id == user_id))
    rig = result.scalar_one_or_none()
    if not rig:
        return False
    await db.delete(rig)
    await db.commit()
    return True


async def get_rig_stats(db: AsyncSession, user_id: int) -> RigStats:
    result = await db.execute(select(Rig).where(Rig.user_id == user_id))
    rigs = result.scalars().all()
    total = len(rigs)
    active = sum(1 for r in rigs if r.status == "drilling")
    avg_rop = round(sum(r.rop_rate_ft_hr for r in rigs) / total, 2) if total else 0.0
    avg_depth = round(sum(r.depth_current for r in rigs) / total, 2) if total else 0.0
    return RigStats(total_rigs=total, active_drilling=active, avg_rop=avg_rop, avg_depth=avg_depth)
