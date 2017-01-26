//only for chrome
$('.road').mouseenter(function() {
  $('body').addClass('start');
  
  var timer = new Date;
  
 timFun = setInterval(function() { 
    $('.Timer').text((new Date - timer) / 1000 + " Seconds");
}, 1000);
});

$('.road').mouseleave(function() {
  $('body').removeClass('start');
  clearInterval(timFun);
});

$('.police, .wire, .civilian').hover(function(){
    $('.road').trigger('mouseleave');
});

$('.road').mouseleave(function(){
    $('.gameover').addClass('show');
  $('.overlay').addClass('stop');
    audio.pause();
});

var audio = $("audio")[0];
$(".road").mouseenter(function() {
  audio.play();
});

 function restart() {
    $('.gameover').removeClass('show');
   $('body').removeClass('start');
    $('.overlay').removeClass('stop');
   timFun = null;
 }