var score = 0;
var ileS = 1;

var lvl = 0;
var xp = 0;
var xpToLvl = 150;
var xp1 = 0;
var xp2 = 1;

var shop1C = 25;
var shop1 = 0;

var shop2C = 500;
var shop2 = 0;

var shop3C = 300;
var shop3 = 0;

var shop4C = 200;
var shop4 = 0;


var color = 0;


var ilePrzed = 0;
var ileNaS = 0;




//Ładowanie
window.onload = loading;
function loading()
{
    //punktów
    document.getElementById("score0").innerHTML = score;


    //Sklepu 1
    document.getElementById("shop1").innerHTML = shop1;
    document.getElementById("shop1C").innerHTML = shop1C;
    //Sklepu 2
    document.getElementById("shop2").innerHTML = shop2;
    document.getElementById("shop2C").innerHTML = shop2C;
    //Sklepu 3
    document.getElementById("shop3").innerHTML = shop3;
    document.getElementById("shop3C").innerHTML = shop3C;
    //Sklepu 4
    document.getElementById("shop4").innerHTML = shop4;
    document.getElementById("shop4C").innerHTML = shop4C;


    //levelu i xp
    document.getElementById("lvl").innerHTML = lvl;
    document.getElementById("xpToLvl").innerHTML = xpToLvl;
    document.getElementById("xp").innerHTML = xp;


    ifShop()
    ileSrednioNaS()
    CzyStac()
}


//Dodawanie punktów
function AddScore(ileS)
{   
    //konwertuje na int bo coś się psuło z ruletką
    ileS = parseInt(ileS);
    //dodaje tyle punktów co ileS
    score=score+ileS;
    document.getElementById("score0").innerHTML = score;

    //dodaje tyle xp co ileS
    xp1=ileS*xp2;
    xp=xp+xp1;

    //reloaduje wypianie
    document.getElementById("lvl").innerHTML = lvl;
    document.getElementById("xpToLvl").innerHTML = xpToLvl;
    document.getElementById("xp").innerHTML = xp;

    lvlUP();
    
    //wypisuje pod kursorem liczbę dodaną do scoru
    document.getElementById('cursor').innerHTML = "<br>+"+ileS;

    setTimeout(() => {
        document.getElementById('cursor').innerHTML = "";
    }, 300)
}


//Kupowanie Sklep 1
function Buy1()
{   
    //Sprawdza czy wystarczająco punktów na kupienie sklepu 1
    if (score >= shop1C)
    {
        //Odejmuje punkty o ceny sklepu 1
        score = score - shop1C;

        //Zwiększa cene sklepu 1
        shop1C = shop1C * 2;
        //Dodaje następny etap sklepu 1
        shop1++;

        //reloaduje wypianie
        document.getElementById("shop1").innerHTML = shop1;
        document.getElementById("score0").innerHTML = score;
        document.getElementById("shop1C").innerHTML = shop1C;

    
        
    }
    if (shop1==10) 
    {
            document.getElementById("shop1buyD").innerHTML = '<div  class="shopbuy"></div><div id="upgrade1"></div><div id="shop1"></div><div id="shop1C"></div><p id="mustext">MAX</p>';
    }
}

//Kupowanie Sklep 2
function Buy2()
{   
    //Sprawdza czy wystarczająco punktów na kupienie sklepu 2
    if (score >= shop2C)
    {
        //Odejmuje punkty o ceny sklepu 2
        score = score - shop2C;

        //Zwiększa cene sklepu 2
        shop2C = shop2C * 2;
        //Dodaje następny etap sklepu 2
        shop2++;

        //reloaduje wypianie
        document.getElementById("shop2").innerHTML = shop2;
        document.getElementById("score0").innerHTML = score;
        document.getElementById("shop2C").innerHTML = shop2C;

    }
    if (shop2==10) 
    {
        document.getElementById("shop2buyD").innerHTML = '<div class="shopbuy"></div><div id="upgrade2"></div><div id="shop2"></div><div id="shop2C"></div><p id="mustext">MAX</p>';
    }
}

//Kupowanie Sklep 3
function Buy3()
{   
    //Sprawdza czy wystarczająco punktów na kupienie sklepu 3
    if (score >= shop3C)
    {
        //Odejmuje punkty o ceny sklepu 3
        score = score - shop3C;

        //Zwiększa cene sklepu 3
        shop3C = shop3C * 2;
        //Dodaje następny etap sklepu 3
        shop3++;

        //reloaduje wypianie
        document.getElementById("shop3").innerHTML = shop3;
        document.getElementById("score0").innerHTML = score;
        document.getElementById("shop3C").innerHTML = shop3C;

    }
    if (shop3==10) 
    {
        document.getElementById("shop3buyD").innerHTML = '<div class="shopbuy"></div><div id="upgrade3"></div><div id="shop3"></div><div id="shop3C"></div><p id="mustext">MAX</p>';
    }
}

//Kupowanie Sklep 4
function Buy4()
{   
    //Sprawdza czy wystarczająco punktów na kupienie sklepu 4
    if (score >= shop4C)
    {
        //Odejmuje punkty o ceny sklepu 4
        score = score - shop4C;

        //Zwiększa cene sklepu 4
        shop4C = shop4C * 4;
        //Dodaje następny etap sklepu 4
        shop4++;

        //reloaduje wypianie
        document.getElementById("shop4").innerHTML = shop4;
        document.getElementById("score0").innerHTML = score;
        document.getElementById("shop4C").innerHTML = shop4C;

    }
    if (shop4==5) 
    {
        document.getElementById("shop4buyD").innerHTML = '<div class="shopbuy"></div><div id="upgrade4"></div><div id="shop4"></div><div id="shop4C"></div><p id="mustext">MAX</p>';
    }
}



//Sprawdzanie Czy level up
function lvlUP()
{
    if (xp>=xpToLvl)
    {
        xp = 0;
        lvl++;
        xpToLvl = xpToLvl*16;

        //Zmienianie grafik i napisów pod levelem zależnie od levelu
        if (lvl==1) {document.getElementById("mus").innerHTML = '<img src="1.png" width="100%" height="100%" alt="">'; document.getElementById("lvlDe").innerHTML = 'Kilka osób pije <p id="mustext">MUS</p> w butelce';}
        if (lvl==2) {document.getElementById("mus").innerHTML = '<img src="2.png" width="100%" height="100%" alt="">'; document.getElementById("lvlDe").innerHTML = 'Niektórzy piją <p id="mustext">MUS</p> w tubce';}
        if (lvl==3) {document.getElementById("mus").innerHTML = '<img src="3.png" width="100%" height="100%" alt="">'; document.getElementById("lvlDe").innerHTML = 'Większość pije <p id="mustext">MUS</p>';}
        if (lvl==4) {document.getElementById("mus").innerHTML = '<img src="4.png" width="100%" height="100%" alt="">'; document.getElementById("lvlDe").innerHTML = 'Wszyscy piją <p id="mustext">MUS</p>';}
        if (lvl==5) {document.getElementById("mus").innerHTML = '<img src="5.png" width="100%" height="100%" alt="">'; document.getElementById("lvlDe").innerHTML = '<p id="mustext">MUS</p> jest wszędzie';}
    }
}

//Działanie Sklepów
function ifShop()
{
    //Działanie Sklepu 1
    if (shop1==1) {AddScore(1);}
    if (shop1==2) {AddScore(4);}
    if (shop1==3) {AddScore(8);}
    if (shop1==4) {AddScore(16);}
    if (shop1==5) {AddScore(32);}
    if (shop1==6) {AddScore(64);}
    if (shop1==7) {AddScore(96);}
    if (shop1==8) {AddScore(128);}
    if (shop1==9) {AddScore(256);}
    if (shop1==10) {AddScore(512);}

    //Działanie Sklepu 2
    if (shop2==1) {AddScore(64);}
    if (shop2==2) {AddScore(96);}
    if (shop2==3) {AddScore(128);}
    if (shop2==4) {AddScore(256);}
    if (shop2==5) {AddScore(384);}
    if (shop2==6) {AddScore(512);}
    if (shop2==7) {AddScore(896);}
    if (shop2==8) {AddScore(1024);}
    if (shop2==9) {AddScore(2048);}
    if (shop2==10) {AddScore(3072);}

    //Działanie Sklepu 3
    if (shop3==1) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(2)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(2)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==2) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(3)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(3)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==3) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(5)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(5)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==4) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(7)" id="mus"><img 5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(7)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==5) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(10)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(10)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==6) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(15)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(15)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==7) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(20)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(20)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==8) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(25)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(25)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==9) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(35)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(35)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }
    if (shop3==10) 
    {
        if (lvl>=6)
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(50)" id="mus"><img src="5.png" width="100%" height="100%" alt=""></button>';
        }
        else
        {
            document.getElementById("musD").innerHTML = '<button onclick="AddScore(50)" id="mus"><img src="'+lvl+'.png" width="100%" height="100%" alt=""></button>';
        }
    }

    //Działanie Sklepu 4
    if (shop4==1) {xp2=2;}
    if (shop4==2) {xp2=3;}
    if (shop4==3) {xp2=5;}
    if (shop4==4) {xp2=7;}
    if (shop4==5) {xp2=10;}

    //Znowu działanie po 1s sklepów
    setTimeout("ifShop()",1000);
}

//Sprawdzanie czy wartość jest możliwa
function SprawdzR(color)
{
    var scoreR = document.getElementById("pole").value;
    var colorN = 0;

    if (score>=scoreR)
    {
        //losowanie koloru
        colorN = Math.floor(Math.random()*100)

        //sprawdzanie koloru
        if (colorN <= 40 && color==1)
        {
            //dodanie punktów
            AddScore(scoreR);

            document.getElementById("nav").innerHTML = '<p id="rwygrana">Wygrano: '+scoreR+'</p>';
        }
        else if (colorN <= 70 && colorN > 40 && color==2)
        {
            //dodanie punktów
            AddScore(2*scoreR);

            document.getElementById("nav").innerHTML = '<p id="rwygrana">Wygrano: '+(scoreR*2)+'</p>';
        }
        else if (colorN <= 90 && colorN > 70  && color==3)
        {
            //dodanie punktów
            AddScore(4*scoreR);

            document.getElementById("nav").innerHTML = '<p id="rwygrana">Wygrano: '+(scoreR*4)+'</p>';
        }
        else if (colorN <= 100 && colorN > 90  && color==4)
        {
            //dodanie punktów
            AddScore(9*scoreR);

            document.getElementById("nav").innerHTML = '<p id="rwygrana">Wygrano: '+(scoreR*9)+'</p>';
        }
        //przegrana
        else
        {
            //odjęcie punktów
            score = score - scoreR;
            //wypisanie
            document.getElementById("score0").innerHTML = score;

            document.getElementById("nav").innerHTML = '<p id="rporazka">Przegrano: '+scoreR+'</p>';            
        }  
    }
    //nie wystarczająco punktów
    else if (score<scoreR)
    {
        alert(" - Nie masz tyle punktów - ");
    }
    //nie wpisano liczby
    else
    {
        alert(" - Wpisz liczbę punktów - ");
    }
}

//Liczy ile średnio (z klikaniem i maszynami) zdobya się w ciągu 1s
function ileSrednioNaS()
{
    //liczy średnio
    ileNaS = score - ilePrzed;
    ilePrzed = score;

    //wypisuje
    document.getElementById('iledodaje').innerHTML = ileNaS+"/1s";

    //wznawia od początku co 1s
    setTimeout("ileSrednioNaS()",1000);
}



//Czy stać cię na upgrade
function CzyStac()
{
    //Upgrade 1
    if (score < shop1C)
    {
        document.getElementById("shop1").style.color = "#ff0000";
        document.getElementById("upgrade1").style.color = "#ff0000";
    }
    else
    {
        document.getElementById("shop1").style.color = "#adff2f";
        document.getElementById("upgrade1").style.color = "#adff2f";
    }
    //Upgrade 2
    if (score < shop2C)
    {
        document.getElementById("shop2").style.color = "#ff0000";
        document.getElementById("upgrade2").style.color = "#ff0000";
    }
    else
    {
        document.getElementById("shop2").style.color = "#adff2f";
        document.getElementById("upgrade2").style.color = "#adff2f";
    }
    //Upgrade 3
    if (score < shop3C)
    {
        document.getElementById("shop3").style.color = "#ff0000";
        document.getElementById("upgrade3").style.color = "#ff0000";
    }
    else
    {
        document.getElementById("shop3").style.color = "#adff2f";
        document.getElementById("upgrade3").style.color = "#adff2f";
    }
    //Upgrade 4
    if (score < shop4C)
    {
        document.getElementById("shop4").style.color = "#ff0000";
        document.getElementById("upgrade4").style.color = "#ff0000";
    }
    else
    {
        document.getElementById("shop4").style.color = "#adff2f";
        document.getElementById("upgrade4").style.color = "#adff2f";
    }



    //Powtórzenie
    setTimeout("CzyStac()", 100);
}