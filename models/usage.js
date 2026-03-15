const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Usage", {
    count: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
};