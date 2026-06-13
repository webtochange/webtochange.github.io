const backButton = document.createElement('button');
backButton.id = 'backButton';
backButton.title = 'Go back';
backButton.textContent = '←';
backButton.classList.add("back")

backButton.addEventListener('click', () => {
    window.location.href = './';
});

document.body.appendChild(backButton);