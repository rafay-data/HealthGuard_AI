# HealthGuard AI - API Routes
# All API endpoints

from fastapi import APIRouter, HTTPException
from api.schemas import HealthInput, PredictionResponse
from core.predictor import predict_all_diseases
from core.explainer import get_top_risk_factors
from core.recommendations import get_recommendations

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_diseases(health_data: HealthInput):
    """
    Main prediction endpoint
    Receives user health data
    Returns risk predictions for all 5 diseases
    """
    try:
        # Convert input to dictionary
        data = health_data.model_dump()

        # Get predictions for all diseases
        predictions, overall_risk = predict_all_diseases(data)

        # Get top risk factors using SHAP
        top_risk_factors = get_top_risk_factors(
            data, 'diabetes', top_n=5)

        # Get personalized recommendations
        recommendations = get_recommendations(predictions)

        return PredictionResponse(
            success=True,
            predictions=predictions,
            top_risk_factors=top_risk_factors,
            recommendations=recommendations,
            overall_risk=overall_risk
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}")

@router.get("/health")
async def api_health():
    """API health check endpoint"""
    return {
        "status": "healthy",
        "message": "HealthGuard AI API is running!"
    }

@router.get("/diseases")
async def get_diseases():
    """Get list of supported diseases"""
    return {
        "diseases": [
            "Diabetes",
            "Heart Disease",
            "Hypertension",
            "Stroke",
            "Kidney Disease"
        ]
    }