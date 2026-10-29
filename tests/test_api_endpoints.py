import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.model_service import model_service

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["features_count"] == 174
    assert data["classes_count"] == 46

def test_symptoms_endpoint():
    response = client.get("/symptoms")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] == 174
    assert len(data["symptoms"]) == 174
    assert len(data["categories"]) > 0
    assert "Respiratory" in data["categories"]
    assert "Rare Clinical Signs" in data["categories"]
    
    # Check structure of a symptom item
    sample = data["symptoms"][0]
    assert "id" in sample
    assert "name" in sample
    assert "category" in sample
    assert "is_rare" in sample

def test_model_info_endpoint():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "model_type" in data
    assert "test_metrics" in data
    assert "top1_accuracy" in data["test_metrics"]
    assert "top3_accuracy" in data["test_metrics"]
    assert "model_comparison" in data

def test_predict_valid_symptoms():
    payload = {
        "symptoms": ["symptom_cough", "symptom_shortness_of_breath", "symptom_wheezing"]
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert len(data["predictions"]) == 3
    assert data["reported_symptoms_count"] == 3
    assert data["insufficient_information"] is False
    assert "disclaimer" in data
    assert "causation_caveat" in data
    
    # Check top prediction structure
    top1 = data["predictions"][0]
    assert top1["rank"] == 1
    assert "disease" in top1
    assert "display_name" in top1
    assert "confidence" in top1
    assert "contributing_symptoms" in top1

def test_predict_abstention_single_symptom():
    """Testing presentation sparsity abstention: exactly 1 symptom must trigger insufficient_information=True."""
    payload = {
        "symptoms": ["symptom_cough"]
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["insufficient_information"] is True
    assert "sparsity" in data["abstention_reason"].lower() or "minimum of 2" in data["abstention_reason"].lower()

def test_predict_unknown_symptom_returns_400():
    payload = {
        "symptoms": ["symptom_cough", "invented_fake_symptom_xyz"]
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "BAD_REQUEST"
    assert "unknown symptom" in data["error"]["message"].lower()

def test_predict_empty_list_returns_422():
    payload = {
        "symptoms": []
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_predict_duplicate_symptoms_returns_422():
    payload = {
        "symptoms": ["symptom_cough", "symptom_fever", "symptom_cough"]
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_predict_oversized_symptoms_returns_422():
    # Exceed maximum 50 symptoms
    huge_list = [f"symptom_{i}" for i in range(55)]
    payload = {
        "symptoms": huge_list
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_missing_model_returns_503(monkeypatch):
    """Simulates a missing model artifact to verify graceful 503 error handling."""
    monkeypatch.setattr(model_service, "is_loaded", False)
    payload = {
        "symptoms": ["symptom_cough", "symptom_fever"]
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 503
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "SERVICE_UNAVAILABLE"
    # Restore model_loaded
    monkeypatch.setattr(model_service, "is_loaded", True)
