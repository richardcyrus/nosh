/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const passport = require('passport');
const { ensureLoggedIn } = require('connect-ensure-login');
const db = require('../models');

const config = require('../config/app-config');
const Zomato = require('../lib/zomato');
const zomato = new Zomato(config.zomato.userKey);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'nosh' });
});

/* GET /login */
router.get('/login', (req, res, next) => {
    if (req.user) {
        return res.redirect('/welcome');
    }

    res.render('account/login', {
        page: 'login-page',
        title: 'Login',
        csrf: req.csrfToken(),
    });
});

/* POST /login */
router.post(
    '/login',
    [
        check('email', 'The provided email address is not a valid format.')
            .isEmail({ domain_specific_validation: true })
            .normalizeEmail({ gmail_remove_dots: false }),
        check('password', 'The password field cannot be empty.')
            .not()
            .isEmpty(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/login');
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                req.flash('errors', info);
                return res.redirect('/login');
            }

            req.logIn(user, (err) => {
                if (err) return next(err);

                req.flash('success', {
                    msg: 'Success! You are logged in.',
                });
                res.redirect(req.session.returnTo || '/welcome');
            });
        })(req, res, next);
    }
);

/* GET /logout */
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
        if (err)
            console.error('Failed to destroy the session during logout.', err);

        req.user = null;
        res.redirect('/');
    });
});

/**
 * GET /signup
 */
router.get('/signup', (req, res, next) => {
    if (req.user) {
        return res.redirect('/account/profile');
    }

    res.render('account/signup', {
        title: 'Create Account',
        csrf: req.csrfToken(),
        page: 'signup-page',
    });
});

/**
 * POST /signup
 * Create a new local account.
 */
router.post(
    '/signup',
    [
        check('email', 'Email is not valid')
            .isEmail({ domain_specific_validation: true })
            .normalizeEmail({ gmail_remove_dots: false }),
        check(
            'password',
            'Password must be at least 8 characters long'
        ).isLength({ min: 8 }),
        check('confirmPassword', 'Passwords do not match').custom(
            (value, { req }) => value === req.body.password
        ),
        check('firstName', 'The first name field cannot be empty')
            .not()
            .isEmpty(),
        check('lastName', 'The last name field cannot be empty')
            .not()
            .isEmpty(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/signup');
        }

        let newUser;
        db.User.findOrCreate({
            where: {
                email: req.body.email,
            },
            defaults: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                displayName: `${req.body.firstName} ${req.body.lastName}`,
                email: req.body.email,
                password: req.body.password,
                provider: 'local',
            },
        })
            .spread((user, created) => {
                if (user && !created) {
                    req.flash('errors', {
                        msg: 'That email address is already taken!',
                    });
                    return res.redirect('/signup');
                }

                if (user && created) {
                    newUser = user;

                    return db.Profile.create({
                        radius: 3,
                        searchResults: 3,
                    });
                }
            })
            .then((profile) => {
                return newUser.setProfile(profile);
            })
            .then(() => {
                req.logIn(newUser, (err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(req.session.returnTo || '/welcome');
                });
            })
            .catch((err) => {
                return next(err);
            });
    }
);

/**
 * GET /account
 */
router.get('/account', ensureLoggedIn('/login'), (req, res, next) => {
    res.render('account/profile', {
        title: 'Account Management',
        csrf: req.csrfToken(),
        page: 'profile-page',
        user: req.user,
    });
});

/**
 * POST /account/profile
 */
router.post(
    '/account/profile',
    [
        check('email', 'Email is not valid')
            .not()
            .isEmpty()
            .isEmail({ domain_specific_validation: true })
            .normalizeEmail({ gmail_remove_dots: false }),
        check('firstName', 'The first name field cannot be empty')
            .not()
            .isEmpty(),
        check('lastName', 'The last name field cannot be empty')
            .not()
            .isEmpty(),
        check('displayName', 'The display name field cannot be empty')
            .not()
            .isEmpty(),
        check('photo', 'The photo needs to be a valid URL')
            .optional({ checkFalsy: true })
            .isURL(),
        check('latitude')
            .optional({ checkFalsy: true })
            .matches(/^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/),
        check('longitude')
            .optional({ checkFalsy: true })
            .matches(
                /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/
            ),
        check('radius', 'Enter a search radius of at least 3 miles.')
            .toInt()
            .isInt({
                min: 3,
            }),
        check('searchResults', 'The minimum number of results is 3')
            .toInt()
            .isInt({
                min: 3,
            }),
    ],
    (req, res, next) => {
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
        db.User.findByPk(req.user.id, {
            include: [{ model: db.Profile, as: 'Profile' }],
        })
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
    }
);

/**
 * POST /account/password
 */
router.post(
    '/account/password',
    [
        check(
            'password',
            'Password must be at least 8 characters long'
        ).isLength({ min: 8 }),
        check('confirmPassword', 'Passwords do not match').custom(
            (value, { req }) => value === req.body.password
        ),
    ],
    (req, res, next) => {
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
    }
);

/**
 * POST /account/delete
 */
router.post('/account/delete', (req, res, next) => {
    db.User.findByPk(req.user.id)
        .then((user) => {
            return user.destroy();
        })
        .then(() => {
            req.flash('info', { msg: 'Your account has been deleted.' });
            res.redirect('/logout');
        });
});

/* GET /welcome */
router.get('/welcome', ensureLoggedIn('/login'), (req, res, next) => {
    // If the user has lat and lon in their profile, we pushed to the
    // session when they authenticated.
    if (req.session.lat && req.session.lon) {
        zomato
            .cuisines({ lat: req.session.lat, lon: req.session.lon })
            .then((cuisines) => {
                console.dir(cuisines);

                res.render('search', {
                    page: 'search-page',
                    csrf_header: req.csrfToken(),
                    cuisines: cuisines,
                });
            })
            .catch((err) => {
                res.render('search', {
                    page: 'search-page',
                    csrf_header: req.csrfToken(),
                });
            });
    } else {
        // Show the page with inputs for the Zomato Query. The user didn't
        // Provide their location during sign-up.
        res.render('search', {
            page: 'search-page',
            csrf_header: req.csrfToken(),
        });
    }
});

/* POST /search/setup */
/**
 * This is only necessary for testing. It allows to ask for location
 * data and update the logged-in user's profile record. May be able
 * to also remove the jQuery call to populate the drop down used in
 * testing.
 */
router.post('/search/setup', (req, res, next) => {
    let lat;
    let lon;

    if (req.session.lat && req.session.lon) {
        lat = req.session.lat;
        lon = req.session.lon;
    } else {
        lat = req.body.lat;
        lon = req.body.lon;
        req.session.lat = lat;
        req.session.lon = lon;

        let user;
        db.User.findByPk(req.user.id)
            .then((foundUser) => {
                user = foundUser;

                return db.Profile.create({
                    latitude: lat,
                    longitude: lon,
                });
            })
            .then((profile) => {
                user.setProfile(profile);
            })
            .then(() => next());
    }

    console.log(`lat: ${lat}, lon: ${lon}`);
    console.log('Cookies: ', req.cookies);

    console.log(req.user);

    // zomato.cuisines({ lat: lat, lon: lon }).then((cuisines) => {
    //     res.json(cuisines);
    // });
});

/* POST /search */
router.post('/search', ensureLoggedIn('/login'), (req, res, next) => {
    const data = {
        cuisines: req.body['cuisine-select'],
        radius: Math.floor(req.body['search-radius'] / 0.00062137),
        count: 5,
    };

    if (req.session.lat && req.session.lon) {
        data.lat = req.session.lat;
        data.lon = req.session.lon;
    }

    console.dir(data);

    zomato.search(data).then((results) => {
        res.json(results);
    });
});

module.exports = router;
