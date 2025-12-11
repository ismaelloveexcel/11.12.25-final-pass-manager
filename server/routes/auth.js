import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Mock user database (replace with actual database in production)
const users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@recruitment.com',
    password: '$2a$10$YourHashedPasswordHere', // 'admin123' hashed
    role: 'admin'
  },
  {
    id: '2',
    username: 'hr_manager',
    email: 'hr@recruitment.com',
    password: '$2a$10$YourHashedPasswordHere', // 'hr123' hashed
    role: 'hr_manager'
  }
];

// POST login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // For demo purposes, accept any username/password
    // In production, validate against real database
    const user = users.find(u => u.username === username) || {
      id: '1',
      username: username || 'demo_user',
      email: 'demo@recruitment.com',
      role: 'admin'
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existing = users.find(u => u.username === username || u.email === email);
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      username,
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET verify token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    res.json({
      success: true,
      data: decoded
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
});

// POST logout
router.post('/logout', (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export default router;
