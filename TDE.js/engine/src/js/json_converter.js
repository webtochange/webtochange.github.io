function convertJSON() {
    const startTime = performance.now();
    const inputText = document.getElementById('inputJSON').value.trim();
    const tileSize = parseInt(document.getElementById('tileSize').value);
    const inputMessage = document.getElementById('inputMessage');
    const outputMessage = document.getElementById('outputMessage');
    const outputTextarea = document.getElementById('outputJSON');
    
    inputMessage.innerHTML = '';
    outputMessage.innerHTML = '';

    if (!inputText) {
        inputMessage.innerHTML = '<div class="error">Please paste JSON to convert!</div>';
        return;
    }

    if (!tileSize || tileSize <= 0) {
        inputMessage.innerHTML = '<div class="error">Tile size must be a number greater than 0!</div>';
        return;
    }

    try {
        const inputData = JSON.parse(inputText);
        
        if (!Array.isArray(inputData)) {
            throw new Error('JSON must be an array of objects');
        }

        const convertedData = inputData.map(item => {
            if (!item.position || typeof item.position.x !== 'number' || typeof item.position.y !== 'number') {
                throw new Error(`Object with ID "${item.id || 'unknown'}" does not have a valid position`);
            }
            
            if (typeof item.width !== 'number' || typeof item.height !== 'number') {
                throw new Error(`Object with ID "${item.id || 'unknown'}" does not have valid dimensions`);
            }

            return {
                ...item,
                position: {
                    x: Math.round(item.position.x * tileSize),
                    y: Math.round(item.position.y * tileSize)
                },
                width: Math.round(item.width * tileSize),
                height: Math.round(item.height * tileSize)
            };
        });

        const outputJSON = JSON.stringify(convertedData, null, 2);
        outputTextarea.value = outputJSON;
        
        const endTime = performance.now();
        const conversionTime = Math.round(endTime - startTime);
        
        document.getElementById('objectCount').textContent = convertedData.length;
        document.getElementById('tileValue').textContent = tileSize;
        document.getElementById('conversionTime').textContent = conversionTime + 'ms';
        document.getElementById('stats').style.display = 'flex';
        
        outputMessage.innerHTML = '<div class="success">✅ JSON successfully converted!</div>';
        inputMessage.innerHTML = '<div class="success">✅ JSON is valid</div>';

    } catch (error) {
        inputMessage.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
        outputTextarea.value = '';
        document.getElementById('stats').style.display = 'none';
    }
}

function copyToClipboard() {
    const outputTextarea = document.getElementById('outputJSON');
    const outputMessage = document.getElementById('outputMessage');
    
    if (!outputTextarea.value.trim()) {
        outputMessage.innerHTML = '<div class="error">No data to copy!</div>';
        return;
    }

    outputTextarea.select();
    outputTextarea.setSelectionRange(0, 99999);

    try {
        document.execCommand('copy');
        outputMessage.innerHTML = '<div class="success">✅ JSON copied to clipboard!</div>';

        setTimeout(() => {
            outputMessage.innerHTML = '';
        }, 3000);
    } catch (err) {
        outputMessage.innerHTML = '<div class="error">❌ Failed to copy to clipboard</div>';
    }
}

document.getElementById('tileSize').addEventListener('input', function() {
    const inputText = document.getElementById('inputJSON').value.trim();
    if (inputText) {
        convertJSON();
    }
});

let debounceTimer;
document.getElementById('inputJSON').addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const inputText = this.value.trim();
        if (inputText) {
            convertJSON();
        }
    }, 1000);
});

window.addEventListener('load', function() {
    convertJSON();
});
