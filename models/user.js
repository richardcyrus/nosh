/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const bcrypt = require('bcrypt');
const BCRYPT_SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR);

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Profile, { onDelete: 'CASCADE' });
        }

        static loadScopes(models) {
            // Define the fields to include/exclude for `passport.deserializeUser`.
            User.addScope('forDeserialize', {
                attributes: {
                    exclude: [
                        'providerId',
                        'provider',
                        'token',
                        'password',
                        'passwordResetToken',
                        'passwordResetExpires',
                    ],
                },
                include: [
                    {
                        model: models.Profile,
                        as: 'Profile',
                        attributes: [
                            'latitude',
                            'longitude',
                            'radius',
                            'searchResults',
                            'gender',
                            'photo',
                        ],
                    },
                ],
            });

            // Define the fields and models to include when processing a user login.
            User.addScope('forLogin', {
                include: [
                    {
                        model: models.Profile,
                        as: 'Profile',
                        attributes: [
                            'latitude',
                            'longitude',
                            'radius',
                            'searchResults',
                        ],
                    },
                ],
            });

            // Include the Profile model. Used for register, delete,
            // and save profile.
            User.addScope('withProfile', {
                include: [
                    {
                        model: models.Profile,
                        as: 'Profile',
                    },
                ],
            });
        }
    }

    User.init(
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
            sequelize,
            modelName: 'User',
            tableName: 'users',
            underscored: false,
            indexes: [
                { unique: true, fields: ['email'] },
                { unique: true, fields: ['providerId'] },
                { fields: ['displayName'] },
            ],
        }
    );

    User.prototype.validPassword = function (password) {
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
                .hash(user.password, BCRYPT_SALT_WORK_FACTOR)
                .then((hash) => {
                    user.password = hash;
                })
                .catch((err) => {
                    throw new Error(err);
                });
        }
    });

    return User;
};
