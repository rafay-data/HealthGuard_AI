# HealthGuard AI - FastAPI Backend
# Main Application Entry Point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

# Create FastAPI app
app = FastAPI(
    title="HealthGuard AI API",
    description="AI-Powered Major Diseases Risk Prediction System",
    version="1.0.0"
)

# CORS Settings
# Allow React frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "HealthGuard AI API is running!",
        "version": "1.0.0",
        "status": "active"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}