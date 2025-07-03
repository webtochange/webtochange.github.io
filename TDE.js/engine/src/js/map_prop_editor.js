const mapInput = document.getElementById('mapInput');
const addPropInput = document.getElementById('addPropInput');
const mapCanvas = document.getElementById('mapCanvas');
const ctx = mapCanvas.getContext('2d');
const exportButton = document.getElementById('exportButton');
const downloadMapButton = document.getElementById('downloadMapButton');
const deselectPropButton = document.getElementById('deselectPropButton');
const resetIdButton = document.getElementById('resetIdButton');
const copyJsonButton = document.getElementById('copyJsonButton');
const jsonOutput = document.getElementById('jsonOutput');
const propList = document.getElementById('propList');
const mapStatus = document.getElementById('mapStatus');
const propCount = document.getElementById('propCount');
const propCountBadge = document.getElementById('propCountBadge');

let mapImage = new Image();
let props = [];
let propIdCounter = 1;
let highlightedProp = null;
let canvasSizeWidth = 800;
let canvasSizeHeight = 600;
let canvasZoom = 1;

ctx.imageSmoothingEnabled = false;

mapInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (mapImage.src && mapImage.src !== '' && file) {
        const proceed = confirm('Are you sure you want to replace the current map image? This action cannot be undone.');
        if (!proceed) {
            e.target.value = '';
            return;
        }
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            mapImage.onload = function() {
                mapCanvas.width = mapImage.width;
                mapCanvas.height = mapImage.height;
                canvasSizeWidth = mapImage.width;
                canvasSizeHeight = mapImage.height;
                
                updateCanvasDisplaySize();
                
                ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
                ctx.drawImage(mapImage, 0, 0, mapCanvas.width, mapCanvas.height);
                
                mapStatus.textContent = `Map loaded: ${mapImage.width}x${mapImage.height}px`;
            };
            mapImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

addPropInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const propImage = new Image();
        const propName = file.name.replace(/\.[^/.]+$/, '');
        const prop = {
            id: `${propIdCounter++}`,
            source: `./assets/images/props/${propName}.png`,
            x: 50,
            y: 50,
            img: propImage,
            width: 0,
            height: 0
        };

        propImage.onload = function() {
            prop.width = propImage.width;
            prop.height = propImage.height;
            props.push(prop);
            drawProps();
            updatePropList();
            updatePropCount();
        };

        const reader = new FileReader();
        reader.onload = function(event) {
            propImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function drawProps() {
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.drawImage(mapImage, 0, 0, mapCanvas.width, mapCanvas.height);
    
    props.forEach(prop => {
        ctx.drawImage(prop.img, prop.x, prop.y, prop.width, prop.height);
        
        if (prop === highlightedProp) {
            ctx.strokeStyle = '#e53e3e';
            ctx.lineWidth = 3;
            ctx.strokeRect(prop.x - 2, prop.y - 2, prop.width + 4, prop.height + 4);

            const cornerSize = 8;
            ctx.fillStyle = '#e53e3e';
            ctx.fillRect(prop.x - cornerSize/2, prop.y - cornerSize/2, cornerSize, cornerSize);
            ctx.fillRect(prop.x + prop.width - cornerSize/2, prop.y - cornerSize/2, cornerSize, cornerSize);
            ctx.fillRect(prop.x - cornerSize/2, prop.y + prop.height - cornerSize/2, cornerSize, cornerSize);
            ctx.fillRect(prop.x + prop.width - cornerSize/2, prop.y + prop.height - cornerSize/2, cornerSize, cornerSize);
        }
    });
}

function updateCanvasDisplaySize() {
    const newWidth = canvasSizeWidth * canvasZoom;
    const newHeight = canvasSizeHeight * canvasZoom;
    mapCanvas.style.width = newWidth + 'px';
    mapCanvas.style.height = newHeight + 'px';
}

function updatePropList() {
    if (props.length === 0) {
        propList.innerHTML = `
            <div class="empty-state">
                <h3>No props added yet</h3>
                <p>Upload a prop file to get started</p>
            </div>
        `;
        return;
    }

    propList.innerHTML = '';
    props.forEach(prop => {
        const propItem = document.createElement('div');
        propItem.classList.add('prop-item');
        if (prop === highlightedProp) {
            propItem.classList.add('highlighted');
        }

        const propInfo = document.createElement('div');
        propInfo.classList.add('prop-info');
        propInfo.textContent = `${prop.source.split('/').pop()} (ID: ${prop.id})`;

        const propControls = document.createElement('div');
        propControls.classList.add('prop-controls');

        ['x', 'y', 'width', 'height'].forEach(key => {
            const controlGroup = document.createElement('div');
            controlGroup.classList.add('control-group');

            const label = document.createElement('label');
            label.textContent = key.toUpperCase() + ':';

            const input = document.createElement('input');
            input.type = 'number';
            input.value = Math.round(prop[key]);
            input.classList.add('control-input');
            input.addEventListener('change', () => {
                prop[key] = parseFloat(input.value) || 0;
                drawProps();
            });

            controlGroup.appendChild(label);
            controlGroup.appendChild(input);
            propControls.appendChild(controlGroup);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-btn');
        removeButton.textContent = 'Remove';
        removeButton.onclick = (e) => {
            if(confirm(`Are you sure you want to remove prop ${prop.source.split('/').pop()}?`)) {
                e.stopPropagation();
                removeProp(prop.id);
            } else {
                return;
            }
        };

        propItem.appendChild(propInfo);
        propItem.appendChild(propControls);
        propItem.appendChild(removeButton);

        propItem.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                highlightSelectedProp(prop);
            }
        });

        propList.appendChild(propItem);
    });
}

function updatePropCount() {
    const count = props.length;
    propCount.textContent = `${count} prop${count !== 1 ? 's' : ''}`;
    propCountBadge.textContent = count;
}

function removeProp(propId) {
    props = props.filter(prop => prop.id !== propId);
    if (highlightedProp && highlightedProp.id === propId) {
        highlightedProp = null;
    }
    drawProps();
    updatePropList();
    updatePropCount();
}

function highlightSelectedProp(prop) {
    highlightedProp = prop;
    drawProps();
    updatePropList();
}

let isDragging = false;
let dragOffset = { x: 0, y: 0 };

mapCanvas.addEventListener('mousedown', (e) => {
    const { x: mouseX, y: mouseY } = getMousePosWithZoom(e);

    for (let i = props.length - 1; i >= 0; i--) {
        const prop = props[i];
        if (mouseX >= prop.x && mouseX <= prop.x + prop.width &&
            mouseY >= prop.y && mouseY <= prop.y + prop.height) {
            
            highlightedProp = prop;
            isDragging = true;
            dragOffset.x = mouseX - prop.x;
            dragOffset.y = mouseY - prop.y;
            drawProps();
            updatePropList();
            break;
        }
    }
});

mapCanvas.addEventListener('mousemove', (e) => {
    if (isDragging && highlightedProp) {
        const { x: mouseX, y: mouseY } = getMousePosWithZoom(e);
        highlightedProp.x = mouseX - dragOffset.x;
        highlightedProp.y = mouseY - dragOffset.y;
        
        highlightedProp.x = Math.max(0, Math.min(highlightedProp.x, mapCanvas.width - highlightedProp.width));
        highlightedProp.y = Math.max(0, Math.min(highlightedProp.y, mapCanvas.height - highlightedProp.height));
        
        drawProps();
        updatePropList();
    }
});

mapCanvas.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('keydown', (e) => {
    if (highlightedProp && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const moveAmount = e.shiftKey ? 10 : 1;

        switch (e.key) {
            case 'ArrowUp':
                highlightedProp.y = Math.max(0, highlightedProp.y - moveAmount);
                break;
            case 'ArrowDown':
                highlightedProp.y = Math.min(mapCanvas.height - highlightedProp.height, highlightedProp.y + moveAmount);
                break;
            case 'ArrowLeft':
                highlightedProp.x = Math.max(0, highlightedProp.x - moveAmount);
                break;
            case 'ArrowRight':
                highlightedProp.x = Math.min(mapCanvas.width - highlightedProp.width, highlightedProp.x + moveAmount);
                break;
        }

        drawProps();
        updatePropList();
    }
});

const zoomButtons = [
    { id: 'zoomCanvasMinusMinus', value: -1 },
    { id: 'zoomCanvasMinus', value: -0.1 },
    { id: 'zoomCanvasPlus', value: 0.1 },
    { id: 'zoomCanvasPlusPlus', value: 1 }
];

zoomButtons.forEach(({ id, value }) => {
    document.getElementById(id).addEventListener('click', () => {
        canvasZoom = Math.max(0.1, Math.min(5, canvasZoom + value));
        document.getElementById('zoomValue').textContent = canvasZoom.toFixed(1);
        updateCanvasDisplaySize();
        drawProps();
    });
});

function getMousePosWithZoom(event) {
    const rect = mapCanvas.getBoundingClientRect();
    const scaleX = mapCanvas.width / rect.width;
    const scaleY = mapCanvas.height / rect.height;
    
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

exportButton.addEventListener('click', () => {
    const json = props.map(prop => ({
        id: prop.id,
        source: prop.source,
        position: {
            x: Math.round(prop.x),
            y: Math.round(prop.y)
        },
        width: Math.round(prop.width),
        height: Math.round(prop.height)
    }));
    jsonOutput.textContent = JSON.stringify(json, null, 2);
});

copyJsonButton.addEventListener('click', () => {
    if (jsonOutput.textContent) {
        navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
            const originalText = copyJsonButton.textContent;
            copyJsonButton.textContent = '✅ Copied!';
            setTimeout(() => {
                copyJsonButton.textContent = originalText;
            }, 2000);
        });
    }
});

downloadMapButton.addEventListener('click', () => {
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = mapCanvas.width;
    offscreenCanvas.height = mapCanvas.height;
    offscreenCtx.imageSmoothingEnabled = false;
    
    offscreenCtx.drawImage(mapImage, 0, 0, mapCanvas.width, mapCanvas.height);
    
    props.forEach(prop => {
        offscreenCtx.drawImage(prop.img, prop.x, prop.y, prop.width, prop.height);
    });

    const dataUrl = offscreenCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'map_with_props.png';
    link.click();
});

deselectPropButton.addEventListener('click', () => {
    highlightedProp = null;
    drawProps();
    updatePropList();
});

resetIdButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all prop IDs? This action cannot be undone.')) {
        propIdCounter = 1;
        props.forEach((prop, index) => {
            prop.id = `${index + 1}`;
        });
        updatePropList();
        drawProps();
    }
});

updatePropCount();