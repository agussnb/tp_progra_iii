import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    
    const {count, rows} = await Product.findAndCountAll({
      where: { active: true },      
      limit,
      offset,
      order: [['id', 'ASC']],
    }
    );
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
    const { name, price, category } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg'; 

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      category,
      image,
      active: true 
    });

    return res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    product.name = name || product.name;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.image = image || product.image;

    await product.save();

    return res.status(200).json({ message: 'Producto actualizado con éxito', product });
    } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
    try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    product.active = false;
    await product.save();
    return res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};