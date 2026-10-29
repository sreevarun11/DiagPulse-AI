import os
import json
import joblib
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from backend.config import settings
from backend.services.symptom_service import symptom_catalog
from backend.schemas import (
    PredictionItem, 
    SymptomContribution, 
    PredictResponse, 
    ModelInfoResponse
)
from src.ml.explain import explain_prediction

def clean_disease_label(raw_disease: str) -> str:
    # E.g. "Chronic_Kidney_Disease" -> "Chronic Kidney Disease"
    # E.g. "COVID19" -> "COVID-19"
    # E.g. "Type2_Diabetes" -> "Type 2 Diabetes"
    name = raw_disease.replace("_", " ")
    if name == "COVID19":
        return "COVID-19"
    if name == "Type2 Diabetes":
        return "Type 2 Diabetes"
    if name == "COPD":
        return "COPD (Chronic Obstructive Pulmonary Disease)"
    return name

class ModelService:
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or settings.MODEL_PATH
        self.model = None
        self.classes: List[str] = []
        self.is_loaded: bool = False
        self.features: List[str] = symptom_catalog.features
        self.feature_to_idx: Dict[str, int] = {f: i for i, f in enumerate(self.features)}
        self.load_error: Optional[str] = None
        
        self.load_model()
        
    def load_model(self):
        try:
            if not os.path.exists(self.model_path):
                self.load_error = f"Model artifact not found at {self.model_path}"
                self.is_loaded = False
                print(f"Warning: {self.load_error}")
                return
                
            self.model = joblib.load(self.model_path)
            self.classes = list(self.model.classes_)
            self.is_loaded = True
            self.load_error = None
            print(f"Model successfully loaded from {self.model_path} with {len(self.classes)} classes.")
        except Exception as e:
            self.load_error = f"Failed to load model: {str(e)}"
            self.is_loaded = False
            print(f"Error loading model: {self.load_error}")
            
    def predict(self, symptoms: List[str]) -> PredictResponse:
        if not self.is_loaded or self.model is None:
            raise RuntimeError(f"Model service is unavailable: {self.load_error or 'Model not loaded'}")
            
        # 1. Vectorize inputs
        vector = np.zeros(len(self.features), dtype=np.uint8)
        for s in symptoms:
            if s in self.feature_to_idx:
                vector[self.feature_to_idx[s]] = 1
                
        # 2. Run inference
        probs = self.model.predict_proba([vector])[0]
        
        # Top 3 classes
        top3_indices = np.argsort(probs)[::-1][:3]
        top3_tuples = [(self.classes[i], float(round(probs[i], 4))) for i in top3_indices]
        
        # 3. Generate exact local explainability
        explanations = explain_prediction(self.model, vector, self.features, top3_tuples, max_symptoms_per_class=5)
        
        # 4. Formulate prediction items
        items = []
        for rank, (disease, conf) in enumerate(top3_tuples, start=1):
            expl_data = explanations.get(disease, {})
            contrib_list = expl_data.get("top_contributing_symptoms", [])
            
            contributions = [
                SymptomContribution(
                    symptom=c["symptom"],
                    clean_name=c["clean_name"],
                    weight=c["weight"],
                    direction=c["direction"]
                )
                for c in contrib_list
            ]
            
            items.append(PredictionItem(
                disease=disease,
                display_name=clean_disease_label(disease),
                confidence=conf,
                confidence_percentage=f"{conf * 100:.1f}%",
                rank=rank,
                contributing_symptoms=contributions
            ))
            
        # 5. Abstention Evaluation
        top1_conf = items[0].confidence if items else 0.0
        symptom_count = len(symptoms)
        
        insufficient_info = False
        abstention_reason = None
        
        if symptom_count < 2:
            insufficient_info = True
            abstention_reason = (
                f"Presentation sparsity: Only {symptom_count} symptom was reported. "
                "A minimum of 2 symptoms is required to formulate a reliable clinical differential hypothesis."
            )
        elif top1_conf < 0.15:
            insufficient_info = True
            abstention_reason = (
                f"Low diagnostic confidence: Top predicted category confidence ({top1_conf*100:.1f}%) "
                "falls below the 15.0% threshold across 46 possible diseases, indicating substantial diagnostic uncertainty."
            )
            
        disclaimer_text = (
            "PRELIMINARY CLINICAL DECISION SUPPORT ONLY: This output represents statistical likelihood "
            "scores derived from simulated multi-symptom presentations. It is NOT a confirmed diagnosis and "
            "does not replace formal physical examination, laboratory work, imaging, or the clinical judgement "
            "of a qualified healthcare professional. Do not prescribe treatments or alter care based solely on this tool."
        )
        
        return PredictResponse(
            predictions=items,
            insufficient_information=insufficient_info,
            abstention_reason=abstention_reason,
            reported_symptoms_count=symptom_count,
            model_version="1.0.0 (Multinomial L2 Logistic Regression)",
            explanation_method="Exact Linear Log-Odds Contributions (w_i * x_i)",
            causation_caveat=(
                "Feature contributions describe how the mathematical model weighs reported symptoms. "
                "They do NOT represent biological etiology, medical causality, or pathophysiology."
            ),
            disclaimer=disclaimer_text
        )

    def get_model_info(self) -> ModelInfoResponse:
        metadata_path = settings.METADATA_PATH
        test_metrics_path = os.path.join(settings.REPORTS_DIR, "test_metrics.json")
        model_comp_path = os.path.join(settings.REPORTS_DIR, "model_comparison.json")
        
        metadata = {}
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as f:
                metadata = json.load(f)
                
        test_metrics = {}
        if os.path.exists(test_metrics_path):
            with open(test_metrics_path, "r") as f:
                test_metrics = json.load(f)
                
        model_comp = {}
        if os.path.exists(model_comp_path):
            with open(model_comp_path, "r") as f:
                model_comp = json.load(f)
                
        return ModelInfoResponse(
            model_name=metadata.get("model_name", "AI Powered Medical Diagnosis Classifier"),
            model_type=metadata.get("model_type", "Logistic Regression"),
            training_date=metadata.get("training_date", "October 2026"),
            dataset_summary=metadata.get("dataset", {}),
            validation_metrics=metadata.get("validation_metrics", {}),
            test_metrics=test_metrics,
            model_comparison=model_comp,
            abstention_rules=metadata.get("abstention_rules", {}),
            top_global_features=metadata.get("top_global_features", [])
        )

# Global singleton
model_service = ModelService()
