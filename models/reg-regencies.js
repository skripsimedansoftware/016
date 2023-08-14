const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class RegRegencies extends Model {
    static associate(models) {
      this.hasMany(models.RegDistricts, { as: 'districts', foreignKey: 'regency_id', onDelete: 'CASCADE' });
      this.belongsTo(models.RegProvinces, { as: 'province', foreignKey: 'province_id', onDelete: 'CASCADE' });
    }
  }

  RegRegencies.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'reg-regencies',
    modelName: 'RegRegencies',
    timestamps: false,
  });

  return RegRegencies;
};
