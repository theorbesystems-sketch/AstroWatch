from fastapi import APIRouter, Request, Depends, HTTPException
import logging
from app.services.spacex_client import fetch_next_launch
from app.schemas.schemas import SpaceXLaunchResponse
from app.core.limiter import limiter

router = APIRouter()
logger = logging.getLogger("AstroWatch.SpaceXAPI")

@router.get("/launches/next", response_model=SpaceXLaunchResponse, summary="Próximo Lançamento Orbital (SpaceX)")
@limiter.limit("60/minute")
async def get_next_launch(request: Request):
    """
    Retorna os dados do próximo lançamento da SpaceX, aplicando conversões de data
    e servindo através de um cache interno para evitar sobrecarga da API pública.
    """
    try:
        data = await fetch_next_launch()
        
        # Transform data to our internal SpaceXLaunchResponse format
        # Unix timestamp is already parsed, and UTC is ISO-8601 string
        response_data = SpaceXLaunchResponse(
            id=data.id,
            mission_name=data.name,
            launch_date_utc=data.date_utc,
            launch_date_unix=data.date_unix,
            is_upcoming=data.upcoming,
            details=data.details
        )
        return response_data
    except Exception as e:
        logger.error(f"Failed to fetch SpaceX data: {e}")
        raise HTTPException(status_code=503, detail="SpaceX Telemetry Unavailable")
