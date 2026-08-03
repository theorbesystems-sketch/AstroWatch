from fastapi import APIRouter
from app.services.nasa_client import fetch_from_nasa

router = APIRouter()

@router.get("/tle", summary="Two Line Element Data (TLE)")
async def get_tle(satellite_number: str = None):
    """
    Retorna posições orbitais para um objeto ou satélite específico.
    Exemplo: TLE API da NASA ou Space-Track. (Mapeamento inicial NASA)
    """
    # A URL exata the TLE na NASA varia, mas a casca será essa.
    data = await fetch_from_nasa("/tle")
    return data

@router.get("/satellite-situation", summary="Satellite Situation Center (SSC)")
async def get_satellite_situation():
    """
    Casts geocentric spacecraft location information into a framework of geophysical regions.
    """
    # SSC Webservice API
    data = await fetch_from_nasa("/ssc/api/system")
    return data

@router.get("/gibs", summary="Global Imagery Browse Services (GIBS)")
async def get_gibs():
    """
    Entrega imagens de satélite completas para exploração interativa.
    """
    data = await fetch_from_nasa("/gibs/v1/image")
    return data
