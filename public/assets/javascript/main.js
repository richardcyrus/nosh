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
   foodList = [
       {
        className:"pe-is-f-hot-dog-f",
        category: "American" 
    },
        {
        className:"pe-is-f-sushi-4-f",
        category:"Asian"
    },
        {
       className:"pe-is-f-barbecue-2-f",
       category: "BBQ"
    },
        {
       className:"pe-is-f-bread-3-f", 
       category: "Bakery"
    },
        {
       className:"pe-is-f-cork-skrew-f", 
       category: "Bar Food"
    },
        {
       className:"pe-is-f-beer-bottle", 
       category: "Beverage"
    },
       {
       className:"pe-is-f-waffle-f",
       category: "Breakfest"
    },
    {
       className:"pe-is-f-burger-1", 
       category: "Burger"
    },
       {
       className:"pe-is-f-coffee-maker-2-f", 
       category: "Cafe"
    },
        {
       className:"pe-is-f-chinese-food-53", 
       category: "Chinese"
    },
        {
       className:"pe-is-f-cup-2", 
       category: "Coffee and Tea"
    },
        {
       className:"pe-is-f-piece-of-cake-1", 
       category: "Dessert"
    },
        {
       className:"pe-is-f-donut-2-f", 
       category: "Donuts"
    },
        {
       className:"pe-is-f-wine-glass-3-f", 
       category: "Drinks Only"
    },
        {
       className:"pe-is-f-french-fries-f", 
       category: "Fast Food"
    },
        {
       className:"pe-is-f-croissant", 
       category: "French"
    },
        {
       className:"pe-is-f-sausage-1-f", 
       category: "German"
    },
        {
       className:"pe-is-f-anana", 
       category: "Hawaiian"
    },
        {
       className:"pe-is-f-apple-2-f", 
       category: "Healthy Food"
    },
        {
       className:"pe-is-f-ice-cream-2", 
       category: "Ice Cream"
    },
        {
       className:"pe-is-f-chef-hat-f", 
       category: "Italian"
    },
        {
       className:"pe-is-f-sushi-2", 
       category: "Japanese"
    },
        {
       className:"pe-is-f-pitcher-2", 
       category: "Juices"
    },
        {
       className:"pe-is-f-skewer", 
       category: "Kebab"
    },
        {
       className:"m", 
       category: "Mediterranean"
    },
        {
       className:"pe-is-f-kebab", 
       category: "Mexican"
    },
        {
       className:"pe-is-f-pizza-2", 
       category: "Pizza"
    },
        {
       className:"pe-is-f-sausage-1", 
       category: "Polish"
    },
       {
       className:"pe-is-f-beer-glass-f", 
       category: "Pub Food"
    },
       {
       className:"pe-is-f-wheat-f", 
       category: "Salad"
    },
       {
       className:"pe-is-f-sandwich", 
       category: "Sandwich"
    },
       {
       className:"pe-is-f-fish-1", 
       category: "Seafood"
    },
       {
       className:"pe-is-f-steak-2", 
       category: "Steak"
    },
       {
       className:"pe-is-f-sushi-2-f", 
       category: "Sushi"
    },
       {
       className:"pe-is-f-kebab-f", 
       category: "Taco"
    },
       {
       className:"pe-is-f-kettle-1"
   , category: "Tea"}]

   
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
$("#rightBtn").click(function(e){
   e.preventDefault();
   var iselector = $(".iconDiv").find('i');
   iselector.removeClass("pe-is-f-sushi-2");
   
   if(counter > foodList.length){

        
        counter = 0;
        iselector.addClass(foodList[counter].className);
        console.log("if"+counter)
        
   }
   else{
        iselector.removeClass(foodList[counter].className)
        counter++;
        iselector.addClass(foodList[counter].className);
        console.log("else"+counter)
        
   }
   
   

   
   // $(this).find('i').removeClass(foodList.American).addClass(foodList.BBQ);
})

$("#leftBtn").click(function(e){
   e.preventDefault();
   var iselector = $(".iconDiv").find('i');

   iselector.removeClass("pe-is-f-sushi-2");
   
   if(counter < 0){
        console.log("if"+ counter)
       counter = foodList.length -1;
       iselector.addClass(foodList[counter].className)
       
   }
   else{

        iselector.removeClass(foodList[counter].className)
        counter--;
        iselector.addClass(foodList[counter].className)
        console.log("else"+counter)
        
   }
   
   // $(this).find('i').removeClass(foodList.American).addClass(foodList.BBQ);
})
});