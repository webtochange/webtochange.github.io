import { MAPS_BASE_URL, PROPS_BASE_URL, ACTORS_BASE_URL, DIALOGS_BASE_URL, ITEMS_URL, ENDINGS_URL, INTERACTIVES_URL } from '../../game/src/js/config.js';

const CONFIG = {
    MAPS_BASE_URL: `../${MAPS_BASE_URL}`,
    PROPS_BASE_URL: `../${PROPS_BASE_URL}`,
    ACTORS_BASE_URL: `../${ACTORS_BASE_URL}`,
    DIALOGS_BASE_URL: `../${DIALOGS_BASE_URL}`,
    ITEMS_URL: `../${ITEMS_URL}`,
    ENDINGS_URL: `../${ENDINGS_URL}`,
    INTERACTIVES_URL: `../${INTERACTIVES_URL}`
};

let gameData = {
    actors: [],
    dialogs: [],
    items: [],
    maps: [],
    props: [],
    endings: [],
    interactives: []
};

let actorFiles = [];
let dialogFiles = [];
let itemFiles = [];
let mapFiles = [];

async function loadDataFiles() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data.json');
        const data = await response.json();

        actorFiles = data.actorFiles || [];
        dialogFiles = data.dialogFiles || [];
        itemFiles = data.itemFiles || [];
        mapFiles = data.mapFiles || [];
    } catch (error) {
        console.error('Error loading data.json:', error);
    }
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const sectionId = tab.dataset.section;
        showSection(sectionId);
    });
});

document.querySelectorAll('.content-section').forEach(section => {
    const input = section.querySelector('.search-box');
    const sectionId = section.id;

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        const grid = document.getElementById(sectionId + 'Grid');
        const cards = grid.querySelectorAll('.card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
    });
});

async function initializeApp() {
    try {
        await loadDataFiles();
        await loadAllData();
        updateStats();
        renderAllSections();
        populateMapSelect();
        setupPropsSection();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load game data. Please check the file paths.');
    }
}

async function loadAllData() {
    const loadingPromises = [
        loadActors(),
        loadDialogs(),
        loadItems(),
        loadMaps()
    ];

    await Promise.all(loadingPromises);
}

async function loadActors() {
    try {
        const actors = [];
        
        for (const id of actorFiles) {
            try {
                const response = await fetch(`${CONFIG.ACTORS_BASE_URL}${id}.json`);
                if (response.ok) {
                    const actor = await response.json();
                    actors.push(actor);
                }
            } catch (error) {
                console.warn(`Failed to load actor ${id}:`, error);
            }
        }
        
        gameData.actors = actors;
    } catch (error) {
        console.error('Failed to load actors:', error);
    }
}

async function loadDialogs() {
    try {
        const dialogs = [];
        
        for (const id of dialogFiles) {
            try {
                const response = await fetch(`${CONFIG.DIALOGS_BASE_URL}${id}.json`);
                if (response.ok) {
                    const dialog = await response.json();
                    dialog.id = id;
                    dialogs.push(dialog);
                }
            } catch (error) {
                console.warn(`Failed to load dialog ${id}:`, error);
            }
        }
        
        gameData.dialogs = dialogs;
    } catch (error) {
        console.error('Failed to load dialogs:', error);
    }
}

async function loadItems() {
    try {
        const items = [];
        
        for (const id of itemFiles) {
            try {
                const response = await fetch(`${CONFIG.ITEMS_URL}${id}.json`);
                if (response.ok) {
                    const item = await response.json();
                    items.push(item);
                }
            } catch (error) {
                console.warn(`Failed to load item ${id}:`, error);
            }
        }
        
        gameData.items = items;
    } catch (error) {
        console.error('Failed to load items:', error);
    }
}

async function loadMaps() {
    try {
        const maps = [];
        
        for (const id of mapFiles) {
            try {
                const response = await fetch(`${CONFIG.MAPS_BASE_URL}${id}.json`);
                if (response.ok) {
                    const map = await response.json();
                    map.id = id;
                    map.name = id === 0 ? 'Home' : 'Outside';
                    maps.push(map);
                }
            } catch (error) {
                console.warn(`Failed to load map ${id}:`, error);
            }
        }
        
        gameData.maps = maps;
    } catch (error) {
        console.error('Failed to load maps:', error);
    }
}

async function loadPropsForMap(mapId) {
    try {
        let props = [];

        if (mapId === 'all') {
            for (const map of gameData.maps) {
                const fileName = `${map.id}.json`;
                const response = await fetch(`${CONFIG.PROPS_BASE_URL}${fileName}`);
                if (response.ok) {
                    const loadedProps = await response.json();
                    loadedProps.forEach(prop => prop.mapId = map.id);
                    props = props.concat(loadedProps);
                } else {
                    console.warn(`Props file not found: ${fileName}`);
                }
            }
        } else {
            const response = await fetch(`${CONFIG.PROPS_BASE_URL}${mapId}.json`);
            if (!response.ok) throw new Error('Props file not found for map ' + mapId);
            props = await response.json();
            props.forEach(prop => prop.mapId = parseInt(mapId));
        }

        gameData.props = props;
        renderProps(props);
    } catch (error) {
        console.error('Failed to load props:', error);
        const grid = document.getElementById('propsGrid');
        grid.innerHTML = `<div class="error">Error loading props: ${error.message}</div>`;
    }
}


function updateStats() {
    document.getElementById('actorsCount').textContent = gameData.actors.length;
    document.getElementById('dialogsCount').textContent = gameData.dialogs.length;
    document.getElementById('itemsCount').textContent = gameData.items.length;
    document.getElementById('mapsCount').textContent = gameData.maps.length;
}

function populateMapSelect() {
    const mapSelect = document.getElementById('mapSelect');
    mapSelect.innerHTML = '<option value="all">All Maps</option>';
    gameData.maps.forEach(map => {
        const option = document.createElement('option');
        option.value = map.id;
        option.textContent = map.name || `Map ${map.id}`;
        mapSelect.appendChild(option);
    });
}

function renderAllSections() {
    renderActors();
    renderDialogs();
    renderItems();
    renderMaps();
}

function renderActors() {
    const grid = document.getElementById('actorsGrid');
    grid.innerHTML = '';

    gameData.actors.forEach(actor => {
        const card = document.createElement('div');
        card.className = 'card clickable';
        card.onclick = () => showActorDetails(actor);

        card.style.borderColor = actor.color || '#667eea';

        const effectsHtml = actor.effect ? actor.effect.map(effect => 
            `<div class="effect-item">${effect.execute}: ${effect.id}</div>`
        ).join('') : '';

        let iconHtml = `<div class="card-icon actor-icon">👤</div>`;
        if (actor.animations && actor.animations.idle && actor.animations.idle.frames.length > 0) {
            const firstFrame = actor.animations.idle.frames[0];
            iconHtml = `<img src="../${firstFrame}" alt="${actor.name}" class="pixel-art" style="width:48px; height:auto;">`;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon">${iconHtml}</div>
                <div>
                    <div class="card-title">${actor.name || `Actor ${actor.id}`}</div>
                    <div class="card-subtitle">ID: ${actor.id}</div>
                </div>
            </div>
            <div class="card-content">
                <div class="property">
                    <span class="property-label">Position:</span>
                    <span class="property-value">${actor.position.x}, ${actor.position.y}</span>
                </div>
                <div class="property">
                    <span class="property-label">Size:</span>
                    <span class="property-value">${actor.width}x${actor.height}</span>
                </div>
                <div class="property">
                    <span class="property-label">Color:</span>
                    <span class="property-value" style="color: ${actor.color}">${actor.color || "-"}</span>
                </div>
                ${effectsHtml ? `<div class="effects-list">${effectsHtml}</div>` : ''}
            </div>
        `;

        grid.appendChild(card);
    });
}

function renderItemMini(itemId, executeType = '') {
    const item = gameData.items.find(i => i.id == itemId || i.id == itemId.toString());
    if (!item) return `<span style="color: red;">Unknown item ID: ${itemId}</span>`;

    let actionLabel = '';
    if (executeType === 'item') actionLabel = 'give';
    else if (executeType === 'removeItem') actionLabel = 'remove';

    return `
        <div class="mini-item" style="
            display: inline-flex; 
            flex-direction: column;
            align-items: center; 
            gap: 4px; 
            border: 1.5px solid ${item.color || '#ccc'}; 
            padding: 2px 6px; 
            border-radius: 4px;
            background: #fff;
            margin-right: 8px;
            font-size: 0.85em;
            user-select: none;
            min-width: 50px;
        ">
            <img src="../${item.icon}" alt="${item.name}" class="pixel-art" style="width:20px; height:20px; object-fit: contain;">
            <span>${item.name}</span>
            ${actionLabel ? `<span style="font-size: 0.75em; color: #666;">${actionLabel}</span>` : ''}
        </div>
    `;
}

async function renderEffect(effect, visitedDialogs = new Set()) {
    switch(effect.execute) {
        case 'dialog':
            return await buildDialogTree(effect.id, visitedDialogs);
        case 'changeMap':
            return `changeMap (ID: ${effect.id}), X: ${effect.x}, Y: ${effect.y}`;
        case 'interact':
            return `<a href="game/src/templates/interactive.html?id=${effect.id}" target="_blank" rel="noopener noreferrer">Interactive (ID: ${effect.id})</a>`;
        case 'ending':
            return `<a href="game/src/templates/ending.html?id=${effect.id}" target="_blank" rel="noopener noreferrer">${effect.execute} (ID: ${effect.id})</a>`;
        case 'hasItem':
            return `Requires item: ${renderItemMini(effect.id, 'require')}`;
        case 'removeItem':
            return `Remove item: ${renderItemMini(effect.id, 'remove')}`;
        case 'item':
            return `Give item: ${renderItemMini(effect.id, 'give')}`;
        case 'changeActorEffect': {
            const actorName = gameData.actors.find(a => a.id == effect.id)?.name || `Actor ${effect.id}`;
            const nestedRendered = await Promise.all((effect.effect || []).map(e => renderEffect(e, visitedDialogs)));
            const nestedHtml = nestedRendered.map(n => `&nbsp;&nbsp;&nbsp;↳ ${n}`).join('<br>');
            return `changeActorEffect(${effect.id}) [${actorName}]<br>${nestedRendered}`;
        }
        default:
            return `${effect.execute} (${effect.id != null ? effect.id : 'N/A'})`;
    }
}

async function showActorDetails(actor) {
    const modal = document.getElementById('actorModal');
    const title = document.getElementById('actorModalTitle');
    const content = document.getElementById('actorModalContent');

    title.textContent = actor.name || `Actor ${actor.id}`;
    content.innerHTML = '<div class="loading">Loading actor details...</div>';
    modal.style.display = 'block';

    if (window.actorAnimationInterval) {
        clearInterval(window.actorAnimationInterval);
        window.actorAnimationInterval = null;
    }

    try {
        let detailsHtml = `
            <div class="property">
                <span class="property-label">ID:</span>
                <span class="property-value">${actor.id}</span>
            </div>
            <div class="property">
                <span class="property-label">Name:</span>
                <span class="property-value">${actor.name}</span>
            </div>
            <div class="property">
                <span class="property-label">Position:</span>
                <span class="property-value">${actor.position.x}, ${actor.position.y}</span>
            </div>
            <div class="property">
                <span class="property-label">Size:</span>
                <span class="property-value">${actor.width}x${actor.height}</span>
            </div>
            <div class="property">
                <span class="property-label">Color:</span>
                <span class="property-value" style="color: ${actor.color}">${actor.color || "-"}</span>
            </div>
            <div class="property">
                <span class="property-label">State:</span>
                <span class="property-value">${actor.state}</span>
            </div>
        `;

        if (actor.requirements && actor.requirements.length > 0) {
            detailsHtml += '<h3>Requirements:</h3><div class="requirements">';
            for (const req of actor.requirements) {
                if (['hasItem', 'removeItem', 'item'].includes(req.execute)) {
                    detailsHtml += renderItemMini(req.id);
                } else {
                    detailsHtml += `<div>Requirement: ${req.execute} (ID: ${(req.id != null) ? req.id : 'N/A'})</div>`;
                }
            }
            detailsHtml += '</div>';
        }

        if (actor.effect && actor.effect.length > 0) {
            detailsHtml += '<h3>Effects and Dialog Tree:</h3><div class="dialog-tree">';
            for (const effect of actor.effect) {
                if (effect.execute === 'dialog') {
                    const dialogTree = await buildDialogTree(effect.id);
                    detailsHtml += dialogTree;
                } else {
                    detailsHtml += `<div class="effect-item">Effect: ${await renderEffect(effect)}<br>`;
                }
            }
            detailsHtml += '</div>';
        }

        if (actor.animations) {
            detailsHtml += '<h3>Animations:</h3>';

            Object.entries(actor.animations).forEach(([animName, anim]) => {
                detailsHtml += `
                    <div class="animation-block">
                        <strong>${animName}:</strong> Speed: ${anim.speed}s, 
                        Frames: ${anim.frames.length}
                        <div class="animation-preview" style="display:flex; gap:6px; margin:6px 0;">
                            ${anim.frames.map(src => `<img src="../${src}" class="pixel-art" style="width:48px; height:auto;">`).join('')}
                        </div>
                        <div class="animation-playing">
                            <img id="animatedFrame_${animName}" src="../${anim.frames[0]}" class="pixel-art" style="width:96px; height:auto;">
                        </div>
                    </div>
                `;

                let frameIndex = 0;
                const frameImgs = anim.frames;
                const animSpeed = anim.speed * 1000;
                const imgElementId = `animatedFrame_${animName}`;

                setTimeout(() => {
                    window.actorAnimationInterval = setInterval(() => {
                        frameIndex = (frameIndex + 1) % frameImgs.length;
                        const imgEl = document.getElementById(imgElementId);
                        if (imgEl) {
                            imgEl.src = `../${frameImgs[frameIndex]}`;
                        }
                    }, animSpeed);
                }, 0);
            });
        }

        content.innerHTML = detailsHtml;
    } catch (error) {
        content.innerHTML = '<div class="loading">Error loading actor details.</div>';
        console.error('Error loading actor details:', error);
    }
}

async function buildDialogTree(dialogId, visited = new Set()) {
    if (visited.has(dialogId)) {
        return `<div class="dialog-node">⚠️ Circular reference detected for Dialog ${dialogId}</div>`;
    }
    
    visited.add(dialogId);
    
    const dialog = gameData.dialogs.find(d => d.id == dialogId);
    if (!dialog) {
        return `<div class="dialog-node">❌ Dialog ${dialogId} not found</div>`;
    }

    let html = `
        <div class="dialog-node">
            <div class="dialog-text"><strong>Dialog ${dialogId}:</strong> "${dialog.text}"</div>
    `;

    if (dialog.responses && dialog.responses.length > 0) {
        html += '<div class="dialog-responses">';
        
        for (const response of dialog.responses) {
            html += `<div class="response-item">`;
            html += `<div class="response-text">"${response.text}"</div>`;

            if (response.requirement && response.requirement.length > 0) {
                html += `<div class="response-requirements">Requirements: `;
                for (const req of response.requirement) {
                    if (['hasItem', 'removeItem', 'item'].includes(req.execute)) {
                        html += renderItemMini(req.id, req.execute);
                    } else {
                        html += `${req.execute} (${req.id}), `;
                    }
                }
                html = html.replace(/, $/, '') + '</div>';
            }

            if (response.effect && response.effect.length > 0) {
                html += `<div class="response-effects">Effects: `;
                for (const effect of response.effect) {
                    if (effect.execute === 'dialog') {
                        html += `Dialog ${effect.id}, `;
                        const nestedDialog = await buildDialogTree(effect.id, new Set(visited));
                        html += `</div>${nestedDialog}<div class="response-effects">`;
                    } else {
                        html += `${await renderEffect(effect)} <br> `;
                    }
                }
                html = html.replace(/, $/, '') + '</div>';
            }
            
            html += '</div>';
        }
        
        html += '</div>';
    }

    html += '</div>';
    return html;
}

function renderDialogs() {
    const grid = document.getElementById('dialogsGrid');
    grid.innerHTML = '';

    gameData.dialogs.forEach(dialog => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const responsesHtml = dialog.responses ? dialog.responses.map(response => 
            `<div class="effect-item">"${response.text}"</div>`
        ).join('') : '';

        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon dialog-icon">💬</div>
                <div>
                    <div class="card-title">Dialog ${dialog.id}</div>
                    <div class="card-subtitle">${dialog.responses ? dialog.responses.length : 0} responses</div>
                </div>
            </div>
            <div class="card-content">
                <div class="property">
                    <span class="property-label">Text:</span>
                    <span class="property-value">"${dialog.text.substring(0, 100)}${dialog.text.length > 100 ? '...' : ''}"</span>
                </div>
                ${responsesHtml ? `<div class="effects-list">${responsesHtml}</div>` : ''}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

async function renderItems() {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = '';

    for (const item of gameData.items) {
        let effectsHtml = '';

        if (item.effect && item.effect.length > 0) {
            effectsHtml += '<div class="effects-section"><strong>Effects:</strong>';
            for (const effect of item.effect) {
                if (effect.execute === 'dialog') {
                    const dialogTree = await buildDialogTree(effect.id);
                    effectsHtml += dialogTree;
                } else {
                    effectsHtml += `<div>Effect: ${effect.execute} (ID: ${effect.id})</div>`;
                }
            }
            effectsHtml += '</div>';
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.style.border = `2px solid ${item.color || '#ccc'}`;
        card.style.borderRadius = '8px';
        card.style.padding = '10px';
        card.style.marginBottom = '12px';
        card.style.background = '#fff';
        card.style.display = 'flex';
        card.style.gap = '12px';
        card.style.alignItems = 'center';

        card.innerHTML = `
            <div style="flex:1;">
                <div class="card-header">
                    <div class="card-icon">
                        <img src="../${item.icon}" alt="${item.name}" class="pixel-art" style="width:24px; height:24px; object-fit: contain;">    
                    </div>
                    <div>
                        <div class="card-title">${item.name || `Item ${item.id}`}</div>
                        <div class="card-subtitle">ID: ${item.id}</div>
                    </div>
                </div>
                <div class="card-content">
                    ${item.description ? `
                    <div class="property">
                        <span class="property-label">Description:</span>
                        <span class="property-value">${item.description}</span>
                    </div>` : ''}
                    ${item.type ? `
                    <div class="property">
                        <span class="property-label">Type:</span>
                        <span class="property-value">${item.type}</span>
                    </div>` : ''}
                    ${effectsHtml}
                </div>
            </div>
        `;

        grid.appendChild(card);
    }
}

function renderMaps() {
    const grid = document.getElementById('mapsGrid');
    grid.innerHTML = '';

    gameData.maps.forEach(map => {
        const card = document.createElement('div');
        card.className = 'card clickable';
        card.style.cursor = 'pointer';

        const tileCount = map.tiles ? map.tiles.flat().length : 0;

        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon map-icon">🗺️</div>
                <div>
                    <div class="card-title">${map.name || `Map ${map.id}`}</div>
                    <div class="card-subtitle">ID: ${map.id}</div>
                </div>
            </div>
            <div class="card-content">
                <div class="property">
                    <span class="property-label">Dimensions:</span>
                    <span class="property-value">${map.tiles ? map.tiles[0].length : 0} x ${map.tiles ? map.tiles.length : 0}</span>
                </div>
                <div class="property">
                    <span class="property-label">Total Tiles:</span>
                    <span class="property-value">${tileCount}</span>
                </div>
                <div class="property">
                    <span class="property-label">Tile Size:</span>
                    <span class="property-value">${map.tileSize}</span>
                </div>
            </div>
        `;

        card.onclick = () => showMapImage(map);

        grid.appendChild(card);
    });
}

function showMapImage(map) {
    const modal = document.getElementById('mapModal');
    const modalTitle = document.getElementById('mapModalTitle');
    const modalContent = document.getElementById('mapModalContent');

    modalTitle.textContent = map.name || `Map ${map.id}`;
    modalContent.innerHTML = `<img src="../${map.image}" alt="${map.name}" style="width:100%; height:auto; image-rendering: pixelated;">`;

    modal.style.display = 'block';
}

function renderProps(props) {
    const grid = document.getElementById('propsGrid');
    grid.innerHTML = '';

    props.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'card clickable';

        const imageSrc = `../${prop.source}`;

        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon prop-icon">🎲</div>
                <div>
                    <div class="card-title">${prop.name || `Prop ${prop.id}`}</div>
                    <div class="card-subtitle">Map ID: ${prop.mapId}</div>
                </div>
            </div>
            <div class="card-content">
                <div class="prop-image" style="text-align:center; margin: 10px 0;">
                    <img src="${imageSrc}" alt="Prop Image" class="pixel-art" style="width: 64px; height: auto;">
                </div>
                <div class="property">
                    <span class="property-label">Position:</span>
                    <span class="property-value">${prop.position.x}, ${prop.position.y}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function filterPropsCards(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const grid = document.getElementById('propsGrid');
    Array.from(grid.children).forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? '' : 'none';
    });
}
function setupPropsSection() {
    populateMapSelect();

    const mapSelect = document.getElementById('mapSelect');
    const searchInput = document.getElementById('propsSearch');

    loadPropsForMap('all');

    mapSelect.addEventListener('change', () => {
        loadPropsForMap(mapSelect.value);
        searchInput.value = '';
    });

    searchInput.addEventListener('input', () => {
        filterPropsCards(searchInput.value);
    });
}


function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(sectionName).classList.add('active');

    event.target.classList.add('active');
}

function filterCards(section, searchTerm) {
    const grid = document.getElementById(section + 'Grid');
    const cards = grid.querySelectorAll('.card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function closeModalActor() {
    const modal = document.getElementById('actorModal');
    modal.style.display = 'none';

    if (window.actorAnimationInterval) {
        clearInterval(window.actorAnimationInterval);
        window.actorAnimationInterval = null;
    }
}
document.getElementById('modalActorClose').addEventListener('click', closeModalActor);

function closeModalMap() {
    const modal = document.getElementById('mapModal');
    modal.style.display = 'none';

    if (window.actorAnimationInterval) {
        clearInterval(window.actorAnimationInterval);
        window.actorAnimationInterval = null;
    }
}
document.getElementById('mapModalClose').addEventListener('click', closeModalMap);

function showError(message) {
    const statsBar = document.getElementById('statsBar');
    statsBar.innerHTML = `<div style="color: #e74c3c; text-align: center; width: 100%;">${message}</div>`;
}

window.onclick = function(event) {
    const modalActor = document.getElementById('actorModal');
    const modalMap = document.getElementById('mapModal');
    if (event.target === modalActor) {
        closeModalActor();
    }
    if (event.target === modalMap) {
        closeModalMap();
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);