import Order from '../models/Order.js';
import Product from '../models/Product.js';
import OrderDetail from '../models/OrderDetail.js';
import database from '../config/database.js'; // Importamos la instancia para usar transacciones

export const createSale = async (req, res) => {
  const t = await database.sequelize.transaction();

  try {
    const { clientName, products } = req.body; 
    if (!clientName || !products || products.length === 0) {
      return res.status(400).json({ message: 'El nombre del cliente y los productos son obligatorios.' });
    }

    let calculatedTotalPrice = 0;
    const itemsToInsert = [];

    for (const item of products) {
      const productInDb = await Product.findByPk(item.id);

      if (!productInDb) {
        await t.rollback();
        return res.status(404).json({ message: `El producto con ID ${item.id} no existe.` });
      }

      if (!productInDb.active) {
        await t.rollback();
        return res.status(400).json({ message: `El producto ${productInDb.name} no está disponible para la venta.` });
      }

      const subtotal = productInDb.price * item.quantity;
      calculatedTotalPrice += subtotal;

      itemsToInsert.push({
        productId: productInDb.id,
        quantity: item.quantity,
        unitPrice: productInDb.price 
      });
    }

    const newOrder = await Order.create({
      clientName,
      totalPrice: calculatedTotalPrice,
    }, { transaction: t });

    const detailsWithOrderId = itemsToInsert.map(detail => ({
      ...detail,
      orderId: newOrder.id 
    }));

    await OrderDetail.bulkCreate(detailsWithOrderId, { transaction: t });

    await t.commit();

    return res.status(201).json({
      message: 'Compra procesada con éxito.',
      orderId: newOrder.id,
      clientName: newOrder.clientName,
      totalPrice: newOrder.totalPrice,
      date: newOrder.date
    });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'Error al procesar la venta.', error: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Order.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'category'], 
          through: {
            attributes: ['quantity', 'unitPrice'] 
          }
        }
      ],
      order: [['createdAt', 'DESC']] 
    });

    return res.status(200).json(sales);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el listado de ventas.', error: error.message });
  }
};
