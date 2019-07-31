/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const loginController = require('../controllers/login');

router
    .route('/')
    .get(loginController.getLogin)
    .post(
        [
            check('email', 'The provided email address is not a valid format.')
                .normalizeEmail({ gmail_remove_dots: false })
                .isEmail({ domain_specific_validation: true }),
            check('password', 'The password field cannot be empty.')
                .not()
                .isEmpty(),
        ],
        loginController.postLogin
    );

module.exports = router;
