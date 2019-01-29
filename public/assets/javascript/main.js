
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
        1500);
});

//selector//
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


$(".imgBtn").click(function(e){
    e.preventDefault();
    
    var images = [{imgUrl:"https://image.flaticon.com/icons/svg/1046/1046784.svg",imgDes:"Burger",imgNum:0},{imgUrl:"https://image.flaticon.com/icons/svg/135/135763.svg",imgDes:"Fries",imgNum:1},{imgUrl:"https://image.flaticon.com/icons/svg/706/706164.svg",imgDes:"Boot",imgNum:2}]

    switch($(this).attr("data-typeBtn")){
        case "forward":
        counter++;
        break;
        case "back":
        counter--;
        break;
    }

    if(counter >= images.length-1){
        $("#food").attr("src", images[counter].imgUrl);
        $("#foodValue").text(images[counter].imgDes);
        counter = 0;
    }
    else if(counter < 0){
        counter = images.length-1;
        $("#food").attr("src", images[counter].imgUrl);
        $("#foodValue").text(images[counter].imgDes);
    }
    else{
        $("#food").attr("src", images[counter].imgUrl);
        $("#foodValue").text(images[counter].imgDes);
        counter++;
        
    }

    
})
})

//other style//
$("#appearance7").roundSlider({
    radius: 170,
    startAngle: 90,
    width: 8,
    handleSize: "+16",
    handleShape: "dot",
    sliderType: "min-range",
    value: 10,

    tooltipFormat: function (e) {
        var handle = this._handles().html("<div class='inner-tooltip'></div>");
        handle.children().html(this.options.value).rsRotate(-e.handle.angle);
        return this.options.rangeValue;
    }
});