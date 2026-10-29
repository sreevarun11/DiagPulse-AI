import json
import os
from typing import List, Dict, Optional
from backend.config import settings
from backend.schemas import SymptomItem, SymptomsResponse

def clean_label(feature_id: str) -> str:
    cleaned = feature_id.replace("symptom_", "").replace("rare_symptom_", "").replace("_symptom", "").replace("_rare", "")
    parts = cleaned.split("_")
    # Title case
    return " ".join([p.capitalize() for p in parts])

def categorize_symptom(feature_id: str) -> str:
    if feature_id.startswith("rare_symptom_") or feature_id.endswith("_rare"):
        return "Rare Clinical Signs"
        
    fid = feature_id.lower()
    
    # Respiratory
    if any(k in fid for k in [
        "cough", "breath", "wheez", "sore_throat", "runny_nose", "nasal", "sinus", 
        "smell", "taste", "pleuritic", "hemoptysis", "dyspnea", "sputum", "stridor", "hoarseness"
    ]):
        return "Respiratory"
        
    # Cardiovascular
    if any(k in fid for k in [
        "chest_pain", "palpitation", "orthopnea", "paroxysmal_nocturnal", "leg_swelling", 
        "syncope", "tachycardia", "bradycardia", "cyanosis", "peripheral_edema", "claudication", "edema"
    ]):
        return "Cardiovascular"
        
    # Neurological
    if any(k in fid for k in [
        "headache", "migraine", "dizz", "vertigo", "seizure", "weakness", "numbness", 
        "tingling", "vision", "speech", "confusion", "memory", "tremor", "gait", 
        "ataxia", "paresthesia", "facial_droop", "photophobia", "sleep", "insomnia"
    ]):
        return "Neurological"
        
    # Gastrointestinal & Hepatic
    if any(k in fid for k in [
        "abdominal", "nausea", "vomit", "diarrhea", "constipation", "hematemesis", 
        "heartburn", "dysphagia", "jaundice", "bloating", "melena", "anorexia", "satiety",
        "bowel", "reflux", "stool", "belching", "flatulence", "pruritus"
    ]):
        return "Gastrointestinal & Hepatic"
        
    # Musculoskeletal
    if any(k in fid for k in [
        "joint", "muscle", "stiff", "back_pain", "bone", "mobility", "myalgia", "arthralgia", "cramps"
    ]):
        return "Musculoskeletal"
        
    # Dermatological & Endocrine
    if any(k in fid for k in [
        "rash", "skin", "sweat", "itching", "alopecia", "hair", "pigment", "acne", 
        "intolerance", "polydipsia", "polyuria", "hirsutism", "goiter", "puffiness"
    ]):
        return "Dermatological & Endocrine"
        
    # Systemic & General
    return "Systemic & General"

class SymptomCatalog:
    def __init__(self, schema_path: Optional[str] = None):
        self.schema_path = schema_path or settings.SCHEMA_PATH
        self.features: List[str] = []
        self.feature_set: set[str] = set()
        self.symptom_items: List[SymptomItem] = []
        self.categories: List[str] = []
        self._load_schema()
        
    def _load_schema(self):
        if not os.path.exists(self.schema_path):
            raise FileNotFoundError(f"Feature schema not found at {self.schema_path}")
            
        with open(self.schema_path, "r") as f:
            data = json.load(f)
            
        self.features = data.get("features", [])
        self.feature_set = set(self.features)
        
        items = []
        categories_found = set()
        for fid in self.features:
            cat = categorize_symptom(fid)
            categories_found.add(cat)
            is_rare = fid.startswith("rare_symptom_") or fid.endswith("_rare")
            items.append(SymptomItem(
                id=fid,
                name=clean_label(fid),
                category=cat,
                is_rare=is_rare
            ))
            
        self.symptom_items = items
        
        # Clinical ordering for categories
        desired_order = [
            "Respiratory",
            "Cardiovascular",
            "Neurological",
            "Gastrointestinal & Hepatic",
            "Musculoskeletal",
            "Dermatological & Endocrine",
            "Systemic & General",
            "Rare Clinical Signs"
        ]
        self.categories = [c for c in desired_order if c in categories_found] + [
            c for c in sorted(categories_found) if c not in desired_order
        ]
        
    def is_valid_symptom(self, symptom_id: str) -> bool:
        return symptom_id in self.feature_set
        
    def get_catalog_response(self) -> SymptomsResponse:
        return SymptomsResponse(
            total_count=len(self.symptom_items),
            categories=self.categories,
            symptoms=self.symptom_items
        )

# Global singleton
symptom_catalog = SymptomCatalog()
