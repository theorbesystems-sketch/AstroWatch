from fastapi import APIRouter
from app.services.nasa_client import fetch_from_nasa

router = APIRouter()


@router.get("/cme", summary="Ejeções de Massa Coronal (CME)")
async def get_cme(startDate: str = None, endDate: str = None):
    """
    Retorna dados de Ejeções de Massa Coronal do banco DONKI da NASA.
    Parâmetros opcionais: startDate e endDate no formato YYYY-MM-DD.
    """
    params = {}
    if startDate:
        params["startDate"] = startDate
    if endDate:
        params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/CME", params=params)


@router.get("/solar-flare", summary="Explosões Solares (Solar Flare)")
async def get_solar_flare(startDate: str = None, endDate: str = None):
    """
    Retorna dados de explosões solares do banco DONKI da NASA.
    """
    params = {}
    if startDate:
        params["startDate"] = startDate
    if endDate:
        params["endDate"] = endDate
    return await fetch_from_nasa("/DONKI/FLR", params=params)


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
