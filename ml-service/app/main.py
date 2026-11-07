import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure root of ml-service is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.schemas import URLScanRequest, URLScanResponse
from prediction.predict import predict_url

load_dotenv()

app = FastAPI(
    title="PhishGuard AI - ML Detection Service",
    description="High performance ML inference API for Phishing Website Detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "PhishGuard AI Inference Engine",
        "status": "online",
        "version": "1.0.0",
        "endpoints": ["/predict", "/health"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=URLScanResponse)
def analyze_url(payload: URLScanRequest):
    if not payload.url or len(payload.url.strip()) == 0:
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    
    try:
        result = predict_url(payload.url.strip())
        return URLScanResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)

