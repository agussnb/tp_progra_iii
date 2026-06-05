import sequelize from '../config/database.js';
import {DataTypes} from 'sequelize';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  category:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  active:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
});

export default Product;