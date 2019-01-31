require('dotenv').config();
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR));
const hash = bcrypt.hashSync(process.env.SEED_USER_PASSWORD, salt);

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'Users',
            [
                {
                    provider: 'local',
                    displayName: 'Jan Doe',
                    firstName: 'Jan',
                    lastName: 'Doe',
                    email: 'jan.doe@example.com',
                    password: hash,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0')
            .then(() => {
                return queryInterface.sequelize.query(
                    'DELETE FROM "users" WHERE "email" = "jan.doe@example.com";'
                );
            })
            .then(() => {
                return queryInterface.sequelize.query(
                    'SET FOREIGN_KEY_CHECKS = 1'
                );
            });
    },
};
