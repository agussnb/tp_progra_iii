import sequelize from '../config/database.js';
import {DataTypes} from 'sequelize';
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

export default Order;