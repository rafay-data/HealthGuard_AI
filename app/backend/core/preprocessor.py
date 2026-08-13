# HealthGuard AI - Data Preprocessor
# Fixed: Dynamic Heart Disease features (ca, thal, oldpeak, slope)
# Fixed: Dynamic Hypertension BP_History from actual BP readings
# Fixed: Dynamic Diabetes Insulin/SkinThickness estimation from Glucose/BMI

import numpy as np
import pandas as pd

def preprocess_for_diabetes(data):
    glucose = data.get('glucose', 100)
    bmi = data.get('bmi', 25)

    # Estimate insulin based on glucose level (clinical proxy)
    # Higher glucose typically correlates with higher insulin
    # resistance/production in Type 2 diabetes profiles
    if glucose < 100:
        estimated_insulin = 60
    elif glucose < 140:
        estimated_insulin = 100
    elif glucose < 200:
        estimated_insulin = 150
    else:
        estimated_insulin = 220

    # Estimate skin thickness based on BMI (clinical proxy -
    # higher BMI generally correlates with higher skinfold thickness)
    if bmi < 25:
        estimated_skin = 18
    elif bmi < 30:
        estimated_skin = 25
    else:
        estimated_skin = 35

    features = {
        'Pregnancies': data.get('pregnancies', 0),
        'Glucose': glucose,
        'BloodPressure': data.get('bp_diastolic', 70),
        'SkinThickness': estimated_skin,
        'Insulin': estimated_insulin,
        'BMI': bmi,
        'DiabetesPedigreeFunction': 0.5,
        'Age': data.get('age', 30)
    }
    return pd.DataFrame([features])

def preprocess_for_heart(data):
    age = data.get('age', 30)
    bp_systolic = data.get('bp_systolic', 120)
    cholesterol = data.get('cholesterol', 200)
    chest_pain = data.get('chest_pain', 0)
    previous_disease = data.get('previous_disease', 0)
    smoking = data.get('smoking', 0)
    # Dynamic risk score for clinical indicators
    risk_score = 0
    if bp_systolic > 140:
        risk_score += 1
    if cholesterol > 240:
        risk_score += 1
    if chest_pain > 0:
        risk_score += 1
    if previous_disease == 1:
        risk_score += 1
    if smoking == 2:
        risk_score += 1
    if age > 50:
        risk_score += 1

    # Dynamically derived clinical features
    oldpeak = min(4.0, risk_score * 0.7)
    slope = 0 if risk_score >= 4 else (1 if risk_score >= 2 else 2)
    ca = min(3, risk_score // 2)

    if risk_score >= 4:
        thal = 3
    elif risk_score >= 2:
        thal = 1
    else:
        thal = 2

    features = {
        'age': age,
        'sex': data.get('gender', 1),
        'cp': chest_pain,
        'trestbps': bp_systolic,
        'chol': cholesterol,
        'fbs': 1 if data.get('glucose', 100) > 120 else 0,
        'restecg': 1 if bp_systolic > 140 else 0,
        'thalach': data.get('heart_rate', 150),
        'exang': 1 if (chest_pain > 0 and previous_disease == 1) else 0,
        'oldpeak': oldpeak,
        'slope': slope,
        'ca': ca,
        'thal': thal
    }
    return pd.DataFrame([features])

def preprocess_for_hypertension(data):
    bp_sys = data.get('bp_systolic', 120)
    bp_dia = data.get('bp_diastolic', 80)
    hist = data.get('hypertension_history', 0)

    # Determine BP category using actual clinical thresholds
    # Encoder mapping confirmed via testing: 0=Hypertension, 1=Normal, 2=Prehypertension
    if bp_sys >= 140 or bp_dia >= 90 or hist == 1:
        bp_history = 0  # Hypertension
    elif bp_sys >= 120 or bp_dia >= 80:
        bp_history = 2  # Prehypertension
    else:
        bp_history = 1  # Normal

    features = {
        'Age': data.get('age', 30),
        'Salt_Intake': data.get('salt_intake', 4),
        'Stress_Score': data.get('stress_score', 2),
        'BP_History': bp_history,
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

    features = {
        'age': data.get('age', 30),
        'bp': data.get('bp_systolic', 80),
        'sg': 1.025,
        'al': 0,
        'su': 0,
        'rbc': 1,
        'pc': 1,
        'pcc': 0,
        'ba': 0,
        'bgr': data.get('glucose', 100),
        'bu': data.get('blood_urea', 15),
        'sc': data.get('creatinine', 0.9),
        'sod': 142,
        'pot': 4.2,
        'hemo': data.get('hemoglobin', 14),
        'pcv': 44,
        'wc': 7000,
        'rc': 5.2,
        'htn': htn,
        'dm': dm,
        'cad': 0,
        'appet': 1,
        'pe': 0,
        'ane': 0
    }
    return pd.DataFrame([features])