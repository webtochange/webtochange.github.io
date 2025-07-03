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
  <h2 style="margin-top: 0; color: #222;">The Knight Leads the Way</h2>
  <p>
    After downing the drink with a grunt of approval, the knight wiped his mouth with the back of his hand and gave you a firm nod.
  </p>
  <p>
    “A deal’s a deal,” he said, voice rough but steady. “Stay close, don’t speak unless I say, and keep your eyes forward.”
  </p>
  <p>
    With armor creaking and sword drawn, he stepped into the tangled green ahead, parting the shadows like a blade through mist.
  </p>
  <p style="font-style: italic; color: #555;">
    The cursed forest whispered around you, but somehow — with him at the front — it no longer felt unbeatable.
  </p>
`;

document.body.appendChild(container);