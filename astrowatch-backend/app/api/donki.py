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


@router.get("/cme-analysis", summary="Análise de CME (CME Analysis)")
async def get_cme_analysis(startDate: str = None, endDate: str = None, mostAccurateOnly: bool = True, speed: int = 0, halfAngle: int = 0, catalog: str = "ALL"):
    params = {"mostAccurateOnly": str(mostAccurateOnly).lower(), "speed": speed, "halfAngle": halfAngle, "catalog": catalog}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/CMEAnalysis", params=params)


@router.get("/ips", summary="Choque Interplanetário (IPS)")
async def get_ips(startDate: str = None, endDate: str = None, location: str = "ALL", catalog: str = "ALL"):
    params = {"location": location, "catalog": catalog}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/IPS", params=params)


@router.get("/sep", summary="Partículas Energéticas Solares (SEP)")
async def get_sep(startDate: str = None, endDate: str = None):
    params = {}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/SEP", params=params)


@router.get("/mpc", summary="Cruzamento da Magnetopausa (MPC)")
async def get_mpc(startDate: str = None, endDate: str = None):
    params = {}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/MPC", params=params)


@router.get("/rbe", summary="Enhancement do Cinturão de Radiação (RBE)")
async def get_rbe(startDate: str = None, endDate: str = None):
    params = {}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/RBE", params=params)


@router.get("/hss", summary="Fluxo de Alta Velocidade (HSS)")
async def get_hss(startDate: str = None, endDate: str = None):
    params = {}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/HSS", params=params)


@router.get("/wsa-enlil", summary="Simulações WSA+Enlil")
async def get_wsa_enlil(startDate: str = None, endDate: str = None):
    params = {}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/WSAEnlilSimulations", params=params)


@router.get("/notifications", summary="Notificações DONKI")
async def get_notifications(startDate: str = None, endDate: str = None, type: str = "all"):
    params = {"type": type}
    if startDate: params["startDate"] = startDate
    if endDate: params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/notifications", params=params)
