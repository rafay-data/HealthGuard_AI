# HealthGuard AI - SHAP Explainer
# Explain AI predictions

import shap
import numpy as np
import pandas as pd
from core.model_loader import get_models
from core.preprocessor import (
    preprocess_for_diabetes,
    preprocess_for_heart,
    preprocess_for_hypertension,
    preprocess_for_stroke,
    preprocess_for_kidney
)

# Feature names for each disease
FEATURE_NAMES = {
    'diabetes': [
        'Pregnancies', 'Glucose', 'Blood Pressure',
        'Skin Thickness', 'Insulin', 'BMI',
        'Diabetes Pedigree', 'Age'
    ],
    'heart_disease': [
        'Age', 'Gender', 'Chest Pain', 'Blood Pressure',
        'Cholesterol', 'Fasting Sugar', 'ECG',
        'Max Heart Rate', 'Exercise Angina',
        'ST Depression', 'ST Slope', 'Vessels', 'Thalassemia'
    ],
    'hypertension': [
        'Age', 'Salt Intake', 'Stress Score',
        'BP History', 'Sleep Duration', 'BMI',
        'Medication', 'Family History',
        'Exercise Level', 'Smoking Status'
    ],
    'stroke': [
        'Gender', 'Age', 'Hypertension',
        'Heart Disease', 'Ever Married',
        'Work Type', 'Residence Type',
        'Glucose Level', 'BMI', 'Smoking Status'
    ],
    'kidney_disease': [
        'Age', 'Blood Pressure', 'Specific Gravity',
        'Albumin', 'Sugar', 'RBC', 'Pus Cell',
        'Pus Cell Clumps', 'Bacteria', 'Glucose',
        'Blood Urea', 'Creatinine', 'Sodium',
        'Potassium', 'Hemoglobin', 'Packed Cell Volume',
        'WBC Count', 'RBC Count', 'Hypertension',
        'Diabetes', 'Coronary Artery', 'Appetite',
        'Pedal Edema', 'Anemia', 'Family History'
    ]
}

def get_top_risk_factors(data, disease='diabetes', top_n=5):
    """Get top risk factors using SHAP"""
    models = get_models()

    preprocessors = {
        'diabetes': preprocess_for_diabetes,
        'heart_disease': preprocess_for_heart,
        'hypertension': preprocess_for_hypertension,
        'stroke': preprocess_for_stroke,
        'kidney_disease': preprocess_for_kidney
    }

    if disease not in models:
        return []

    model = models[disease]
    preprocessor = preprocessors[disease]
    processed = preprocessor(data)

    try:
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(processed)

        if isinstance(shap_values, list):
            shap_vals = shap_values[1][0]
        elif len(np.array(shap_values).shape) == 3:
            shap_vals = shap_values[0, :, 1]
        else:
            shap_vals = shap_values[0]

        shap_vals = shap_vals.flatten()
        feature_names = FEATURE_NAMES.get(disease, [])

        n = min(len(shap_vals), len(feature_names))
        factors = []

        for i in range(n):
            factors.append({
                'feature': feature_names[i],
                'value': float(processed.iloc[0, i]),
                'impact': float(shap_vals[i]),
                'direction': 'increases' if shap_vals[i] > 0 
                            else 'decreases'
            })

        # Sort by absolute impact
        factors.sort(key=lambda x: abs(x['impact']),
                    reverse=True)
        return factors[:top_n]

    except Exception as e:
        print(f"SHAP error: {e}")
        return []