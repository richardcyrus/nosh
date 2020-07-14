/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

/* global jQuery */
/* eslint-disable */

(function ($) {
    // Bootstrap tooltip and alert globals.
    $('[data-toggle="tooltip"]').tooltip();

    // Enable alerts that close on their own.
    $('.alert[data-auto-dismiss]').each(function (index, element) {
        const $element = $(element);
        const timeout = $element.data('auto-dismiss') || 5000;

        setTimeout(function () {
            $element.alert('close');
        }, timeout);
    });
})(jQuery);
