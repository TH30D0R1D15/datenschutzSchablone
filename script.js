// Canvas-Element und Kontext holen
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Bild-Upload-Element holen
const imageUpload = document.getElementById('image-upload');

// Flag für Maskierungsmodus
let maskingMode = false;

// Array für markierte Bereiche
let maskRegions = [];

// Event-Listener für Bild-Upload
imageUpload.addEventListener('change', handleImageUpload);

// Event-Listener für Maskierungsmodus-Button
const maskingModeButton = document.getElementById('masking-mode');
maskingModeButton.addEventListener('click', toggleMaskingMode);

// Event-Listener für Bild-Maskieren-Button
const maskImageButton = document.getElementById('mask-image');
maskImageButton.addEventListener('click', maskImage);

// Event-Listener für Download-Button
const downloadButton = document.getElementById('download-image');
downloadButton.addEventListener('click', downloadImage);

// Bild-Upload-Handler
function handleImageUpload(event) {
  // Bild in Canvas zeichnen
  const image = new Image();
  image.src = URL.createObjectURL(event.target.files[0]);
  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
  };
}

// Maskierungsmodus umschalten
function toggleMaskingMode() {
  maskingMode = !maskingMode;
  if (maskingMode) {
    maskingModeButton.innerText = 'Maskierungsmodus beenden';
    // Event-Listener für Maus-Klicks im Canvas
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
  } else {
    maskingModeButton.innerText = 'Maskierungsmodus';
    // Event-Listener für Maus-Klicks im Canvas entfernen
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
  }
}

// Markierten Bereich hinzufügen
function handleMouseDown(event) {
  maskRegions.push({
    x: event.offsetX,
    y: event.offsetY,
    width: 0,
    height: 0
  });
}

function handleMouseMove(event) {
  const currentRegion = maskRegions[maskRegions.length - 1];
  if (currentRegion) {
    currentRegion.width = event.offsetX - currentRegion.x;
    currentRegion.height = event.offsetY - currentRegion.y;
    drawRegions();
  }
}

function handleMouseUp(event) {
  const currentRegion = maskRegions[maskRegions.length - 1];
  if (currentRegion) {
    if (currentRegion.width < 0) {
      currentRegion.x += currentRegion.width;
      currentRegion.width = -currentRegion.width;
    }
    if (currentRegion.height < 0) {
      currentRegion.y += currentRegion.height;
      currentRegion.height = -currentRegion.height;
    }
    drawRegions();
  }
}
// Alle markierten Bereiche zeichnen
function drawRegions() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    for (let i = 0; i < maskRegions.length; i++) {
      const region = maskRegions[i];
      context.fillRect(region.x, region.y, region.width, region.height);
    }
  }
  
  // Bild maskieren und zum Download bereitstellen
  function maskImage() {
    // Canvas-Element erzeugen und auf gleiche Größe wie das Bild setzen
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
  
    // Canvas-Context holen und Bild zeichnen
    const tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(image, 0, 0);
  
    // Alle markierten Bereiche abfragen und Pixel schwärzen
    for (let i = 0; i < maskRegions.length; i++) {
      const region = maskRegions[i];
      tempContext.clearRect(region.x, region.y, region.width, region.height);
    }
  
    // Maskiertes Bild als Daten-URL zum Download bereitstellen
    const downloadLink = document.createElement('a');
    downloadLink.download = 'maskedImage.png';
    downloadLink.href = tempCanvas.toDataURL('image/png');
    downloadLink.click();
  }
  
  // Event-Listener für Maus-Klicks im Canvas
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  
  // Maus-Klick-Handler
  function handleMouseDown(event) {
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
    currentRect = {
      x: startX,
      y: startY,
      width: 0,
      height: 0
    };
  }
  
  function handleMouseUp(event) {
    isDrawing = false;
    currentRect.width = event.offsetX - startX;
    currentRect.height = event.offsetY - startY;
    maskRegions.push(currentRect);
    drawRegions();
  }
  
  // Event-Listener für Bild-Maskieren-Button
  const maskImageButton = document.getElementById('mask-image');
  maskImageButton.addEventListener('click', maskImage);
  