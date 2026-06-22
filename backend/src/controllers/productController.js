import { Product } from '../models/index.js';
import Log from '../models/Logs.js'; 

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Product.findAndCountAll({
      where: { active: true },      
      limit,
      offset,
      order: [['id', 'ASC']],
    });
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
        products: rows,
        currentPage: page,
        totalPages,
        totalProducts: count,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { nombre, precio, categoria, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'La imagen del producto es obligatoria.' });
    }

    const rutaImagen = `/uploads/${req.file.filename}`;

    const newProduct = await Product.create({
      name: nombre,
      price: parseFloat(precio),
      category: categoria, // O 'category' si tu modelo usa inglés
      image: rutaImagen,
      stock: parseInt(stock) || 0,
      active: true 
    });

    await Log.create({
      action: 'CREAR',
      description: `Se creó el producto "${nombre}" (Stock: ${stock}, Precio: $${precio}), Categoría: ${categoria}`,
      user: req.user ? req.user.email : 'Admin' 
    });

    return res.status(201).json({ success: true, message: 'Producto creado con éxito', product: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ success: false, message: 'Error al crear el producto', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, categoria, active } = req.body; 

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    const nuevaImagen = req.file ? `/uploads/${req.file.filename}` : product.image;

    await product.update({
      name: name || product.name,
      price: price ? parseFloat(price) : product.price,
      stock: stock !== undefined ? parseInt(stock) : product.stock,
      category: categoria || product.category, // O 'category' según tu modelo
      image: nuevaImagen,
      active: active === 'true' || active === true
    });
    
    await Log.create({
        action: 'MODIFICAR',
        description: `Se modificó el producto ID ${id}: "${product.name}" ($${product.price}), stock: ${product.stock}`,
        user: req.user ? req.user.email : 'Admin'
    });

    return res.status(200).json({ success: true, message: 'Producto actualizado con éxito', product });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ success: false, message: 'Error al actualizar el producto', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    product.active = false;
    await product.save();

    await Log.create({
        action: 'BORRAR',
        description: `Baja lógica del producto: "${product.name}" (ID: ${id})`,
        user: req.user ? req.user.email : 'Admin'
    });

    return res.status(200).json({ success: true, message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ success: false, message: 'Error al eliminar el producto', error: error.message });
  }
};