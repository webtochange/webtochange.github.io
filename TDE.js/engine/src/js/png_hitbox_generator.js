const fileInput = document.getElementById('fileInput');
const colorInput = document.getElementById('colorInput');
const colorText = document.getElementById('colorText');
const output = document.getElementById('output');
const copyButton = document.getElementById('copyButton');
const fileInputButton = document.querySelector('.file-input-button span:last-child');

colorInput.addEventListener('input', function() {
    colorText.value = this.value;
    processCurrentImage();
});

colorText.addEventListener('input', function() {
    const color = this.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        colorInput.value = color;
        processCurrentImage();
    }
});

let currentImageData = null;

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    fileInputButton.textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            currentImageData = {
                data: ctx.getImageData(0, 0, img.width, img.height),
                width: img.width,
                height: img.height
            };

            processCurrentImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function processCurrentImage() {
    if (!currentImageData) return;

    const { data, width, height } = currentImageData;
    const imageData = data.data;
    const targetColor = hexToRgb(colorInput.value);
    const hitboxArray = [];

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = imageData[index];
            const g = imageData[index + 1];
            const b = imageData[index + 2];
            const a = imageData[index + 3];

            if (a === 0) {
                row.push(0);
            } 
            else if (r === targetColor.r && g === targetColor.g && b === targetColor.b) {
                row.push(1);
            } 
            else {
                row.push(0);
            }
        }
        hitboxArray.push(row);
    }

    const formattedOutput = hitboxArray.map(row => '\t\t' + JSON.stringify(row)).join(',\n');
    const jsonOutput = `{\n\t"tiles": [\n${formattedOutput}\n\t]\n}`;
    
    output.textContent = jsonOutput;
    copyButton.classList.add('visible');
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

copyButton.addEventListener('click', function() {
    const text = output.textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(function() {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(function() {
            copyButton.textContent = originalText;
            copyButton.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy text: ', err);
        
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(function() {
            copyButton.textContent = originalText;
            copyButton.classList.remove('copied');
        }, 2000);
    });
});