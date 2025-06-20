'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + './../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/*fs.readdirSync(__dirname).filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename &&  file.slice(-3) === '.js' &&   
      file.indexOf('.test.js') === -1
    );
  }).forEach(file => {
    //console.log(path.join(__dirname, file))
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    //console.log("MODELO::::", model)
    db[model.name] = model;
  });*/

  // Función para filtrar archivos .js válidos
const isModelFile = (file) => {
  return (
    file.endsWith('.js') && !file.startsWith('.') &&  file !== basename &&  !file.includes('.test.js')
  );
};
// Función para filtrar directorios que no sean "QueryUtils"
const isModelDirectory = (dirent) => {
  return dirent.isDirectory() && dirent.name.toLowerCase() !== 'queries';
};

// Leer archivos en el directorio actual (raíz)
fs.readdirSync(__dirname)
  .filter(file => isModelFile(file))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Lee archivos en subdirectorios (1 nivel de profundidad)
fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => isModelDirectory(dirent))
  .forEach(dir => {
    fs.readdirSync(path.join(__dirname, dir.name))
      .filter(file => isModelFile(file))
      .forEach(file => {
        //pm2console.log("Loading model:", file);
        const model = require(path.join(__dirname, dir.name, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
