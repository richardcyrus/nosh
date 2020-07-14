/**
 * nosh
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

module.exports = {
    'extends': 'prettier',
    'plugins': ['prettier', 'chai-friendly'],
    'rules': {
        'prettier/prettier': 'error',
        'chai-friendly/no-unused-expressions': 2
    },
    'parserOptions': {
        'ecmaVersion': 10,
        'sourceType': 'module',
        'ecmaFeatures': {
            'impliedStrict': true
        }
    },
    'env': {
        'browser': true,
        'commonjs': true,
        'node': true,
        'es6': true,
        'mocha': true
    }
};
