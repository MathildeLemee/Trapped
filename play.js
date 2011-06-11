//Mon host chez cloud9
var HOST = "nodesnake.mathilde.c9.io";

function init() {
io.setPath('/path/to/socket.io/');
this.socket = new io.Socket(HOST);
socket.connect();
var canvas = document.getElementById("canvas");  
 if (canvas.getContext) {
   ctx = canvas.getContext("2d");
   this.x = canvas.width / 2;
   this.y = canvas.height / 2;
   this.gridSize = 5;
   this.currentPosition = {'x':this.x, 'y':this.y};
   }  
   allowMove = true;
   this.positions=[];

socket.on('message', function (data) {
   if (data.direction!=null) {
        direction=data.direction;
        color = data.color;
        room = data.room;
        draw();
    }
     if (data.x!=null) {
        positions.push([data.x,data.y]);
        createSquare(data.x,data.y,gridSize, gridSize,data.color);
    }
});

}

function draw() {
   interval = setInterval(autoMove,100);

}

function autoMove() {
  moveSnake();  
}

function createSquare(x, y, w, h,c) {
  if (x < canvas.width && y < canvas.height) {
    
    ctx.fillStyle =c;
    ctx.fillRect (x, y, w, h);
  }

}  
function hasCollision(element, index, array) {
  return (element[0] == currentPosition['x'] && element[1] == currentPosition['y']);  
}

function moveTo(x, y, w, h) {
    
    if (positions.some(hasCollision)) {
        gameOver();
    }
    positions.push([currentPosition['x'], currentPosition['y']]);
    socket.send( {"x": x, "y": y,"color":color,"room":room});
    createSquare(x, y, w, h,color);
}


function moveUp(){
    
  if (upPosition() >= 0) {
    executeMove('up', 'y', upPosition());
  } else {
    gameOver();
  }
}

function moveDown(){
  if (downPosition() < canvas.height) {
    executeMove('down', 'y', downPosition());    
  } else {
    gameOver();
  }
}

function moveLeft(){
  if (leftPosition() >= 0) {
    executeMove('left', 'x', leftPosition());
  } else {
    gameOver();
  }
}

function moveRight(){
  if (rightPosition() < canvas.width) {
    executeMove('right', 'x', rightPosition());
  } else {
    gameOver();
  }
}

function gameOver(){
      clearInterval(interval);
    allowMove = false;
    alert("Game Over.");
    
  }
function executeMove(dirValue, axisType, axisValue) {
  direction = dirValue;
  currentPosition[axisType] = axisValue;
  moveTo(currentPosition['x'],currentPosition['y'],gridSize,gridSize);
}
document.onkeydown = function(event) {
  var keyCode; 
  if (!allowMove){
        return null;  
    }
  if(event == null)
  {
    keyCode = window.event.keyCode; 
  }
  else 
  {
    keyCode = event.keyCode; 
  }
 
  switch(keyCode)
  {
    // left 
    case 37:
      moveLeft();
      break; 
     
    // up 
    case 38:
      moveUp();
      break; 
      
    // right 
    case 39:
      moveRight();
      break; 
    
    // down
    case 40:
      moveDown();
      break; 
    
    default: 
      break; 
  } 
}
function leftPosition(){
 return currentPosition['x'] - gridSize;  
}

function rightPosition(){
  return currentPosition['x'] + gridSize;
}

function upPosition(){
  return currentPosition['y'] - gridSize;  
}

function downPosition(){
  return currentPosition['y'] + gridSize;
}

  function moveSnake(){
  switch(direction){
    case 'up':
      moveUp();
      break;

    case 'down':
      moveDown();
      break;
      
    case 'left':
      moveLeft();
      break;

    case 'right':
      moveRight();
      break;
  }
}

