import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    domain: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Legitimate', 'Suspicious', 'Phishing'],
      default: 'Legitimate'
    },
    threatLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low'
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    confidence: {
      type: Number,
      default: 95.5
    },
    ipAddress: {
      type: String,
      default: 'N/A'
    },
    country: {
      type: String,
      default: 'Global'
    },
    sslValid: {
      type: Boolean,
      default: true
    },
    features: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    indicators: {
      type: [String],
      default: []
    },
    recommendation: {
      type: String,
      default: 'Website is safe to browse.'
    },
    detectionEngine: {
      type: String,
      default: 'PhishGuard Neural Forest'
    },
    scanTimeMs: {
      type: Number,
      default: 240
    },
    userId: {
      type: String,
      default: null
    },
    userEmail: {
      type: String,
      default: 'Guest'
    }
  },
  {
    timestamps: true
  }
);

const MongooseScanModel = mongoose.models.Scan || mongoose.model('Scan', scanSchema);

// In-Memory store fallback
const memoryScans = [
  {
    _id: 'scan_001',
    id: 'scan_001',
    url: 'https://paypal-security-verification-portal.com/login.php',
    domain: 'paypal-security-verification-portal.com',
    status: 'Phishing',
    threatLevel: 'High',
    riskScore: 92.4,
    confidence: 96.8,
    ipAddress: '198.51.100.45',
    country: 'Panama',
    sslValid: false,
    indicators: ['Brand impersonation (PayPal)', 'Suspicious TLD/hyphens', 'Missing verified SSL', 'High entropy score'],
    recommendation: 'DO NOT visit or enter personal credentials. High probability of credential harvesting.',
    detectionEngine: 'PhishGuard Neural Forest + Heuristic Ensemble',
    scanTimeMs: 310,
    userId: 'user_demo_002',
    userEmail: 'user@phishguard.ai',
    features: {
      url_length: 58,
      num_dots: 2,
      num_hyphens: 3,
      num_at: 0,
      has_ip_address: 0,
      is_https: 0,
      brand_impersonation: 1,
      is_suspicious_tld: 0
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    _id: 'scan_002',
    id: 'scan_002',
    url: 'https://github.com/trending',
    domain: 'github.com',
    status: 'Legitimate',
    threatLevel: 'Low',
    riskScore: 3.1,
    confidence: 99.2,
    ipAddress: '140.82.121.4',
    country: 'United States',
    sslValid: true,
    indicators: ['Valid Digicert Extended Validation SSL', 'Known Alexa Top 100 Domain', 'Standard lexical structure'],
    recommendation: 'Safe. Verified legitimate platform with strict transport security.',
    detectionEngine: 'PhishGuard Neural Forest',
    scanTimeMs: 180,
    userId: 'user_demo_002',
    userEmail: 'user@phishguard.ai',
    features: {
      url_length: 29,
      num_dots: 1,
      num_hyphens: 0,
      num_at: 0,
      has_ip_address: 0,
      is_https: 1,
      brand_impersonation: 0,
      is_suspicious_tld: 0
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    _id: 'scan_003',
    id: 'scan_003',
    url: 'http://apple-id-verify-account-locked.xyz/recover',
    domain: 'apple-id-verify-account-locked.xyz',
    status: 'Phishing',
    threatLevel: 'High',
    riskScore: 95.8,
    confidence: 98.4,
    ipAddress: '45.142.214.12',
    country: 'Russia',
    sslValid: false,
    indicators: ['Known phishing pattern (Apple ID)', 'Untrusted .xyz registrar', 'Excessive hyphen count', 'Unencrypted HTTP transport'],
    recommendation: 'Dangerous! Active phishing campaign targeting Apple ID accounts.',
    detectionEngine: 'PhishGuard Neural Forest',
    scanTimeMs: 295,
    userId: 'user_demo_002',
    userEmail: 'user@phishguard.ai',
    features: {
      url_length: 50,
      num_dots: 1,
      num_hyphens: 4,
      num_at: 0,
      has_ip_address: 0,
      is_https: 0,
      brand_impersonation: 1,
      is_suspicious_tld: 1
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
  },
  {
    _id: 'scan_004',
    id: 'scan_004',
    url: 'https://chase-ebanking-support-update.info/auth',
    domain: 'chase-ebanking-support-update.info',
    status: 'Phishing',
    threatLevel: 'High',
    riskScore: 88.6,
    confidence: 94.7,
    ipAddress: '185.220.101.5',
    country: 'Seychelles',
    sslValid: false,
    indicators: ['Financial institution spoofing (Chase)', 'Suspicious authentication keyword in path', 'Untrusted host'],
    recommendation: 'Financial credential harvesting site. Avoid navigating to this page.',
    detectionEngine: 'PhishGuard Neural Forest',
    scanTimeMs: 270,
    userId: null,
    userEmail: 'Guest',
    features: {
      url_length: 46,
      num_dots: 1,
      num_hyphens: 3,
      num_at: 0,
      has_ip_address: 0,
      is_https: 1,
      brand_impersonation: 1,
      is_suspicious_tld: 0
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
  },
  {
    _id: 'scan_005',
    id: 'scan_005',
    url: 'https://www.netflix.com/login',
    domain: 'netflix.com',
    status: 'Legitimate',
    threatLevel: 'Low',
    riskScore: 2.8,
    confidence: 99.5,
    ipAddress: '54.175.122.9',
    country: 'United States',
    sslValid: true,
    indicators: ['Official verified Netflix domain', 'Valid HSTS header', 'EV SSL certificate'],
    recommendation: 'Official streaming service login portal.',
    detectionEngine: 'PhishGuard Neural Forest',
    scanTimeMs: 165,
    userId: 'user_demo_002',
    userEmail: 'user@phishguard.ai',
    features: {
      url_length: 29,
      num_dots: 2,
      num_hyphens: 0,
      num_at: 0,
      has_ip_address: 0,
      is_https: 1,
      brand_impersonation: 0,
      is_suspicious_tld: 0
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
];

export const Scan = {
  async find(query = {}) {
    try {
      if (mongoose.connection.readyState === 1) {
        const docs = await MongooseScanModel.find(query).sort({ createdAt: -1 });
        if (docs && docs.length > 0) return docs;
      }
    } catch (_) { }

    let results = [...memoryScans];
    if (query.userId) {
      results = results.filter(s => s.userId === query.userId);
    }
    if (query.status) {
      results = results.filter(s => s.status.toLowerCase() === query.status.toLowerCase());
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    // Try MongoDB first (only if it looks like a valid ObjectId)
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const doc = await MongooseScanModel.findById(id);
        if (doc) return doc;
      } catch (_) { }
    }

    // Fallback to in-memory
    return memoryScans.find(s => s._id === id || s.id === id) || null;
  },

  async create(scanData) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await MongooseScanModel.create(scanData);
      }
    } catch (_) { }

    const newScan = {
      _id: 'scan_' + Date.now(),
      id: 'scan_' + Date.now(),
      ...scanData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryScans.unshift(newScan);
    return newScan;
  },

  async countDocuments(query = {}) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await MongooseScanModel.countDocuments(query);
      }
    } catch (_) { }

    if (query.userId) {
      return memoryScans.filter(s => s.userId === query.userId).length;
    }
    if (query.status) {
      return memoryScans.filter(s => s.status.toLowerCase() === query.status.toLowerCase()).length;
    }
    return memoryScans.length;
  },

  async findByIdAndDelete(id) {
    // Try MongoDB first for real ObjectIds
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const deletedDoc = await MongooseScanModel.findByIdAndDelete(id);
        if (deletedDoc) {
          // Also remove from memory if it's there (edge case)
          const index = memoryScans.findIndex(s => s._id === String(id) || s.id === String(id));
          if (index !== -1) memoryScans.splice(index, 1);
          return deletedDoc;
        }
      } catch (err) {
        console.error('[Scan.findByIdAndDelete] MongoDB error:', err.message);
      }
    }

    // Fallback: delete from in-memory store
    const index = memoryScans.findIndex(s => s._id === id || s.id === id);
    if (index !== -1) {
      return memoryScans.splice(index, 1)[0];
    }
    return null;
  }
};

