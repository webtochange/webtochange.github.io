const swiper = new Swiper('.swiper', {
    // Optional parameters,
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });



const menu = mdc.menu.MDCMenu.attachTo(document.querySelector('.mdc-menu'));
menu.open = false;

// Otwieranie menu po kliknięci menuo
const menuOpen = document.querySelector('#menu');
const menuClose = document.querySelector('main');

menuOpen.addEventListener('click', () => 
{
  menu.open = !menu.open;
});
menuClose.addEventListener('click', () => 
{
  menu.open = false;
});




// animacja klikania menu
function clickMenu()
{
  
  var menu = document.querySelector('.menuing');
  

  // usunięcie klasy
  setTimeout( () => 
  {
    menu.classList.remove('animation');
  },700);

  // dodanie klasy
  menu.classList.add('animation');
}