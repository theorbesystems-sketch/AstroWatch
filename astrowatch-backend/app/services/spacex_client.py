import httpx
import time
import logging
from app.schemas.schemas import SpaceXLaunch

logger = logging.getLogger("AstroWatch.SpaceXClient")

SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/next"

# Simple in-memory cache
# Format: {"data": SpaceXLaunch, "timestamp": unix_timestamp}
_cache = {
    "data": None,
    "timestamp": 0
}

CACHE_TTL_SECONDS = 300 # 5 minutes

async def fetch_next_launch() -> SpaceXLaunch:
    current_time = time.time()
    
    # Check cache validity
    if _cache["data"] and (current_time - _cache["timestamp"]) < CACHE_TTL_SECONDS:
        logger.info("Serving SpaceX data from internal cache.")
        return _cache["data"]
    
    logger.info("Fetching fresh SpaceX data from external API.")
    async with httpx.AsyncClient() as client:
        response = await client.get(SPACEX_API_URL)
        response.raise_for_status()
        raw_data = response.json()
        
        # Validate and sanitize data
        launch_data = SpaceXLaunch(**raw_data)
        
        # Update Cache
        _cache["data"] = launch_data
        _cache["timestamp"] = current_time
        
        return launch_data
