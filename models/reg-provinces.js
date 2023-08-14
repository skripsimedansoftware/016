const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class RegProvinces extends Model {
    static associate(models) {
      this.hasMany(models.RegRegencies, { as: 'regencies', foreignKey: 'province_id', onDelete: 'CASCADE' });
    }
  }

  RegProvinces.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'reg-provinces',
    modelName: 'RegProvinces',
    timestamps: false,
  });

  return RegProvinces;
};
