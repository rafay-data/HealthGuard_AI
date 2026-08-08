# HealthGuard AI - Model Loader
from pathlib import Path
import pickle

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODELS_PATH = BASE_DIR / "models" / "saved"

models = {}
scalers = {}
pipelines = {}

def load_all_models():
    global models, scalers, pipelines

    model_files = {
        'diabetes': 'diabetes_model.pkl',
        'heart_disease': 'heart_model.pkl',
        'hypertension': 'hypertension_model.pkl',
        'stroke': 'stroke_model.pkl',
        'kidney_disease': 'kidney_model.pkl'
    }
    scaler_files = {
        'diabetes': 'diabetes_scaler.pkl',
        'heart_disease': 'heart_scaler.pkl',
        'hypertension': 'hypertension_scaler.pkl',
    }
    pipeline_files = {
        'stroke': 'stroke_pipeline.pkl',
        'kidney_disease': 'kidney_pipeline.pkl'
    }

    for disease, filename in model_files.items():
        model_path = MODELS_PATH / filename
        if model_path.exists():
            with open(model_path, 'rb') as f:
                models[disease] = pickle.load(f)
            print(f" {disease} model loaded!")

    for disease, filename in scaler_files.items():
        scaler_path = MODELS_PATH / filename
        if scaler_path.exists():
            with open(scaler_path, 'rb') as f:
                scalers[disease] = pickle.load(f)
            print(f" {disease} scaler loaded!")

    for disease, filename in pipeline_files.items():
        pipeline_path = MODELS_PATH / filename
        if pipeline_path.exists():
            with open(pipeline_path, 'rb') as f:
                pipelines[disease] = pickle.load(f)
            print(f" {disease} pipeline loaded!")

    return models, scalers, pipelines

def get_models():
    global models
    if not models:
        load_all_models()
    return models

def get_scalers():
    global scalers
    if not scalers:
        load_all_models()
    return scalers

def get_pipelines():
    global pipelines
    if not pipelines:
        load_all_models()
    return pipelines