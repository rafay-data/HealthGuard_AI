# HealthGuard AI - API Routes

from fastapi import APIRouter, HTTPException
from api.schemas import HealthInput, PredictionResponse
from core.predictor import predict_all_diseases
from core.explainer import get_top_risk_factors
from core.recommendations import get_recommendations

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_diseases(health_data: HealthInput):
    try:
        data = health_data.model_dump()
        predictions, overall_risk = predict_all_diseases(data)

        top_disease = max(
            predictions.items(),
            key=lambda x: x[1]['risk_percentage']
        )[0]

        top_risk_factors = get_top_risk_factors(
            data, top_disease, top_n=5)

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
    return {"status": "healthy", "message": "HealthGuard AI API is running!"}

@router.get("/diseases")
async def get_diseases():
    return {
        "diseases": ["Diabetes", "Heart Disease", "Hypertension",
                     "Stroke", "Kidney Disease"]
    }