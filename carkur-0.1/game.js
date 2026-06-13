const loop = function () 
{

    // działanie klawisza skoku
    if (controller.up && player1.jumping == false) 
    {
        player1.yVelocity -= jumpHeight * jumpModifier * jumpMode;
        player1.jumping = true;

        //niwelacja odbiajczy
        jumpModifier = 1;
    }

    // działanie klawisza w lewo
    if (controller.left) {player1.xVelocity -= 0.5; player1.rotationLeft = true; }
    // działanie klawisza w prawo
    if (controller.right) { player1.xVelocity += 0.5; player1.rotationLeft = false; }

    // gravity
    player1.yVelocity += gravity2;
    player1.x += player1.xVelocity * speedModifier * speedMode;
    player1.y += player1.yVelocity * speedModifier * speedMode;
    
    // ! dash
    dash()

    // ! timer 
    timer();

    createVelocityItems();
    
    // szybkość
    player1.xVelocity *= swing;
    player1.yVelocity *= swing;

    if (player1.xVelocity < 0.1 && player1.xVelocity > 0.1)
    {
        player1.xVelocity = 0;
    }

    // Ground
    if (player1.y > heightMap - 14 - 16 - 32) 
    {
        player1.jumping = false;
        player1.y = heightMap - 14 - 16 - 32;
        player1.yVelocity = 0;
    }

    groundItems("cube1.y");

    // ! Site
    // Left
    if (player1.x < 0) { player1.x = 0; } 
    // Right
    else if (player1.x > widthMap - player1.width) { player1.x = widthMap - player1.width; }

    // ! Site
    siteCube("player1", "cube1");

    // background drawing
    canvas.fillStyle = "#131313";
    canvas.fillRect(0, 0, widthMap, heightMap);
    
    // timer drawing
    canvas.fillStyle = "#242424";
    canvas.textAlign = 'center';
    canvas.font = "400px Arial";
    canvas.fillText(timerString, widthMap/2, heightMap/2 + 70);

    //Rysuje lewel
    drawingLevel();

    // Rysuje wszystko poza itemami
    drawingEverything();

    // update draw again
    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);

// ! timer
setInterval(() => {
    milisec++;
}, 100);


//Scrolling web with spacebar OFF
window.addEventListener('keydown', (elem) => 
{  
    if (elem.keyCode == 32 && elem.target == document.body) 
    {  
        elem.preventDefault(); 
    }  
});


//game mode
const mode = document.querySelector('#mode');

mode.addEventListener("submit", (e) =>
{
    e.preventDefault();

    level = document.querySelector('#level').value;

    jumpMode = document.querySelector('#jump').value;

    speedMode = document.querySelector('#speed').value;

    // reset ustawienia rzeczy
    level = level - 1;
    Win();
});