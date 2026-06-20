import sequelize from '../config/database.js';
import {DataTypes} from 'sequelize';

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  action: {
    type: DataTypes.STRING(20),
    allowNull: false, // acciones; crear, modificar, eliminar
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // descripcion de la accion
  },
  user: {
    type: DataTypes.STRING(100),
    allowNull: false, // email del admin que hizo dicha accion
  }
}, {
  tableName: 'logs',
  timestamps: true, // timestamps para saber cuando se creo el log
  updatedAt: false  // opcion para evitar la modificacion de un log ya que son a modo de 'historial'
});

export default Log;