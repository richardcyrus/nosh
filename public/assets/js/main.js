/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

/* global jQuery */
/* eslint-disable */

(function($) {
    // Get the user's latitude and longitude from the browser.
    const profileGeo = function(position) {
        $('input[name="latitude"]').val(position.coords.latitude);
        $('input[name="longitude"]').val(position.coords.longitude);
    };

    const geoError = function(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log('Location permission denied by user.');
                break;
            case error.POSITION_UNAVAILABLE:
                console.log('Location position unavailable.');
                break;
            case error.TIMEOUT:
                console.log('Location request timed out.');
                break;
            case error.UNKNOWN_ERROR:
                console.log('Location: Unknow error.');
                break;
        }
    };

    $('.update-location').on('click', function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(profileGeo, geoError);
        } else {
            console.log('The browser does not support geolocation!');
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

    $('#nosh-me').on('click', function(event) {
        event.preventDefault();

        const token = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');

        const searchParams = {
            radius: $('#radius-wheel').roundSlider('option', 'value'),
            cuisines: $('.carousel-item.active').data('cuisine-id'),
        };

        $.ajax({
            method: 'post',
            url: '/search',
            data: searchParams,
            headers: {
                'X-CSRF-Token': token,
            },
        }).done(function(data) {
            console.dir(data);
            $('#results-container').empty();
            data.forEach((item) => {
                // Build Modal Content
                $('#results-container').append(`
<div class="card mb-3" data-restaurant-id="${item.id}">
<div class="card-body">
<h5 class="card-title">${item.name}</h5>
<p class="card-text">${item.address}<br>
Website:&nbsp;<a href="${item.url}" class="card-link">${item.name}</a><br>
</p>
</div>
</div>
                `);
            });
            $('#resultsModal').modal('show');
        });
    });
})(jQuery);
