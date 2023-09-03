const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  class DaftarUsaha extends Model {
    static associate(models) {
      this.belongsTo(models.Pengguna, { as: 'pengusaha', foreignKey: 'owner', targetKey: 'id' });
    }
  }

  DaftarUsaha.init({
    nama: DataTypes.STRING,
    produk: DataTypes.STRING,
    jenis_usaha: DataTypes.STRING,
    sektor_usaha: DataTypes.STRING,
    fotocopy_keterangan_usaha: DataTypes.STRING,
    fotocopy_izin_usaha: DataTypes.STRING,
    foto_produksi: DataTypes.STRING,
    detail_usaha: DataTypes.TEXT,
    provinsi: DataTypes.STRING,
    kabupaten_atau_kota: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    desa_atau_kelurahan: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    catatan: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('aktif', 'non-aktif', 'melengkapi', 'pengajuan', 'perbaikan'),
      defaultValue: 'melengkapi',
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    tableName: 'daftar-usaha',
    modelName: 'DaftarUsaha',
  });

  return DaftarUsaha;
};
