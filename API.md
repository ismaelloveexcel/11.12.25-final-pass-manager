# 📡 API Documentation

## Base URL

**Development**: `http://localhost:3000/api`  
**Production**: `https://your-domain.com/api`

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Get Token

```bash
POST /api/auth/login
```

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@recruitment.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👥 Candidates API

### Get All Candidates

```bash
GET /api/candidates
```

**Query Parameters:**
- `stage` (optional): Filter by stage (initial_review, hr_screening, interview_ready)
- `status` (optional): Filter by status (new, overdue, due_soon, on_track)

**Example:**
```bash
curl https://your-app.com/api/candidates?stage=initial_review
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "name": "Nafees Ahamed K",
      "position": "Electronics Engineer",
      "stage": "initial_review",
      "profileMatchScore": 94,
      "email": "nafees@example.com",
      "skills": ["PCB Design", "Embedded Systems"],
      "appliedDate": "2024-12-08T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Candidate

```bash
GET /api/candidates/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Nafees Ahamed K",
    "position": "Electronics Engineer",
    "stage": "initial_review",
    "profileMatchScore": 94,
    "aiAnalysis": {
      "technicalSkills": 96,
      "experienceLevel": 92,
      "recommendation": "Strong Shortlist - Top 5% candidate"
    }
  }
}
```

---

### Create Candidate

```bash
POST /api/candidates
```

**Request:**
```json
{
  "name": "John Doe",
  "position": "Electronics Engineer",
  "email": "john@example.com",
  "phone": "+971-XX-XXX-XXXX",
  "experience": "3 years",
  "education": "Bachelor's",
  "location": "Dubai",
  "source": "LinkedIn",
  "skills": ["PCB Design", "Arduino"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "name": "John Doe",
    "stage": "initial_review",
    "status": "new",
    "appliedDate": "2024-12-11T20:00:00.000Z"
  }
}
```

---

### Update Candidate

```bash
PUT /api/candidates/:id
```

**Request:**
```json
{
  "stage": "hr_screening",
  "status": "shortlisted",
  "notes": "Great candidate, proceed to screening"
}
```

---

### Delete Candidate

```bash
DELETE /api/candidates/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Candidate deleted",
  "data": { ... }
}
```

---

### Shortlist Candidate

```bash
POST /api/candidates/:id/shortlist
```

**Response:**
```json
{
  "success": true,
  "message": "Candidate shortlisted successfully",
  "data": {
    "stage": "hr_screening",
    "status": "shortlisted",
    "shortlistedAt": "2024-12-11T20:00:00.000Z"
  }
}
```

---

### Reject Candidate

```bash
POST /api/candidates/:id/reject
```

**Request:**
```json
{
  "reason": "Insufficient experience",
  "template": "exp"
}
```

---

### Send Screening Package

```bash
POST /api/candidates/:id/send-package
```

**Response:**
```json
{
  "success": true,
  "message": "Screening package sent successfully"
}
```

---

### Get Statistics

```bash
GET /api/candidates/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 23,
    "byStage": {
      "initial_review": 15,
      "hr_screening": 5,
      "interview_ready": 3
    },
    "byStatus": {
      "new": 10,
      "overdue": 5,
      "due_soon": 3,
      "on_track": 5
    }
  }
}
```

---

## 🎫 Passes API

### Get All Passes

```bash
GET /api/passes
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "PASS-2025-SCR-ABC123",
      "candidateId": "1",
      "candidateName": "Nafees Ahamed K",
      "type": "screening",
      "status": "active",
      "expiresAt": "2025-01-10T20:00:00.000Z"
    }
  ]
}
```

---

### Get Single Pass

```bash
GET /api/passes/:ref
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "PASS-2025-SCR-ABC123",
    "candidateName": "Nafees Ahamed K",
    "type": "screening",
    "status": "active",
    "accessLevel": "standard",
    "includes": [
      "Candidate Information Form",
      "Soft Skills Assessment",
      "Technical Assessment"
    ]
  }
}
```

---

### Generate Pass

```bash
POST /api/passes
```

**Request:**
```json
{
  "candidateId": "1",
  "candidateName": "Nafees Ahamed K",
  "type": "screening",
  "position": "Electronics Engineer",
  "accessLevel": "standard",
  "expiryDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pass generated successfully",
  "data": {
    "id": "PASS-2025-SCR-XYZ789",
    "status": "active",
    "expiresAt": "2025-01-10T20:00:00.000Z"
  }
}
```

---

### Validate Pass

```bash
POST /api/passes/:ref/validate
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "reason": "Valid",
  "data": {
    "reference": "PASS-2025-SCR-ABC123",
    "candidateName": "Nafees Ahamed K",
    "expiresAt": "2025-01-10T20:00:00.000Z"
  }
}
```

---

## 🤖 AI Assistant API

### Score Candidate

```bash
POST /api/ai/score-candidate
```

**Request:**
```json
{
  "candidateId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Candidate scored successfully",
  "data": {
    "technicalSkills": 96,
    "experienceLevel": 92,
    "educationFit": 100,
    "overallScore": 94,
    "recommendation": "Strong Shortlist",
    "strengths": ["Strong technical background"],
    "concerns": ["Salary expectations slightly high"]
  }
}
```

---

### Score All Candidates

```bash
POST /api/ai/score-all
```

**Request:**
```json
{
  "stage": "initial_review"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scored 15 candidates",
  "data": [
    {
      "candidateId": "1",
      "name": "Nafees Ahamed K",
      "score": 94
    }
  ]
}
```

---

### Rank Candidates

```bash
POST /api/ai/rank-candidates
```

**Request:**
```json
{
  "stage": "initial_review",
  "criteria": "profileMatchScore"
}
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "rank": 1,
      "id": "1",
      "name": "Nafees Ahamed K",
      "score": 94
    },
    {
      "rank": 2,
      "id": "3",
      "name": "Ahmed Al-Rashid",
      "score": 91
    }
  ]
}
```

---

### Generate Job Description

```bash
POST /api/ai/generate-jd
```

**Request:**
```json
{
  "position": "Electronics Engineer",
  "department": "Engineering",
  "requirements": [
    "Bachelor's degree",
    "3-5 years experience",
    "PCB design skills"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Electronics Engineer",
    "overview": "We are seeking...",
    "responsibilities": [...],
    "requirements": [...],
    "benefits": [...]
  }
}
```

---

### Draft Email

```bash
POST /api/ai/draft-email
```

**Request:**
```json
{
  "candidateId": "1",
  "type": "screening"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "to": "nafees@example.com",
    "subject": "Next Steps - Electronics Engineer Position",
    "body": "Dear Nafees,\n\nThank you for your interest..."
  }
}
```

---

### Generate Interview Questions

```bash
POST /api/ai/interview-questions
```

**Request:**
```json
{
  "candidateId": "1",
  "position": "Electronics Engineer",
  "focus": "technical"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "technical": [
      "Describe your PCB design experience...",
      "How do you troubleshoot circuits?"
    ],
    "behavioral": [...],
    "situational": [...]
  }
}
```

---

### Research Candidate

```bash
POST /api/ai/research-candidate
```

**Request:**
```json
{
  "candidateId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "linkedIn": {
      "found": true,
      "connections": 500,
      "recommendations": 12
    },
    "workHistory": {
      "verified": true,
      "gaps": false
    },
    "insights": [
      "Strong professional network",
      "Active contributor to forums"
    ]
  }
}
```

---

## 🔑 Authentication API

### Login

```bash
POST /api/auth/login
```

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

---

### Register

```bash
POST /api/auth/register
```

**Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "hr_manager"
}
```

---

### Verify Token

```bash
GET /api/auth/verify
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "admin",
    "role": "admin"
  }
}
```

---

### Logout

```bash
POST /api/auth/logout
```

---

## 💚 Health Check

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-11T20:00:00.000Z",
  "version": "1.0.0",
  "features": {
    "aiAssistant": true,
    "passManagement": true,
    "autoReminders": true
  }
}
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "status": 400
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 📊 Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes

---

## 🔧 Testing Examples

### cURL

```bash
# Get all candidates
curl -X GET https://your-app.com/api/candidates

# Create candidate
curl -X POST https://your-app.com/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "position": "Electronics Engineer"
  }'

# Score candidate with AI
curl -X POST https://your-app.com/api/ai/score-candidate \
  -H "Content-Type: application/json" \
  -d '{"candidateId": "1"}'
```

### JavaScript (Fetch)

```javascript
// Get candidates
const response = await fetch('https://your-app.com/api/candidates');
const data = await response.json();

// Create candidate
const newCandidate = await fetch('https://your-app.com/api/candidates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Electronics Engineer'
  })
});
```

---

**Version**: 1.0.0  
**Last Updated**: December 11, 2024
