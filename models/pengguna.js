const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class Pengguna extends Model {
    static associate(models) {
      this.hasOne(models.DaftarUsaha, { as: 'usaha', foreignKey: 'owner', sourceKey: 'id' });
    }
  }

  Pengguna.init({
    nik: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto_profil: DataTypes.STRING,
    nomor_hp: DataTypes.STRING,
    fotocopy_kk: DataTypes.STRING,
    fotocopy_ktp: DataTypes.STRING,
    fotocopy_npwp: DataTypes.STRING,
    jabatan: {
      type: DataTypes.ENUM('admin', 'kepala-dinas', 'pengusaha'),
      allowNull: false,
      defaultValue: 'pengusaha',
    },
  }, {
    sequelize,
    tableName: 'pengguna',
    modelName: 'Pengguna',
  });

  return Pengguna;
};
