/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:accountRouter');

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/account');

/**
 * GET /account
 */
router.get('/', accountController.displayAccount);

/**
 * POST /account/profile
 */
router.post(
    '/profile',
    [
        check('email', 'Email is not valid')
            .not()
            .isEmpty()
            .normalizeEmail({ gmail_remove_dots: false })
            .isEmail({ domain_specific_validation: true }),
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
    accountController.saveProfile
);

/**
 * POST /account/password
 */
router.post(
    '/password',
    [
        check(
            'password',
            'Password must be at least 8 characters long'
        ).isLength({
            min: 8,
        }),
        check('confirmPassword', 'Passwords do not match').custom(
            (value, { req }) => value === req.body.password
        ),
    ],
    accountController.changePassword
);

/**
 * POST /account/delete
 */
router.post('/delete', accountController.deleteAccount);

module.exports = router;
