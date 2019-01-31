/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureLoggedIn, ensureNotLoggedIn } = require('connect-ensure-login');
const db = require('../models');

const config = require('../config/app-config');
const Zomato = require('../lib/zomato');
const zomato = new Zomato(config.zomato.userKey);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'nosh' });
});

/* GET /login */
router.get('/login', ensureNotLoggedIn(), (req, res, next) => {
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
router.post('/login', (req, res, next) => {
    req.assert(
        'email',
        'The provided email address is not a valid format.'
    ).isEmail();
    req.assert('password', 'The password field cannot be empty.').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
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

            req.flash('success', { message: 'Success! You are logged in.' });
            res.redirect(req.session.returnTo || '/welcome');
        });
    })(req, res, next);
});

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
router.get('/signup', ensureNotLoggedIn(), (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/signup', {
        title: 'Create Account',
        csrf: req.csrfToken(),
    });
});

/**
 * POST /signup
 * Create a new local account.
 */
router.post('/signup', (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(
        4
    );
    req.assert('confirmPassword', 'Passwords do not match').equals(
        req.body.password
    );
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }

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
                    message: 'That email address is already taken!',
                });
                return res.redirect('/signup');
            }

            if (user && created) {
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(req.session.returnTo || '/');
                });
            }
        })
        .catch((err) => {
            return next(err);
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
    }

    // Show the page with inputs for the Zomato Query. The user didn't
    // Provide their location during sign-up.
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

router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
    })
);

router.get(
    '/auth/google/redirect',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login',
    })
);

module.exports = router;
