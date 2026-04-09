const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.use('/api', authRoutes);

module.exports = app;