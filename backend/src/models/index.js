import Product from './product.model.js';
import Order from './Order.js';
import OrderDetail from './OrderDetail.js';


// Define associations
Product.belongsToMany(Order, { through: OrderDetail, foreignKey: 'productId' });
Order.belongsToMany(Product, { through: OrderDetail, foreignKey: 'orderId' });

export { Product, Order, OrderDetail, };