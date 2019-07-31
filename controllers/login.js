/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:loginController');
const passport = require('passport');
const { validationResult } = require('express-validator');

module.exports = {
    getLogin: (req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect('/welcome');
        }

        res.render('account/login', {
            page: 'login-page',
            title: 'Login',
            csrf: req.csrfToken(),
        });
    },

    postLogin: (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            req.flash('errors', validationErrors.array());
            return res.redirect('/login');
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.flash('errors', info);
                return res.redirect('/login');
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
