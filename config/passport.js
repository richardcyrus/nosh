/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

passport.use(
    'local',
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        (req, email, password, done) => {
            db.User.scope('forLogin')
                .findOne({ where: { email: email } })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            msg: 'Incorrect username or password.',
                        });
                    }

                    return user.validPassword(password).then((isMatch) => {
                        if (!isMatch) {
                            return done(null, false, {
                                msg: 'Incorrect username or password.',
                            });
                        } else {
                            return done(null, user);
                        }
                    });
                })
                .catch((err) => {
                    return done(err, false);
                });
        }
    )
);

// Note: This doesn't work with scopes. Must add the include.
passport.use(
    'register',
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        (req, email, password, done) => {
            db.User.findOrCreate({
                where: { email: req.body.email.toLowerCase() },
                defaults: {
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    displayName: `${req.body.firstName} ${req.body.lastName}`,
                    email: req.body.email,
                    password: password,
                    provider: 'local',
                    Profile: {
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        radius: 3,
                        searchResults: 3,
                    },
                },
                include: [
                    {
                        model: db.Profile,
                        as: 'Profile',
                    },
                ],
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
                    return done(err, false);
                });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.User.scope('forDeserialize')
        .findByPk(id)
        .then((user) => {
            if (user) {
                done(null, user.get({ plain: true }));
            } else {
                done(null, false);
            }
        })
        .catch((err) => {
            done(err, false);
        });
});

module.exports = passport;
