import os
import sys
from pathlib import Path

# Ensure project root is in sys.path regardless of how or where this file was executed
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from backend.config import settings
from backend.schemas import (
    ErrorResponse, 
    ErrorDetail, 
    HealthResponse, 
    SymptomsResponse, 
    ModelInfoResponse, 
    PredictRequest, 
    PredictResponse
)
from backend.services.symptom_service import symptom_catalog
from backend.services.model_service import model_service

# Configure privacy-preserving logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("backend.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure models and catalogs are loaded
    logger.info("Initializing Medical Diagnosis Decision Support API...")
    if not model_service.is_loaded:
        logger.warning(f"Model service initialized with warning: {model_service.load_error}")
    else:
        logger.info(f"Model loaded: {len(model_service.classes)} classes, {len(symptom_catalog.features)} symptoms.")
    yield
    # Shutdown
    logger.info("Shutting down Medical Diagnosis Decision Support API.")

app = FastAPI(
    title="AI Powered Medical Diagnosis Classifier API",
    description="Doctor-facing clinical decision-support differential diagnosis prototype.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Privacy-preserving access log middleware (NO symptom/patient data logged!)
@app.middleware("http")
async def privacy_audit_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)
    # Log ONLY endpoint, method, status code, and latency - ZERO health data
    logger.info(
        f"METHOD={request.method} PATH={request.url.path} STATUS={response.status_code} DURATION={duration_ms}ms"
    )
    return response

# Standardized Error Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    details = [
        {"field": ".".join(str(loc) for loc in err.get("loc", [])), "issue": err.get("msg")}
        for err in errors
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed. Please check the request structure.",
                "details": details
            }
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    code = "HTTP_ERROR"
    if exc.status_code == status.HTTP_400_BAD_REQUEST:
        code = "BAD_REQUEST"
    elif exc.status_code == status.HTTP_404_NOT_FOUND:
        code = "NOT_FOUND"
    elif exc.status_code == status.HTTP_503_SERVICE_UNAVAILABLE:
        code = "SERVICE_UNAVAILABLE"
        
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": code,
                "message": exc.detail if isinstance(exc.detail, str) else "An HTTP error occurred.",
                "details": exc.detail if not isinstance(exc.detail, str) else None
            }
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal server error: {type(exc).__name__}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An internal server error occurred. Clinical decision support is temporarily unavailable.",
                "details": None
            }
        }
    )

# API Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Returns the operational status of the API and model artifact loading state."""
    model_ready = model_service.is_loaded
    return HealthResponse(
        status="healthy" if model_ready else "degraded",
        model_loaded=model_ready,
        features_count=len(symptom_catalog.features),
        classes_count=len(model_service.classes) if model_ready else 0,
        environment=settings.ENVIRONMENT
    )

@app.get("/symptoms", response_model=SymptomsResponse)
async def get_symptoms():
    """Returns the complete, verified 174-symptom feature schema grouped into clinical categories."""
    return symptom_catalog.get_catalog_response()

@app.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    """Returns verified model metadata, actual test metrics, comparison benchmarks, and calibration parameters."""
    return model_service.get_model_info()

@app.post("/predict", response_model=PredictResponse)
async def predict_diagnosis(payload: PredictRequest):
    """
    Evaluates patient reported symptoms and produces top-3 differential diagnosis categories,
    model confidence scores, exact local linear log-odds symptom contributions, and safety abstentions.
    """
    if not model_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Diagnostic model artifact is not loaded or unavailable."
        )
        
    symptoms = payload.symptoms
    
    # Validate against known feature schema
    unknown_symptoms = [s for s in symptoms if not symptom_catalog.is_valid_symptom(s)]
    if unknown_symptoms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown symptom(s) provided: {', '.join(unknown_symptoms)}. Only symptoms from /symptoms are valid."
        )
        
    return model_service.predict(symptoms)

if __name__ == "__main__":
    import uvicorn
    print(f"Starting API server on http://{settings.HOST}:{settings.PORT} ...")
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
