const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.use('/api', authRoutes);

app.get('/crear-usuario-test', async (req, res) => {
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const sql = 'INSERT INTO users (email, password, is_active) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE is_active = 1';
  db.query(sql, ['test@test.com', hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario test creado/activado' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});