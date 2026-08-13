import pickle
import pandas as pd

with open('E:/HealthGuard_AI/models/saved/diabetes_model.pkl', 'rb') as f:
    dm_model = pickle.load(f)
with open('E:/HealthGuard_AI/models/saved/diabetes_scaler.pkl', 'rb') as f:
    dm_scaler = pickle.load(f)

columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
           'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

# Patient #3 exact values as currently sent (systolic=118 used as BloodPressure)
current_way = pd.DataFrame([[
    2, 280, 118, 20, 80, 27.3, 0.5, 40
]], columns=columns)

# If we used diastolic (78) instead
diastolic_way = pd.DataFrame([[
    2, 280, 78, 20, 80, 27.3, 0.5, 40
]], columns=columns)

for name, row in [("Using Systolic (118)", current_way),
                   ("Using Diastolic (78)", diastolic_way)]:
    scaled = pd.DataFrame(dm_scaler.transform(row), columns=columns)
    prob = dm_model.predict_proba(scaled)[0][1]
    print(f"{name} --> Diabetes risk: {prob*100:.2f}%")

print(f"\nFeature Importances:")
for name, imp in zip(columns, dm_model.feature_importances_):
    print(f"  {name}: {imp:.4f}")