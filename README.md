# HealthGuard AI 🏥

An AI-Powered Major Diseases Risk Prediction System built as Final Year Project at University of Sindh, Jamshoro.

## 🎯 Overview
HealthGuard AI predicts risk for 5 major diseases simultaneously using Machine Learning algorithms with a modern web interface.

## 🩺 Diseases Predicted
| Disease | Model | Accuracy |
|---------|-------|----------|
| Diabetes | XGBoost | 95.68% |
| Heart Disease | Random Forest | 84.38% |
| Hypertension | XGBoost | 98.76% |
| Stroke | Random Forest | 82.44% |
| Kidney Disease | Random Forest | 99.33% |

## 🛠️ Tech Stack

**Backend:**
- FastAPI
- Python 3.13
- scikit-learn
- XGBoost
- SHAP
- Uvicorn

**Frontend:**
- React.js
- Tailwind CSS
- Recharts
- Axios

**ML/Data:**
- pandas
- NumPy
- SMOTE
- StandardScaler

## 📁 Project Structure



HealthGuard_AI/
├── app/
│ ├── backend/ # FastAPI Backend
│ │ ├── api/ # Routes & Schemas
│ │ ├── core/ # ML Engine
│ │ └── main.py # Entry Point
│ └── frontend/ # React Frontend
│ └── src/
│ ├── pages/ # Home, Assessment, Results, About
│ └── components/
├── data/
│ ├── raw/ # Original Datasets
│ └── processed/ # Cleaned Datasets
├── models/
│ └── saved/ # Trained Models (.pkl)
├── notebooks/
│ ├── EDA/ # Exploratory Data Analysis
│ ├── cleaning/ # Data Cleaning
│ └── models/ # Model Training
└── reports/ # SHAP Plots & Results




## 🚀 How to Run

**Backend:**
```bash
cd app/backend
python -m uvicorn main:app --reload
```

**Frontend:**
```bash
cd app/frontend
npm run dev
```

**Open:** http://localhost:5173

## 📊 Datasets
- Pima Indians Diabetes Database (UCI)
- Cleveland Heart Disease Dataset (UCI)
- Hypertension Risk Dataset (Kaggle)
- Stroke Prediction Dataset (Kaggle)
- Chronic Kidney Disease Dataset (UCI)

## ⚠️ Disclaimer
This system is for educational purposes only and is not a substitute for professional medical advice.

## 👥 Team
- University of Sindh, Jamshoro
- Department of Information Technology
- BS Information Technology - Final Year Project 2026