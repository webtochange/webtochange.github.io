function drawingLevel()
{
    //level 1
    if (level==1)
    {
        //belka 1
        createColisionAndDrawing(100, 200, 400, "#444444", 30, "Collision();", 0, 0);
        //belka 2
        createColisionAndDrawing(180, 500, 700, "#444444", 30, "Collision();", 0, 0);
        //belka 3
        createColisionAndDrawing(250, 800, 1000, "#444444", 30, "Collision();", 0, 0);
        //belka 4
        createColisionAndDrawing(325, 1100, 1200, "#444444", 30, "Collision();", 0, 0);
        //belka 5    
        createColisionAndDrawing(400, 1300, 1350, "#444444", 30, "Collision();", 0, 0);
        //belka 6    
        createColisionAndDrawing(450, 1450, 1620, "#444444", 30, "Collision();", 0, 0);
        //END
        createColisionAndDrawing(505, 1550, 1600, "#ffdc09", 80, "Win()", 20, 80);
    }
    //level 2
    else if (level==2)
    {
        //belka 1
        createColisionAndDrawing(100, 250, 400, "#444444", 30, "Collision();", 0, 0);
        //belka 2
        createColisionAndDrawing(180, 50, 200, "#444444", 30, "Collision();", 0, 0);
        //belka 3
        createColisionAndDrawing(260, 250, 400, "#444444", 30, "Collision();", 0, 0);
        //belka 4
        createColisionAndDrawing(340, 50, 200, "#444444", 30, "Collision();", 0, 0);
        //belka 5
        createColisionAndDrawing(420, 250, 400, "#444444", 30, "Collision();", 0, 0);
        //belka 6
        createColisionAndDrawing(500, 50, 200, "#444444", 30, "Collision();", 0, 0);
        //belka 7
        createColisionAndDrawing(580, 250, 400, "#444444", 30, "Collision();", 0, 0);
        //lava 1
        createColisionAndDrawing(450, 520, 1380, "#a70000", 70, "Dead();", 20, 70);
        //belka 7
        createColisionAndDrawing(580, 600, 800, "#444444", 30, "Collision();", 0, 0);
        //belka 7
        createColisionAndDrawing(580, 1000, 1200, "#444444", 30, "Collision();", 0, 0);
        //belka 7
        createColisionAndDrawing(580, 1400, 1620, "#444444", 30, "Collision();", 0, 0);
        //END
        createColisionAndDrawing(635, 1550, 1600, "#ffdc09", 80, "Win()", 20, 80);
    }
    //level 3
    else if (level==3)
    {
        //belka 1
        createColisionAndDrawing(100, 170, 220, "#444444", 30, "Collision();", 0, 0);
        //belka 2
        createColisionAndDrawing(150, 395, 445, "#444444", 30, "Collision();", 0, 0);
        //belka 3
        createColisionAndDrawing(150, 570, 620, "#444444", 30, "Collision();", 0, 0);
        //jump pad 1
        createColisionAndDrawing(225, 720, 920, "#006abc", 30, "JumpPad();", 0, 0);
        //belka 4
        createColisionAndDrawing(600, 970, 1120, "#444444", 30, "Collision();", 0, 0);
        //speed 1
        createColisionAndDrawing(600, 1120, 1420, "#FFA500", 30, "Speed();", 0, 0);
        //belka 5
        createColisionAndDrawing(600, 1420, 1570, "#444444", 30, "Collision();", 0, 0);
        //lava 1
        createColisionAndDrawing(400, 1050, 1100, "#a70000", 300, "Dead();", 120, 180);
        //belka 6
        createColisionAndDrawing(400, 1520, 1620, "#444444", 30, "Collision();", 0, 0);
        //belka 7
        createColisionAndDrawing(250, 1220, 1420, "#444444", 30, "Collision();", 0, 0);
        //END
        createColisionAndDrawing(305, 1250, 1300, "#ffdc09", 80, "Win()", 20, 80);  
    }
    //level 4
    else if (level==4)
    {
        //belka 1
        createColisionAndDrawing(100, 170, 220, "#444444", 30, "Collision();", 0, 0);
        //jump pad 1
        createColisionAndDrawing(210, 300, 400, "#006abc", 30, "JumpPad();", 0, 0);
        //belka 2
        createColisionAndDrawing(570, 500, 600, "#444444", 30, "Collision();", 0, 0);
        //speed 1
        createColisionAndDrawing(570, 600, 900, "#FFA500", 30, "Speed();", 0, 0);
        //lava 1
        createColisionAndDrawing(450, 520, 1380, "#a70000", 70, "Dead();", 20, 70);
        //belka 3
        createColisionAndDrawing(570, 1250, 1400, "#444444", 30, "Collision();", 0, 0);
        //belka 4
        createColisionAndDrawing(300, 1450, 1620, "#444444", 30, "Collision();", 0, 0);
        //belka 5
        createColisionAndDrawing(200, 1150, 1300, "#444444", 30, "Collision();", 0, 0);
        //belka 6
        createColisionAndDrawing(250, 950, 1020, "#444444", 30, "Collision();", 0, 0);
        //belka 7
        createColisionAndDrawing(250, 700, 820, "#444444", 30, "Collision();", 0, 0);
        //END
        createColisionAndDrawing(305, 720, 770, "#ffdc09", 80, "Win()", 20, 80);
    }
    // level 5
    else if (level==5)
    {
        gravityCube1 = 0.5;
        //belka 1
        createColisionAndDrawing(100, 170, 600, "#444444", 30, "Collision();", 0, 0); 
                        //belka 1 cube1
                        createColisionAndDrawingCube1(100, 170, 600, "gravityCube1=0; cube1.yVelocity = 0;", 0, 0, cube1.y, cube1.x);
         //button 1
         openPlatform1 = false;
         createColisionAndDrawing(30, 1200, 1230, "#bf8bff", 30, "openPlatform1 = true;", 0, 10); 
                        //button 1 cube1
                        createColisionAndDrawingCube1(30, 1200, 1230, "openPlatform1 = true;", 0, 10, cube1.y, cube1.x);
        // platforma 1
        if (openPlatform1==false)
        {
            createColisionAndDrawing(200, 650, 900, "#1a1a1a", 30, "", 0, 0);
        }
        else if (openPlatform1==true)
        {
            createColisionAndDrawing(200, 650, 900, "#bf8bff", 30, "Collision();", 0, 0);
        }
        //belka 2
        createColisionAndDrawing(300, 950, 1000, "#444444", 30, "Collision();", 0, 0);
        //jump pad 1  
        createColisionAndDrawing(300, 1200, 1400, "#006abc", 30, "JumpPad();", 0, 0);
        //belka 3
        createColisionAndDrawing(600, 850, 1100, "#444444", 30, "Collision();", 0, 0);
        //END
        createColisionAndDrawing(655, 870, 920, "#ffdc09", 80, "Win()", 20, 80);
    }
    // level 6
    else if (level==6)
    {
        //belka 1
        createColisionAndDrawing(100, 1020, 1220, "#444444", 30, "Collision();", 0, 0);
        //belka 2
        createColisionAndDrawing(180, 1370, 1570, "#444444", 30, "Collision();", 0, 0);
        //belka 3
        createColisionAndDrawing(250, 1070, 1270, "#444444", 30, "Collision();", 0, 0);
        //lava 1
        createColisionAndDrawing(260, 70, 970, "#a70000", 70, "Dead();", 20, 70);
        //belka 4
        createColisionAndDrawing(325, 870, 920, "#444444", 30, "Collision();", 0, 0);
        //belka 5    
        createColisionAndDrawing(350, 700, 750, "#444444", 30, "Collision();", 0, 0);
        //belka 6    
        createColisionAndDrawing(450, 570, 620, "#444444", 30, "Collision();", 0, 0);
        //belka 7
        createColisionAndDrawing(520, 380, 430, "#444444", 30, "Collision();", 0, 0);
        //belka 8
        createColisionAndDrawing(600, 20, 220, "#444444", 30, "Collision();", 0, 0);
        //END
        createColisionAndDrawing(655, 70, 120, "#ffdc09", 80, "Win()", 20, 80);
    }



    // no colison
    gravityTF = true;
}


function WhereItemlevel()
{
    if (level==5)
    {
        cube1.x = 500;
        cube1.y = heightMap - 200; 
    } 
}

function createVelocityItems()
{
    // level 5
    if (level == 5)
    {
        // cube1
        cube1.yVelocity += gravityCube1;
        cube1.x += cube1.xVelocity;
        cube1.y += cube1.yVelocity;
        
        if (player1.x < cube1.x + 33 && player1.x > cube1.x - 33 && player1.y < cube1.y + 33 && player1.y > cube1.y - 33 && cube1.x > 0 && cube1.x < widthMap - player1.width && level==5)
        {
            cube1.x += player1.xVelocity;
            Collision();gravityTF = false;
        }
    }  
}

function drawingItems()
{
    // level 5
    if (level==5)
    {
        // cube1 drawing
        canvas.fillStyle = "#A0522D";
        canvas.beginPath();
        canvas.rect(cube1.x, cube1.y, cube1.width, cube1.height);
        canvas.fill(); 
    }
}