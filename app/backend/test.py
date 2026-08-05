import pickle
import pandas as pd

# Test Stroke
with open('E:/HealthGuard_AI/models/saved/stroke_pipeline.pkl', 'rb') as f:
    stroke_pipeline = pickle.load(f)

stroke_data = pd.DataFrame([[
    1, 55, 1, 1, 1, 2, 1, 250, 31, 2
]], columns=['gender', 'age', 'hypertension', 'heart_disease',
             'ever_married', 'work_type', 'Residence_type',
             'avg_glucose_level', 'bmi', 'smoking_status'])

prob = stroke_pipeline.predict_proba(stroke_data)[0][1]
print(f"Stroke Risk: {prob * 100:.2f}%")

# Test Kidney
with open('E:/HealthGuard_AI/models/saved/kidney_pipeline.pkl', 'rb') as f:
    kidney_pipeline = pickle.load(f)

# FIXED: Removed the extra '1' and 'family_history' column to match exactly 24 features
kidney_data = pd.DataFrame([[
    55, 160, 1.020, 0, 0, 1, 1, 0, 0,
    250, 30, 3.5, 140, 4.5, 10, 40,
    8000, 4.5, 1, 1, 0, 1, 0, 0
]], columns=['age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc',
             'pcc', 'ba', 'bgr', 'bu', 'sc', 'sod', 'pot',
             'hemo', 'pcv', 'wc', 'rc', 'htn', 'dm', 'cad',
             'appet', 'pe', 'ane'])

prob2 = kidney_pipeline.predict_proba(kidney_data)[0][1]
print(f"Kidney Risk: {prob2 * 100:.2f}%")