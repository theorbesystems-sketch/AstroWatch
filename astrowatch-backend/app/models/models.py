from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from datetime import datetime
from app.db.database import Base

class CelestialEvent(Base):
    """
    Persists Coronal Mass Ejections (CME) and Solar Flares (FLR).
    """
    __tablename__ = "celestial_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)  # CME, FLR, GST
    nasa_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity_rank = Column(String, nullable=True) # e.g. M1.5, X2.0
    raw_data = Column(JSON)

class NeoAnalysis(Base):
    """
    Stores Asteroid data with the proprietary OrbeSystems Risk Score.
    """
    __tablename__ = "neo_analysis"

    id = Column(Integer, primary_key=True, index=True)
    nasa_id = Column(String, index=True)
    nomenclature = Column(String)
    close_approach_date = Column(String)
    velocity_kms = Column(Float)
    miss_distance_ld = Column(Float)
    diameter_max_m = Column(Float)
    is_hazardous = Column(Boolean)
    orbesystems_risk_score = Column(Float)
    analyzed_at = Column(DateTime, default=datetime.utcnow)
