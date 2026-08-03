from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# NASA DONKI Responses
class CMEEvent(BaseModel):
    activityID: str
    startTime: Optional[str] = None
    sourceLocation: str = "Unknown"
    note: str = ""
    
class SolarFlareEvent(BaseModel):
    flrID: str
    beginTime: Optional[str] = None
    peakTime: Optional[str] = None
    endTime: Optional[str] = None
    classType: str = "Unknown"
    sourceRegion: str = "Unknown"

# SpaceX API Responses
class SpaceXCore(BaseModel):
    core: Optional[str] = None
    flight: Optional[int] = None
    gridfins: Optional[bool] = None
    legs: Optional[bool] = None
    reused: Optional[bool] = None
    landing_attempt: Optional[bool] = None
    landing_success: Optional[bool] = None

class SpaceXLaunch(BaseModel):
    id: str
    name: str
    date_unix: int
    date_utc: str
    details: Optional[str] = None
    success: Optional[bool] = None
    upcoming: bool
    cores: List[SpaceXCore] = []
    
class SpaceXLaunchResponse(BaseModel):
    """
    Formato padronizado de saída da nossa API para o Frontend (AstroWatch).
    """
    id: str
    mission_name: str
    launch_date_utc: str # ISO-8601
    launch_date_unix: int
    is_upcoming: bool
    details: Optional[str] = None
    vehicle: str = "Falcon 9" # Simplificação para o protótipo
    launch_site: str = "KENNEDY SPACE CENTER" # Simplificação para o protótipo
    orbit: str = "LEO" # Simplificação
    
    # Mock data for the telemetry dashboard (since SpaceX API doesn't provide real-time telemetry for upcoming)
    telemetry: dict = Field(
        default_factory=lambda: {
            "fuel": 96.0,
            "oxygen": 93.8,
            "avionics": 99.8,
            "climate": 94.0
        }
    )
