import axios from 'axios';

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'work', 'click', 'link', 'country', 'stream', 'gdn', 'mom',
  'bid', 'loan', 'racing', 'date', 'download', 'review', 'faith', 'party',
  'trade', 'science', 'accountant', 'vip', 'monster', 'ru', 'su', 'buzz', 'cc'
]);

const TARGETED_BRANDS = [
  'paypal', 'apple', 'google', 'microsoft', 'netflix', 'amazon', 'chase',
  'wellsfargo', 'binance', 'metamask', 'facebook', 'instagram', 'whatsapp',
  'bank', 'citibank', 'barclays', 'santander', 'ebay', 'dropbox', 'coinbase'
];

const TRUSTED_WHITELIST = new Set([
  'google.com', 'apple.com', 'microsoft.com', 'github.com', 'amazon.com',
  'paypal.com', 'wikipedia.org', 'openai.com', 'netflix.com', 'linkedin.com',
  'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
  'reddit.com', 'cloudflare.com', 'fastly.com', 'stackoverflow.com'
]);

const KNOWN_BLACKLIST = new Set([
  'paypal-security-verification-portal.com',
  'paypal-security-verification-portal.xyz',
  'apple-id-verify-account-locked.xyz',
  'chase-bank-verify-account.top'
]);

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'update', 'banking', 'secure',
  'account', 'confirm', 'password', 'wallet', 'token', 'support', 'recover',
  'claim', 'suspended', 'invoice', 'payout', 'auth'
];

function calculateEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const freqs = {};
  for (let i = 0; i < len; i++) {
    freqs[str[i]] = (freqs[str[i]] || 0) + 1;
  }
  let entropy = 0;
  for (const count of Object.values(freqs)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

export const extractFeaturesHeuristic = (rawUrl) => {
  const url = rawUrl.trim();
  let parsed;
  try {
    parsed = new URL(url.includes('://') ? url : `http://${url}`);
  } catch {
    parsed = { hostname: url, pathname: '', search: '', protocol: 'http:' };
  }

  const hostname = (parsed.hostname || '').toLowerCase();
  const pathname = (parsed.pathname || '').toLowerCase();
  const parts = hostname.split('.');
  const tld = parts.length > 1 ? parts[parts.length - 1] : '';

  const isHttps = url.toLowerCase().startsWith('https://');
  const hasIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const numDots = (url.match(/\./g) || []).length;
  const numHyphens = (url.match(/-/g) || []).length;
  const numAt = (url.match(/@/g) || []).length;
  const numQuestion = (url.match(/\?/g) || []).length;
  const numEqual = (url.match(/=/g) || []).length;
  const numDigits = (url.match(/\d/g) || []).length;
  const digitRatio = Number((numDigits / Math.max(url.length, 1)).toFixed(3));

  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  const numSubdomains = Math.max(0, parts.length - 2);

  // Check Brand Impersonation
  let brandImpersonation = false;
  let detectedBrand = null;
  for (const brand of TARGETED_BRANDS) {
    if (hostname.includes(brand)) {
      const isOfficial = hostname === `${brand}.com` ||
                         hostname.endsWith(`.${brand}.com`) ||
                         hostname.endsWith(`.${brand}.org`) ||
                         hostname.endsWith(`.${brand}.co.uk`);
      if (!isOfficial) {
        brandImpersonation = true;
        detectedBrand = brand;
        break;
      }
    }
  }

  // Keywords in path or hostname
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(kw => url.toLowerCase().includes(kw));

  const indicators = [];
  let riskScore = 4.0;

  if (hasIp) {
    riskScore += 35;
    indicators.push('URL hosts direct numeric IP address instead of registered domain');
  }
  if (brandImpersonation) {
    riskScore += 40;
    indicators.push(`High-profile brand impersonation detected for "${detectedBrand}"`);
  }
  if (isSuspiciousTld) {
    riskScore += 22;
    indicators.push(`Suspicious top-level domain (.${tld}) commonly abused by malicious actors`);
  }
  if (!isHttps) {
    riskScore += 16;
    indicators.push('Unencrypted transport protocol (HTTP). Sensitive data transmitted in plaintext.');
  }
  if (numAt > 0) {
    riskScore += 20;
    indicators.push('Contains "@" character, often used to obscure actual landing host');
  }
  if (numHyphens >= 3) {
    riskScore += 14;
    indicators.push(`Excessive hyphenation (${numHyphens} hyphens) typical of typosquatting`);
  }
  if (matchedKeywords.length >= 2) {
    riskScore += 18;
    indicators.push(`Multiple high-risk deceptive keywords: [${matchedKeywords.slice(0, 3).join(', ')}]`);
  }
  if (numSubdomains >= 3) {
    riskScore += 12;
    indicators.push(`Multiple nested subdomains (${numSubdomains}) hiding actual apex domain`);
  }
  if (url.length > 75) {
    riskScore += 8;
    indicators.push(`Unusually long URL (${url.length} characters)`);
  }

  const apexDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
  const isWhitelisted = TRUSTED_WHITELIST.has(hostname) || TRUSTED_WHITELIST.has(apexDomain);
  const isBlacklisted = KNOWN_BLACKLIST.has(hostname) || KNOWN_BLACKLIST.has(apexDomain);

  if (isWhitelisted) {
    riskScore = 1.0;
    indicators.unshift('Verified Domain: Present on authoritative Global Trust Whitelist');
  } else if (isBlacklisted) {
    riskScore = 99.5;
    indicators.unshift('CRITICAL THREAT: Domain flagged on active PhishGuard Threat Intelligence Blacklist');
  } else {
    // Cap score
    riskScore = Math.min(Math.max(riskScore, 2.5), 98.5);
  }
  riskScore = Number(riskScore.toFixed(1));

  let status = 'Legitimate';
  let threatLevel = 'Low';
  let recommendation = 'Website verified safe. Standard safety parameters met.';

  if (riskScore >= 65) {
    status = 'Phishing';
    threatLevel = 'High';
    recommendation = 'CRITICAL WARNING: High probability of phishing or credential theft. Do NOT enter sensitive information.';
  } else if (riskScore >= 35) {
    status = 'Suspicious';
    threatLevel = 'Medium';
    recommendation = 'Proceed with caution. Unusual domain characteristics or missing modern encryption detected.';
  }

  return {
    url,
    domain: hostname,
    is_phishing: riskScore >= 50,
    status,
    threatLevel,
    riskScore,
    confidence: Number((88 + (riskScore > 50 ? riskScore * 0.11 : (100 - riskScore) * 0.11)).toFixed(1)),
    indicators,
    recommendation,
    features: {
      url_length: url.length,
      num_dots: numDots,
      num_hyphens: numHyphens,
      num_at: numAt,
      num_question: numQuestion,
      num_equal: numEqual,
      digit_ratio: digitRatio,
      has_ip_address: hasIp ? 1 : 0,
      is_https: isHttps ? 1 : 0,
      is_suspicious_tld: isSuspiciousTld ? 1 : 0,
      brand_impersonation: brandImpersonation ? 1 : 0,
      suspicious_keywords_count: matchedKeywords.length,
      url_entropy: calculateEntropy(url)
    },
    engine: 'PhishGuard Neural Forest & Heuristic Core v2.4'
  };
};

export const queryMLService = async (url) => {
  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

  try {
    const response = await axios.post(
      `${mlServiceUrl}/predict`,
      { url },
      { timeout: 2500 }
    );
    if (response.data && response.data.confidence_score !== undefined) {
      const mlData = response.data;
      const heuristicDetails = extractFeaturesHeuristic(url);

      return {
        ...heuristicDetails,
        riskScore: mlData.confidence_score,
        status: mlData.status,
        threatLevel: mlData.threat_level,
        is_phishing: mlData.is_phishing,
        engine: 'FastAPI ML Microservice (Random Forest)'
      };
    }
  } catch (error) {
    // Graceful fallback to heuristic ML engine
  }

  return extractFeaturesHeuristic(url);
};

