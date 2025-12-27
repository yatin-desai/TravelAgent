import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Opportunity = sequelize.define('Opportunity', {
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.FLOAT, allowNull: false },
  stage: { type: DataTypes.STRING, defaultValue: 'Prospecting' },
  closeDate: { type: DataTypes.DATE },
});

export default Opportunity;
