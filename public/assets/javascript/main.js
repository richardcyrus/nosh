//fade away for the nosh title//
  $(window).scroll(function(){
    $(".noshSvg").css("opacity", 1 - $(window).scrollTop() / 250);
  });

  //fade away for the start now button//
  $(window).scroll(function(){
    $(".startBtn").css("opacity", 1 - $(window).scrollTop() / 250);
  });

  //auto scroll after clicking the about button//
  $(".aboutArrow").click(function() {
    $('html,body').animate({
        scrollTop: $(".aboutDiv").offset().top},
        2000);
});

//distance selector//
$(document).ready(function(){
    
    var counter = 0;

$("#slider01").roundSlider({
    min: 2,
    max: 20,
    step: 1,
    value: 2,
    radius: 170,
    startAngle: 90,
    handleSize: "+20",
    sliderType: "min-range",

    showTooltip: false,
    tooltipFormat: function (e) {
        var handle = this._handles().html("<div class='inner-tooltip'></div>");
        handle.children().html(this.options.value).rsRotate(-e.handle.angle);
        return this.options.rangeValue;
    },
    change: function(e){
        $("#sliderV1").html(e.value);
    }

});

//icon selector//
$(".iconDiv").click(function(e){
    e.preventDefault();

    $(this).find('i').removeClass("pe-is-f-sushi-2");

    foodList = { 
        American:"pe-is-f-hot-dog-f",
        Asian:"pe-is-f-sushi-4-f",
        BBQ:"pe-is-f-barbecue-2-f",
        Bakery:"pe-is-f-bread-3-f",
        Bar_Food:"pe-is-f-cork-skrew-f",
        Beverage:"pe-is-f-beer-bottle",
        Breakfest:"pe-is-f-waffle-f",
        Burger:"pe-is-f-burger-1",
        Cafe:"pe-is-f-coffee-maker-2-f",
        Chinese:"pe-is-f-chinese-food-53",
        Coffee_and_Tea:"pe-is-f-cup-2",
        Dessert:"pe-is-f-piece-of-cake-1",
        Donuts:"pe-is-f-donut-2-f",
        Drinks_Only:"pe-is-f-wine-glass-3-f",
        Fast_Food:"pe-is-f-french-fries-f",
        French:"pe-is-f-croissant",
        German:"pe-is-f-sausage-1-f",
        Hawaiian:"pe-is-f-anana",
        Healthy_Food:"pe-is-f-apple-2-f",
        Ice_Cream:"pe-is-f-ice-cream-2",
        Italian:"pe-is-f-chef-hat-f",
        Japanese:"pe-is-f-sushi-2",
        Juices:"pe-is-f-pitcher-2",
        Kebab:"pe-is-f-skewer",
        Mediterranean:"m",
        Mexican:"pe-is-f-kebab",
        Pizza:"pe-is-f-pizza-2",
        Polish:"pe-is-f-sausage-1",
        Pub_Food:"pe-is-f-beer-glass-f",
        Salad:"pe-is-f-wheat-f",
        Sandwich:"pe-is-f-sandwich",
        Seafood:"pe-is-f-fish-1",
        Steak:"pe-is-f-steak-2",
        Sushi:"pe-is-f-sushi-2-f",
        Taco:"pe-is-f-kebab-f",
        Tea:"pe-is-f-kettle-1"
    }

    var foodArray = Object.keys(foodList)

    counter++;
    
    $(this).find('i').addClass(foodList.BBQ);

    // $(this).find('i').removeClass(foodList.American).addClass(foodList.BBQ);
})
});