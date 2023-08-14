/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pengguna', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      username: Sequelize.DataTypes.STRING,
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      nama_lengkap: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      foto_profil: Sequelize.DataTypes.STRING,
      jabatan: {
        type: Sequelize.DataTypes.ENUM('admin', 'kepala-dinas', 'pengusaha'),
        allowNull: false,
        defaultValue: 'pengusaha',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      deleted_at: Sequelize.DataTypes.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('pengguna');
  },
};
