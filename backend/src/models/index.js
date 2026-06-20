import Product from './Product.js';
import Order from './Order.js';
import OrderDetail from './OrderDetail.js';
import Admin from './Admin.js'; 

Product.belongsToMany(Order, { through: OrderDetail, foreignKey: 'productId' });
Order.belongsToMany(Product, { through: OrderDetail, foreignKey: 'orderId' });

Admin.hasMany(Product, { 
    foreignKey: 'adminId', 
    as: 'productos' 
});

Product.belongsTo(Admin, { 
    foreignKey: 'adminId', 
    as: 'administrador' 
});

Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'details' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderDetail, { foreignKey: 'productId' });
OrderDetail.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export { Product, Order, OrderDetail, Admin };