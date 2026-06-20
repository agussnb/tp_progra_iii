import { Product } from '../models/index.js';
import Log from '../models/Logs.js';

export const getLogsView = async (req, res) => {
    try {
        res.render('logs', { title: 'Registros del Sistema' });
    } catch (error) {
        console.error('Error al renderizar logs:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const getLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json(logs);
    } catch (error) {
        console.error('Error al obtener logs:', error);
        return res.status(500).json({ message: 'Error al obtener los registros.' });
    }
};

export const getProductsView = async (req, res) => {
    try {
        const productsList = await Product.findAll({ order: [['id', 'ASC']] });
        res.render('products', {
            title: 'Gestión de productos',
            products: productsList,
            adminName: req.session.adminName || 'Admin'
        });
    } catch (error) {
        console.error('Error en getProductsView:', error);
        res.status(500).redirect('/admin/');
    }
};

export const getUpdateView = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).render('404', { message: 'El producto que intentás editar no existe.' });
        }
        return res.render('updateProduct', { producto: product });
    } catch (error) {
        console.error('Error al cargar la vista de edición:', error);
        return res.status(500).send('Error interno del servidor.');
    }
};