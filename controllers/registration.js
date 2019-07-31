/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:registrationController');
const { validationResult } = require('express-validator');
const passport = require('passport');

module.exports = {
    displayScreen: (req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect('/account');
        }

        res.render('account/signup', {
            title: 'Create Account',
            csrf: req.csrfToken(),
            page: 'signup-page',
            locationRoute: true,
        });
    },

    handleRegistration: (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/signup');
        }
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.flash('errors', info);
                return res.redirect('/signup');
            }

            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.redirect(req.session.returnTo || '/welcome');
            });
        })(req, res, next);
    },
};
