const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class RegDistricts extends Model {
    static associate(models) {
      this.hasMany(models.RegVillages, { as: 'villages', foreignKey: 'district_id', onDelete: 'CASCADE' });
      this.belongsTo(models.RegRegencies, { as: 'regency', foreignKey: 'regency_id', onDelete: 'CASCADE' });
    }
  }

  RegDistricts.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'reg-districts',
    modelName: 'RegDistricts',
    timestamps: false,
  });

  return RegDistricts;
};
