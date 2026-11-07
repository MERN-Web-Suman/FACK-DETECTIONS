import { Scan } from '../models/Scan.js';
import { validateURL } from '../utils/validateURL.js';
import { performScan } from '../services/scanService.js';

// @desc    Scan and analyze target URL
// @route   POST /api/scans/analyze
// @access  Public / Optional Auth
export const analyzeURL = async (req, res, next) => {
  try {
    const { url } = req.body;
    const validation = validateURL(url);

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const scanResult = await performScan(validation.url, req.user || null);

    res.status(200).json({
      success: true,
      data: scanResult
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's scan history
// @route   GET /api/scans/history
// @access  Private
export const getScanHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const scans = await Scan.find({ userId });

    res.status(200).json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific scan report by ID
// @route   GET /api/scans/:id
// @access  Public
export const getScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan report not found' });
    }

    res.status(200).json({
      success: true,
      data: scan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user scan statistics
// @route   GET /api/scans/stats
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const scans = await Scan.find({ userId });

    const total = scans.length;
    const phishing = scans.filter(s => s.status === 'Phishing').length;
    const suspicious = scans.filter(s => s.status === 'Suspicious').length;
    const legitimate = scans.filter(s => s.status === 'Legitimate').length;

    const avgRiskScore = total > 0
      ? Number((scans.reduce((acc, curr) => acc + curr.riskScore, 0) / total).toFixed(1))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        phishing,
        suspicious,
        legitimate,
        avgRiskScore,
        recentScans: scans.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a scan
// @route   DELETE /api/scans/:id
// @access  Private
export const deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }

    // Check authorization safely comparing strings and email
    const userId = String(req.user._id || req.user.id || '');
    const scanUserId = String(scan.userId || '');
    const userEmail = (req.user.email || '').toLowerCase();
    const scanEmail = (scan.userEmail || '').toLowerCase();

    const isOwner =
      (scanUserId && scanUserId === userId) ||
      (scanEmail && scanEmail === userEmail) ||
      (!scanUserId || scanUserId === 'null' || scanUserId === 'undefined') ||
      req.user.role === 'admin';

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this scan' });
    }

    const deleted = await Scan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Scan not found or already deleted' });
    }

    console.log(`[DELETE] Scan ${req.params.id} deleted from MongoDB by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Scan record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze email text for phishing, urgency & BEC lures
// @route   POST /api/scans/analyze-email
// @access  Private / Protected
export const analyzeEmailContent = async (req, res, next) => {
  try {
    const { subject = '', body = '' } = req.body;
    const content = `${subject} ${body}`.toLowerCase();

    if (!content.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide email subject or body text to analyze.' });
    }

    const urgencyKeywords = [
      'immediate action', 'immediately', 'within 24 hours', 'account suspended',
      'account will be terminated', 'account locked', 'unauthorized access',
      'security alert', 'urgent', 'act now', 'final notice', 'expired'
    ];

    const financialKeywords = [
      'wire transfer', 'gift card', 'bitcoin', 'crypto', 'invoice attached',
      'payroll', 'bank details', 'payment update', 'funds', 'remittance', 'direct deposit'
    ];

    const credentialKeywords = [
      'verify your password', 'reset password', 'confirm identity', 'login credentials',
      'click below', 'click here', 'update payment method', 're-activate'
    ];

    const foundUrgency = urgencyKeywords.filter(k => content.includes(k));
    const foundFinancial = financialKeywords.filter(k => content.includes(k));
    const foundCredential = credentialKeywords.filter(k => content.includes(k));

    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const extractedUrls = (content.match(urlRegex) || []).map(u => u.replace(/[),.;]+$/, ''));

    let riskScore = 12;
    riskScore += foundUrgency.length * 18;
    riskScore += foundFinancial.length * 20;
    riskScore += foundCredential.length * 22;
    if (extractedUrls.length > 0) riskScore += 15;
    riskScore = Math.min(Math.max(riskScore, 5), 98);

    let verdict = 'Legitimate';
    let threatLevel = 'Low';

    if (riskScore >= 65) {
      verdict = 'Phishing';
      threatLevel = 'High';
    } else if (riskScore >= 35) {
      verdict = 'Suspicious';
      threatLevel = 'Medium';
    }

    const report = {
      verdict,
      threatLevel,
      riskScore,
      urgencyScore: Math.min(foundUrgency.length * 30 + (foundUrgency.length ? 15 : 5), 100),
      financialRiskScore: Math.min(foundFinancial.length * 35 + (foundFinancial.length ? 15 : 5), 100),
      credentialHarvestRisk: Math.min(foundCredential.length * 35 + (foundCredential.length ? 15 : 5), 100),
      detectedIndicators: [
        ...foundUrgency.map(k => `High-Urgency Pressure: "${k}"`),
        ...foundFinancial.map(k => `Financial / BEC Bait: "${k}"`),
        ...foundCredential.map(k => `Credential Harvesting Call-To-Action: "${k}"`),
        ...(extractedUrls.length > 0 ? [`Contains ${extractedUrls.length} embedded web links`] : [])
      ],
      extractedUrls,
      recommendation: verdict === 'Phishing'
        ? 'DANGER: Do NOT click links, reply, or transfer funds. High indicators of phishing or Business Email Compromise (BEC).'
        : verdict === 'Suspicious'
        ? 'CAUTION: Email displays manipulative urgency patterns. Verify sender through secondary out-of-band communication.'
        : 'SAFE: No aggressive phishing, BEC lures, or high-risk credential solicitation detected.'
    };

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

