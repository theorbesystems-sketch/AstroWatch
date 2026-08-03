from fastapi import APIRouter
from app.services.nasa_client import fetch_from_nasa

router = APIRouter()

@router.get("/exoplanets", summary="Exoplanet Archive")
async def get_exoplanets():
    """
    Acesso programático ao banco de dados do arquivo de Exoplanetas.
    """
    # O endpoint exato pode ser TAP/sync via Exoplanet API
    data = await fetch_from_nasa("/EXOPLANETSRest/api")
    return data

@router.get("/insight-mars", summary="Insight Mars Weather")
async def get_insight_mars():
    """
    Serviço de clima da superfície de Marte (Insight).
    """
    data = await fetch_from_nasa("/insight_weather/", params={"feedtype": "json", "ver": "1.0"})
    return data

@router.get("/ssd-cneos", summary="Solar System Dynamics / CNEOS")
async def get_ssd_cneos():
    """
    Dinâmica do Sistema Solar e Centro de Estudos Terrestres.
    """
    data = await fetch_from_nasa("/api/cneos")
    return data

@router.get("/planetary-trek", summary="Vesta/Moon/Mars Trek WMTS")
async def get_planetary_trek():
    """
    Serviço de mapas visuais de Vesta, Lua e Marte.
    """
    data = await fetch_from_nasa("/trek/wmts")
    return data

@router.get("/image-and-video", summary="NASA Image and Video Library")
async def get_nasa_image_library(q: str = "space"):
    """
    Busca na extensa biblioteca de mídia da NASA.
    """
    data = await fetch_from_nasa("/search", params={"q": q})
    return data

@router.get("/techport", summary="NASA Techport")
async def get_techport():
    """
    Projetos de tecnologia da NASA.
    """
    data = await fetch_from_nasa("/techport/api/projects")
    return data

@router.get("/open-science", summary="Open Science Data")
async def get_open_science():
    data = await fetch_from_nasa("/osdr/api/projects")
    return data
