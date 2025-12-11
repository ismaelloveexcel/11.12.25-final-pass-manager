import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();

// GET all candidates
router.get('/', (req, res) => {
  try {
    const { stage, status } = req.query;
    const candidates = db.getCandidates({ stage, status });
    res.json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single candidate
router.get('/:id', (req, res) => {
  try {
    const candidate = db.getCandidate(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create candidate
router.post('/', async (req, res) => {
  try {
    const candidate = {
      id: uuidv4(),
      ...req.body,
      appliedDate: new Date().toISOString(),
      lastAction: new Date().toISOString(),
      stage: req.body.stage || 'initial_review',
      status: 'new'
    };
    
    const created = await db.addCandidate(candidate);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update candidate
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.updateCandidate(req.params.id, {
      ...req.body,
      lastAction: new Date().toISOString()
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE candidate
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.deleteCandidate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST shortlist candidate
router.post('/:id/shortlist', async (req, res) => {
  try {
    const candidate = db.getCandidate(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const updated = await db.updateCandidate(req.params.id, {
      stage: 'hr_screening',
      status: 'shortlisted',
      shortlistedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Candidate shortlisted successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST reject candidate
router.post('/:id/reject', async (req, res) => {
  try {
    const { reason, template } = req.body;
    const candidate = db.getCandidate(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const updated = await db.updateCandidate(req.params.id, {
      status: 'rejected',
      rejectionReason: reason,
      rejectionTemplate: template,
      rejectedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Candidate rejected',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST send screening package
router.post('/:id/send-package', async (req, res) => {
  try {
    const candidate = db.getCandidate(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const updated = await db.updateCandidate(req.params.id, {
      packageSent: true,
      packageSentAt: new Date().toISOString(),
      status: 'package_sent'
    });

    res.json({
      success: true,
      message: 'Screening package sent successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET statistics
router.get('/stats/summary', (req, res) => {
  try {
    const candidates = db.getCandidates();
    const stats = {
      total: candidates.length,
      byStage: {
        initial_review: candidates.filter(c => c.stage === 'initial_review').length,
        hr_screening: candidates.filter(c => c.stage === 'hr_screening').length,
        interview_ready: candidates.filter(c => c.stage === 'interview_ready').length
      },
      byStatus: {
        new: candidates.filter(c => c.status === 'new').length,
        overdue: candidates.filter(c => c.status === 'overdue').length,
        due_soon: candidates.filter(c => c.status === 'due_soon').length,
        on_track: candidates.filter(c => c.status === 'on_track').length
      }
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
