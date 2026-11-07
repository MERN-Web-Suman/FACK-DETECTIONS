from urllib.parse import urlparse

def extract_security_features(url: str) -> dict:
    """Extract protocol, port and security attributes."""
    clean_url = url.strip().lower()
    
    is_https = 1 if clean_url.startswith("https://") else 0
    has_port_in_url = 0
    
    try:
        parsed = urlparse(clean_url if "://" in clean_url else f"http://{clean_url}")
        if parsed.port and parsed.port not in (80, 443):
            has_port_in_url = 1
    except Exception:
        has_port_in_url = 0

    # Shortener check
    shorteners = {'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly'}
    is_shortener = 1 if any(s in clean_url for s in shorteners) else 0

    return {
        "is_https": is_https,
        "non_standard_port": has_port_in_url,
        "is_shortened_url": is_shortener
    }

