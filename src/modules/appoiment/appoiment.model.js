import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database/database.js';

export const Appoiment = sequelize.define('appoiments', {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time',
  },
  durationMinute: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    field: 'duration_id',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'cancelled', 'complete'),
    allowNull: false,
    defaultValue: 'pending',
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'pet_id',
  },
  medicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'medic_id',
  },
},{ 
  indexes: [
    {
      unique: true,
      fields: ['pet_id', 'start_time']
    },
    {
      unique: true,
      fields: ['medic_id', 'start_time']
    }
  ]
});
