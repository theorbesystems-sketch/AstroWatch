import os
from dotenv import load_dotenv

# Carrega o arquivo .env apenas se estiver rodando localmente
load_dotenv()


class Settings:
    PROJECT_NAME: str = "OrbeSystems AstroWatch API"
    NASA_API_KEY: str = os.getenv("NASA_API_KEY", "DEMO_KEY")
    ALLOWED_ORIGIN: str = os.getenv("ALLOWED_ORIGIN", "https://orbesystems.github.io")
    NASA_BASE_URL: str = "https://api.nasa.gov"


settings = Settings()
