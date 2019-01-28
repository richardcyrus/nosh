/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

/* global jQuery */

(function($) {
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
})(jQuery);
