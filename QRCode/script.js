const qrContainer = document.getElementById("qrcode");
const qrInput = document.getElementById("qrText");
const downloadBtn = document.getElementById("downloadBtn");
const borderToggle = document.getElementById("borderToggle");
let finalImageSrc = null; // We will store the final ready-to-download image here

function generateQR() {
    const text = qrInput.value.trim();
    
    if (!text) {
        alert("Please enter some text or a URL first!");
        return;
    }

    qrContainer.innerHTML = "";
    downloadBtn.style.display = "none";
    finalImageSrc = null;

    // Create a temporary hidden div to generate the raw QR code
    const tempDiv = document.createElement("div");
    
    new QRCode(tempDiv, {
        text: text,
        width: 1024,
        height: 1024,
        colorDark : "#2c3e50", 
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Wait a fraction of a second for qrcode.js to finish creating the image
    setTimeout(() => {
        const qrImage = tempDiv.querySelector("img");
        
        if (!qrImage || !qrImage.src) {
            alert("Generating took too long. Try again!");
            return;
        }

        if (borderToggle.checked) {
            applyCoolBorder(qrImage.src);
        } else {
            // If no border is wanted, just use the raw image
            displayFinalImage(qrImage.src);
        }
    }, 150);
}

function applyCoolBorder(base64Img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
        const borderSize = 100; // How thick the gradient frame is
        const padding = 40;     // White space between the QR code and the frame

        // Size the new canvas to fit the QR code + padding + border
        canvas.width = img.width + (borderSize * 2);
        canvas.height = img.height + (borderSize * 2);

        // 1. Draw a cool sunset gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#833ab4"); // Purple
        gradient.addColorStop(0.5, "#fd1d1d"); // Red
        gradient.addColorStop(1, "#fcb045"); // Orange/Yellow
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw a solid white box so the QR code is easy to scan
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            borderSize - padding, 
            borderSize - padding, 
            img.width + (padding * 2), 
            img.height + (padding * 2)
        );

        // 3. Draw the actual QR Code in the very center
        ctx.drawImage(img, borderSize, borderSize);

        // 4. Send the new framed canvas to be displayed and downloaded
        displayFinalImage(canvas.toDataURL("image/png"));
    };
    
    img.src = base64Img;
}

function displayFinalImage(src) {
    finalImageSrc = src;
    
    const displayImg = document.createElement("img");
    displayImg.src = src;
    displayImg.style.maxWidth = "100%";
    displayImg.style.borderRadius = "8px"; // Slightly rounds the corners on the screen
    
    qrContainer.innerHTML = "";
    qrContainer.appendChild(displayImg);
    
    downloadBtn.style.display = "block";
}

function downloadQR() {
    if (!finalImageSrc) return;
    
    const link = document.createElement("a");
    link.href = finalImageSrc;
    // Change the file name depending on if it has a border!
    link.download = borderToggle.checked ? "framed-qrcode.png" : "qrcode.png"; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Trigger generation on 'Enter' key press
qrInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        generateQR();
    }
});