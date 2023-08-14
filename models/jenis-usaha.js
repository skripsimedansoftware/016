const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class JenisUsaha extends Model {
    // static associate(models) {
    //   // this.hasMany(models.DaftarUsaha, { as: 'daftarUsaha', foreignKey: 'jenis_usaha' });
    // }
  }

  JenisUsaha.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'jenis-usaha',
    modelName: 'JenisUsaha',
  });

  return JenisUsaha;
};
