const loop = function () 
{
    // działanie klawisza w lewo
    if (controller.left) {player1.xVelocity -= 0.5;}
    // działanie klawisza w prawo
    if (controller.right) { player1.xVelocity += 0.5; }
    // działanie klawisza w gore
    if (controller.up) {player1.yVelocity -= 0.5;}
    // działanie klawisza w dol
    if (controller.down) { player1.yVelocity += 0.5; }
    
    // ! Site
    // Left
    if (player1.x < 0) { player1.x = 0; } 
    // Right
    else if (player1.x > map.width - player1.width) { player1.x = map.width - player1.width; }
    // Up
    if (player1.y < 0) { player1.y = 0; } 
    // Down
    else if (player1.y > map.height - player1.height) { player1.y = map.height - player1.height; }
    
    // szybkość
    player1.xVelocity *= speed;
    player1.yVelocity *= speed;

    // poruszanie
    player1.x += player1.xVelocity;
    player1.y += player1.yVelocity;



    
    //how block
    player1.xBlock = Math.floor((player1.x+4)/16);
    player1.yBlock = Math.floor((player1.y+4)/16);




    //water colision
    if (mapA[player1.yBlock][player1.xBlock]==3)
    {   
        player1.x -= player1.xVelocity;
        player1.y -= player1.yVelocity;
    }
    //mud colision
    if (mapA[player1.yBlock][player1.xBlock]==5)
    {   
        player1.x -= player1.xVelocity*speed;
        player1.y -= player1.yVelocity*speed;
    }




    //! map
    for (var i=0; i < mapA.length; i++)
    {
        for (var i2=0; i2 < mapA[i].length; i2++)
        {
            if (mapA[i][i2]==0)
            {
                canvas.drawImage(
                    grass, block.width * i2, block.height * i, block.width, block.height
                )
            }
            else if (mapA[i][i2]==1)
            {
                canvas.drawImage(
                    sand, block.width * i2, block.height * i, block.width, block.height
                )
            }
            else if (mapA[i][i2]==2)
            {
                canvas.drawImage(
                    snow, block.width * i2, block.height * i, block.width, block.height
                )
            }
            else if (mapA[i][i2]==3)
            {
                canvas.drawImage(
                    water, block.width * i2, block.height * i, block.width, block.height
                )
            }
            else if (mapA[i][i2]==4)
            {
                canvas.drawImage(
                    lava, block.width * i2, block.height * i, block.width, block.height
                )
            }
            else if (mapA[i][i2]==5)
            {
                canvas.drawImage(
                    mud, block.width * i2, block.height * i, block.width, block.height
                )
            }
        }
    }
    
    
    
    //player border
    canvas.fillStyle = "#ffff00";
    canvas.beginPath();
    canvas.rect(player1.x - player1.width/2, player1.y - player1.height/2, player1.width*2, player1.height*2);
    canvas.fill();
    //player
    canvas.fillStyle = "#efefef";
    canvas.beginPath();
    canvas.rect(player1.x, player1.y, player1.width, player1.height);
    canvas.fill();

    // update draw again
    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);

