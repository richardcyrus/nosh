// require('dotenv').config();
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR));
const hash = bcrypt.hashSync(process.env.SEED_USER_PASSWORD, salt);

module.exports = {
    up: async (queryInterface) => {
        // await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.bulkInsert(
            'profiles',
            [
                {
                    radius: 3,
                    searchResults: 3,
                    gender: 'Female',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );

        const profile = await queryInterface.sequelize.query(
            'SELECT id from profiles'
        );

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryInterface.bulkInsert(
            'users',
            [
                {
                    provider: 'local',
                    displayName: 'Jan Doe',
                    lastName: 'Doe',
                    firstName: 'Jan',
                    email: 'jan.doe@email.com',
                    password: hash,
                    profileId: profile[0][0].id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    },
};
