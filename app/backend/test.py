import pickle
import pandas as pd

with open('E:/HealthGuard_AI/models/saved/heart_model.pkl', 'rb') as f:
    heart_model = pickle.load(f)

with open('E:/HealthGuard_AI/models/saved/heart_scaler.pkl', 'rb') as f:
    heart_scaler = pickle.load(f)

columns = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
           'restecg', 'thalach', 'exang', 'oldpeak',
           'slope', 'ca', 'thal']

# Healthy person
healthy = pd.DataFrame([[
    25, 1, 0, 110, 160, 0, 0, 170, 0, 0, 1, 0, 2
]], columns=columns)

# Unhealthy person - high risk
unhealthy = pd.DataFrame([[
    55, 1, 1, 160, 280, 1, 0, 95, 1, 3.5, 2, 3, 3
]], columns=columns)

healthy_scaled = heart_scaler.transform(healthy)
unhealthy_scaled = heart_scaler.transform(unhealthy)

healthy_scaled_df = pd.DataFrame(healthy_scaled, columns=columns)
unhealthy_scaled_df = pd.DataFrame(unhealthy_scaled, columns=columns)

prob_healthy = heart_model.predict_proba(healthy_scaled_df)[0][1]
prob_unhealthy = heart_model.predict_proba(unhealthy_scaled_df)[0][1]

print(f"Healthy raw prob (class 1): {prob_healthy:.4f}")
print(f"Unhealthy raw prob (class 1): {prob_unhealthy:.4f}")

print(f"\nHealthy predict: {heart_model.predict(healthy_scaled_df)}")
print(f"Unhealthy predict: {heart_model.predict(unhealthy_scaled_df)}")