const Sequelize = require("sequelize");

const db = new Sequelize("PruebaLogin", "postgres", "12768594", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = db;
