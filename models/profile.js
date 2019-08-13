/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define(
        'Profile',
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
            tableName: 'profiles',
            underscored: false,
            freezeTableName: true,
        }
    );

    return Profile;
};
