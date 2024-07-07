const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Organisation = sequelize.define('Organisation', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

module.exports = Organisation;
