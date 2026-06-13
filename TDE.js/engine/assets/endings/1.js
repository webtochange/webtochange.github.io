const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap';
document.head.appendChild(fontLink);

const container = document.createElement('div');
container.style.padding = '24px';
container.style.backgroundColor = '#f9f9f9';
container.style.borderRadius = '12px';
container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
container.style.fontFamily = "'Silkscreen', monospace";
container.style.color = '#333';
container.style.maxWidth = '600px';
container.style.margin = '40px auto';
container.style.lineHeight = '1.6';

container.innerHTML = `
  <h2 style="margin-top: 0; color: #c48f00;">Long Live the Chicken King!</h2>
  <p>
    You gave a confident nod. The chicken flapped excitedly, spiraling into the air with a victorious “COO COO!”
  </p>
  <p>
    Feathers swirled. A golden crown (slightly egg-shaped) descended from above, landing perfectly on your head.
  </p>
  <p>
    Chickens from every corner of the land emerged — warriors, sages, farmers — bowing before you in unity.
  </p>
  <p style="font-style: italic; color: #775b00;">
    “All hail the Chicken King,” they clucked in unison. “Protector of the Coop. Herald of the Corn.”
  </p>
  <p>
    And just like that, your destiny was sealed... not in steel, but in feathers.
  </p>
`;

document.body.appendChild(container);