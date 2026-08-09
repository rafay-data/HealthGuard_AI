# HealthGuard AI - SHAP Explainer
# Explain AI predictions
# Fixed: Uses correct pipeline/scaler per disease, heart inversion

import shap
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
        'Pedal Edema', 'Anemia'
    ]
}

PIPELINE_DISEASES = ['stroke', 'kidney_disease']

def get_top_risk_factors(data, disease='diabetes', top_n=5):
    """Get top risk factors using SHAP - uses same model path as predictor.py"""
    models = get_models()
    scalers = get_scalers()
    pipelines = get_pipelines()

    preprocessors = {
        'diabetes': preprocess_for_diabetes,
        'heart_disease': preprocess_for_heart,
        'hypertension': preprocess_for_hypertension,
        'stroke': preprocess_for_stroke,
        'kidney_disease': preprocess_for_kidney
    }

    if disease not in preprocessors:
        return []

    processed = preprocessors[disease](data)

    try:
        # --- Use SAME model + scaling path as predictor.py ---
        if disease in PIPELINE_DISEASES and disease in pipelines:
            # Pipeline handles scaling internally, explain the final model step
            pipeline = pipelines[disease]
            scaled_input = pipeline.named_steps['scaler'].transform(processed)
            scaled_df = pd.DataFrame(scaled_input, columns=processed.columns)
            model = pipeline.named_steps['model']
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(scaled_df)

        elif disease in scalers:
            scaled_input = scalers[disease].transform(processed)
            scaled_df = pd.DataFrame(scaled_input, columns=processed.columns)
            model = models[disease]
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(scaled_df)

        else:
            model = models[disease]
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(processed)

        # Extract class-1 contribution
        if isinstance(shap_values, list):
            shap_vals = shap_values[1][0]
        elif len(np.array(shap_values).shape) == 3:
            shap_vals = shap_values[0, :, 1]
        else:
            shap_vals = shap_values[0]

        shap_vals = np.array(shap_vals).flatten()

        # --- HEART DISEASE FIX: class 1 = Healthy, so negate to get disease-risk direction ---
        if disease == 'heart_disease':
            shap_vals = -shap_vals

        feature_names = FEATURE_NAMES.get(disease, [])
        n = min(len(shap_vals), len(feature_names), processed.shape[1])
        factors = []

        for i in range(n):
            factors.append({
                'feature': feature_names[i],
                'value': float(processed.iloc[0, i]),
                'impact': float(shap_vals[i]),
                'direction': 'increases' if shap_vals[i] > 0
                            else 'decreases'
            })

        factors.sort(key=lambda x: abs(x['impact']), reverse=True)
        return factors[:top_n]

    except Exception as e:
        print(f"SHAP error for {disease}: {e}")
        return []