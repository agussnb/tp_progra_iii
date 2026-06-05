import Product from '../models/Product.js';

export const getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.count({ where: { active: true } });
        
        const adminName = req.session.user?.name || 'Administrador';

        res.render('dashboard', {
            title: 'Panel de Control - Admin',
            adminName,
            totalProducts
        });
    } catch (error) {
        console.error('Error al cargar el dashboard:', error);
        res.status(500).send('Error interno del servidor al cargar el panel de control.');
    }
};