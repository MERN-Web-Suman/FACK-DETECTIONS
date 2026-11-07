import dns from 'dns/promises';
import tls from 'tls';

/**
 * Perform real-time DNS resolution on hostname
 */
export async function resolveHost(hostname) {
  try {
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return { ip: hostname, resolved: true, hasMx: false };
    }

    const addresses = await dns.resolve4(hostname).catch(() => []);
    const ip = addresses.length > 0 ? addresses[0] : null;

    let hasMx = false;
    try {
      const mx = await dns.resolveMx(hostname).catch(() => []);
      hasMx = mx.length > 0;
    } catch (_) { }

    return {
      ip: ip || null,
      resolved: !!ip,
      allIps: addresses,
      hasMx
    };
  } catch (err) {
    return { ip: null, resolved: false, hasMx: false, error: err.message };
  }
}

/**
 * Perform real-time TLS / SSL Handshake to inspect remote certificate
 */
export async function inspectTLSCertificate(hostname, port = 443) {
  return new Promise((resolve) => {
    let resolved = false;

    const socket = tls.connect(
      {
        host: hostname,
        port,
        servername: hostname,
        timeout: 2500,
        rejectUnauthorized: false
      },
      () => {
        if (resolved) return;
        resolved = true;

        try {
          const cert = socket.getPeerCertificate();
          const authorized = socket.authorized;
          const authorizationError = socket.authorizationError;

          let daysRemaining = null;
          if (cert && cert.valid_to) {
            const expDate = new Date(cert.valid_to);
            daysRemaining = Math.round((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          }

          socket.end();
          resolve({
            sslValid: !!authorized,
            issuer: cert?.issuer?.O || cert?.issuer?.CN || 'Unknown CA',
            validTo: cert?.valid_to || null,
            daysRemaining,
            authorized,
            authorizationError: authorizationError ? String(authorizationError) : null
          });
        } catch (e) {
          socket.end();
          resolve({ sslValid: false, issuer: null, error: e.message });
        }
      }
    );

    socket.on('error', (err) => {
      if (resolved) return;
      resolved = true;
      resolve({ sslValid: false, issuer: null, error: err.message });
    });

    socket.on('timeout', () => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({ sslValid: false, issuer: null, error: 'TLS Handshake Timeout' });
    });
  });
}

/**
 * Query live real-time IP Geolocation & ASN
 */
export async function getLiveGeolocation(ip) {
  if (!ip || ip === 'N/A' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
    return { country: 'Local / Private Network', city: 'Internal', isp: 'Private Network' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,org`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          country: data.country || 'Global',
          city: data.city || 'Unknown',
          isp: data.isp || data.org || 'Cloud Provider'
        };
      }
    }
  } catch (_) { }

  return { country: 'Global', city: 'Worldwide', isp: 'Internet Transit' };
}

/**
 * Perform real-time HTTP probe on target URL
 */
export async function probeHttp(targetUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PhishGuard-Scanner/2.4'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    const hasHsts = !!response.headers.get('strict-transport-security');
    const serverHeader = response.headers.get('server') || 'Unknown';
    const finalUrl = response.url;
    const isRedirected = finalUrl && finalUrl !== targetUrl;

    let hasPasswordInput = false;
    try {
      const text = await response.text();
      hasPasswordInput = /<input[^>]+type=["']?password["']?/i.test(text);
    } catch (_) { }

    return {
      online: true,
      statusCode: response.status,
      hasHsts,
      serverHeader,
      finalUrl,
      isRedirected,
      hasPasswordInput
    };
  } catch (err) {
    return {
      online: false,
      statusCode: null,
      error: err.message
    };
  }
}

