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
maskingModeButton.addEventListener('mousedown', toggleMaskingMode);

// Event-Listener für Bild-Maskieren-Button
const maskImageButton = document.getElementById('mask-image');
maskImageButton.addEventListener('click', maskImage);

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
    canvas.addEventListener('mousedown', handleMaskRegion);
    canvas.addEventListener('mousemove', handleMaskRegion);
  } else {
    maskingModeButton.innerText = 'Maskierungsmodus';
    // Event-Listener für Maus-Klicks im Canvas entfernen
    canvas.removeEventListener('mousedown', handleMaskRegion);
    canvas.removeEventListener('mousemove', handleMaskRegion);
  }
}

// Markierten Bereich hinzufügen
function handleMaskRegion(event) {
  if (maskingMode && event.buttons === 1) {
    const x = event.offsetX;
    const y = event.offsetY;
    maskRegions.push({x: x, y: y});
    // Markierung zeichnen
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.strokeStyle = 'green';
    context.stroke();
  }
}

// Bild maskieren
function maskImage() {
    // Schleife über alle Pixel im Canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      // Prüfen, ob Pixel markiert ist
      let masked = false;
      for (let j = 0; j < maskRegions.length; j++) {
        const region = maskRegions[j];
        const dx = x - region.x;
        const dy = y - region.y;
        if (dx * dx + dy * dy < 100) {
          masked = true;
          break;
        }
      }
      // Pixel schwärzen, wenn nicht markiert
      if (!masked) {
        imageData.data[i] = 0;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = 255;
      }
    }
    // Maskiertes Bild in Canvas zeichnen
    context.putImageData(imageData, 0, 0);
  }
  
  // Event-Listener für Maus-Down im Canvas
  canvas.addEventListener('mousedown', function(event) {
    if (maskingMode) {
      isDrawing = true;
      const x = event.offsetX;
      const y = event.offsetY;
      maskRegions.push({x: x, y: y});
      // Markierung zeichnen
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.strokeStyle = 'green';
      context.stroke();
    }
  });
  
  // Event-Listener für Maus-Up im Canvas
  canvas.addEventListener('mouseup', function(event) {
    if (maskingMode) {
      isDrawing = false;
    }
  });
  