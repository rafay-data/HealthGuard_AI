import pickle
import pandas as pd

with open('E:/HealthGuard_AI/models/saved/heart_model.pkl', 'rb') as f:
    heart_model = pickle.load(f)

with open('E:/HealthGuard_AI/models/saved/heart_scaler.pkl', 'rb') as f:
    heart_scaler = pickle.load(f)

columns = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
           'restecg', 'thalach', 'exang', 'oldpeak',
           'slope', 'ca', 'thal']

# Healthy - dynamic features (from preprocessor logic)
healthy = pd.DataFrame([[
    25, 1, 0, 110, 160, 0, 0, 170, 0, 0.0, 2, 0, 2
]], columns=columns)

# Unhealthy
unhealthy = pd.DataFrame([[
    55, 1, 1, 160, 280, 1, 1, 95, 1, 4.0, 0, 3, 3
]], columns=columns)

h_scaled = pd.DataFrame(heart_scaler.transform(healthy), columns=columns)
u_scaled = pd.DataFrame(heart_scaler.transform(unhealthy), columns=columns)

prob_h = heart_model.predict_proba(h_scaled)[0][1]
prob_u = heart_model.predict_proba(u_scaled)[0][1]

print(f"Healthy raw prob (class 1): {prob_h:.4f}")
print(f"Unhealthy raw prob (class 1): {prob_u:.4f}")
print(f"\nModel type: {type(heart_model).__name__}")