const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URL);

const User = require("./user")(sequelize);
const History = require("./history")(sequelize);
const Usage = require("./usage")(sequelize);

User.hasMany(History, { foreignKey: "user_id" });
User.hasOne(Usage, { foreignKey: "user_id" });

module.exports = { sequelize, User, History, Usage };
