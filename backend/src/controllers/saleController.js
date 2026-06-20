import Order from '../models/Order.js';
import { Product } from '../models/index.js';
import OrderDetail from '../models/OrderDetail.js';
import Log from '../models/Logs.js';
import database from '../config/database.js'; 

export const createSale = async (req, res) => {

  const t = await database.transaction();

  try {
    const { clientName, products } = req.body; 
    if (!clientName || !products || products.length === 0) {
      return res.status(400).json({ message: 'El nombre del cliente y los productos son obligatorios.' });
    }

    let calculatedTotalPrice = 0;
    const itemsToInsert = [];

    for (const item of products) {
      const productInDb = await Product.findByPk(item.id, { transaction: t });

      if (!productInDb) {
        await t.rollback();
        return res.status(404).json({ message: `El producto con ID ${item.id} no existe.` });
      }

      if (!productInDb.active) {
        await t.rollback();
        return res.status(400).json({ message: `El producto ${productInDb.name} no está disponible para la venta.` });
      }

      if (productInDb.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ 
          message: `Stock insuficiente para "${productInDb.name}". Disponible: ${productInDb.stock}, Solicitado: ${item.quantity}` 
        });
      }

      productInDb.stock -= item.quantity;
      await productInDb.save({ transaction: t });

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

    await Log.create({
      action: 'VENTA',
      description: `Nueva venta registrada ID: ${newOrder.id} - Cliente: ${clientName} - Total: $${calculatedTotalPrice}`,
      user: req.user ? req.user.email : 'Admin' 
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Compra procesada con éxito.',
      orderId: newOrder.id,
      clientName: newOrder.clientName,
      totalPrice: newOrder.totalPrice,
      date: newOrder.date
    });

  } catch (error) {
    await t.rollback();
    console.error('Error en createSale:', error);
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
    console.error('Error en getSales:', error);
    return res.status(500).json({ message: 'Error al obtener el listado de ventas.', error: error.message });
  }
};