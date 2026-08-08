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

# CORS (Cross-Origin Resource Sharing) Middleware Setup
# Yeh React frontend (jo port 5173 par chal raha hai) ko is FastAPI backend ke sath data share aur communicate karne ki permission deta hai.
app.add_middleware(
    CORSMiddleware,
    
    # Sirf in URLs (frontend) se aane wali requests ko allow karega
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    
    # Cookies aur authentication details ko allow karta hai
    allow_credentials=True, 
    
    # Har qism ke HTTP methods (GET, POST, PUT, DELETE, etc.) ko permission deta hai
    allow_methods=["*"],    
    
    # Client ki taraf se aane wale har qism ke headers ko allow karta hai
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