module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0')
            .then(() => {
                return queryInterface.createTable(
                    'users',
                    {
                        id: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                        },
                        providerId: {
                            type: Sequelize.STRING,
                            allowNull: true,
                        },
                        provider: {
                            type: Sequelize.STRING,
                            allowNull: false,
                            validate: {
                                isIn: [['local', 'google']],
                            },
                        },
                        displayName: {
                            type: Sequelize.STRING,
                            allowNull: false,
                            validate: {
                                notEmpty: true,
                            },
                        },
                        lastName: {
                            type: Sequelize.STRING,
                            allowNull: false,
                            validate: {
                                notEmpty: true,
                            },
                        },
                        firstName: {
                            type: Sequelize.STRING,
                            allowNull: false,
                            validate: {
                                notEmpty: true,
                            },
                        },
                        email: {
                            type: Sequelize.STRING,
                            unique: true,
                            allowNull: false,
                            validate: {
                                isEmail: true,
                                notEmpty: true,
                            },
                        },
                        token: {
                            type: Sequelize.STRING,
                            allowNull: true,
                        },
                        password: {
                            type: Sequelize.STRING,
                            allowNull: false,
                            validate: {
                                notEmpty: true,
                                len: [8],
                            },
                        },
                        passwordResetToken: {
                            type: Sequelize.STRING,
                            allowNull: true,
                        },
                        passwordResetExpires: {
                            type: Sequelize.STRING,
                            allowNull: true,
                        },
                        profileId: {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                            references: {
                                model: 'Profiles',
                                key: 'id',
                            },
                            onDelete: 'CASCADE',
                            onUpdate: 'CASCADE',
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
            })
            .then(() => {
                return queryInterface.addIndex('Users', ['email'], {
                    indicesType: 'UNIQUE',
                });
            })
            .then(() => {
                return queryInterface.addIndex('Users', ['providerId'], {
                    indicesType: 'UNIQUE',
                });
            })
            .then(() => {
                return queryInterface.addIndex('Users', ['displayName']);
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
                return queryInterface.dropTable('Users');
            })
            .then(() => {
                return queryInterface.sequelize.query(
                    'SET FOREIGN_KEY_CHECKS = 1'
                );
            });
    },
};
