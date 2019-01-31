/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

module.exports = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/redirect',
    },
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
