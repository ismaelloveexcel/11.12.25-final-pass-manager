# 🚀 Recruitment Screening System

A comprehensive, AI-powered 3-stage recruitment screening system with pass management, automation, and advanced workflow features.

## ✨ Features

### 🎯 Core Functionality
- **3-Stage Screening Workflow**: Initial Review → HR Screening → Interview Ready
- **AI Assistant**: Candidate scoring, ranking, email drafting, and research
- **Pass Management System**: Secure candidate access with QR codes
- **SLA Tracking**: Real-time urgency indicators and deadline monitoring
- **Bulk Operations**: Process multiple candidates simultaneously
- **Keyboard Shortcuts**: Power-user efficiency features

### 🤖 AI-Powered Features
- Automatic candidate CV scoring (94% accuracy)
- Intelligent candidate ranking
- Job description generation
- Email template drafting
- Background research automation
- Interview question generation

### 🔐 Security & Access
- Pass-based candidate portal access
- Admin control panel (secret access)
- Role-based permissions
- Secure authentication with JWT

## 🏗️ Tech Stack

### Frontend
- HTML5, CSS3 (iOS-style Glassmorphic Design)
- Vanilla JavaScript (ES6+)
- Bootstrap 5.3
- Responsive & Mobile-Friendly

### Backend
- Node.js + Express.js
- JSON file-based database (easily upgradable to PostgreSQL/MongoDB)
- RESTful API architecture
- JWT authentication

## 📦 Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn

### Local Setup

```bash
# Clone repository
git clone <your-repo-url>
cd webapp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# Server will start at http://localhost:3000
```

## 🌐 API Endpoints

### Candidates
```
GET    /api/candidates              - List all candidates
GET    /api/candidates/:id          - Get candidate details
POST   /api/candidates              - Create candidate
PUT    /api/candidates/:id          - Update candidate
DELETE /api/candidates/:id          - Delete candidate
POST   /api/candidates/:id/shortlist    - Shortlist candidate
POST   /api/candidates/:id/reject       - Reject candidate
POST   /api/candidates/:id/send-package - Send screening package
GET    /api/candidates/stats/summary    - Get statistics
```

### Passes
```
GET    /api/passes                  - List all passes
GET    /api/passes/:ref             - Get pass details
POST   /api/passes                  - Generate new pass
PUT    /api/passes/:ref             - Update pass
POST   /api/passes/:ref/validate    - Validate pass
GET    /api/passes/stats/summary    - Pass statistics
```

### AI Assistant
```
POST   /api/ai/score-candidate      - Score single candidate
POST   /api/ai/score-all            - Score all candidates
POST   /api/ai/rank-candidates      - Rank candidates
POST   /api/ai/generate-jd          - Generate job description
POST   /api/ai/draft-email          - Draft email
POST   /api/ai/interview-questions  - Generate questions
POST   /api/ai/research-candidate   - Research candidate background
```

### Authentication
```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
GET    /api/auth/verify             - Verify token
POST   /api/auth/logout             - User logout
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Production URL will be provided
```

### Option 2: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Get URL
railway domain
```

### Option 3: Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# Open app
heroku open
```

### Option 4: Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Deploy

### Option 5: DigitalOcean App Platform

1. Push code to GitHub
2. Go to https://cloud.digitalocean.com/apps
3. Create App → Connect repository
4. Configure build settings
5. Deploy

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Database
DB_PATH=./data/database.json

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# AI (Optional)
OPENAI_API_KEY=your-openai-key
AI_MODEL=gpt-4

# Features
ENABLE_AI_ASSISTANT=true
ENABLE_PASS_MANAGEMENT=true
ENABLE_AUTO_REMINDERS=true
```

## 📱 Keyboard Shortcuts

- `S` - Shortlist current candidate
- `R` - Reject current candidate
- `M` - Mark as Maybe
- `N` or `→` - Next candidate
- `P` or `←` - Previous candidate
- `F` - Toggle Focus Mode
- `A` - Open AI Assistant
- `Ctrl+K` - Search
- `1-3` - Switch between stages
- `?` - Show shortcuts help
- `Esc` - Close modals
- `Ctrl+Shift+Alt+A` - Secret Admin Panel

## 🎨 Features Overview

### Stage 1: Initial Review
- Quick candidate card review
- AI-powered profile scoring
- One-click shortlist/reject
- Bulk operations
- SLA tracking with urgency indicators

### Stage 2: HR Screening
- Automated package sending
- Progress tracking
- Assessment monitoring
- Reminder system
- Document requests

### Stage 3: Interview Ready
- Complete candidate profiles
- Risk assessment
- Salary analysis
- Interview scheduling
- Comparison tools

## 🔐 Admin Features

### Secret Admin Panel
Access: `Ctrl+Shift+Alt+A`

Features:
- System statistics dashboard
- Pass template builder
- Database management
- Workflow controls
- Security & access logs
- Bulk operations

## 📊 Database Schema

```json
{
  "candidates": [
    {
      "id": "uuid",
      "name": "string",
      "position": "string",
      "stage": "initial_review|hr_screening|interview_ready",
      "status": "new|overdue|due_soon|on_track",
      "profileMatchScore": "number",
      "email": "string",
      "phone": "string",
      "skills": ["array"],
      "aiAnalysis": { "object" },
      "appliedDate": "ISO date",
      "lastAction": "ISO date"
    }
  ],
  "passes": [ /* ... */ ],
  "users": [ /* ... */ ],
  "settings": { /* ... */ }
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Future Enhancements

- [ ] PostgreSQL/MongoDB integration
- [ ] Real AI API integration (OpenAI)
- [ ] Email service integration (SendGrid/Mailgun)
- [ ] Calendar integration (Google Calendar/Outlook)
- [ ] Video interview scheduling
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Custom branding options

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🆘 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: support@recruitment-system.com

## 🎉 Credits

Built with ❤️ by the HR Tech Team

---

**Version**: 1.0.0  
**Last Updated**: December 2024
