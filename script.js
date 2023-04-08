// Variablen deklarieren
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let img = new Image();
let isDrawing = false;
let startX, startY;
let maskMode = false;
let rects = [];
let tempRect = null;

// Bild hochladen
function handleImageUpload() {
    let fileInput = document.getElementById("image-upload");
    img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = URL.createObjectURL(fileInput.files[0]);
}

// Mausereignisse behandeln
canvas.addEventListener("mousedown", function (e) {
  if (maskMode) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    tempRect = {
      x: startX,
      y: startY,
      width: 0,
      height: 0
    };
  }
});

canvas.addEventListener("mousemove", function (e) {
  if (maskMode && isDrawing) {
    tempRect.width = e.offsetX - startX;
    tempRect.height = e.offsetY - startY;
    drawTempRect(tempRect);
  }
});

canvas.addEventListener("mouseup", function (e) {
  if (maskMode && isDrawing) {
    isDrawing = false;
    rects.push(tempRect);
    drawRects();
  }
});

// Maskierungsmodus umschalten
function toggleMaskMode() {
  maskMode = !maskMode;
  if (maskMode) {
    canvas.style.cursor = "crosshair";
  } else {
    canvas.style.cursor = "default";
  }
}

// Temporäres Rechteck zeichnen
function drawTempRect(rect) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.strokeStyle = "#FF0000";
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

// Rechtecke zeichnen
function drawRects() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  for (let i = 0; i < rects.length; i++) {
    ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
  }
}

// Bild schwärzen
function blackOut() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.fillStyle = "black";
  for (let i = 0; i < rects.length; i++) {
    ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
  }
}
