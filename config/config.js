/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

module.exports = {
    development: {
        use_env_variable: 'MYSQLDB_URL',
        dialect: 'mysql',
        debug: true,
        charset: 'utf8mb4',
        dialectOptions: {
            charset: 'utf8mb4_unicode_520_ci',
            supportBigNumbers: true,
        },
        define: {
            underscored: false,
            freezeTableName: true,
            charset: 'utf8mb4',
            dialectOptions: {
                charset: 'utf8mb4_unicode_520_ci',
            },
            timestamps: true,
        },
    },
    test: {
        username: process.env.CI_DB_USERNAME,
        password: process.env.CI_DB_PASSWORD,
        database: process.env.CI_DB_NAME,
        host: process.env.CI_DB_HOSTNAME,
        dialect: 'mysql',
    },
    production: {
        use_env_variable: 'JAWSDB_URL',
        dialect: 'mysql',
    },
};
