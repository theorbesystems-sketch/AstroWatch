from fastapi import APIRouter
from app.services.nasa_client import fetch_from_nasa

router = APIRouter()


@router.get("/apod", summary="Foto Astronômica do Dia (APOD)")
async def get_apod(date: str = None):
    """
    Retorna a Astronomy Picture of the Day da NASA.
    Parâmetro opcional: date no formato YYYY-MM-DD.
    """
    params = {}
    if date:
        params["date"] = date
    return await fetch_from_nasa("/planetary/apod", params=params)


@router.get("/epic/latest", summary="Imagens EPIC mais recentes da Terra")
async def get_epic_latest():
    """
    Retorna as imagens mais recentes do satélite EPIC (Earth Polychromatic Imaging Camera).
    """
    return await fetch_from_nasa("/EPIC/api/natural/images", params={})


@router.get("/eonet", summary="Earth Observatory Natural Event Tracker (EONET)")
async def get_eonet(status: str = "open", days: int = 20):
    """
    Retorna eventos naturais na Terra tracker (Incêndios, tempestades, vulcões).
    """
    return await fetch_from_nasa("/EONET/api/v3/events", params={"status": status, "days": days})
