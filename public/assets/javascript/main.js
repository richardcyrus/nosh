
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