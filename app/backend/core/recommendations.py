# HealthGuard AI - Health Recommendations
# Generate personalized health advice

RECOMMENDATIONS = {
    'diabetes': {
        'low': [
            "Maintain healthy BMI through regular exercise",
            "Follow balanced diet with low sugar intake",
            "Monitor blood sugar levels annually",
            "Stay physically active - 30 minutes daily"
        ],
        'moderate': [
            "Consult doctor for diabetes screening",
            "Reduce sugar and refined carbohydrates",
            "Exercise at least 150 minutes per week",
            "Monitor blood glucose regularly",
            "Maintain healthy weight"
        ],
        'high': [
            "Immediately consult a doctor or endocrinologist",
            "Get HbA1c test done urgently",
            "Start diabetes management plan",
            "Strictly control diet - avoid sugar",
            "Daily blood glucose monitoring required"
        ]
    },
    'heart_disease': {
        'low': [
            "Maintain healthy cholesterol levels",
            "Exercise regularly - cardio activities",
            "Avoid smoking and limit alcohol",
            "Annual heart checkup recommended"
        ],
        'moderate': [
            "Consult cardiologist for evaluation",
            "Monitor blood pressure regularly",
            "Reduce saturated fat in diet",
            "Stop smoking immediately",
            "Manage stress through meditation"
        ],
        'high': [
            "Urgently consult a cardiologist",
            "Get ECG and stress test done",
            "Start heart-healthy diet immediately",
            "Take prescribed medications regularly",
            "Avoid strenuous physical activity until evaluated"
        ]
    },
    'hypertension': {
        'low': [
            "Reduce salt intake to less than 6g daily",
            "Exercise 30 minutes most days",
            "Maintain healthy weight",
            "Limit alcohol consumption"
        ],
        'moderate': [
            "Monitor blood pressure daily at home",
            "Significantly reduce salt intake",
            "Start DASH diet for blood pressure",
            "Consult doctor for evaluation",
            "Manage stress levels"
        ],
        'high': [
            "Immediately consult doctor for BP medication",
            "Strictly limit salt to less than 3g daily",
            "Daily blood pressure monitoring required",
            "Avoid caffeine and alcohol",
            "Practice relaxation techniques daily"
        ]
    },
    'stroke': {
        'low': [
            "Maintain healthy blood pressure",
            "Exercise regularly",
            "Avoid smoking",
            "Eat heart-healthy diet"
        ],
        'moderate': [
            "Control blood pressure strictly",
            "Consult neurologist if headaches occur",
            "Stop smoking immediately",
            "Manage diabetes if present",
            "Reduce stress and get adequate sleep"
        ],
        'high': [
            "Urgently consult neurologist or doctor",
            "Learn stroke warning signs - FAST method",
            "Control all risk factors immediately",
            "Take prescribed blood thinners if recommended",
            "Emergency: Call 1122 if stroke symptoms appear"
        ]
    },
    'kidney_disease': {
        'low': [
            "Stay well hydrated - 8 glasses water daily",
            "Avoid excessive NSAID pain medications",
            "Control blood pressure",
            "Annual kidney function test"
        ],
        'moderate': [
            "Consult nephrologist for evaluation",
            "Reduce protein intake in diet",
            "Strictly control blood pressure",
            "Avoid nephrotoxic medications",
            "Monitor creatinine levels regularly"
        ],
        'high': [
            "Urgently consult nephrologist",
            "Get GFR test done immediately",
            "Start kidney-protective diet",
            "Strictly control diabetes and BP",
            "Discuss dialysis options with doctor"
        ]
    }
}

def get_recommendations(predictions):
    """Get recommendations based on risk levels"""
    all_recommendations = {}

    for disease, result in predictions.items():
        risk_level = result['risk_level'].lower()

        if 'low' in risk_level:
            level = 'low'
        elif 'moderate' in risk_level:
            level = 'moderate'
        else:
            level = 'high'

        all_recommendations[disease] = {
            'disease_name': result['name'],
            'risk_level': result['risk_level'],
            'risk_percentage': result['risk_percentage'],
            'advice': RECOMMENDATIONS.get(disease, {}).get(
                level, ["Consult your doctor for advice"])
        }

    return all_recommendations