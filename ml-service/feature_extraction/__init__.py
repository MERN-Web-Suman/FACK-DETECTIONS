"""Feature extraction package for PhishGuard AI."""
from .url_features import extract_url_features
from .domain_features import extract_domain_features
from .security_features import extract_security_features

def extract_all_features(url: str) -> dict:
    features = {}
    features.update(extract_url_features(url))
    features.update(extract_domain_features(url))
    features.update(extract_security_features(url))
    return features

