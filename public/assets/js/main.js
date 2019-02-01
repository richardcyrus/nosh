/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

/* global jQuery */
/* eslint-disable func-style */

(function($) {
    const cuisineList = $('#cuisine-select');

    const geoSuccess = function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const token = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');

        $.ajax({
            method: 'post',
            url: '/search/setup',
            data: {
                lat: latitude,
                lon: longitude,
            },
            headers: {
                'X-CSRF-Token': token,
            },
        }).done(function(data) {
            data.forEach((item) => {
                const selectItem = $('<option>')
                    .attr({
                        'data-cuisine-id': item.cuisine_id,
                        'data-cuisine-name': item.cuisine_name,
                        value: item.cuisine_id,
                    })
                    .text(item.cuisine_name);
                cuisineList.append(selectItem);
            });
        });
    };

    // Get the user's latitude and longitude from the browser.
    const profileGeo = function(position) {
        $('input[name="latitude"]').val(position.coords.latitude);
        $('input[name="longitude"]').val(position.coords.longitude);
    };

    const geoError = function(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error('Location permission denied by user.');
                break;
            case error.POSITION_UNAVAILABLE:
                console.error('Location position unavailable.');
                break;
            case error.TIMEOUT:
                console.error('Location request timed out.');
                break;
            case error.UNKNOWN_ERROR:
                console.error('Location: Unknow error.');
                break;
        }
    };

    $('.get-location').on('click', function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
        } else {
            console.error('The browser does not support geolocation!');
        }
    });

    $('.update-location').on('click', function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(profileGeo, geoError);
        } else {
            console.error('The browser does not support geolocation!');
        }
    });

    // Bootstrap Globals
    $('[data-toggle="tooltip"]').tooltip();

    $('.alert[data-auto-dismiss]').each(function(index, element) {
        const $element = $(element);
        const timeout = $element.data('auto-dismiss') || 5000;

        setTimeout(function() {
            $element.alert('close');
        }, timeout);
    });

    // Front Page
    $(window).scroll(function() {
        $('.mainTitle').css('opacity', 1 - $(window).scrollTop() / 250);
    });

    $('.about-arrow').on('click', function(event) {
        event.preventDefault();
        $('html,body').animate(
            {
                scrollTop: $('#about-nosh').offset().top,
            },
            1500
        );
    });

    // nosh search page
    $('#radius-wheel').roundSlider({
        sliderType: 'min-range',
        handleShape: 'round',
        width: 27,
        radius: 170,
        value: 3,
        startAngle: 90,
        editableTooltip: false,
        showTooltip: false,
        min: 3,
        max: 48,
        step: 3,
        handleSize: '+20',
        tooltipFormat: function(e) {
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
})(jQuery);
