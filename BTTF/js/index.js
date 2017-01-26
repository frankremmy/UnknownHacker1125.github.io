////////////
// Global //
////////////

var doc = $(document);
var win = $(window);
var bdy = $('body');
var wrapper = $('.wrapper');
var startScreen = $('.start-screen');
var overlay = $('.overlay');
var mute = $('.mute');
var hud = $('.hud');
var speedometer = $('.speedometer');
var flux = $('.flux');
var countdown = $('.countdown');
var road = $('.road');
var timeMachine = $('.time-machine');
var items = $('.items');

var stage = 1;
var stages = [1955,2015,1885];
var carMin = 40;
var carMax = 88;
var minSpeed = 2000;
var maxSpeed;
var currentSpeed;
var carSpeed;
var fluxCount;
var fluxMax = 100;
var timeMachinePos = parseInt(timeMachine.css('top')) + 150;

var carAccelerator, itemGenerator, itemAccelerator;

var soundtrack = document.getElementById('soundtrack');
var beepLow = document.getElementById('beep-low');
var beepHigh = document.getElementById('beep-high');
var powerUp = document.getElementById('power-up');
var buzz = document.getElementById('buzz');
var zap = document.getElementById('zap');
var fail = document.getElementById('fail');

reset();

///////////
// Audio //
///////////

function setVolume(mute) {
  if (mute) {
  	$('audio').each(function() {
    	this.volume = 0;
  	});
	} else {
    soundtrack.volume = 0.2;
		beepLow.volume = 0.5;
		beepHigh.volume = 0.5;
		powerUp.volume = 0.5;
    buzz.volume = 1;
		zap.volume = 0.5;
    fail.volume = 1;
  };
};

setVolume();

mute.on('click', function() {
  var self = $(this);
  
  self.toggleClass('muted');
  
  if (self.hasClass('muted')) {
    setVolume('mute');
  } else {
    setVolume();
  };
});

//////////////////
// Acceleration //
//////////////////

function accelerateCar() {
  if (speedometer.text() < 88) speedometer.text(carSpeed);
  
  if (carSpeed === 88) {
    clearInterval(carAccelerator);
    clearInterval(itemGenerator);
    clearInterval(itemAccelerator);
    
    wrapper.removeClass('play');
    wrapper.children('.item').remove();
    
    if (fluxCount >= fluxMax) {
      wrapper.addClass('win');
      timeMachine.append('<span />');
      timeMachine.addClass('slip');
      zap.play();
      setTimeout(function() { timeMachine.removeClass('slip'); }, 400);
    } else {
      soundtrack.pause();
      soundtrack.currentTime = 0;
      fail.play();
    };
    
    setTimeout(function() {
      overlay.removeClass('hide');
      if (fluxCount >= fluxMax) overlay.addClass('win');
      else overlay.addClass('lose');
    }, 1000);
  };
  
  carSpeed++;
};

function accelerateItems() {
  if (currentSpeed > maxSpeed && wrapper.hasClass('play')) {
    wrapper.find('.item').css('animation', 'move-item ' + currentSpeed + 'ms linear infinite');
    currentSpeed = currentSpeed - 100;
  };
};


///////////
// Items //
///////////

// Score
function score(slip) {
  if (!slip) {
    fluxCount++;
    timeMachine.addClass('score');
    powerUp.currentTime = 0;
    powerUp.play();
  }
  else {
    if (fluxCount > 0) fluxCount--;
    timeMachine.addClass('slip');
    buzz.currentTime = 0;
    buzz.play();
  };
  
  var fluxPercentage = Math.round(fluxCount / fluxMax * 100);
  
  if (fluxPercentage <= 100 && fluxPercentage >= 0) flux.html(fluxPercentage + '<span>%</span>');
  else if (fluxPercentage > 100 || fluxPercentage < 0) fluxCount = fluxMax;
  
  setTimeout(function() {
    timeMachine.removeClass('score');
    timeMachine.removeClass('slip');
  }, 400);
};

// Create Items
function createItem(activeItem) {
  var goodItemClone = items.find(activeItem[0]).clone(),
      badItemClone = items.find(activeItem[1]).clone(),
      newItemArray = [goodItemClone,badItemClone],
      newItem = newItemArray[Math.floor(Math.random()*newItemArray.length)];
  
  newItem.attr('data-lane', Math.floor((Math.random()*3)+1)).addClass('hold');
  newItem.appendTo('.wrapper');
};

// Remove Items
(function removeItem() {
  requestAnimationFrame(removeItem);
  
  var timeMachineLane = parseInt(timeMachine.attr('data-lane'));
  
  wrapper.children('.item').each(function() {
    var self = $(this),
        itemPosition = self.position().top,
        itemLane = self.data('lane');
    
    if (itemPosition <= timeMachinePos && itemPosition > 100 && timeMachineLane === itemLane && !wrapper.hasClass('win') && wrapper.hasClass('play')) {
      self.css('visibility', 'hidden');
      if (!self.hasClass('obstacle')) score();
      else score('slip');
    };
    
    if (itemPosition < -80 && wrapper.hasClass('play')) {
      self.remove();
    };
  });
})();


//////////
// Play //
//////////

overlay.find('.start').on('click', startCountdown);

function startCountdown() {
  var countStartNumber = countdown.data('count');
  
  timeMachine.addClass('get-set');
  overlay.addClass('animate').addClass('hide');
  setTimeout(function() { overlay.removeClass('intro'); }, 1000);
  
  countdown.addClass('start');
  
  (function countdownTimer() {
    if (countStartNumber >= 0) {
      countdown.attr('data-count', countStartNumber--);
      setTimeout(countdownTimer, 1000);
      
      if (countStartNumber < 0) {
        beepHigh.play();
        countdown.attr('data-count', 'GO');
      } else {
        beepLow.play();
      };
    }
    else {
      countdown.removeClass('start').attr('data-count', '3');
      play();
    };
  })();
};

function play() {
  wrapper.addClass('play');
  carAccelerator = setInterval(accelerateCar, 1000);
  
  itemGenerator = setInterval(function() {
    createItem(items.find('.active'));
  }, 500);
  
  itemAccelerator = setInterval(accelerateItems, 3000);
};


//////////////////
// Start Screen //
//////////////////

startScreen.on('click', function() {
  $(this).remove();
  if (!mute.hasClass('muted')) soundtrack.play();
});


///////////
// Reset //
///////////

overlay.find('.reset').on('click', function() {
  reset();
  if (!mute.hasClass('muted')) soundtrack.play();
  fail.pause();
  fail.currentTime = 0;
});

function reset() {
  maxSpeed = 500 + ((stage - stages.length) * -250);
  currentSpeed = minSpeed;
  carSpeed = carMin;
  fluxCount = 0;
  
  wrapper.removeClass('win');
  wrapper.find('.item').removeAttr('style');
  speedometer.text('0');
  flux.html('0<span>%</span>');
  timeMachine.removeClass('get-set').attr('data-lane', '2').empty();
  overlay.attr('class', 'overlay intro');
};


//////////////
// Continue //
//////////////

overlay.find('.continue').on('click', nextStage);

function nextStage() {
  if (stage < 3) stage++;
  else stage = 1;
  
  reset();
  
  overlay.find('.continue span').text(stage + 1);
  hud.find('.stage span').text(stage);
  hud.find('.present span').text(stages[stage - 1]);
  
  wrapper.attr('data-stage', stage);
  wrapper.find('.item.active').removeClass('active');
  wrapper.find('.item[data-stage="' + stage + '"]').addClass('active');
  
  if (stage === 3) {
    overlay.find('.win button')
           .html('Play Again')
           .prev('p')
           .text('You got Marty back to 1985. Thank you for playing.');
  }
  else if (stage === 1) {
    overlay.find('.win button')
           .html('Continue to Stage <span>2</span>')
           .prev('p')
           .text('You got Marty back to 1985.');
  };
};


///////////////////////
// Keyboard Controls //
///////////////////////

doc.keydown(function(e) {
  var currentLane = timeMachine.attr('data-lane');
  
  switch(e.which) {
    case 37: // left
      if (currentLane > 1 && wrapper.hasClass('play')) timeMachine.attr('data-lane', --currentLane);
    break;
    
    case 39: // right
      if (currentLane < 3 && wrapper.hasClass('play')) timeMachine.attr('data-lane', ++currentLane);
    break;
    
    case 13: // enter/return
      if (overlay.is(':visible')) overlay.find('button:visible').trigger('click');
    break;
    
    default: return;
  };
  
  e.preventDefault();
});