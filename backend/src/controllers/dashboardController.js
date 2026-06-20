import {Product} from '../models/index.js';

export const getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.count();
        const activeProducts = await Product.count({
            where: { active: true }
        });
        const inactiveProducts = await Product.count({
            where: { active: false }
        });

        return res.render('dashboard', {
            title: 'UTN AdminPanel',
            totalProducts,
            activeProducts,
            inactiveProducts
        });

    } catch (error) {
        console.error('Error al cargar las estadísticas del dashboard:', error);
        return res.status(500).send('Error interno al cargar el panel de control.');
    }
};