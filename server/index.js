import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import candidatesRouter from './routes/candidates.js';
import passesRouter from './routes/passes.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';
import { initDatabase } from './database.js';

// Load environment variables
dotenv.config();

// ES Module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize database
await initDatabase();

// API Routes
app.use('/api/candidates', candidatesRouter);
app.use('/api/passes', passesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      aiAssistant: process.env.ENABLE_AI_ASSISTANT === 'true',
      passManagement: process.env.ENABLE_PASS_MANAGEMENT === 'true',
      autoReminders: process.env.ENABLE_AUTO_REMINDERS === 'true'
    }
  });
});

// Catch-all route - serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Recruitment Screening System - Server Running       ║
║                                                           ║
║   📍 URL: http://localhost:${PORT}                        ║
║   🌐 Environment: ${process.env.NODE_ENV || 'development'}                       ║
║   ⚡ API: http://localhost:${PORT}/api                    ║
║   💚 Health: http://localhost:${PORT}/api/health          ║
║                                                           ║
║   Features Enabled:                                       ║
║   ${process.env.ENABLE_AI_ASSISTANT === 'true' ? '✅' : '❌'} AI Assistant                                    ║
║   ${process.env.ENABLE_PASS_MANAGEMENT === 'true' ? '✅' : '❌'} Pass Management                                ║
║   ${process.env.ENABLE_AUTO_REMINDERS === 'true' ? '✅' : '❌'} Auto Reminders                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
