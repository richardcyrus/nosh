/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

exports.get_icons = function(cuisines) {
    const cuisineNameIconMap = new Map([
        [1, 'pe-is-f-hot-dog-f'],
        [3, 'pe-is-f-sushi-4-f'],
        [5, 'pe-is-f-bread-3-f'],
        [193, 'pe-is-f-barbecue-2-f'],
        [227, 'pe-is-f-cork-skrew-f'],
        [270, 'pe-is-f-beer-bottle'],
        [182, 'pe-is-f-waffle-f'],
        [168, 'pe-is-f-burger-1'],
        [30, 'pe-is-f-coffee-maker-2-f'],
        [25, 'pe-is-f-chinese-food-53'],
        [161, 'pe-is-f-cup-2'],
        [100, 'pe-is-f-piece-of-cake-1'],
        [959, 'pe-is-f-donut-2-f'],
        [268, 'pe-is-f-wine-glass-3-f'],
        [40, 'pe-is-f-french-fries-f'],
        [45, 'pe-is-f-croissant'],
        [134, 'pe-is-f-sausage-1-f'],
        [521, 'pe-is-f-anana'],
        [143, 'pe-is-f-apple-2-f'],
        [233, 'pe-is-f-ice-cream-2'],
        [55, 'pe-is-f-chef-hat-f'],
        [60, 'pe-is-f-sushi-2'],
        [164, 'pe-is-f-pitcher-2'],
        [178, 'pe-is-f-skewer'],
        [73, 'pe-is-f-kebab'],
        [82, 'pe-is-f-pizza-2'],
        [219, 'pe-is-f-sausage-1'],
        [983, 'pe-is-f-beer-glass-f'],
        [998, 'pe-is-f-wheat-f'],
        [304, 'pe-is-f-sandwich'],
        [83, 'pe-is-f-fish-1'],
        [141, 'pe-is-f-steak-2'],
        [177, 'pe-is-f-sushi-2-f'],
        [997, 'pe-is-f-kebab-f'],
        [163, 'pe-is-f-kettle-1'],
    ]);

    const cuisineMap = cuisines.filter((c) => {
        return cuisineNameIconMap.has(c.cuisine_id);
    });

    cuisineMap.forEach((i) => {
        i.icon = cuisineNameIconMap.get(i.cuisine_id);
    });

    return cuisineMap;
};

exports.prepare_modal = function(results) {
    const restaurants = results.restaurants.map((r) => {
        return {
            id: r.id,
            name: r.name,
            url: r.url,
            thumb: r.thumb,
            address: r.location.address,
            cost: r.average_cost_for_two,
            rating_text: r.user_rating.rating_text,
            rating_votes: r.user_rating.votes,
        };
    });

    return restaurants;
};
