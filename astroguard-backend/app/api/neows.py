from datetime import date, timedelta
from fastapi import APIRouter
from app.services.nasa_client import fetch_from_nasa

router = APIRouter()


@router.get("/feed", summary="Asteroides próximos à Terra (NeoWs Feed)")
async def get_neo_feed(
    start_date: str = None,
    end_date: str = None,
):
    """
    Retorna asteroides próximos à Terra para um intervalo de datas.
    - Intervalo máximo permitido pela NASA: 7 dias.
    - Padrão: próximos 7 dias a partir de hoje.
    """
    today = date.today()
    params = {
        "start_date": start_date or today.isoformat(),
        "end_date": end_date or (today + timedelta(days=7)).isoformat(),
    }
    return await fetch_from_nasa("/neo/rest/v1/feed", params=params)


@router.get("/lookup/{asteroid_id}", summary="Detalhes de um asteroide específico")
async def get_neo_lookup(asteroid_id: str):
    """
    Retorna os detalhes completos de um asteroide pelo seu ID SPK da NASA.
    """
    return await fetch_from_nasa(f"/neo/rest/v1/neo/{asteroid_id}")
