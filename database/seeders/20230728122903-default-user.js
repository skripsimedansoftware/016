const { SHA1 } = require('crypto-js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface} queryInterface
   */
  async up(queryInterface) {
    queryInterface.bulkInsert('pengguna', [
      {
        email: 'admin@umkm-monitoring.id',
        password: SHA1('admin').toString(),
        nama_lengkap: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface} queryInterface
   */
  async down(queryInterface) {
    await queryInterface.bulkDelete('pengguna', null, {});
  },
};
