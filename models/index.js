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

/**
 * CONNECTION LOGIC
 * Render par DATABASE_URL priority hogi, local par config.json
 */
if (process.env.DATABASE_URL) {
  // Production (Render + Supabase) setup
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Supabase connection ke liye zaroori hai
      }
    },
    logging: false
  });
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Local Development setup
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

export default db;