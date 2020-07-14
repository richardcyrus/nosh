module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.createTable(
            'profiles',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                latitude: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                longitude: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                radius: {
                    type: Sequelize.INTEGER,
                    defaultValue: 3,
                },
                searchResults: {
                    type: Sequelize.INTEGER,
                    defaultValue: 3,
                },
                gender: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                photo: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {
                engine: 'INNODB',
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_520_ci',
            }
        );
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.dropTable('profiles');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },
};
