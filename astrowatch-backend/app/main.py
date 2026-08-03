from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import donki, earth, neows, spacex, spacecraft, planetary
from app.core.middleware import TelemetryLogMiddleware
from app.core.limiter import limiter, RateLimitExceeded, _rate_limit_exceeded_handler

from app.db.database import engine
from app.models import models

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Painel de controle operacional e telemetria planetária desenvolvido pela OrbeSystems.",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Register Custom Logging Middleware
app.add_middleware(TelemetryLogMiddleware)

# ---------------------------------------------------------------------------
# Cyber Safety: permite acesso público aos dados (Dashboard de Consumo)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite Vercel, Render e outros domínios
    allow_credentials=True,
    allow_methods=["GET"],  # Dashboard de consumo — somente GET necessário
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Roteadores
# ---------------------------------------------------------------------------
app.include_router(donki.router, prefix="/api/v1/donki", tags=["🌩️ Clima Espacial (DONKI)"])
app.include_router(earth.router, prefix="/api/v1/earth", tags=["🌍 Terra (APOD & EPIC)"])
app.include_router(neows.router, prefix="/api/v1/neows", tags=["☄️ Asteroides (NeoWs)"])
app.include_router(spacex.router, prefix="/api/v1/spacex", tags=["🚀 SpaceX (Lançamentos)"])
app.include_router(spacecraft.router, prefix="/api/v1/spacecraft", tags=["🛰️ Espaço & Satélites"])
app.include_router(planetary.router, prefix="/api/v1/planetary", tags=["🪐 Descoberta Científica"])


# ---------------------------------------------------------------------------
# Health check & Keep-Alive
# ---------------------------------------------------------------------------
@app.get("/ping", tags=["Status"])
async def ping():
    return {"status": "operational", "message": "Stay awake, AstroWatch!"}


@app.get("/", tags=["Status"])
async def root():
    return {
        "message": f"Bem-vindo ao sistema {settings.PROJECT_NAME}. Sistemas operacionais.",
        "docs": "/docs",
        "redoc": "/redoc",
    }
