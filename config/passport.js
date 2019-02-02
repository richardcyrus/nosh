/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../models');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.User.findByPk(id, {
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
                model: db.Profile,
                as: 'Profile',
                where: { ProfileId: db.Sequelize.col('Profile.id') },
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
    })
        .then((user) => {
            if (user) {
                done(null, user.get({ plain: true }));
            } else {
                done(null, false);
            }
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
                            msg: 'Incorrect username or password.',
                        });
                    }

                    return user
                        .validPassword(password)
                        .then((isMatch) => {
                            if (!isMatch) {
                                return done(null, false, {
                                    msg: 'Incorrect username or password.',
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
                            msg: 'That email address is already taken!',
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

module.exports = passport;
