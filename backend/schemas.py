from typing import List, Optional, Any
from pydantic import BaseModel, Field, field_validator

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail

class PredictRequest(BaseModel):
    symptoms: List[str] = Field(
        ...,
        min_length=1,
        max_length=50,
        description="List of verified symptom identifiers reported by the patient."
    )

    @field_validator("symptoms")
    @classmethod
    def validate_unique_and_non_empty(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("Symptom list cannot be empty.")
        cleaned = [s.strip() for s in v if isinstance(s, str) and s.strip()]
        if len(cleaned) != len(v):
            raise ValueError("Symptom identifiers cannot be empty or blank.")
        if len(set(cleaned)) != len(cleaned):
            raise ValueError("Duplicate symptoms detected in presentation list.")
        return cleaned

class SymptomContribution(BaseModel):
    symptom: str
    clean_name: str
    weight: float
    direction: str

class PredictionItem(BaseModel):
    disease: str
    display_name: str
    confidence: float
    confidence_percentage: str
    rank: int
    contributing_symptoms: List[SymptomContribution]

class PredictResponse(BaseModel):
    predictions: List[PredictionItem]
    insufficient_information: bool
    abstention_reason: Optional[str] = None
    reported_symptoms_count: int
    model_version: str
    explanation_method: str
    causation_caveat: str
    disclaimer: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    features_count: int
    classes_count: int
    environment: str

class SymptomItem(BaseModel):
    id: str
    name: str
    category: str
    is_rare: bool

class SymptomsResponse(BaseModel):
    total_count: int
    categories: List[str]
    symptoms: List[SymptomItem]

class ModelInfoResponse(BaseModel):
    model_name: str
    model_type: str
    training_date: str
    dataset_summary: dict
    validation_metrics: dict
    test_metrics: dict
    model_comparison: dict
    abstention_rules: dict
    top_global_features: list
