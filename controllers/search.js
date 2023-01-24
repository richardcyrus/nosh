/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:searchController');
const Zomato = require('../lib/zomato');
const zomato = new Zomato(process.env.ZOMATO_API_KEY);
const { get_icons, prepare_modal } = require('../lib/zomato-utils');

/**
 * Query the Zomato API for a list of cuisines based on the user's location.
 *
 * @param {string} latitude
 * @param {string} longitude
 * @returns {Promise}
 */
function getCuisines(latitude, longitude) {
    const data = {
        lat: latitude,
        lon: longitude,
    };

    return zomato.cuisines(data);
}

module.exports = {
    runSearch: async (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401);
        }

        const searchParams = {
            cuisines: req.body.cuisines,
            radius: Math.floor(req.body.radius / 0.00062137),
            count: req.session.searchResults,
        };

        if (req.session.latitude && req.session.longitude) {
            searchParams.lat = req.session.latitude;
            searchParams.lon = req.session.longitude;
        }

        debug('searchParams: %o', searchParams);

        const results = await zomato.search(searchParams);
        if (results) {
            res.json(prepare_modal(results));
        } else {
            res.status(404);
        }
    },

    displaySearch: async (req, res, next) => {
        console.dir(req.session);

        if (req.session.latitude && req.session.longitude) {
            const foodTypes = await getCuisines(
                req.session.latitude,
                req.session.longitude
            );

            if (foodTypes) {
                const cuisines = get_icons(foodTypes);

                res.render('search', {
                    page: 'search-page',
                    csrf_header: req.csrfToken(),
                    cuisines: cuisines,
                    searchRoute: true,
                    nonce: res.locals.nonce,
                });
            }
        } else {
            req.flash('errors', { msg: 'Failed to get the list of cuisines!' });
            res.render('search', {
                page: 'search-page',
                csrf_header: req.csrfToken(),
                searchRoute: true,
            });
        }
    },
};
