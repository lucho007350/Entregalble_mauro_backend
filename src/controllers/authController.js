const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    userModel.createUser(email, hashedPassword, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'El email ya existe' });
        }
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: 'Usuario registrado correctamente',
        userId: result.insertId
      });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  userModel.findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email
      }
    });
  });
};

module.exports = {
  register,
  login
};