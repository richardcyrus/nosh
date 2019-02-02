/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

module.exports = {
    zomato: {
        userKey: process.env.ZOMATO_API_KEY,
    },
    session: {
        secret: process.env.SESSION_SECRET,
    },
    crypt: {
        workFactor: parseInt(process.env.SALT_WORK_FACTOR),
    },
};
