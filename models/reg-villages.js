const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class RegVillages extends Model {
    static associate(models) {
      this.belongsTo(models.RegDistricts, { as: 'district', foreignKey: 'district_id', onDelete: 'CASCADE' });
    }
  }

  RegVillages.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    name: DataTypes.STRING,

  }, {
    sequelize,
    tableName: 'reg-villages',
    modelName: 'RegVillages',
    timestamps: false,
  });

  return RegVillages;
};
