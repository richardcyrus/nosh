/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:accountController');

const { validationResult } = require('express-validator');
const db = require('../models');

module.exports = {
    displayAccount: (req, res) => {
        res.render('account/profile', {
            title: 'Account Management',
            csrf: req.csrfToken(),
            page: 'profile-page',
            user: req.user,
            locationRoute: true,
        });
    },

    saveProfile: (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/account');
        }

        const profileUpdate = {
            photo: req.body.photo,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            radius: req.body.radius,
            searchResults: req.body.searchResults,
        };

        const userUpdate = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            displayName: req.body.displayName,
        };

        /**
         * Hints on how to make this work properly came from:
         * https://github.com/RobinBuschmann/sequelize-typescript/issues/309#issuecomment-367443345
         * https://stackoverflow.com/questions/33918383/sequelize-update-with-association
         */
        db.User.scope('withProfile')
            .findByPk(req.user.id)
            .then((user) => {
                Promise.all([
                    user.update(userUpdate),
                    user.Profile.update(profileUpdate),
                ])
                    .then((value) => value[0])
                    .then(() => {
                        req.flash('success', {
                            msg: 'Profile information has been updated.',
                        });
                        res.redirect('/account');
                    })
                    .catch((err) => next(err));
            })
            .catch((err) => next(err));
    },

    changePassword: (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/account');
        }

        db.User.findByPk(req.user.id)
            .then((user) => {
                user.update({ password: req.body.password }).then(() => {
                    req.flash('success', { msg: 'Password has been changed.' });
                    res.redirect('/logout');
                });
            })
            .catch((err) => next(err));
    },

    deleteAccount: (req, res, next) => {
        db.User.scope('withProfile')
            .findByPk(req.user.id)
            .then((user) => {
                return user.destroy();
            })
            .then(() => {
                req.flash('info', { msg: 'Your account has been deleted.' });
                res.redirect('/logout');
            });
    },
};
