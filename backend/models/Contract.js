import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Contract = sequelize.define('Contract', {
  title: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE },
  value: { type: DataTypes.FLOAT },
});

export default Contract;
