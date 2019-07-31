require('dotenv').config();
const bcrypt = require('bcrypt');

const db = require('../models');

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR));
const hash = bcrypt.hashSync(process.env.SEED_USER_PASSWORD, salt);

const user = {
    provider: 'local',
    displayName: 'Jan Doe',
    lastName: 'Doe',
    firstName: 'Jan',
    email: 'jan.doe@example.com',
    password: hash,
    createdAt: new Date(),
    updatedAt: new Date(),
    Profile: {
        radius: 3,
        searchResults: 3,
        gender: 'Female',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
};

module.exports = {
    up: (queryInterface, Sequelize) => {
        return db.User.create(user, {
            include: [
                {
                    model: db.Profile,
                    as: 'Profile',
                },
            ],
        });
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
