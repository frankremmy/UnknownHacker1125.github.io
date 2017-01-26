/*
 * Point & Click Browser Game Prototype
 *  
 * A very basic prototype for a browsergame. 
 * Best experience in fullscreen!
 *
 * Photos by @haukebruno
 *
 * 
 * 2013 by Tim Pietrusky
 * timpietrusky.com
 */

var active = 'alpha';
var b = $('#game');
  
function clean(e) {
  e.preventDefault();
  
  // Remove all
  b.removeClass();
}

function check(name_alpha, name_beta) {
   b.addClass('animate');
  
  setTimeout(function() {
    b.removeClass('animate');
  }, 1000);
  
  if (active != name_alpha) {
    b.addClass(name_alpha);
    active = name_alpha;
  } else {
    b.addClass(name_beta);
    active = name_beta;
  }
  
  if (active == 'beta') {
    $('.object--alpha').hide();
  }
  
  if (active == 'gamma') {
    $('.object--beta').hide();
  }
  
  if (active == 'alpha') {
    $('.object--beta').show();
    $('.object--alpha').show();
  }
}

$('.object--alpha').on('click', function(e) {
  clean(e);
  check('alpha', 'beta');
});

$('.object--beta').on('click', function(e) {
  clean(e);
  check('alpha', 'gamma');
});