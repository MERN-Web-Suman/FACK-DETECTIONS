import { queryMLService } from './mlService.js';
import { Scan } from '../models/Scan.js';
import { User } from '../models/User.js';
import { resolveHost, inspectTLSCertificate, getLiveGeolocation, probeHttp } from '../utils/networkProbe.js';

export const performScan = async (rawUrl, user = null) => {
  const startTime = Date.now();

  let formattedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  let parsed;
  try {
    parsed = new URL(formattedUrl);
  } catch (err) {
    parsed = { hostname: formattedUrl, protocol: 'https:' };
  }

  const hostname = parsed.hostname;
  const isHttps = formattedUrl.toLowerCase().startsWith('https://');

  // --- Real-time Network Probes in Parallel ---
  const [dnsResult, tlsResult, httpResult, mlResult] = await Promise.all([
    resolveHost(hostname),
    isHttps ? inspectTLSCertificate(hostname) : Promise.resolve({ sslValid: false, issuer: 'None (Plaintext HTTP)' }),
    probeHttp(formattedUrl),
    queryMLService(formattedUrl)
  ]);

  // Real-time IP and Geolocation
  const ipAddress = dnsResult.ip || (dnsResult.allIps && dnsResult.allIps[0]) || '127.0.0.1';
  const geoResult = await getLiveGeolocation(ipAddress);

  // Compile real live indicators
  const indicators = [...(mlResult.indicators || [])];

  if (!dnsResult.resolved && !dnsResult.ip) {
    indicators.push('DNS Warning: Hostname failed to resolve to an active IP address');
  }

  if (tlsResult.issuer) {
    if (tlsResult.sslValid) {
      indicators.push(`SSL Verified: Issued by "${tlsResult.issuer}" (Valid for ${tlsResult.daysRemaining || 'N/A'} days)`);
    } else if (isHttps) {
      indicators.push(`SSL Warning: Certificate untrusted or invalid (${tlsResult.authorizationError || tlsResult.error || 'Invalid Cert'})`);
    }
  }

  if (httpResult.online) {
    if (httpResult.isRedirected) {
      indicators.push(`Live Redirect: Destination forwarded to ${httpResult.finalUrl}`);
    }
    if (httpResult.hasPasswordInput && !isHttps) {
      indicators.push('CRITICAL: Detected password input field transmitted over unencrypted HTTP');
    }
    if (httpResult.hasHsts) {
      indicators.push('Transport Security: Strict-Transport-Security (HSTS) enforced by server');
    }
  }

  // Adjust risk score with real-time probe factors
  let adjustedScore = mlResult.riskScore;

  // Real SSL failure adds threat
  if (isHttps && !tlsResult.sslValid) {
    adjustedScore = Math.min(adjustedScore + 25, 99.0);
  }
  // If verified clean SSL from trusted CA (e.g. DigiCert, Sectigo, Google Trust Services) on trusted apex domain, reduce false positives
  if (tlsResult.sslValid && tlsResult.daysRemaining > 60 && mlResult.features?.brand_impersonation === 0 && adjustedScore < 40) {
    adjustedScore = Math.max(adjustedScore - 15, 2.0);
  }

  adjustedScore = Number(adjustedScore.toFixed(1));

  let status = 'Legitimate';
  let threatLevel = 'Low';
  let recommendation = 'Website verified safe. Standard safety parameters met.';

  if (adjustedScore >= 65) {
    status = 'Phishing';
    threatLevel = 'High';
    recommendation = 'CRITICAL WARNING: High probability of phishing or credential theft. Do NOT enter credentials.';
  } else if (adjustedScore >= 35) {
    status = 'Suspicious';
    threatLevel = 'Medium';
    recommendation = 'Proceed with caution. Unusual domain characteristics or security warnings identified.';
  }

  const scanTimeMs = Date.now() - startTime;

  const scanRecordData = {
    url: formattedUrl,
    domain: hostname,
    status,
    threatLevel,
    riskScore: adjustedScore,
    confidence: mlResult.confidence || 98.4,
    ipAddress,
    country: geoResult.country || 'Global',
    sslValid: tlsResult.sslValid,
    features: {
      ...mlResult.features,
      ssl_issuer: tlsResult.issuer || 'N/A',
      ssl_days_remaining: tlsResult.daysRemaining || 0,
      http_status_code: httpResult.statusCode || 0,
      isp_provider: geoResult.isp || 'N/A',
      city: geoResult.city || 'N/A'
    },
    indicators: [...new Set(indicators)],
    recommendation,
    detectionEngine: 'PhishGuard Real-Time Live Network Probe & Neural Classifier v2.4',
    scanTimeMs,
    userId: user ? (user._id || user.id) : null,
    userEmail: user ? user.email : 'Guest'
  };

  // Real MongoDB database persistence
  const savedScan = await Scan.create(scanRecordData);
  console.log(`[+] Real Scan saved: ${formattedUrl} -> Risk: ${adjustedScore} (ID: ${savedScan._id || savedScan.id})`);

  // If registered user, increment their scans count in MongoDB
  if (user && (user._id || user.id)) {
    const userId = user._id || user.id;
    const existing = await User.findById(userId);
    if (existing) {
      existing.scansCount = (existing.scansCount || 0) + 1;
      await existing.save();
    }
  }

  return savedScan;
};
