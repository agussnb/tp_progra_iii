import Product from '../models/Product.js';

export const getLogs = async (req, res) => {
    try {
        const logsSimulados = [];
        res.render('admin/logs',{
            title: 'Registros del sistema',
            logs: logsSimulados
        });
    }catch(error){
        console.error('Error en getLogs:', error);
        res.status(500).json({ message: 'Error al cargar los registros del sistema.'});
    }
};

export const getProducts = async (req, res) => {
    try{
        const productosSimulados = [];
        res.render('admin/products',{
            title: 'Productos',
            productos: productosSimulados
        });
    }catch(error){
        console.error('Error en getProducts:', error);
        res.status(500).json({ message: 'Error al cargar los productos.' });
    }
};

export const exportExcel = async (req, res) => {
    try {
        res.send('Funcionalidad de descarga de Excel en desarrollo...');
    } catch (error) {
        console.error('Error en exportExcel:', error);
        res.status(500).send('Error al generar el archivo Excel');
    }
};


export const createProduct = async (req, res) => {
    try {
        const { nombre, precio, stock, categoria } = req.body;
        
        console.log('Creando producto:', req.body);
        
        const producto = await Product.create({ nombre, precio, stock, categoria });
        console.log('Producto creado con éxito:', producto.id);
        
        res.redirect('/admin/productos');
    } catch (error) {
        console.error('Error en createProduct:', error);
        res.status(500).send('Error al crear el producto');
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock, categoria } = req.body;

        console.log(`Editando producto con ID ${id}:`, req.body);

        await Product.update(
            { nombre, precio, stock, categoria }, 
            { where: { id } }
        );

        res.redirect('/admin/productos');
    } catch (error) {
        console.error('Error en updateProduct:', error);
        res.status(500).send('Error al actualizar el producto');
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Aplicando baja lógica al producto con ID ${id}`);

        await Product.update(
            { active: false }, 
            { where: { id } }
        );

        res.redirect('/admin/productos');
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        res.status(500).send('Error al eliminar el producto');
    }
};


      