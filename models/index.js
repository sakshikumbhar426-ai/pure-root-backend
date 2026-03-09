'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Import config
import configData from '../config/config.json' with { type: 'json' };
const config = configData[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 1. Get all model files
const files = fs.readdirSync(__dirname)
  .filter(file => 
    (file.indexOf('.') !== 0) && 
    (file !== basename) && 
    (file.slice(-3) === '.js')
  );

// 2. Import and Initialize models
for (const file of files) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href; 

  const modelModule = await import(fileUrl);
  // modelModule.default refers to 'export default' in your model files
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

// 3. Run Associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// FIX: Do not use named exports via destructuring here.
// In your Controllers, import the whole 'db' object and then destructure.
export default db;