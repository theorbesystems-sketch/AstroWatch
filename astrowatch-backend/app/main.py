from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import donki, earth, neows

from app.db.database import engine
from app.models import models

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Painel de controle operacional e telemetria planetária desenvolvido pela OrbeSystems.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# Cyber Safety: restringe as origens que podem acessar a API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGIN],  # Apenas seu GitHub Pages ou localhost
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
