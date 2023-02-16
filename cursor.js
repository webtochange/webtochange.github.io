const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => 
{
    cursor.setAttribute("style", "top: "+(e.pageY-10)+"px; left: "+(e.pageX-5)+"px;")            
})

document.addEventListener('click', () => 
{
    cursor.classList.add("clickanie");
    setTimeout(() => {cursor.classList.remove("clickanie")}, 200)
})


function OnMouse()
{
    cursor.classList.add("hover");
}

function NoOnMouse()
{
    cursor.classList.remove("hover");
}