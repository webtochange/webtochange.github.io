import { MAPS_BASE_URL, PROPS_BASE_URL, ACTORS_BASE_URL, DIALOGS_BASE_URL, ITEMS_URL } from './config.js';

// ! - Global variables -
let map = [];
let props = [];
let actors = [];
let actorEffectsByMap = {};
let actorStatesByMap = {};
let player = { 
    mapId: 1,
    position: {x: 1035, y: 650},
    screenX: 0, 
    screenY: 0, 
    dx: 0, 
    dy: 0, 
    speed: 4, 
    width: 21 * 2.5, 
    height: 29 * 2.5,
    animations: {
        idle:{
            "speed": 0.2,
            "frames": [
                "./assets/images/player/idle/0.png",
                "./assets/images/player/idle/1.png",
                "./assets/images/player/idle/2.png",
                "./assets/images/player/idle/1.png"
            ]
        },
        walkUp:{
            "speed": .1,
            "frames": [
                "./assets/images/player/walkUp/0.png",
            ]
        },
        walkDown:{
            "speed": .1,
            "frames": [
                "./assets/images/player/walkDown/0.png",
            ]
        },
        walkLeft:{
            "speed": .1,
            "frames": [
                "./assets/images/player/walkLeft/0.png",
            ]
        },
        walkRight:{
            "speed": .1,
            "frames": [
                "./assets/images/player/walkRight/0.png",
            ]
        }
    }
};
let lastInteractedActor = null;
let canvas, ctx;
let mapImage;
let offsetX = 0;
let offsetY = 0;
let mapWidth = 0;
let mapHeight = 0;
let currentDialog = null;
let isDialogActive = false; 
let isMobile = false;
let showControls = false; 
let upButton, downButton, leftButton, rightButton, interactButton;
let isMovingUp = false;
let isMovingDown = false;
let isMovingLeft = false;
let isMovingRight = false;
let items = []; 

const startTime = performance.now();

// ! - MOBILE -
function checkIfMobile() {
    if (window.innerWidth <= 1000) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    if (isMobile) {
        showControls = true;
        createMobileControls();
    } else {
        showControls = false;
        removeMobileControls();
    }
}

function createArrowButton(direction, x, y) {
    const button = document.createElement('button');
    const arrowIcon = document.createElement('img');

    arrowIcon.src = `src/img/arrow_${direction}.png`;

    arrowIcon.style.width = '80px';
    arrowIcon.style.height = '80px';

    arrowIcon.style.imageRendering = 'pixelated';
    arrowIcon.style.imageRendering = 'crisp-edges';

    button.appendChild(arrowIcon);

    button.style.position = 'absolute';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.background = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    button.addEventListener('contextmenu', (e) => e.preventDefault());

    return button;
}

function createInteractButton(x, y) {
    const button = document.createElement('button');
    const interactionIcon = document.createElement('img');

    interactionIcon.src = 'src/img/hand_open.png';
    
    interactionIcon.style.width = '90px';
    interactionIcon.style.height = '90px';

    interactionIcon.style.imageRendering = 'pixelated';
    interactionIcon.style.imageRendering = 'crisp-edges';

    button.appendChild(interactionIcon);

    button.style.position = 'absolute';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.background = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    button.addEventListener('click', () => executeInteraction());

    button.addEventListener('contextmenu', (e) => e.preventDefault());

    return button;
}


function createMobileControls() {
    upButton = createArrowButton('up', 80, window.innerHeight - 220);
    downButton = createArrowButton('down', 80, window.innerHeight - 80);
    leftButton = createArrowButton('left', 10, window.innerHeight - 150);
    rightButton = createArrowButton('right', 150, window.innerHeight - 150);

    interactButton = createInteractButton(window.innerWidth - 120, window.innerHeight - 150);

    document.body.appendChild(upButton);
    document.body.appendChild(downButton);
    document.body.appendChild(leftButton);
    document.body.appendChild(rightButton);
    document.body.appendChild(interactButton);

    upButton.addEventListener('pointerdown', () => handleTouchStart('up'));
    downButton.addEventListener('pointerdown', () => handleTouchStart('down'));
    leftButton.addEventListener('pointerdown', () => handleTouchStart('left'));
    rightButton.addEventListener('pointerdown', () => handleTouchStart('right'));

    upButton.addEventListener('pointerup', () => handleTouchEnd('up'));
    downButton.addEventListener('pointerup', () => handleTouchEnd('down'));
    leftButton.addEventListener('pointerup', () => handleTouchEnd('left'));
    rightButton.addEventListener('pointerup', () => handleTouchEnd('right'));
}

function handleMovement(direction) {
    switch (direction) {
        case 'up':
            player.dy = isMovingUp ? -player.speed : 0;
            break;
        case 'down':
            player.dy = isMovingDown ? player.speed : 0;
            break;
        case 'left':
            player.dx = isMovingLeft ? -player.speed : 0;
            break;
        case 'right':
            player.dx = isMovingRight ? player.speed : 0;
            break;
    }
}

function handleTouchStart(direction) {
    switch (direction) {
        case 'up':
            isMovingUp = true;
            break;
        case 'down':
            isMovingDown = true;
            break;
        case 'left':
            isMovingLeft = true;
            break;
        case 'right':
            isMovingRight = true;
            break;
    }
    handleMovement(direction);
}

function handleTouchEnd(direction) {
    switch (direction) {
        case 'up':
            isMovingUp = false;
            break;
        case 'down':
            isMovingDown = false;
            break;
        case 'left':
            isMovingLeft = false;
            break;
        case 'right':
            isMovingRight = false;
            break;
    }
    handleMovement(direction);
}

function executeInteraction() {
    if (currentDialog) return;

    for (const actor of actors) {
        const distanceX = Math.abs(player.position.x - actor.position.x);
        const distanceY = Math.abs(player.position.y - actor.position.y);

        if (distanceX <= player.width *3 && distanceY <= player.height *3) {
            executeActorInteraction(actor);
            break;
        }
    }
}

function removeMobileControls() {
    if (upButton) upButton.remove();
    if (downButton) downButton.remove();
    if (leftButton) leftButton.remove();
    if (rightButton) rightButton.remove();
    if (interactButton) interactButton.remove();
}

//! - GAME -
async function init() {
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    document.body.appendChild(canvas);
    resizeCanvas();

    createItemUI();

    await loadMap();

    centerCameraOnPlayer();

    setupEventListeners();
    gameLoop();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function centerCameraOnPlayer() {
    offsetX = player.screenX - canvas.width / 2 + player.width / 2;
    offsetY = player.screenY - canvas.height / 2 + player.height / 2;
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

async function loadMap() {
    try {
        const response = await fetch(`../${MAPS_BASE_URL}${player.mapId}.json`);
        map = await response.json();

        mapWidth = map.tiles[0].length * map.tileSize;
        mapHeight = map.tiles.length * map.tileSize;

        player.screenX = player.position.x;
        player.screenY = player.position.y;

        await loadActors();
        await loadProps();
    } catch (err) {
        console.error('Error loading map:', err);
    }
}

async function loadProps() {
    props = [];
    try {
        const response = await fetch(`../${PROPS_BASE_URL}${player.mapId}.json`);
        props = await response.json();
    } catch (err) {
        console.log('No props found for this map');
    }
}

async function loadActors() {
    actors = [];

    for (const id of map.actors) {
        try {
            const response = await fetch(`../${ACTORS_BASE_URL}${id}.json`);
            const actor = await response.json();

            if (actorEffectsByMap[player.mapId] && actorEffectsByMap[player.mapId][actor.id]) {
                actor.effect = actorEffectsByMap[player.mapId][actor.id];
            }
            if (actorStatesByMap[player.mapId] && actorStatesByMap[player.mapId][actor.id]) {
                actor.state = actorStatesByMap[player.mapId][actor.id];
            }

            actors.push(actor);
        } catch (err) {
            console.error(`Error loading Actor ${id}:`, err);
        }
    }
}

async function loadDialog(id) {
    try {
        const response = await fetch(`../${DIALOGS_BASE_URL}${id}.json`);
        const dialog = await response.json();
        handleDialog(dialog);
    } catch (err) {
        console.error(`Error loading dialog ${id}:`, err);
    }
}

function handleDialog(dialog) {
    if (currentDialog) {
        document.body.removeChild(currentDialog);
    }

    isDialogActive = true;

    const dialogContainer = document.createElement('div');
    dialogContainer.style.position = 'absolute';
    dialogContainer.style.top = '10px';
    dialogContainer.style.left = '50%';
    dialogContainer.style.transform = 'translateX(-50%)';
    dialogContainer.style.width = '80%';
    dialogContainer.style.maxWidth = '1000px';
    dialogContainer.style.padding = '20px';
    dialogContainer.style.fontSize = "18px";
    dialogContainer.style.backgroundColor = '#1e1e1e';
    dialogContainer.style.border = '2px solid ' + (lastInteractedActor?.color || "#555");
    dialogContainer.style.borderRadius = '15px';
    dialogContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    dialogContainer.style.zIndex = '1000';
    dialogContainer.style.fontFamily = '"Silkscreen", sans-serif';
    dialogContainer.style.color = '#f0f0f0';

    const actorName = lastInteractedActor ? lastInteractedActor.name : "Actor";

    const actorNameElement = document.createElement('h3');
    actorNameElement.textContent = actorName;
    actorNameElement.style.margin = '0 0 10px 0';
    actorNameElement.style.fontSize = '22px';
    actorNameElement.style.color = lastInteractedActor?.color || '#555';
    dialogContainer.appendChild(actorNameElement);

    const dialogText = document.createElement('p');
    dialogText.style.marginBottom = '15px';
    dialogText.style.lineHeight = '1.4';
    dialogContainer.appendChild(dialogText);

    const responseContainer = document.createElement('div');
    responseContainer.style.marginTop = '10px';
    responseContainer.style.display = 'flex';
    responseContainer.style.flexWrap = 'wrap';
    responseContainer.style.gap = '10px';

    dialog.responses.forEach((response) => {
        if(handleRequirement(response.requirement) !== false) {     
            const responseButton = document.createElement('button');
            responseButton.textContent = response.text;
            responseButton.style.padding = '10px 20px';
            responseButton.style.fontSize = "16px";
            responseButton.style.border = '1px solid #d3d3d3';
            responseButton.style.borderRadius = '8px';
            responseButton.style.backgroundColor = 'transparent';
            responseButton.style.color = '#d3d3d3';
            responseButton.style.cursor = 'pointer';
            responseButton.style.transition = 'all 0.3s ease';
            responseButton.style.display = "none";
            responseButton.style.fontWeight = 'bold';
            responseButton.classList.add('dialog-response-button');

            responseButton.addEventListener('mouseenter', () => {
                responseButton.style.backgroundColor = '#d3d3d3';
                responseButton.style.color = '#1e1e1e';
            });

            responseButton.addEventListener('mouseleave', () => {
                responseButton.style.backgroundColor = 'transparent';
                responseButton.style.color = '#d3d3d3';
            });
    
            responseButton.addEventListener('click', () => {
                handleEffect(response.effect);
    
                document.body.removeChild(dialogContainer);
                currentDialog = null;
                isDialogActive = false;
            });
    
            responseContainer.appendChild(responseButton);
        }
    });

    dialogContainer.appendChild(responseContainer);
    document.body.appendChild(dialogContainer);

    let i = 0;
    function typeWriter() {
        if (i < dialog.text.length) {
            dialogText.textContent += dialog.text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            responseContainer.querySelectorAll('button').forEach(button => {
                setTimeout(() => {
                    button.style.display = "inline-block";
                }, 500);
            });
        }
    }

    typeWriter();

    currentDialog = dialogContainer;
}

let handleEffectTimeout = false;
function handleEffect(effect) {
    if (!effect){
        return;
    }
    if(!handleEffectTimeout) {
        handleEffectTimeout = true;
        effect.forEach(e => {
            if (e.execute === 'dialog') {
                loadDialog(e.id);
            } else if (e.execute === 'item') {
                addItemById(e.id);
            } else if (e.execute === 'removeItem') {
                removeItemById(e.id);
            } else if (e.execute === 'changeActorEffect') {
                changeActorEffect(e.id, e.effect);
            } else if (e.execute === 'ending') {
                playEnding(e.id);
            } else if (e.execute === 'interact') {
                startInteractiveIFrame(e.id, e.done, e.failed);
            } else if (e.execute === 'changeMap') {
                player.mapId = e.id;
                player.position.x = e.x;
                player.position.y = e.y;
                loadMap().then(() => {
                    centerCameraOnPlayer();
                });
            } else if (e.execute === 'state') {
                changeActorState(e.id, e.state);
            }
        });
        setTimeout(() => {
            handleEffectTimeout = false;
        }, 1500);
    }
}

function handleRequirement(requirement) {
    let isFulfilled = true;

    if (!requirement){
        return;
    }
    requirement.forEach(e => {
        if (e.execute === 'hasItem') {
            if(!checkItemById(e.id)){
                isFulfilled = false;
            }
        }
    });
    return isFulfilled;
}

function drawMap() {
    if(!mapImage || mapImage.src !== map.image) {
        mapImage = new Image();
        mapImage.src = `../${map.image}`;
    }
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(mapImage, -offsetX, -offsetY, mapWidth, mapHeight);
}

function drawEntities() {
    const entities = [...actors, player, ...props];
    
    entities.sort((a, b) => (a.position.y + a.height) - (b.position.y + b.height));

    for (const entity of entities) {
        if (entity.state && entity.state === 'hidden') {
            continue;
        }

        const screenX = entity.screenX ? entity.screenX - offsetX : entity.position.x - offsetX;
        const screenY = entity.screenY ? entity.screenY - offsetY : entity.position.y - offsetY;

        if(entity.animations){
            let elapsedTime = (performance.now() - startTime) / 1000;
            let speed;
            let frames;

            if(entity === player){
                if(isDialogActive) {
                    speed = entity.animations.idle.speed;
                    frames = entity.animations.idle.frames;
                } else if(player.dx === 0 && player.dy === 0) {
                    speed = entity.animations.idle.speed;
                    frames = entity.animations.idle.frames;
                } else if (player.dx < 0) {
                    // LEFT
                    speed = entity.animations.walkLeft.speed;
                    frames = entity.animations.walkLeft.frames;
                } else if (player.dx > 0) {
                    // RIGHT
                    speed = entity.animations.walkRight.speed;
                    frames = entity.animations.walkRight.frames;
                } else if (player.dy < 0) {
                    // UP
                    speed = entity.animations.walkUp.speed;
                    frames = entity.animations.walkUp.frames;
                } else if (player.dy > 0) {
                    // DOWN
                    speed = entity.animations.walkDown.speed;
                    frames = entity.animations.walkDown.frames;
                }
            }else{
                speed = entity.animations.idle.speed;
                frames = entity.animations.idle.frames;
            }
            let howManyFrames = frames.length;
            let currentFrame = Math.floor(elapsedTime / speed) % howManyFrames;
            let frame = frames[currentFrame];
            
            

            let frameImage = new Image();
            frameImage.src = `../${frame}`;

            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(frameImage, screenX, screenY, entity.width, entity.height);
        }else if (entity.source) {
            const image = new Image();
            image.src = `../${entity.source}`;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, screenX, screenY, entity.width, entity.height);
        }

        if (entity.name) {
            ctx.font = '24px Silkscreen';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(entity.name, screenX + entity.width / 2, screenY - 8);
        }
    }
}

function checkCollision(nextX, nextY) {
    const playerLeft = nextX;
    const playerRight = nextX + player.width;
    const playerTop = nextY;
    const playerBottom = nextY + player.height;

    for (let y = 0; y < map.tiles.length; y++) {
        for (let x = 0; x < map.tiles[y].length; x++) {
            const tile = map.tiles[y][x];
            if (tile === 1) {
                const tileLeft = x * map.tileSize;
                const tileRight = tileLeft + map.tileSize;
                const tileTop = y * map.tileSize;
                const tileBottom = tileTop + map.tileSize;

                const adjustedPlayerTop = playerTop + player.height * 0.9;

                if (
                    playerRight > tileLeft &&
                    playerLeft < tileRight &&
                    playerBottom > tileTop &&
                    adjustedPlayerTop < tileBottom
                ) {
                    return false;
                }
            }
        }
    }
    return true;
}

function handlePlayerMovement() {
    if (isDialogActive) return;

    if (player.dx !== 0 || player.dy !== 0) {
        const nextX = player.screenX + player.dx;
        const nextY = player.screenY + player.dy;

        const canMoveX = player.dx === 0 || checkCollision(player.screenX + player.dx, player.screenY);
        const canMoveY = player.dy === 0 || checkCollision(player.screenX, player.screenY + player.dy);

        if (canMoveX) {
            player.screenX += player.dx;
            player.position.x = Math.floor(player.screenX);
        } else {
            player.dx = 0;
        }

        if (canMoveY) {
            player.screenY += player.dy;
            player.position.y = Math.floor(player.screenY);
        } else {
            player.dy = 0;
        }
    }

    const targetOffsetX = player.screenX - canvas.width / 2 + player.width / 2;
    const targetOffsetY = player.screenY - canvas.height / 2 + player.height / 2;

    let larpValue = 0.05;
    offsetX = lerp(offsetX, targetOffsetX, larpValue);
    offsetY = lerp(offsetY, targetOffsetY, larpValue);

    if (mapWidth <= canvas.width) {
        offsetX = -(canvas.width - mapWidth) / 2;
    } else {
        offsetX = Math.max(0, Math.min(offsetX, mapWidth - canvas.width));
    }

    if (mapHeight <= canvas.height) {
        offsetY = -(canvas.height - mapHeight) / 2;
    } else {
        offsetY = Math.max(0, Math.min(offsetY, mapHeight - canvas.height));
    };

    checkActorProximity();
}

function checkActorProximity() {
    for (const actor of actors) {
        const distanceX = Math.abs(player.position.x - actor.position.x);
        const distanceY = Math.abs(player.position.y - actor.position.y);

        if (distanceX <= player.width *3 && distanceY <= player.height *3) {
            window.addEventListener('keydown', (e) => {
                if (e.key === 'E' || e.key === 'e') {
                    executeActorInteraction(actor);
                }
            }, { once: true });
        }
    }
}

function executeActorInteraction(actor) {
    if (currentDialog) return;

    lastInteractedActor = actor;
    
    handleEffect(actor.effect);
}

function setupEventListeners() {
    const keysPressed = new Set();

    window.addEventListener('keydown', (e) => {
        keysPressed.add(e.key.toLowerCase());

        updatePlayerDirection();

        if (e.key === 'E' || e.key === 'e') {
            executeInteraction();
        }
    });

    window.addEventListener('keyup', (e) => {
        keysPressed.delete(e.key.toLowerCase());
        updatePlayerDirection();
    });

    function updatePlayerDirection() {
        if ((keysPressed.has('arrowleft') || keysPressed.has('a')) &&
            !(keysPressed.has('arrowright') || keysPressed.has('d'))) {
            player.dx = -player.speed;
        } else if ((keysPressed.has('arrowright') || keysPressed.has('d')) &&
                !(keysPressed.has('arrowleft') || keysPressed.has('a'))) {
            player.dx = player.speed;
        } else {
            player.dx = 0;
        }

        if ((keysPressed.has('arrowup') || keysPressed.has('w')) &&
            !(keysPressed.has('arrowdown') || keysPressed.has('s'))) {
            player.dy = -player.speed;
        } else if ((keysPressed.has('arrowdown') || keysPressed.has('s')) &&
                !(keysPressed.has('arrowup') || keysPressed.has('w'))) {
            player.dy = player.speed;
        } else {
            player.dy = 0;
        }
    }
}

function createItemUI() {
    const container = document.createElement('div');
    container.id = 'item-container';
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.maxHeight = '300px';
    container.style.overflowX = 'hidden';
    container.style.overflowY = 'auto';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    container.style.border = '2px solid #333';
    container.style.borderRadius = '10px';
    container.style.padding = '10px';
    container.style.paddingRight = '30px';
    container.style.zIndex = '1000';

    document.body.appendChild(container);
    renderItems();
}

function renderItems() {
    const container = document.getElementById('item-container');
    if (!container) return;

    container.innerHTML = '';

    if (!items || items.length === 0) {
        container.style.display = 'none';
        return;
    } else {
        container.style.display = 'block';
    }

    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr';
    container.style.gap = '16px';
    container.style.padding = '16px';

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.padding = '16px';
        itemDiv.style.border = '2px solid #444';
        itemDiv.style.borderRadius = '12px';
        itemDiv.style.transition = 'all 0.2s ease';
        itemDiv.style.cursor = 'pointer';
        itemDiv.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';

        itemDiv.addEventListener('mouseenter', () => {
            itemDiv.style.border = '2px solid white';
            itemDiv.style.boxShadow = '0 0 15px rgba(131, 131, 131, 0.4)';
        });

        itemDiv.addEventListener('mouseleave', () => {
            itemDiv.style.border = '2px solid #444';
            itemDiv.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
        });

        const icon = document.createElement('img');
        icon.src = `../${item.icon}`;
        icon.alt = item.name;
        icon.style.width = '48px';
        icon.style.height = '48px';
        icon.style.marginRight = '16px';
        icon.style.borderRadius = '8px';

        icon.style.imageRendering = 'pixelated';
        icon.style.imageRendering = 'crisp-edges';

        const name = document.createElement('span');
        name.textContent = item.name;
        name.style.fontSize = '18px';
        name.style.color = 'white';
        name.style.fontWeight = 'bold';
        name.style.fontFamily = '"Silkscreen", sans-serif';

        itemDiv.appendChild(icon);
        itemDiv.appendChild(name);

        itemDiv.addEventListener('click', () => handleItemInteraction(item));

        container.appendChild(itemDiv);
    });
}

async function addItemById(id) {
    try {
        const res = await fetch(`../${ITEMS_URL}${id}.json`);
        const item = await res.json();

        const exists = items.some(existingItem => existingItem.id === item.id);

        if (!exists) {
            items.push(item);
            renderItems();
        } 
    } catch (err) {
        console.error(`Failed to load item ${id}`, err);
    }
}

function removeItemById(id) {
    items = items.filter(item => item.id != id);
    renderItems();
}

function checkItemById(id) {
    return items.some(item => item.id == id);
}

function handleItemInteraction(item) {
    lastInteractedActor = {};
    lastInteractedActor.name = item.name;
    lastInteractedActor.color = item.color || "#000";
    handleEffect(item.effect);
}

function changeActorEffect(actorId, effect) {
    const actor = actors.find(n => n.id === actorId);
    if (actor) {
        actor.effect = effect;

        if (!actorEffectsByMap[player.mapId]) {
            actorEffectsByMap[player.mapId] = {};
        }
        actorEffectsByMap[player.mapId][actorId] = effect;
    }
}

function changeActorState(actorId, state) {
    const actor = actors.find(n => n.id === actorId);
    if (actor) {
        actor.state = state;

        if (!actorStatesByMap[player.mapId]) {
            actorStatesByMap[player.mapId] = {};
        }
        actorStatesByMap[player.mapId][actorId] = state;
    }
}

function playEnding(id) {
    window.location.href = `src/templates/ending.html?id=${id}`;
}

function startInteractiveIFrame(id, done, failed) {
    
    if (document.getElementById('interactive-iframe-container')) return;

    const container = document.createElement('div');
    container.id = 'interactive-iframe-container';
    container.style.position = 'fixed';
    container.style.left = '50%';
    container.style.top = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.width = '80vw';
    container.style.maxWidth = '700px';
    container.style.aspectRatio = '1 / 1';
    container.style.zIndex = '9999';

    container.style.boxShadow = '0 0 20px #d3d3d3';
    container.style.border = '4px solid #d3d3d3';
    container.style.borderRadius = '16px';
    container.style.overflow = 'hidden';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    const closeBtn = document.createElement('button');
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '5px';
    closeBtn.style.zIndex = '10000';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.width = '48px';
    closeBtn.style.height = '48px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '0';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';

    const closeIcon = document.createElement('img');
    closeIcon.src = 'src/img/cancel.png';
    closeIcon.alt = 'Close';
    closeIcon.style.width = '48px';
    closeIcon.style.height = '48px';
    closeIcon.style.userSelect = 'none';
    closeIcon.style.imageRendering = 'pixelated';
    closeIcon.style.imageRendering = 'crisp-edges';

    closeBtn.appendChild(closeIcon);
    closeBtn.style.color = 'transparent';
    closeBtn.style.fontSize = '0';

    closeBtn.addEventListener('click', () => {
        container.remove();
        window.removeEventListener('message', messageHandler);
    });

    const iframe = document.createElement('iframe');
    iframe.src = `src/templates/interactive.html?id=${id}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    function messageHandler(event) {
        
        if (event.data.type === 'done') {
            if (done) {
                handleEffect(done);
            }
        }else if (event.data.type === 'failed'){
            if (failed) {
                handleEffect(failed);
            }
        }
        
        if( event.data ){
            container.remove();
            window.removeEventListener('message', messageHandler);
        }
    }

    window.addEventListener('message', messageHandler);

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    document.body.appendChild(container);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawEntities();
    handlePlayerMovement();
    requestAnimationFrame(gameLoop);
}

init();

// ! - SAVE/LOAD GAME -
function saveGameToCookie() {
    const gameState = {
        player: {
            mapId: player.mapId,
            position: player.position
        },
        actorEffectsByMap,
        actorStatesByMap,
        items
    };

    const jsonString = JSON.stringify(gameState);
    document.cookie = `gameSave=${encodeURIComponent(jsonString)}; path=/; max-age=31536000`;

    showSaveAlert();
    changeLoadMode();
}

function loadGameFromCookie() {
    const cookies = document.cookie.split("; ").reduce((acc, cookieStr) => {
        const [name, value] = cookieStr.split("=");
        acc[name] = decodeURIComponent(value);
        return acc;
    }, {});

    if (cookies.gameSave) {
        try {
            const gameState = JSON.parse(cookies.gameSave);

            if (gameState.player) {
                player.mapId = gameState.player.mapId ?? player.mapId;
                player.position = gameState.player.position ?? player.position;
            }

            actorEffectsByMap = gameState.actorEffectsByMap || {};
            actorStatesByMap = gameState.actorStatesByMap || {};
            items = gameState.items || [];

            renderItems();

            loadMap().then(() => {
                centerCameraOnPlayer();
            });
        } catch (e) {
            console.error("Błąd przy odczycie zapisu gry:", e);
        }
    }
}

function showSaveAlert() {
    const text = document.createElement('div');
    text.textContent = 'saved';
    text.style.position = 'fixed';
    text.style.bottom = '20px';
    text.style.right = '20px';
    text.style.color = 'white';
    text.style.fontFamily = '"Silkscreen", sans-serif';
    text.style.fontSize = '34px';
    text.style.textShadow = '1px 1px 2px black';
    text.style.zIndex = '10000';
    text.style.pointerEvents = 'none';
    
    document.body.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 2000);
}

function addSaveButton() {
    const saveButton = document.createElement('button');
    saveButton.style.position = 'fixed';
    saveButton.style.top = '10px';
    saveButton.style.left = '10px';
    saveButton.style.zIndex = '9999';
    saveButton.textContent = 'save';
    saveButton.style.padding = '10px 20px';
    saveButton.style.fontSize = '16px';
    saveButton.style.border = '1px solid #d3d3d3';
    saveButton.style.borderRadius = '8px';
    saveButton.style.backgroundColor = 'transparent';
    saveButton.style.color = '#d3d3d3';
    saveButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
    saveButton.style.cursor = 'pointer';
    saveButton.style.transition = 'all 0.3s ease';
    saveButton.style.fontWeight = 'bold';
    saveButton.style.marginRight = '10px';
    saveButton.addEventListener('mouseenter', () => {
        saveButton.style.backgroundColor = '#d3d3d3';
        saveButton.style.color = '#1e1e1e';
    });
    saveButton.addEventListener('mouseleave', () => {
        saveButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
        saveButton.style.color = '#d3d3d3';
    });
    saveButton.onclick = saveGameToCookie;

    document.body.appendChild(saveButton);
}

function changeLoadMode() {
    document.cookie = "mode=load; path=/; max-age=31536000";
}

window.addEventListener('DOMContentLoaded', () => {
    addSaveButton();

    const cookies = document.cookie.split("; ").reduce((acc, cookieStr) => {
        const [name, value] = cookieStr.split("=");
        acc[name] = decodeURIComponent(value);
        return acc;
    }, {});

    if (cookies.mode === 'load') {
        loadGameFromCookie();
    }
});

setInterval(() => {
    saveGameToCookie();
}, 30000);