# HealthGuard AI - Data Preprocessor (Optimized Baseline Calibration)

import numpy as np
import pandas as pd

def preprocess_for_diabetes(data):
    features = {
        'Pregnancies': data.get('pregnancies', 0),
        'Glucose': data.get('glucose', 100),
        'BloodPressure': data.get('bp_systolic', 70),
        'SkinThickness': 20,
        'Insulin': 80,
        'BMI': data.get('bmi', 25),
        'DiabetesPedigreeFunction': 0.5,
        'Age': data.get('age', 30)
    }
    return pd.DataFrame([features])

def preprocess_for_heart(data):
    features = {
        'age': data.get('age', 30),
        'sex': data.get('gender', 1),
        'cp': data.get('chest_pain', 0),
        'trestbps': data.get('bp_systolic', 120),
        'chol': data.get('cholesterol', 200),
        'fbs': 1 if data.get('glucose', 100) > 120 else 0,
        'restecg': 0,
        'thalach': data.get('heart_rate', 150),
        'exang': data.get('previous_disease', 0),
        'oldpeak': 0.0,
        'slope': 2,   # 2 = Upsloping (Normal healthy ST segment)
        'ca': 0,      # 0 = No major vessels colored
        'thal': 2     # 2 = Normal flow in standard Cleveland mapping
    }
    return pd.DataFrame([features])

def preprocess_for_hypertension(data):
    features = {
        'Age': data.get('age', 30),
        'Salt_Intake': data.get('salt_intake', 4),
        'Stress_Score': data.get('stress_score', 2),
        'BP_History': data.get('hypertension_history', 0),
        'Sleep_Duration': data.get('sleep_duration', 7),
        'BMI': data.get('bmi', 25),
        'Medication': 0,
        'Family_History': data.get('family_history', 0),
        'Exercise_Level': data.get('exercise', 1),
        'Smoking_Status': data.get('smoking', 0)
    }
    return pd.DataFrame([features])

def preprocess_for_stroke(data):
    hypertension = 1 if (
        data.get('bp_systolic', 120) > 140 or
        data.get('hypertension_history', 0) == 1
    ) else 0

    heart_disease = 1 if (
        data.get('chest_pain', 0) > 0 or
        data.get('previous_disease', 0) == 1
    ) else 0

    features = {
        'gender': data.get('gender', 1),
        'age': data.get('age', 30),
        'hypertension': hypertension,
        'heart_disease': heart_disease,
        'ever_married': data.get('ever_married', 1),
        'work_type': data.get('work_type', 2),
        'Residence_type': 1,
        'avg_glucose_level': data.get('glucose', 100),
        'bmi': data.get('bmi', 25),
        'smoking_status': data.get('smoking', 0)
    }
    return pd.DataFrame([features])

def preprocess_for_kidney(data):
    htn = 1 if (
        data.get('bp_systolic', 120) > 140 or
        data.get('hypertension_history', 0) == 1
    ) else 0

    dm = 1 if (
        data.get('glucose', 100) > 126 or
        data.get('diabetes_history', 0) == 1
    ) else 0

    # Calibrated baseline features for normal non-CKD profile
    features = {
        'age': data.get('age', 30),
        'bp': data.get('bp_systolic', 80),
        'sg': 1.025, # High specific gravity = healthy urine concentration
        'al': 0,     # Albumin = 0 (Normal)
        'su': 0,     # Sugar = 0 (Normal)
        'rbc': 1,    # Normal RBC
        'pc': 1,     # Normal Pus Cell
        'pcc': 0,    # No Pus Cell Clumps
        'ba': 0,     # No Bacteria
        'bgr': data.get('glucose', 100),
        'bu': data.get('blood_urea', 15),
        'sc': data.get('creatinine', 0.9),
        'sod': 142,  # Ideal sodium
        'pot': 4.2,  # Ideal potassium
        'hemo': data.get('hemoglobin', 14),
        'pcv': 44,   # Normal Packed Cell Volume
        'wc': 7000,  # Normal White Blood Cells
        'rc': 5.2,   # Normal Red Blood Cells
        'htn': htn,
        'dm': dm,
        'cad': 0,
        'appet': 1,  # Good appetite
        'pe': 0,     # No Pedal Edema
        'ane': 0     # No Anemia
    }
    return pd.DataFrame([features])