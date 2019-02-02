/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const bcrypt = require('bcrypt');
const appConfig = require('../config/app-config');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            providerId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            provider: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['local', 'google']],
                },
            },
            displayName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true,
                    notEmpty: true,
                },
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [8],
                },
            },
            passwordResetToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            passwordResetExpires: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            indexes: [
                { unique: true, fields: ['email'] },
                { unique: true, fields: ['providerId'] },
                { fields: ['displayName'] },
            ],
        }
    );

    User.prototype.validPassword = function(password) {
        // This returns a promise. The bcrypt recommendation for server
        // side logic is to not use the Sync versions of the methods
        // so that we don't block when calculating the hash.
        return bcrypt.compare(password, this.password);
    };

    User.beforeSave((user, options) => {
        // Don't hash the fake password if the user record is from
        // an external source. Validation happens before this is called
        // so I can't just leave the password field blank in the call from
        // findOrCreate.
        if (user.changed('password') && user.password !== 'external') {
            return bcrypt
                .hash(user.password, appConfig.crypt.workFactor)
                .then((hash) => {
                    user.password = hash;
                })
                .catch((err) => {
                    throw new Error(err);
                });
        }
    });

    User.associate = function(models) {
        User.belongsTo(models.Profile);
    };

    return User;
};
