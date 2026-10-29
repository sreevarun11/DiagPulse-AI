export interface SymptomItem {
  id: string;
  name: string;
  category: string;
  is_rare: boolean;
}

export interface SymptomsResponse {
  total_count: number;
  categories: string[];
  symptoms: SymptomItem[];
}

export interface SymptomContribution {
  symptom: string;
  clean_name: string;
  weight: number;
  direction: 'positive' | 'negative';
}

export interface PredictionItem {
  disease: string;
  display_name: string;
  confidence: number;
  confidence_percentage: string;
  rank: number;
  contributing_symptoms: SymptomContribution[];
}

export interface PredictResponse {
  predictions: PredictionItem[];
  insufficient_information: boolean;
  abstention_reason?: string | null;
  reported_symptoms_count: number;
  model_version: string;
  explanation_method: string;
  causation_caveat: string;
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  features_count: number;
  classes_count: number;
  environment: string;
}

export interface ModelComparisonItem {
  accuracy: number;
  top3_accuracy: number;
  macro_f1: number;
  weighted_f1: number;
  training_time_seconds: number;
  inference_latency_ms: number;
}

export interface ModelInfoResponse {
  model_name: string;
  model_type: string;
  training_date: string;
  dataset_summary: {
    training_samples?: number;
    validation_samples?: number;
    feature_count?: number;
    class_count?: number;
  };
  validation_metrics: {
    top1_accuracy?: number;
    top3_accuracy?: number;
    macro_f1?: number;
    weighted_f1?: number;
    brier_score?: number;
    fit_duration_seconds?: number;
  };
  test_metrics: {
    evaluation_dataset?: string;
    total_test_cases?: number;
    top1_accuracy?: number;
    top3_accuracy?: number;
    macro_f1?: number;
    weighted_f1?: number;
    brier_score?: number;
  };
  model_comparison: Record<string, ModelComparisonItem>;
  abstention_rules: {
    min_symptoms_required?: number;
    min_confidence_threshold?: number;
    justification?: string;
  };
  top_global_features: Array<{
    rank: number;
    feature: string;
    importance: number;
  }>;
}
