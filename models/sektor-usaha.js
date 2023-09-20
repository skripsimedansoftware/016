const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class SektorUsaha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // this.hasMany(models.DaftarUsaha, { as: 'daftarUsaha', foreignKey: 'sektor_usaha' });
    // }
  }

  SektorUsaha.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'sektor-usaha',
    modelName: 'SektorUsaha',
  });

  return SektorUsaha;
};
