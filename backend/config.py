import os
import sys
from pathlib import Path

# Resolve project base directory reliably regardless of invocation path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

class Settings:
    BASE_DIR: Path = BASE_DIR
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")
    
    # Permissive localhost CORS for local frontend development
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:5173,http://localhost:3000,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:3000,http://127.0.0.1:4173"
        ).split(",")
        if origin.strip()
    ]
    
    # Artifact Paths anchored to project root
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "model.joblib"))
    SCHEMA_PATH: str = os.getenv("SCHEMA_PATH", str(BASE_DIR / "models" / "feature_schema.json"))
    METADATA_PATH: str = os.getenv("METADATA_PATH", str(BASE_DIR / "models" / "model_metadata.json"))
    REPORTS_DIR: str = os.getenv("REPORTS_DIR", str(BASE_DIR / "reports"))

settings = Settings()
