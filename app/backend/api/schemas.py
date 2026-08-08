# HealthGuard AI - Input/Output Schemas

from pydantic import BaseModel, Field
from typing import Optional

class HealthInput(BaseModel):
    age: float = Field(..., ge=1, le=120)
    gender: int = Field(..., ge=0, le=1)
    weight: Optional[float] = 70
    height: Optional[float] = 170
    bmi: float = Field(..., ge=10, le=70)
    bp_systolic: float = Field(..., ge=70, le=250)
    bp_diastolic: float = Field(..., ge=40, le=150)
    heart_rate: Optional[float] = 75
    glucose: float = Field(..., ge=50, le=500)
    cholesterol: Optional[float] = 200
    hemoglobin: Optional[float] = 13
    creatinine: Optional[float] = 1.0
    blood_urea: Optional[float] = 30
    smoking: int = Field(..., ge=0, le=2)
    exercise: int = Field(..., ge=0, le=4)
    alcohol: int = Field(..., ge=0, le=3)
    pregnancies: Optional[float] = 0
    salt_intake: Optional[float] = 8
    stress_score: Optional[float] = 5
    sleep_duration: Optional[float] = 7
    family_history: int = Field(..., ge=0, le=1)
    previous_disease: int = Field(..., ge=0, le=1)
    chest_pain: Optional[int] = 0
    diabetes_history: Optional[int] = 0
    hypertension_history: Optional[int] = 0
    ever_married: Optional[int] = 1
    work_type: Optional[int] = 2

class PredictionResponse(BaseModel):
    success: bool
    predictions: dict
    top_risk_factors: list
    recommendations: dict
    overall_risk: float