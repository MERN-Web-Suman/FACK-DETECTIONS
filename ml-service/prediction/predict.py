import os
import sys
import joblib
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from feature_extraction import extract_all_features

_model = None
_scaler = None

def load_inference_artifacts():
    global _model, _scaler
    if _model is not None and _scaler is not None:
        return _model, _scaler

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, 'models', 'phishing_model.pkl')
    scaler_path = os.path.join(base_dir, 'models', 'scaler.pkl')

    if os.path.exists(model_path) and os.path.exists(scaler_path):
        _model = joblib.load(model_path)
        _scaler = joblib.load(scaler_path)
    return _model, _scaler

def predict_url(url: str) -> dict:
    """Predict phishing probability and safety classification for a given URL."""
    features = extract_all_features(url)
    model, scaler = load_inference_artifacts()

    # Rule-based fallback if ML pickle is not yet serialized
    if model is None or scaler is None:
        # Heuristic calculation based on high-fidelity features
        score = 5.0
        if features.get('has_ip_address', 0) == 1:
            score += 35
        if features.get('brand_impersonation', 0) == 1:
            score += 40
        if features.get('is_suspicious_tld', 0) == 1:
            score += 25
        if features.get('is_https', 1) == 0:
            score += 15
        if features.get('num_at', 0) > 0:
            score += 20
        if features.get('num_hyphens', 0) >= 3:
            score += 15
        if features.get('suspicious_keywords_count', 0) >= 2:
            score += 25
        if features.get('is_shortened_url', 0) == 1:
            score += 15
        if features.get('url_entropy', 0) > 4.2:
            score += 10
            
        probability = min(max(score / 100.0, 0.02), 0.99)
    else:
        df_feat = pd.DataFrame([features])
        scaled = scaler.transform(df_feat)
        prob = model.predict_proba(scaled)[0][1]
        probability = float(prob)

    risk_score = round(probability * 100, 2)

    if risk_score >= 65:
        status = "Phishing"
        threat_level = "High"
    elif risk_score >= 35:
        status = "Suspicious"
        threat_level = "Medium"
    else:
        status = "Legitimate"
        threat_level = "Low"

    return {
        "url": url,
        "is_phishing": bool(risk_score >= 50),
        "status": status,
        "threat_level": threat_level,
        "confidence_score": risk_score,
        "features": features
    }

