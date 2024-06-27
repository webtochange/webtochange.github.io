const canvas = document.getElementById("paint");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let x = 0;
let y = 0;
let brushColor = "#000000";
let brushSize = 8;

resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ? PC
canvas.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});
canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
        x = e.offsetX;
        y = e.offsetY;
    }
});
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

// ? Mobile
canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    x = touch.offsetX;
    y = touch.offsetY;
    isDrawing = true;
    e.preventDefault();
});
canvas.addEventListener("touchmove", (e) => {
    if (isDrawing) {
        const touch = e.touches[0];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(touch.offsetX, touch.offsetY);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
        x = touch.offsetX;
        y = touch.offsetY;
    }
    e.preventDefault();
});
canvas.addEventListener("touchend", () => {
    isDrawing = false;
});

// ! COLORS

basicColors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFFFFF",
    "#000000"
];

const colorsDiv = document.querySelector("#colors");

basicColors.forEach(color => {
    colorsDiv.innerHTML += `<div class="color box" style="background-color: ${color};"></div>`;
});

basicColorsDivs = document.querySelectorAll(".color");

basicColorsDivs.forEach((colorDiv, i) => {
    colorDiv.addEventListener("click", () => {
        brushColor = basicColors[i];
        basicColorsDivs.forEach((e) => {
            e.classList.remove("color-selected");
        });
        basicColorsDivs[i].classList.add("color-selected");
    });
});


// ! SIZE

const sizeInput = document.querySelector("#size");

sizeInput.value = brushSize;

sizeInput.addEventListener("input", () => {
    brushSize = sizeInput.value;
});

// ! CLEAR

const clearDiv = document.querySelector("#clear");

clearDiv.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


// ! PAINTINGS

const openDrawingsDiv = document.querySelector("#open-drawings");

openDrawingsDiv.addEventListener("click", () => {
    document.querySelector("#loading-drawings").style.display = "block";
});

const closeDiv = document.querySelector("#close");

closeDiv.addEventListener("click", () => {
    document.querySelector("#loading-drawings").style.display = "none";
});

const tagsDiv = document.querySelector("#tags");

tags.forEach(tag => {
    tagsDiv.innerHTML += `<span class="tag">${tag}</span>`;
});

const tagDiv = tagsDiv.querySelectorAll(".tag");
tagDiv.forEach((tag, i) => {
    tag.addEventListener("click", () => {
        if(!tag.classList.contains("tag-selected")){
            tagDiv.forEach((e) => {
                e.classList.remove("tag-selected");
            });
            tag.classList.add("tag-selected");
            const paintingsWithNumbers = paintings.filter(painting => painting.tags.includes(tags[i]));
            createListOfPaintings(paintingsWithNumbers);
        }else{
            tagDiv.forEach((e) => {
                e.classList.remove("tag-selected");
            });
            createListOfPaintings(paintings);
        }
    });
});

const colectionDrawingsDiv = document.querySelector("#colection-drawings");

const createListOfPaintings = (paintingList) => {
    colectionDrawingsDiv.innerHTML = "";
    paintingList.forEach(painting => {
        colectionDrawingsDiv.innerHTML += `<div class="box painting"><img src="paintings/${painting.name}.png" alt="${painting.name}"></div>`;
    });

    const paintingsDiv = document.querySelectorAll(".painting");

    paintingsDiv.forEach(paintingDiv => {
        const painting = paintingDiv.querySelector("img");
        paintingDiv.addEventListener("click", () => {
            const img = new Image();
            img.src = painting.attributes[0].nodeValue;

            let scale = canvas.height/img.height - 0.4;

            ctx.drawImage(img, canvas.width/2 - img.width * scale/2, canvas.height/2 - img.height * scale/2, img.width * scale, img.height * scale);

            document.querySelector("#loading-drawings").style.display = "none";
        });
    });
}

createListOfPaintings(paintings);