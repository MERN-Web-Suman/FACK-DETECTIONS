from pydantic import BaseModel, HttpUrl
from typing import Dict, Any, Optional

class URLScanRequest(BaseModel):
    url: str

class URLScanResponse(BaseModel):
    url: str
    is_phishing: bool
    status: str
    threat_level: str
    confidence_score: float
    features: Dict[str, Any]
    engine: str = "PhishGuard-RandomForest-v1"

