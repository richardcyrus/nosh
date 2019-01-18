/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

module.exports = router;
