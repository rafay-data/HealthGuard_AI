# HealthGuard AI - Input/Output Schemas
# Pydantic models for data validation

from pydantic import BaseModel, Field
from typing import Optional

# User Health Input Schema
class HealthInput(BaseModel):
    # Personal Information
    age: float = Field(..., ge=1, le=120, description="Age in years")
    gender: int = Field(..., ge=0, le=1, description="0=Female, 1=Male")
    
    # Physical Measurements
    bmi: float = Field(..., ge=10, le=70, description="Body Mass Index")
    weight: Optional[float] = Field(None, description="Weight in kg")
    height: Optional[float] = Field(None, description="Height in cm")
    
    # Vital Signs
    bp_systolic: float = Field(..., ge=70, le=250, description="Systolic BP")
    bp_diastolic: float = Field(..., ge=40, le=150, description="Diastolic BP")
    heart_rate: Optional[float] = Field(None, description="Heart rate")
    
    # Lab Results
    glucose: float = Field(..., ge=50, le=500, description="Blood glucose")
    cholesterol: Optional[float] = Field(None, description="Cholesterol")
    
    # Lifestyle
    smoking: int = Field(..., ge=0, le=2, description="0=Never, 1=Former, 2=Current")
    exercise: int = Field(..., ge=0, le=4, description="0=None to 4=Daily")
    alcohol: int = Field(..., ge=0, le=3, description="0=None to 3=Heavy")
    
    # Medical History
    family_history: int = Field(..., ge=0, le=1, description="0=No, 1=Yes")
    previous_disease: int = Field(..., ge=0, le=1, description="0=No, 1=Yes")

# Disease Risk Output Schema
class DiseaseRisk(BaseModel):
    disease: str
    risk_percentage: float
    risk_level: str
    color: str

# Prediction Response Schema
class PredictionResponse(BaseModel):
    success: bool
    predictions: dict
    top_risk_factors: list
    recommendations: dict
    overall_risk: float