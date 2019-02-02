/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define(
        'Profile',
        {
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING,
            radius: DataTypes.INTEGER,
            searchResults: DataTypes.INTEGER,
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            photo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {}
    );
    Profile.associate = function(models) {
        // associations can be defined here
    };
    return Profile;
};
