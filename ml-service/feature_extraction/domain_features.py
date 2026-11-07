import re
from urllib.parse import urlparse

SUSPICIOUS_TLDS = {
    'xyz', 'top', 'work', 'click', 'link', 'country', 'stream', 'gdn', 'mom',
    'bid', 'loan', 'racing', 'date', 'download', 'review', 'faith', 'party',
    'trade', 'science', 'accountant', 'vip', 'monster', 'ru', 'su'
}

HIGH_TARGET_BRANDS = [
    'paypal', 'apple', 'google', 'microsoft', 'netflix', 'amazon', 'chase',
    'wellsfargo', 'binance', 'metamask', 'facebook', 'instagram', 'whatsapp',
    'bank', 'citibank', 'barclays', 'santander', 'ebay'
]

def extract_domain_features(url: str) -> dict:
    """Extract domain level indicators and typosquatting signals."""
    clean_url = url.strip()
    parsed = urlparse(clean_url if "://" in clean_url else f"http://{clean_url}")
    hostname = parsed.netloc.split(':')[0].lower()
    
    parts = hostname.split('.')
    tld = parts[-1] if len(parts) > 1 else ''
    domain_length = len(hostname)
    num_subdomains = max(0, len(parts) - 2) if len(parts) > 2 else 0

    is_suspicious_tld = 1 if tld in SUSPICIOUS_TLDS else 0
    has_hyphen_in_domain = 1 if '-' in hostname else 0

    # Brand impersonation check (target brand present in subdomain or combined name)
    brand_impersonation = 0
    for brand in HIGH_TARGET_BRANDS:
        if brand in hostname:
            # If brand is in domain, but it's not the official primary domain
            if not (hostname == f"{brand}.com" or hostname.endswith(f".{brand}.com") or hostname.endswith(f".{brand}.org")):
                brand_impersonation = 1
                break

    return {
        "domain_length": domain_length,
        "num_subdomains": num_subdomains,
        "is_suspicious_tld": is_suspicious_tld,
        "has_hyphen_in_domain": has_hyphen_in_domain,
        "brand_impersonation": brand_impersonation
    }

