const axios = require('axios');
const qs = require('qs');

/**
 * This is the main class, the entry point to the zomato API client.
 *
 * @class Zomato
 */
class Zomato {
    /**
     * Instantiate Zomato with the caller's API key.
     *
     * @param {string} apiKey the user's API key
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.hostname = 'developers.zomato.com';
        this.apiVersion = '/api/v2.1';
        this.request = axios.create({
            baseURL: `https://${this.hostname}${this.apiVersion}`,
            timeout: 5000,
            method: 'get',
            headers: {
                'user-key': this.apiKey,
            },
            paramsSerializer: function(params) {
                return qs.stringify(params, { skipNulls: true });
            },
        });
    }

    /**
     * Get a list of categories
     */
    categories() {
        return this.request.get('/categories').then((response) => {
            return Promise.resolve(
                response.data.categories.map((o) => o.categories)
            );
        });
    }

    /**
     * Get the Zomato ID and other details for a city.
     *
     * @param {Object} params An object with the request parameters.
     */
    cities(params) {
        const query = {
            url: '/cities',
            params: params,
        };

        return this.request.request(query).then((response) => {
            return response.data.location_suggestions;
        });
    }

    /**
     * Get Zomato Restaurant Collections in a City.
     *
     * @param {Object} params An object with the request parameters.
     */
    collections(params) {
        const query = {
            url: '/collections',
            params: params,
        };

        return this.request.request(query).then((response) => {
            return response.data.collections.map((o) => o.collection);
        });
    }

    /**
     * Get a list of all cuisines of restaurants listed in a city.
     *
     * @param {Object} params An object with the request parameters.
     */
    cuisines(params) {
        const query = {
            url: '/cuisines',
            params: params,
        };

        return this.request.request(query).then((response) => {
            return response.data.cuisines.map((o) => o.cuisine);
        });
    }

    /**
     * Get a list of restaurant types in a city.
     *
     * @param {Object} params An object with the request parameters.
     */
    establishments(params) {
        const query = {
            params: params,
            url: '/establishments',
        };

        return this.request.request(query).then((response) => {
            return response.data.establishments.map((o) => o.establishment);
        });
    }

    /**
     * Get Foodie and Nightlife Index, list of popular cuisines and nearby
     * restaurants around the given coordinates.
     *
     * @param {Object} params An object with the request parameters.
     */
    geocode(params) {
        const query = {
            params: params,
            url: '/geocode',
        };

        return this.request.request(query).then((response) => {
            return response.data;
        });
    }

    /**
     * Search for Zomato locations by keyword.
     *
     * @param {Object} params An object with the request parameters.
     */
    locations(params) {
        const query = {
            params: params,
            url: '/locations',
        };

        return this.request.request(query).then((response) => {
            return response.data.location_suggestions;
        });
    }

    /**
     * Get Foodie Index, Nightlife Index, Top Cuisines and Best rated
     * restaurants in a given location.
     *
     * @param {Object} params An object with the request parameters.
     */
    locationDetails(params) {
        const query = {
            params: params,
            url: '/location_details',
        };

        return this.request.request(query).then((response) => {
            console.dir(response.data);
            return response.data;
        });
    }

    /**
     * Get detailed restaurant information using Zomato restaurant ID.
     *
     * @param {Object} params An object with the request parameters.
     */
    restaurant(params) {
        const query = {
            params: params,
            url: '/restaurant',
        };

        return this.request.request(query).then((response) => {
            return response.data;
        });
    }

    /**
     * Get daily menu using Zomato restaurant ID.
     *
     * @param {Object} params An object with the request parameters.
     */
    dailymenu(params) {
        const query = {
            params: params,
            url: '/dailymenu',
        };
        return this.request.request(query).then((response) => {
            return Promise.resolve(
                response.data.daily_menus.map((o) => o.daily_menu)
            );
        });
    }

    /**
     * Get restaurant reviews using the Zomato restaurant ID.
     *
     * @param {Object} params An object with the request parameters.
     */
    reviews(params) {
        const query = {
            params: params,
            url: '/reviews',
        };
        return this.request.request(query).then((response) => {
            return Promise.resolve({
                reviews_count: response.data.reviews_count,
                reviews_shown: response.data.reviews_shown,
                user_reviews: response.data.user_reviews.map((o) => o.review),
            });
        });
    }

    /**
     * Search for restaurants.
     *
     * @param {Object} params An object with the request parameters.
     */
    search(params) {
        const query = {
            params: params,
            url: '/search',
        };
        return this.request.request(query).then((response) => {
            return Promise.resolve({
                results_found: response.data.results_found,
                results_shown: response.data.results_shown,
                restaurants: response.data.restaurants.map((o) => o.restaurant),
            });
        });
    }
}

module.exports = Zomato;
module.exports.Zomato = Zomato;
module.exports.default = Zomato;
