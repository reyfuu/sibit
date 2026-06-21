import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3001; // Backend runs on 3001, Vite on 5173

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── Database ──────────────────────────────────────────────────────────────────
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log(`✅ Connected to PostgreSQL database: ${process.env.DB_NAME}`))
  .catch((err) => console.error('❌ Error connecting to PostgreSQL:', err.message));

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: process.env.DB_NAME });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    // Query user by email from the users table
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = result.rows[0];

    // Verify password using bcrypt (supports both $2y$ and $2b$ prefixes from PHP/Laravel)
    const passwordToCheck = user.password.replace(/^\$2y\$/, '$2b$');
    const isValid = await bcrypt.compare(password, passwordToCheck);

    if (!isValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    console.log(`✅ Login successful for user: ${user.name} (${user.email})`);

    // Return user info (TODO: add JWT token here later)
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, dan password wajib diisi' });
    }

    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, is_active) VALUES ($1, $2, $3, true) RETURNING id, name, email, is_active',
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];
    console.log(`✅ Registration successful for user: ${newUser.name} (${newUser.email})`);

    return res.status(201).json({
      message: 'Registrasi berhasil',
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// ─── Nota API ─────────────────────────────────────────────────────────────────
app.get('/api/nota', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nota ORDER BY tanggal DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching nota:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/nota', async (req, res) => {
  try {
    const { tanggal, no_nota, grade, week, ikat, gompi } = req.body;
    
    // Generate ID otomatis (Misal: N-YYYYMMDD-RandomHex)
    const d = new Date();
    const dateStr = d.toISOString().split('T')[0].replace(/-/g, '');
    const randId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedId = `N-${dateStr}-${randId}`;

    const query = `
      INSERT INTO nota (id, tanggal, "no-nota", grade, week, ikat, gompi)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [generatedId, tanggal, no_nota, grade, week, ikat, gompi];
    
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting nota:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/nota/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggal, no_nota, grade, week, ikat, gompi } = req.body;
    
    const query = `
      UPDATE nota 
      SET tanggal = $1, "no-nota" = $2, grade = $3, week = $4, ikat = $5, gompi = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [tanggal, no_nota, grade, week, ikat, gompi, id];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nota tidak ditemukan' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating nota:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`🚀 Express backend running on http://localhost:${port}`);
});
