from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.nasa_client import fetch_from_nasa
from app.db.database import get_db
from app.models.models import CelestialEvent
from app.services.notifiers import check_and_notify_cme

router = APIRouter()


@router.get("/cme", summary="Ejeções de Massa Coronal (CME)")
async def get_cme(startDate: str = None, endDate: str = None, db: Session = Depends(get_db)):
    """
    Retorna dados de Ejeções de Massa Coronal do banco DONKI da NASA e registra no banco.
    """
    params = {}
    if startDate:
        params["startDate"] = startDate
    if endDate:
        params["endDate"] = endDate
    
    data = await fetch_from_nasa("/DONKI/CME", params=params)
    
    # Persistence: Log CMEs
    if isinstance(data, list):
        for item in data:
            event_id = item.get("activityID")
            # Avoid duplicates (NASA IDs are stable)
            existing = db.query(CelestialEvent).filter(CelestialEvent.nasa_id == event_id).first()
            if not existing:
                new_event = CelestialEvent(
                    event_type="CME",
                    nasa_id=event_id,
                    raw_data=item
                )
                db.add(new_event)
                
                # Tactical Alert Trigger
                await check_and_notify_cme(event_id)
        db.commit()
    
    return data


@router.get("/solar-flare", summary="Explosões Solares (Solar Flare)")
async def get_solar_flare(startDate: str = None, endDate: str = None, db: Session = Depends(get_db)):
    """
    Retorna dados de explosões solares do banco DONKI da NASA e registra no banco.
    """
    params = {}
    if startDate:
        params["startDate"] = startDate
    if endDate:
        params["endDate"] = endDate
    
    data = await fetch_from_nasa("/DONKI/FLR", params=params)
    
    # Persistence: Log Flares
    if isinstance(data, list):
        for item in data:
            event_id = item.get("flrID")
            existing = db.query(CelestialEvent).filter(CelestialEvent.nasa_id == event_id).first()
            if not existing:
                new_flare = CelestialEvent(
                    event_type="FLR",
                    nasa_id=event_id,
                    severity_rank=item.get("classType"),
                    raw_data=item
                )
                db.add(new_flare)
        db.commit()
        
    return data


@router.get("/geomagnetic-storm", summary="Tempestades Geomagnéticas (GST)")
async def get_geomagnetic_storm(startDate: str = None, endDate: str = None):
    """
    Retorna dados de tempestades geomagnéticas do banco DONKI da NASA.
    """
    params = {}
    if startDate:
        params["startDate"] = startDate
    if endDate:
        params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/GST", params=params)
