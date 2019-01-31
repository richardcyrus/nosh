/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('../models');
const config = require('./app-config');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.User.findByPk(id, {
        attributes: ['id', 'providerId', 'provider', 'displayName'],
        include: [
            {
                model: db.Profile,
                where: { ProfileId: db.Sequelize.col('Profile.id') },
                attributes: [
                    'latitude',
                    'longitude',
                    'radius',
                    'searchResults',
                ],
            },
        ],
    })
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err);
        });
});

passport.use(
    'local',
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        (req, email, password, done) => {
            db.User.findOne({
                where: { email: email },
                include: [
                    {
                        model: db.Profile,
                        where: { ProfileId: db.Sequelize.col('Profile.id') },
                        attributes: [
                            'latitude',
                            'longitude',
                            'radius',
                            'searchResults',
                        ],
                    },
                ],
            })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            message: 'Incorrect username or password.',
                        });
                    }

                    return user
                        .validPassword(password)
                        .then((isMatch) => {
                            if (!isMatch) {
                                return done(null, false, {
                                    message: 'Incorrect username or password.',
                                });
                            } else {
                                req.session.lat = user.Profile.latitude;
                                req.session.lon = user.Profile.longitude;
                                return done(null, user);
                            }
                        })
                        .catch((err) => {
                            return done(err);
                        });
                })
                .catch((err) => {
                    return done(err);
                });
        }
    )
);

passport.use(
    'register',
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        (req, email, password, done) => {
            db.User.findOrCreate({
                where: {
                    email: req.body.email.toLowerCase(),
                },
                defaults: {
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    displayName: `${req.body.firstName} ${req.body.lastName}`,
                    email: req.body.email,
                    password: password,
                    provider: 'local',
                },
            })
                .spread((user, created) => {
                    if (user && !created) {
                        return done(null, false, {
                            message: 'That email address is already taken!',
                        });
                    }

                    if (user && created) {
                        return done(null, user);
                    }
                })
                .catch((err) => {
                    return done(err);
                });
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
        },
        (accessToken, refreshToken, profile, done) => {
            db.User.findOrCreate({
                where: {
                    providerId: profile.id,
                },
                defaults: {
                    displayName: profile.displayName,
                    lastName: profile.name.familyName,
                    firstName: profile.name.givenName,
                    // gender: profile.gender,
                    // email: profile.emails[0].value,
                    // photo: profile.photos[0].value,
                    provider: profile.provider,
                    token: accessToken,
                    password: 'external',
                },
            })
                .spread((user, created) => {
                    if (!created && !user) {
                        return done(null, false, {
                            message: 'Your profile has not been created!',
                        });
                    }

                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message:
                                'An error occurred while storing your profile!',
                        });
                    }
                })
                .catch((err) => {
                    return done(err);
                });
        }
    )
);

module.exports = passport;
