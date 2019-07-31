/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:indexRouter');

const express = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');
const router = express.Router();

const loginRoutes = require('./login');
const registrationRoutes = require('./registration');
const accountRoutes = require('./account');

const searchController = require('../controllers/search');

// Register routes that have their own configuration files.
router.use('/login', loginRoutes);
router.use('/signup', registrationRoutes);
router.use('/account', ensureLoggedIn('/login'), accountRoutes);

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'nosh', indexRoute: true });
});

/* GET /welcome */
router.get(
    '/welcome',
    ensureLoggedIn('/login'),
    searchController.displaySearch
);

/* POST /search */
router.post('/search', searchController.runSearch);

/* GET /logout */
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) return next(err);

        req.user = null;
        res.redirect('/');
    });
});

module.exports = router;
