# HealthGuard AI - FastAPI Backend
# Main Application Entry Point

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

# Create FastAPI app
app = FastAPI(
    title="HealthGuard AI API",
    description="AI-Powered Major Diseases Risk Prediction System",
    version="1.0.0"
)

# CORS (Cross-Origin Resource Sharing) Middleware Setup
# Local frontend URLs hamesha allowed hain
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Deployed frontend URL(s) environment variable FRONTEND_URL se aate hain
# (comma se alag karke, jaise https://healthguard-ai.vercel.app)
extra_origins = os.getenv("FRONTEND_URL", "")
allowed_origins += [
    origin.strip().rstrip("/")
    for origin in extra_origins.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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