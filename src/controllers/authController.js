const express = require('express');
const Usuario = require('./models/Usuario'); // Importa el modelo
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Registrar un usuario nuevo
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: 'El usuario ya está registrado' });
    }

    // Crear un nuevo usuario
    usuario = new Usuario({ nombre, email, password });

    // Guardar el usuario en la base de datos
    await usuario.save();

    // Crear token JWT
    const token = jwt.sign({ id: usuario._id }, 'secreto_jwt', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    // Comparar la contraseña ingresada con la guardada
    const esCoincidente = await usuario.compararPassword(password);
    if (!esCoincidente) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign({ id: usuario._id }, 'secreto_jwt', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
