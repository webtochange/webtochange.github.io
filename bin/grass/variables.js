const canvas = document.querySelector("canvas").getContext("2d");

var grass = document.querySelector("#grass");
var stone = document.querySelector("#stone");
var sand = document.querySelector("#sand");
var snow = document.querySelector("#snow");
var water = document.querySelector("#water");
var lava = document.querySelector("#lava");
var mud = document.querySelector("#mud");

const map = 
{
  height: 960,
  width: 1600,
  level: 0,
};

const biom = 
{
  height: map.height/3,
  width: map.width/5,
};

var speed = 0.9;

canvas.canvas.height = map.height;
canvas.canvas.width = map.width;

const player1 = 
{
  height: 8,
  width: 8,
  x: map.width/2 - 8,
  xVelocity: 0,
  y: map.height/2 - 8,
  yVelocity: 0,
  xBlock: 0,
  yBlock: 0
};

const block = 
{
  height: 16,
  width: 16,
};




// Sterowanie
const controller =
{
  left: false,
  right: false,
  up: false,
  down: false,
  keyListener: function (event) 
  {
    var key_state = (event.type == "keydown") ? true : false;

    switch (event.keyCode) 
    {
        // LEFT
        case 37:// LEFT Arrow 
        controller.left = key_state;
        break;
        case 65:// A
        controller.left = key_state;
        break;
    
        // UP
        case 38:// UP Arrow
        controller.up = key_state;
        break;
        case 87:// W
        controller.up = key_state;
        break;
    
        // RIGHT
        case 39:// RIGHT Arrow
        controller.right = key_state;
        break;
        case 68:// D
        controller.right = key_state;
        break;

        // Down
        case 40:// DOWN Arrow
        controller.down = key_state;
        break;
        case 83:// S
        controller.down = key_state;
        break;
    }
  }
}