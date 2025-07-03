const html = `
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: #87cefa;
    }
    canvas {
      display: block;
    }
  </style>
  <canvas id="gameCanvas"></canvas>
`;

document.body.innerHTML += html;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hook = {
  x: canvas.width / 2,
  y: 0,
  width: 10,
  height: 30,
  speedY: .5
};

let fish = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 30
};

const seaweeds = [];
for (let i = 0; i < 5; i++) {
  seaweeds.push({
    x: Math.random() * (canvas.width - 50),
    y: 200 + i * 150,
    width: 300,
    height: 60
  });
}

let targetX = hook.x;

window.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
});
window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    targetX = e.touches[0].clientX;
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FF5733";
  ctx.fillRect(fish.x, fish.y, fish.width, fish.height);

  ctx.fillStyle = "green";
  for (let seaweed of seaweeds) {
    ctx.fillRect(seaweed.x, seaweed.y, seaweed.width, seaweed.height);
  }

  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(hook.x, 0);
  ctx.lineTo(hook.x, hook.y);
  ctx.stroke();
  ctx.fillStyle = "gray";
  ctx.fillRect(hook.x - hook.width / 2, hook.y, hook.width, hook.height);
  
  hook.y += hook.speedY;
  hook.x += (targetX - hook.x) * 0.1;

  for (let seaweed of seaweeds) {
    if (
      hook.x > seaweed.x &&
      hook.x < seaweed.x + seaweed.width &&
      hook.y + hook.height > seaweed.y &&
      hook.y < seaweed.y + seaweed.height
    ) {
      endGame(false);
      return;
    }
  }

  if (
    hook.x > fish.x &&
    hook.x < fish.x + fish.width &&
    hook.y + hook.height > fish.y &&
    hook.y < fish.y + fish.height
  ) {
    endGame(true);
    return;
  }

  if (hook.y > canvas.height) {
    endGame(false);
    return;
  }

  requestAnimationFrame(gameLoop);
}

function endGame(success) {
  if (success) {
    done();
  } else {
    failed();
  }
}

gameLoop();