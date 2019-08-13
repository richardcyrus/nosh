/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

/* global jQuery */
/* eslint-disable */

(function($) {
    // Save the user's Browser location data.
    const profileGeo = function(position) {
        $('input[name="latitude"]').val(position.coords.latitude);
        $('input[name="longitude"]').val(position.coords.longitude);
    };

    // Error logging for the Browser location request.
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
                console.log('Location: Unknown error.');
                break;
        }
    };

    // Get the location data. If first request, the user will see a browser
    // message asking to approve the location access.
    const askLocation = function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(profileGeo, geoError);
        } else {
            console.log('The browser does not support geolocation!');
        }
    };

    // Ask for the user's Browser location coordinates on the sign-up page.
    $('.signup-page').on('focus','#firstName', askLocation);

    // Ask for the user's Browser location coordinates on the profile page.
    // This is triggered when they click the location button.
    $('.update-location').on('click', askLocation);
})(jQuery);
