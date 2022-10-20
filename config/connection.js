// Import the Sequelize
const Sequelize = require('sequelize');

require('dotenv').config();

// Create connection to database, pass in the MySQL info for username and password
let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3301
  });
}

module.exports = sequelize;