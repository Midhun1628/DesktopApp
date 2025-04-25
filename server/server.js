import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const app = express();
const port = 8000;
const JWT_SECRET = 'your_jwt_secret'; // 🔐 Change this to a secure secret in .env

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create DB connection inside async IIFE
let db;
const  startServer =   async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'qweasdzxc1',
      database: 'credentials'
    });
    console.log('✅ Connected to MySQL databasess');

    // Start server after DB connection
    app.listen(port, () => {
      console.log(`🚀 Backend server runninggg at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
  }
};

// Register user
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [rows] = await db.execute(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, password]
    );

    res.status(200).json({ message: 'User registered successfully', userId: rows.insertId });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Login + JWT generation
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.user_id, username: user.username, email: user.email }
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Expecting format: Bearer <token>

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
}

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}! You accessed a protected route.` });
});

// Health check
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Backend is online' });
});

export  {app,startServer}
