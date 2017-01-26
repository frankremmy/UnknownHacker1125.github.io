//ToDo-- Unbeatable Game

//1.Choose user Icon and set the icon
//2.reset
//3.win check
//4.draw check
//5.AI
$(function() {
  var player;
  var comp;
  var pTurn;
  var gameEnd = false;
  var turns = 1; // to caluclate total moves

  $('.icon').on('click', userIcon);
  // game function at the end
  $('.square').on('click', function() {
    game(this)
  });
  $('#reset').on('click', restart);

  // get user icon
  function userIcon() {
    if ($(this).attr("id") == "x") {
      player = "X";
      comp = "O";
    } else if ($(this).attr("id") == "o") {
      player = "O";
      comp = "X";
    }
    $('#user').hide(1000);
    $('table').show(1000);
    reset();
  }

  //show icons
  function symbDisp(ths) {
    // if the square is empty
    if ($(ths).text())
      return false;
    $(ths).text(pTurn);
    return true;
  }
  // full restart
  function restart() {
    $('#user').show(1000);
    player = comp = undefined;
    reset();
  }
  // reset the game
  function reset() {
    // color and turns back to original
    $('.square').text('').css('background-color', 'red');
    turns = 1;
    gameEnd = false;
  }
  // win conditions
  function winCheck() {
    var wins = ["123", "456", "789", "147", "258", "369", "159", "357"];
    for (var i in wins)
      if (rowCheck('#' + wins[i][0], '#' + wins[i][1], '#' + wins[i][2])) return;
    drawCheck();
  }

  function rowCheck(a, b, c) {
    if ($(a).text() == pTurn && $(b).text() == pTurn && $(c).text() == pTurn) {
      $(a + ',' + b + ',' + c).css('background-color',
        //if user wins,color-green;else color black     //orange color for draw
        pTurn == player ? 'green' : 'black');
      gameEnd = true;
      setTimeout(reset, 1500);
      return true;
    }
    return false;
  }
  // moves 9 and still no one wins--draw
  function drawCheck() {
    if (turns === 9) {
      $(".square").css('background-color', 'orange');
      setTimeout(reset, 1500);
    }
  }

  // comp moves(very simple at this point)
  function AI() {
    for (var i = 1; i < 10; i++) {
      if (!$('#' + i).text()) {
        $('#' + i).text(pTurn);
        return;
      }
    }
  }
  // every function is here
  function game(ths) {
    pTurn = player;
    if (!symbDisp(ths)) return;
    winCheck();
    turns += 1;
    if (!gameEnd) {
      pTurn = comp;
      AI();
      winCheck();
      turns += 1;
    }
  }
});