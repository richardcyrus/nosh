/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:registrationRouter');

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const registrationController = require('../controllers/registration');

router
    .route('/')
    .get(registrationController.displayScreen)
    .post(
        [
            check('email', 'Email is not valid')
                .normalizeEmail({ gmail_remove_dots: false })
                .isEmail({ domain_specific_validation: true }),
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
            check('latitude')
                .optional({ checkFalsy: true })
                .matches(/^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/),
            check('longitude')
                .optional({ checkFalsy: true })
                .matches(
                    /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/
                ),
        ],
        registrationController.handleRegistration
    );

module.exports = router;
