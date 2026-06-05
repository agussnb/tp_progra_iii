import sequelize from '../config/database.js';
import {DataTypes} from 'sequelize';

const OrderDetail = sequelize.define('OrderDetail', {
    saleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

export default OrderDetail;