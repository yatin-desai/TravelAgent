import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Lead = sequelize.define('Lead', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'New' },
  source: { type: DataTypes.STRING },
});

export default Lead;
