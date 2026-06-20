import Admin from '../models/Admin.js';
import { createHash, isValidPassword } from '../utils.js';
import jwt from 'jsonwebtoken'; 
import Log from '../models/Logs.js';

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios.' });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'El email ya se encuentra registrado.' });
    }

    const newAdmin = await Admin.create({
      email,
      password: createHash(password) 
    });

    await Log.create({
      action: 'REGISTRO',
      description: `Se registro un nuevo administrador en el sistema: ${email}`,
      user: email
    });

    return res.status(200).json({ message: 'Administrador registrado con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar el administrador.', error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios.' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !isValidPassword(admin, password)) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    await Log.create({
      action: 'LOGIN',
      description: `El administrador inició sesión correctamente.`,
      user: email 
    });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Error en loginAdmin:', error);
    return res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
  }
};

export const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).redirect('/');
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ message: 'Error al cerrar sesión.' });
    }
};

export const renderLogin = (req, res) => {
    const errorParam = req.query.error || null;
    res.render('login', { title: 'Iniciar Sesión', error: errorParam });
};

export const renderRegister = (req, res) => {
    res.render('register', { title: 'Registrarse' });
};