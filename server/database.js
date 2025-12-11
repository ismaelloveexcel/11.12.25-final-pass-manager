import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/database.json');

// Default database structure
const DEFAULT_DB = {
  candidates: [
    {
      id: '1',
      name: 'Nafees Ahamed K',
      position: 'Electronics Engineer',
      stage: 'initial_review',
      profileMatchScore: 94,
      source: 'LinkedIn',
      experience: '3+ years',
      education: "Bachelor's",
      location: 'Dubai',
      appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'overdue',
      email: 'nafees.ahamed@example.com',
      phone: '+971-50-XXX-XXXX',
      skills: ['PCB Design', 'Embedded Systems', 'Circuit Analysis'],
      notes: 'Strong PCB and embedded background; limited IoT exposure.',
      aiAnalysis: {
        technicalSkills: 96,
        experienceLevel: 92,
        educationFit: 100,
        locationFit: 90,
        salaryAlignment: 85,
        cultureFit: 94,
        recommendation: 'Strong Shortlist - Top 5% candidate'
      },
      lastAction: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'Electronics Engineer',
      stage: 'initial_review',
      profileMatchScore: 88,
      source: 'Indeed',
      experience: '5+ years',
      education: "Master's",
      location: 'Abu Dhabi',
      appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'due_soon',
      email: 'sarah.johnson@example.com',
      phone: '+971-55-XXX-XXXX',
      skills: ['IoT', 'PCB Design', 'Leadership'],
      notes: 'Strong IoT & PCB. Leadership experience. Risk: Notice period 3mo.',
      lastAction: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Ahmed Al-Rashid',
      position: 'Electronics Engineer',
      stage: 'hr_screening',
      profileMatchScore: 91,
      source: 'LinkedIn',
      experience: '4 years',
      education: "Bachelor's",
      location: 'Sharjah',
      appliedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'on_track',
      email: 'ahmed.alrashid@example.com',
      phone: '+971-56-XXX-XXXX',
      skills: ['PCB Design', 'Embedded Systems', 'Project Management'],
      notes: 'Perfect tech match. Local. No risks identified.',
      screeningProgress: {
        infoFormCompleted: true,
        softSkillsAssessment: 85,
        technicalAssessment: 92,
        overallCompletion: 100
      },
      lastAction: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  ],
  passes: [
    {
      id: 'PASS-2025-SCR-001234',
      candidateId: '1',
      candidateName: 'Nafees Ahamed K',
      type: 'screening',
      position: 'Electronics Engineer (REQ-2025-EE-001)',
      status: 'active',
      accessLevel: 'standard',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      includes: ['Candidate Information Form', 'Soft Skills Assessment', 'Technical Assessment', 'Document Upload Portal', 'Progress Tracker']
    }
  ],
  users: [
    {
      id: 'user-1',
      username: 'admin',
      email: 'admin@recruitment.com',
      role: 'admin',
      passwordHash: '$2a$10$YourHashedPasswordHere' // bcrypt hash
    }
  ],
  settings: {
    slaThresholds: {
      initial_review: 48,
      hr_screening: 72,
      interview_ready: 24
    },
    emailTemplates: {
      screening: 'Dear {name},\n\nThank you for your interest in the {position} position...',
      rejection: 'Dear {name},\n\nThank you for applying...',
      interview: 'Dear {name},\n\nWe are pleased to invite you...'
    },
    aiSettings: {
      enabled: true,
      autoScoring: true,
      confidenceThreshold: 0.75
    }
  }
};

// Database operations
class Database {
  constructor() {
    this.data = null;
  }

  async init() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(DB_PATH);
      await fs.mkdir(dataDir, { recursive: true });

      // Check if database exists
      try {
        const content = await fs.readFile(DB_PATH, 'utf-8');
        this.data = JSON.parse(content);
        console.log('✅ Database loaded from file');
      } catch (err) {
        // Create new database
        this.data = DEFAULT_DB;
        await this.save();
        console.log('✅ New database created');
      }
    } catch (err) {
      console.error('❌ Database initialization error:', err);
      this.data = DEFAULT_DB;
    }
  }

  async save() {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('❌ Database save error:', err);
    }
  }

  // Candidates
  getCandidates(filters = {}) {
    let candidates = [...this.data.candidates];
    
    if (filters.stage) {
      candidates = candidates.filter(c => c.stage === filters.stage);
    }
    if (filters.status) {
      candidates = candidates.filter(c => c.status === filters.status);
    }
    
    return candidates;
  }

  getCandidate(id) {
    return this.data.candidates.find(c => c.id === id);
  }

  async addCandidate(candidate) {
    this.data.candidates.push(candidate);
    await this.save();
    return candidate;
  }

  async updateCandidate(id, updates) {
    const index = this.data.candidates.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.candidates[index] = { ...this.data.candidates[index], ...updates };
      await this.save();
      return this.data.candidates[index];
    }
    return null;
  }

  async deleteCandidate(id) {
    const index = this.data.candidates.findIndex(c => c.id === id);
    if (index !== -1) {
      const deleted = this.data.candidates.splice(index, 1);
      await this.save();
      return deleted[0];
    }
    return null;
  }

  // Passes
  getPasses() {
    return this.data.passes;
  }

  getPass(id) {
    return this.data.passes.find(p => p.id === id);
  }

  async addPass(pass) {
    this.data.passes.push(pass);
    await this.save();
    return pass;
  }

  async updatePass(id, updates) {
    const index = this.data.passes.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.passes[index] = { ...this.data.passes[index], ...updates };
      await this.save();
      return this.data.passes[index];
    }
    return null;
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  async updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    await this.save();
    return this.data.settings;
  }
}

const db = new Database();

export const initDatabase = async () => {
  await db.init();
};

export default db;
