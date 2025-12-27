import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Account = sequelize.define('Account', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
});

export default Account;
