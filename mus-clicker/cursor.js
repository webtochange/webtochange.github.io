const cursor = document.querySelector('.cursor');

//Rusza customowym cursorem
document.addEventListener('mousemove', e => 
{
    //przesuwa customowy cursor w miejsce prawdziwego cursora
    cursor.setAttribute("style", "top: "+(e.pageY-10)+"px; left: "+(e.pageX-10)+"px;")            
})

//Animacja clickania
document.addEventListener('click', () => 
{
    //dodaje do classy clickanie
    cursor.classList.add("clickanie");
    //usówa po czasie żeby wruciło do normy
    setTimeout(() => {cursor.classList.remove("clickanie")}, 100)
})

//Kiedy najedziesz na clickalną rzecz
function OnMouse()
{
    //dodanie do classy hover
    cursor.classList.add("hover");
}
//Kiedy najedziesz na nie clickalną rzecz
function NoOnMouse()
{
    //usunięcie z classy hover
    cursor.classList.remove("hover");
}