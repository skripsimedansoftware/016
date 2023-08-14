/** @typedef {typeof import('sequelize').Model} Model */
/**
 * Sequelize model.
 *
 * @typedef {Object} DB
 * @property {import('sequelize').Sequelize} sequelize - Database.
 * @property {typeof import('sequelize').Sequelize} Sequelize - Sequelize.
 * @property {Model} Pengguna - Pengguna model.
 * @property {Model} JenisUsaha - Jenis Usaha model.
 * @property {Model} SektorUsaha - Sektor Usaha model.
 * @property {Model} DaftarUsaha - Daftar Usaha model.
 * @property {Model} OmzetUsaha - Omzet Usaha model.
 * @property {Model} RegProvinces - Provinces model.
 * @property {Model} RegRegencies - Regencies model.
 * @property {Model} RegDistricts - Districts model.
 * @property {Model} RegVillages - Villages model.
 */

const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../database/config.json`)[env];

/** @type {DB} */
const db = {};

/** @type {Sequelize} */
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0
      && file !== basename
      && file.slice(-3) === '.js'
      && file.indexOf('.test.js') === -1
  ))
  .forEach((file) => {
    /** @type {Model} */
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
