// This is Teddy
$(document).ready(function(){
    
    var counter = 0;

$("#slider01").roundSlider({
    min: 1000,
    max: 4000,
    step: 1000,
    value: 2000,
    radius: 120,
    sliderType: "min-range",
    showTooltip: false,
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