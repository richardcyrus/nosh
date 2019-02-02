module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0')
            .then(() => {
                return queryInterface.createTable('Profiles', {
                    id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    latitude: {
                        type: Sequelize.STRING,
                    },
                    longitude: {
                        type: Sequelize.STRING,
                    },
                    radius: {
                        type: Sequelize.INTEGER,
                    },
                    searchResults: {
                        type: Sequelize.INTEGER,
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
                });
            })
            .then(() => {
                return queryInterface.sequelize.query(
                    'SET FOREIGN_KEY_CHECKS = 1'
                );
            });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0')
            .then(() => {
                return queryInterface.dropTable('Profiles');
            })
            .then(() => {
                return queryInterface.sequelize.query(
                    'SET FOREIGN_KEY_CHECKS = 1'
                );
            });
    },
};
