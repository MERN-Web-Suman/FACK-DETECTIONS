import re
import math
from urllib.parse import urlparse

def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy of a string."""
    if not text:
        return 0.0
    entropy = 0.0
    length = len(text)
    freq = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)

def extract_url_features(url: str) -> dict:
    """Extract lexical and structural features from the raw URL."""
    clean_url = url.strip()
    parsed = urlparse(clean_url if "://" in clean_url else f"http://{clean_url}")
    
    url_len = len(clean_url)
    num_dots = clean_url.count('.')
    num_hyphens = clean_url.count('-')
    num_at = clean_url.count('@')
    num_question = clean_url.count('?')
    num_equal = clean_url.count('=')
    num_slash = clean_url.count('/')
    num_digits = sum(c.isdigit() for c in clean_url)
    digit_ratio = round(num_digits / max(url_len, 1), 4)

    # Check for IP address format in hostname
    has_ip = 1 if re.search(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', parsed.netloc.split(':')[0]) else 0

    # Suspicious keywords in path/query
    suspicious_keywords = [
        'login', 'verify', 'update', 'banking', 'secure', 'account', 'signin',
        'confirm', 'password', 'wallet', 'token', 'support', 'recover', 'claim'
    ]
    keyword_count = sum(1 for kw in suspicious_keywords if kw in clean_url.lower())

    return {
        "url_length": url_len,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_at": num_at,
        "num_question": num_question,
        "num_equal": num_equal,
        "num_slash": num_slash,
        "digit_ratio": digit_ratio,
        "has_ip_address": has_ip,
        "suspicious_keywords_count": keyword_count,
        "url_entropy": calculate_entropy(clean_url)
    }

