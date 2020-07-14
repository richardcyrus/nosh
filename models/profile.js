/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {}

    Profile.init(
        {
            latitude: { type: DataTypes.STRING, allowNull: true },
            longitude: { type: DataTypes.STRING, allowNull: true },
            radius: {
                type: DataTypes.INTEGER,
                defaultValue: 3,
            },
            searchResults: {
                type: DataTypes.INTEGER,
                defaultValue: 3,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            photo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Profile',
            tableName: 'profiles',
            underscored: false,
        }
    );

    return Profile;
};
