from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..schemas.rig import RigCreate, RigResponse, RigStats, RigUpdate
from ..services.rig_service import create_rig, delete_rig, get_rig, get_rig_stats, get_rigs, update_rig

router = APIRouter(prefix="/api/rigs", tags=["rigs"])


@router.get("/", response_model=list[RigResponse])
async def list_rigs(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_rigs(db, user.id)


@router.post("/", response_model=RigResponse, status_code=status.HTTP_201_CREATED)
async def add_rig(data: RigCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await create_rig(db, user.id, data)


@router.get("/stats", response_model=RigStats)
async def stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_rig_stats(db, user.id)


@router.get("/{rig_id}", response_model=RigResponse)
async def get_single_rig(rig_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    rig = await get_rig(db, rig_id, user.id)
    if not rig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rig not found")
    return rig


@router.put("/{rig_id}", response_model=RigResponse)
async def update_single_rig(rig_id: int, data: RigUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    rig = await update_rig(db, rig_id, user.id, data)
    if not rig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rig not found")
    return rig


@router.delete("/{rig_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_single_rig(rig_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    deleted = await delete_rig(db, rig_id, user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rig not found")
