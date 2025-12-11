import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();

// Generate pass reference ID
function generatePassReference() {
  const year = new Date().getFullYear();
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PASS-${year}-SCR-${randomId}`;
}

// GET all passes
router.get('/', (req, res) => {
  try {
    const passes = db.getPasses();
    res.json({
      success: true,
      count: passes.length,
      data: passes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single pass
router.get('/:ref', (req, res) => {
  try {
    const pass = db.getPass(req.params.ref);
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Pass not found' });
    }
    
    // Check if expired
    const isExpired = new Date(pass.expiresAt) < new Date();
    if (isExpired) {
      pass.status = 'expired';
    }
    
    res.json({ success: true, data: pass });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create pass
router.post('/', async (req, res) => {
  try {
    const {
      candidateId,
      candidateName,
      type,
      position,
      accessLevel,
      expiryDays = 30
    } = req.body;

    // Validate candidate exists
    const candidate = db.getCandidate(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const passReference = generatePassReference();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const pass = {
      id: passReference,
      candidateId,
      candidateName: candidateName || candidate.name,
      type: type || 'screening',
      position: position || candidate.position,
      status: 'active',
      accessLevel: accessLevel || 'standard',
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      includes: [
        'Candidate Information Form',
        'Soft Skills Assessment',
        'Technical Assessment',
        'Document Upload Portal',
        'Progress Tracker'
      ]
    };

    const created = await db.addPass(pass);
    
    res.status(201).json({
      success: true,
      message: 'Pass generated successfully',
      data: created
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update pass status
router.put('/:ref', async (req, res) => {
  try {
    const { status } = req.body;
    const pass = db.getPass(req.params.ref);
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Pass not found' });
    }

    const updated = await db.updatePass(req.params.ref, {
      status,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Pass updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST validate pass
router.post('/:ref/validate', (req, res) => {
  try {
    const pass = db.getPass(req.params.ref);
    
    if (!pass) {
      return res.json({
        success: false,
        valid: false,
        reason: 'Pass not found'
      });
    }

    const isExpired = new Date(pass.expiresAt) < new Date();
    const isActive = pass.status === 'active';

    res.json({
      success: true,
      valid: isActive && !isExpired,
      reason: !isActive ? 'Pass is not active' : isExpired ? 'Pass has expired' : 'Valid',
      data: {
        reference: pass.id,
        candidateName: pass.candidateName,
        position: pass.position,
        expiresAt: pass.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET pass statistics
router.get('/stats/summary', (req, res) => {
  try {
    const passes = db.getPasses();
    const now = new Date();
    
    const stats = {
      total: passes.length,
      active: passes.filter(p => p.status === 'active' && new Date(p.expiresAt) > now).length,
      expired: passes.filter(p => new Date(p.expiresAt) <= now).length,
      revoked: passes.filter(p => p.status === 'revoked').length,
      byType: {
        screening: passes.filter(p => p.type === 'screening').length,
        candidate: passes.filter(p => p.type === 'candidate').length,
        interview: passes.filter(p => p.type === 'interview').length,
        onboarding: passes.filter(p => p.type === 'onboarding').length
      }
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
