/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

/* global jQuery, bootbox */
/* eslint-disable */

(function ($) {
    /* eslint-disable-next-line strict */
    'use strict';

    // Get the _csrf token needed for POST, PUT, PATCH, DELETE requests.
    const token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');

    // Note: `startRadius` is set in the template and used here if it exists.
    let startValue = parseInt(startRadius);

    // Search Page setup. Register the round-slider element and default display.
    $('#radius-wheel').roundSlider({
        sliderType: 'min-range',
        handleShape: 'round',
        width: 27,
        radius: 170,
        value: startValue || 3,
        startAngle: 90,
        editableTooltip: false,
        showTooltip: false,
        min: 3,
        max: 48,
        step: 3,
        handleSize: '+20',
        tooltipFormat: function (e) {
            const handle = this._handles().html(
                '<div class="inner-tooltip"></div>'
            );
            handle
                .children()
                .html(this.options.value)
                .rsRotate(-e.handle.angle);

            return this.options.rangeValue;
        },
    });

    // Process the search request.
    $('#nosh-me').on('click', (e) => {
        e.preventDefault();

        const params = {
            radius: $('#radius-wheel').roundSlider('option', 'value'),
            cuisines: $('.carousel-item.active').data('cuisine-id'),
        };

        $.ajax({
            method: 'post',
            url: '/search',
            data: params,
            headers: { 'X-CSRF-Token': token },
        }).done((data) => {
            console.dir(data);
            showResults(data);
        });
    });

    /**
     * Build a Bootstrap Card component for a single restaurant result.
     *
     * @param {Object} restaurant The restaurant for which to build the card.
     * @returns {*|jQuery|HTMLElement}
     */
    function createCard(restaurant) {
        /* eslint-disable max-len */
        // prettier-ignore
        const card = $(`
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${restaurant.name}</h5>
            <p class="card-text">
              ${restaurant.address}
              Website:&nbsp;<a href="${restaurant.url}" class="card-link">${restaurant.name}</a><br>
            </p>
          </div>
        </div>`.trim());

        /* eslint-enable */
        // Add the record id for future use.
        card.data('id', restaurant.id);
        card.data('restaurant-id', restaurant.id);

        // Add the Name as a title attribute for the modal box.
        card.data('title', restaurant.name);

        return card;
    }

    /**
     * Build the stack of Bootstrap Cards to render the results for the
     * modal.
     *
     * @param {Array} restaurants The results of the search.
     */
    function renderRestaurants(restaurants) {
        let i = 0;
        const cards = [];

        for (i; i < restaurants.length; i++) {
            cards.push(createCard(restaurants[i]));
        }

        $('.results-container').append(cards);
    }

    /**
     * Build and display the modal for the search results.
     *
     * @param restaurants
     */
    function showResults(restaurants) {
        // Construct the interior of the modal.
        const contentWrap = $('<div>').addClass(
            'results-container container-fluid'
        );

        bootbox.dialog({
            closeButton: true,
            onEscape: true,
            show: true,
            title: 'Your Options',
            message: contentWrap,
            backdrop: true,
            buttons: {
                close: {
                    /* eslint-disable max-len */
                    label: '<span class="fas fa-times"></span>&nbsp;&nbsp;Close',
                    /* eslint-enable max-len */
                    className: 'btn-outline-danger',
                    callback: function () {
                        bootbox.hideAll();
                    },
                },
            },
        });

        renderRestaurants(restaurants);
    }
})(jQuery);
