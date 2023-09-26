const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class OmzetUsaha extends Model {
    static associate(models) {
      this.belongsTo(models.DaftarUsaha, { as: 'dataUsaha', foreignKey: 'usaha_id' });
    }
  }

  OmzetUsaha.init({
    tahun: DataTypes.INTEGER,
    omzet: DataTypes.DOUBLE,
    asset: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'omzet-usaha',
    modelName: 'OmzetUsaha',
  });

  return OmzetUsaha;
};
