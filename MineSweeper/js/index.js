//variables
var lvl1w = 9;
var lvl1h = 9;
var lvl1m = 10;

var mineField;
var opened;

startGame();
function startGame(){
  mineField = new Array();
  opened = 0;
  
  //creating on array
  for(var i=0; i<lvl1h; i++){
    mineField[i] = new Array();
    for(var j=0; j<lvl1w; j++){
      mineField[i].push(0);
    }
  }
  
  //placing mines
  var placedMines = 0;
  var randomRow,randomCol;
  while(placedMines < lvl1m){
    randomRow = Math.floor(Math.random() * lvl1h);
    randomCol = Math.floor(Math.random() * lvl1w);
    if(mineField[randomRow][randomCol] == 0){
      mineField[randomRow][randomCol] = 9;
      placedMines++;
    }
  }
  
  //placing digits
  for(var i=0; i < lvl1h; i++){
    for(var j=0; j<lvl1w; j++){
      if(mineField[i][j] == 9){
        for(var ii=-1; ii<=1; ii++){
          for(var jj=-1; jj<=1; jj++){
            if(ii!=0 || jj!=0){
              if(tileValue(i+ii,j+jj) != 9 && tileValue(i+ii,j+jj) != -1){
                mineField[i+ii][j+jj]++;
              }
            }
          }
        }
      }
    }
  }
  
  //placing in page
  for(var i=0; i<lvl1h; i++){
    for(var j=0; j<lvl1w; j++){
      var tile = $("#container").append("<span id='"+i+""+j+"' data-row='"+i+"' data-col='"+j+"' class='box first'></span>");
    }
  }
  
  $("#container span.box").on('contextmenu',function(e){
    e.preventDefault();
    if($(this).hasClass("checked")){
      $(this).removeClass("checked");
    } else {
      $(this).addClass("checked");
    }
  });
  
  $("#container span.box").click(function(){
    if(!$(this).hasClass('checked')){
    var tile = $(this);
    var clickedRow = tile.data('row');
    var clickedCol = tile.data('col');
    var clickedVal = mineField[clickedRow][clickedCol];
    
    if(clickedVal == 0){
      floodFill(clickedRow,clickedCol);
    }
    
    if(clickedVal > 0 && clickedVal < 9){
      tile.removeClass('first');
      tile.html(clickedVal);
      opened++;
    }
    
    if(clickedVal == 9){
      tile.removeClass('first');
      tile.append("<span class='bomb'></span>");
      $("#container").after('<a href="#" id="again">Game Over! Start Again ?</a>');
      $("#container .box").off('click');
      $("a#again").on('click',function(e){
        e.preventDefault();
        $("#container span.box").remove();
        $("#again").remove();
        startGame();
      });
    }
    
    checkopened();
    }
  });
  
}

function floodFill(row,col){
  var tile = $("#container span#"+row+""+col);
  if(tile.hasClass('first')){
    tile.removeClass('first');
    if(tile.hasClass("checked")){
        tile.removeClass("checked");
      }
    if(mineField[row][col] > 0){
      tile.html(mineField[row][col]);
      opened++;
    } else {
      tile.addClass("opened");
      opened++;
    }
  
    if(mineField[row][col] == 0){
      for(var ii=-1; ii<=1; ii++){
        for(var jj=-1; jj<=1; jj++){
          if(ii!=0 || jj!=0){
            if(tileValue(row+ii,col+jj) != 9){
              if(tileValue(row+ii,col+jj) != -1){
                floodFill(row+ii,col+jj);
              }
            }
          }
        }
      }
    }
  }
}

function checkopened(){
  console.log(opened);
  if(opened >= 71){
    $("#container").after('<a href="#" id="again">You Win! Start Again ?</a>');
    $("#container .box").off('click');
    $("a#again").on('click',function(e){
      e.preventDefault();
      $("#container span.box").remove();
      $("#again").remove();
      startGame();
    });
  }
}

function tileValue(row,col){
  if(mineField[row] == undefined || mineField[row][col] == undefined){
    return -1;
  } else {
    return mineField[row][col];
  }
}