import Admin from '../models/Admin.js';
import { createHash, isValidPassword } from '../utils.js'; 

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de campos vacíos
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

    return res.status(200).redirect('/');
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar el administrador.', error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.redirect('/?error=' + encodeURIComponent('El email y la contraseña son obligatorios.'));
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.redirect('/?error=' + encodeURIComponent('Credenciales inválidas.'));
    }

    const isPasswordCorrect = isValidPassword(admin, password);
    if (!isPasswordCorrect) {
      return res.redirect('/?error=' + encodeURIComponent('Credenciales inválidas.'));
    }

    req.session.user = {
      id: admin.id,
      name: admin.name,
      email: admin.email
    };

    return req.session.save(() => {
      res.redirect('/admin/dashboard');
    });

  } catch (error) {
    console.error('Error en loginAdmin:', error);
    return res.redirect('/?error=' + encodeURIComponent('Error interno del servidor al iniciar sesión.'));
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