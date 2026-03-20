from datetime import date, timedelta
from fastapi import APIRouter
from app.services.nasa_client import fetch_from_nasa
from app.services.security import calculate_risk_score
from app.services.notifiers import check_and_notify_neo

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
    data = await fetch_from_nasa("/neo/rest/v1/feed", params=params)
    
    # Intelligence Layer: Inject OrbeSystems Risk Score
    if "near_earth_objects" in data:
        for date_str in data["near_earth_objects"]:
            for asteroid in data["near_earth_objects"][date_str]:
                # Extract metrics for scoring
                try:
                    dia = asteroid.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max", 0)
                    vel = float(asteroid["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"])
                    dist = float(asteroid["close_approach_data"][0]["miss_distance"]["lunar"])
                    haz = asteroid.get("is_potentially_hazardous_asteroid", False)
                    
                    asteroid["orbesystems_risk_score"] = calculate_risk_score(dia, vel, dist, haz)
                    
                    # Tactical Alert Trigger
                    await check_and_notify_neo(asteroid["name"], asteroid["orbesystems_risk_score"])
                except (KeyError, IndexError, ValueError):
                    asteroid["orbesystems_risk_score"] = 0.0
                    
    return data


@router.get("/lookup/{asteroid_id}", summary="Detalhes de um asteroide específico")
async def get_neo_lookup(asteroid_id: str):
    """
    Retorna os detalhes completos de um asteroide pelo seu ID SPK da NASA.
    """
    data = await fetch_from_nasa(f"/neo/rest/v1/neo/{asteroid_id}")
    
    # Inject Score for lookup
    try:
        dia = data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max", 0)
        # Detailed lookup might have multiple approach data, we take the first/next one
        approach = data.get("close_approach_data", [{}])[0]
        vel = float(approach.get("relative_velocity", {}).get("kilometers_per_second", 0))
        dist = float(approach.get("miss_distance", {}).get("lunar", 0))
        haz = data.get("is_potentially_hazardous_asteroid", False)
        
        data["orbesystems_risk_score"] = calculate_risk_score(dia, vel, dist, haz)
    except (KeyError, IndexError, ValueError):
         data["orbesystems_risk_score"] = 0.0
         
    return data
