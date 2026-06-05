import sequelize from '../config/database.js';
import {DataTypes} from 'sequelize';
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Admin;