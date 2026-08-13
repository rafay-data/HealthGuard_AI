# HealthGuard AI - Prediction Engine
# Final Version: Corrected Target Inversion & Clinical Calibration

import numpy as np
import pandas as pd
from core.model_loader import get_models, get_scalers, get_pipelines
from core.preprocessor import (
    preprocess_for_diabetes,
    preprocess_for_heart,
    preprocess_for_hypertension,
    preprocess_for_stroke,
    preprocess_for_kidney
)

def get_risk_level(percentage):
    if percentage < 30:
        return "Low Risk", "#2ecc71"
    elif percentage < 70:
        return "Moderate Risk", "#f39c12"
    else:
        return "High Risk", "#e74c3c"

def predict_all_diseases(data):
    models = get_models()
    scalers = get_scalers()
    pipelines = get_pipelines()
    predictions = {}

    PIPELINE_DISEASES = ['stroke', 'kidney_disease']

    preprocessors = {
        'diabetes': preprocess_for_diabetes,
        'heart_disease': preprocess_for_heart,
        'hypertension': preprocess_for_hypertension,
        'stroke': preprocess_for_stroke,
        'kidney_disease': preprocess_for_kidney
    }

    disease_names = {
        'diabetes': 'Diabetes',
        'heart_disease': 'Heart Disease',
        'hypertension': 'Hypertension',
        'stroke': 'Stroke',
        'kidney_disease': 'Kidney Disease'
    }

    for disease, preprocessor in preprocessors.items():
        if disease in models or disease in pipelines:
            processed_df = preprocessor(data)

            if disease in PIPELINE_DISEASES and disease in pipelines:
                prob = pipelines[disease].predict_proba(processed_df)[0][1]

            elif disease in scalers:
                scaled_array = scalers[disease].transform(processed_df)
                scaled_df = pd.DataFrame(
                    scaled_array,
                    columns=processed_df.columns)
                prob = models[disease].predict_proba(scaled_df)[0][1]

            else:
                prob = models[disease].predict_proba(processed_df)[0][1]

            # --- START OF CLINICAL CALIBRATION & INVERSION FIX ---

            if disease == 'heart_disease':
                # CRITICAL FIX: The target labels in the Heart Disease dataset are inverted!
                # 1 = Healthy, 0 = Disease. We must subtract from 1 to get the actual DISEASE risk.
                prob = 1.0 - prob

                # Now apply calibration to the corrected true risk
                if prob < 0.45:
                    prob = prob * 0.25  # e.g., 37% true baseline becomes ~9% (Low Risk)
                else:
                    prob = min(0.95, prob * 1.30) # e.g., 60%+ becomes 78%+ (High Risk)

            elif disease == 'hypertension':
                # Gradual 4-step calibration to avoid saturation at 96%
                # for both borderline and severe BP cases
                if prob < 0.35:
                    prob = prob * 0.30
                elif prob < 0.55:
                    prob = prob * 0.60
                elif prob < 0.75:
                    prob = prob * 0.90
                else:
                    prob = min(0.96, prob * 1.05)

            elif disease == 'kidney_disease':
                if prob < 0.35:
                    prob = prob * 0.25
                else:
                    prob = min(0.96, prob * 1.05)

            # --- END OF CLINICAL CALIBRATION & INVERSION FIX ---

            risk_percentage = float(round(float(prob) * 100, 2))
            risk_level, color = get_risk_level(risk_percentage)

            predictions[disease] = {
                'name': disease_names[disease],
                'risk_percentage': risk_percentage,
                'risk_level': risk_level,
                'color': color
            }

    if len(predictions) > 0:
        overall_risk = float(round(
            sum(p['risk_percentage'] for p in predictions.values()) /
            len(predictions), 2))
    else:
        overall_risk = 0.0

    return predictions, overall_risk