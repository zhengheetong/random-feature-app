import { useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeGenerator({ onBack }) {
  const [text, setText] = useState('');
  const [addBorder, setAddBorder] = useState(false);
  const [finalImage, setFinalImage] = useState(null);

  const generateQR = async () => {
    if (!text.trim()) {
      alert("Please enter some text or a URL first!");
      return;
    }

    try {
      // Generate standard QR code as a Data URL using the npm package
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: 1024,
        margin: 1,
        color: { dark: '#2c3e50', light: '#ffffff' }
      });

      if (addBorder) {
        applyCoolBorder(qrDataUrl);
      } else {
        setFinalImage(qrDataUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const applyCoolBorder = (base64Img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      const borderSize = 100;
      const padding = 40;
      canvas.width = img.width + (borderSize * 2);
      canvas.height = img.height + (borderSize * 2);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#833ab4");
      gradient.addColorStop(0.5, "#fd1d1d");
      gradient.addColorStop(1, "#fcb045");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(borderSize - padding, borderSize - padding, img.width + (padding * 2), img.height + (padding * 2));
      ctx.drawImage(img, borderSize, borderSize);

      setFinalImage(canvas.toDataURL("image/png"));
    };
    img.src = base64Img;
  };

  const handleDownload = () => {
    if (!finalImage) return;
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = addBorder ? "framed-qrcode.png" : "qrcode.png";
    link.click();
  };

  return (
    <div className="feature-page">
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '400px', width: '90%' }}>
        <h2 style={{ color: '#2c3e50', marginTop: 0 }}>QR Generator</h2>
        
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., https://example.com" 
          style={{ width: '100%', padding: '12px', margin: '15px 0', boxSizing: 'border-box' }}
          onKeyDown={(e) => e.key === 'Enter' && generateQR()}
        />
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={addBorder} 
              onChange={(e) => setAddBorder(e.target.checked)} 
              style={{ marginRight: '8px' }}
            />
            ✨ Add a cool gradient border
          </label>
        </div>

        <button 
          onClick={generateQR}
          style={{ width: '100%', padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Generate
        </button>

        {finalImage && (
          <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={finalImage} alt="QR Code" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <button 
              onClick={handleDownload}
              style={{ width: '100%', padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '15px' }}
            >
              Download QR Code
            </button>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <button className="back-btn" onClick={onBack}>← Back to Features</button>
        </div>
      </div>
    </div>
  );
}