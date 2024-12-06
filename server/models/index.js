"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv')

dotenv.config();


const { Sequelize } = require("sequelize"); // Destructure Sequelize directly from import
const basename = path.basename(__filename);
const db = {};

// Initialize Sequelize instance
let sequelize;

try {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USERNAME,
    process.env.PASSWORD,
    {
      host: process.env.HOST,
      dialect: process.env.DIALECT,
      port: process.env.DB_PORT,
      dialectOptions: {
        // for deployement
        // ssl: {
        //   require: true, // Enforce SSL connection
        //   rejectUnauthorized: false, // Allow self-signed certificates
        // }
      }
    },
    
  );
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1); 
}

// Load all models dynamically
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Store the model in db object
  });

// Establish model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize instance and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
