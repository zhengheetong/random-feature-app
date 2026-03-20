import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ClipboardSaver() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [batchName, setBatchName] = useState('extracted-image');


  // --- 1. CLIPBOARD PASTE HANDLER ---
  useEffect(() => {
    const handlePaste = (e) => {
      const clipboardItems = e.clipboardData?.items || [];
      const newImages = [];
      
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            newImages.push({
              id: Date.now() + i,
              file: blob,
              src: URL.createObjectURL(blob),
              name: `extract-${Date.now().toString().slice(-4)}.png`
            });
          }
        }
      }

      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // --- 2. DRAG AND DROP HANDLERS ---
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevents the browser from opening the image in a new tab
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    const newImages = [];

    if (droppedFiles && droppedFiles.length > 0) {
      Array.from(droppedFiles).forEach((file, i) => {
        // Check if the dropped file is an image
        if (file.type.startsWith('image/')) {
          newImages.push({
            id: Date.now() + i,
            file: file,
            src: URL.createObjectURL(file),
            name: `drop-${Date.now().toString().slice(-4)}-${file.name || 'image.png'}`
          });
        }
      });

      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
      }
    }
  };

  // --- 3. UTILITY FUNCTIONS ---
  const handleDownloadSingle = (img) => {
    const link = document.createElement('a');
    link.href = img.src;
    link.download = img.name.includes('.') ? img.name : `${img.name}.png`;
    link.click();
  };

  const handleDownloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => handleDownloadSingle(img), index * 250); 
    });
  };

  const handleRemove = (idToRemove) => {
    setImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const handleUpdateName = (id, newName) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, name: newName } : img));
  };

  const handleClearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.src)); 
    setImages([]);
  };

  const handleBatchRename = () => {
    if (!batchName.trim()) return;
    
    setImages(prev => prev.map((img, index) => {
      // Find the file extension (e.g., .png, .jpg) or default to .png
      const extMatch = img.name.match(/\.[0-9a-z]+$/i);
      const ext = extMatch ? extMatch[0] : '.png';
      
      // Update the name with the new base name + number
      return { 
        ...img, 
        name: `${batchName.trim()}-${index + 1}${ext}` 
      };
    }));
  };


  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: '#f1c40f', marginBottom: '10px', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        Image Extractor
      </h2>
      <p style={{ color: '#a0a0a0', marginBottom: '30px' }}>
        Paste or Drag & Drop multiple images here. Download them all at once.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ color: '#a0a0a0', fontSize: '14px' }}>
          {images.length} Image{images.length !== 1 ? 's' : ''} in Queue
        </div>
        
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleDownloadAll}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', 
                border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
              }}
            >
              {/* Modern Download SVG */}
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download All
            </button>
            <button 
              onClick={handleClearAll}
              style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer' }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '15px', 
          backgroundColor: '#1a1a1a', padding: '15px', 
          borderRadius: '8px', border: '1px solid #333', 
          marginBottom: '20px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' 
        }}>
          <span style={{ color: '#a0a0a0', fontSize: '14px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
            ✏️ Batch Rename:
          </span>
          <input 
            type="text" 
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="e.g., presentation-slide"
            style={{ 
              flex: 1, padding: '10px', borderRadius: '6px', 
              backgroundColor: '#121212', color: 'white', 
              border: '1px solid #444', outline: 'none', fontSize: '14px' 
            }}
          />
          <button 
            onClick={handleBatchRename}
            style={{ 
              padding: '10px 20px', backgroundColor: '#8e44ad', 
              color: 'white', border: 'none', borderRadius: '6px', 
              cursor: 'pointer', fontWeight: 'bold' 
            }}
          >
            Apply to All
          </button>
        </div>
      )}


      {/* --- THE DROP ZONE --- */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px',
          minHeight: '300px', // Made slightly taller for an easier drop target
          padding: '20px',
          backgroundColor: isDragging ? '#2c3e50' : '#1e1e1e', // Changes color when hovering a file!
          borderRadius: '12px',
          border: isDragging ? '3px dashed #3498db' : (images.length === 0 ? '2px dashed #444' : '1px solid #333'),
          transition: 'all 0.2s ease'
        }}>
        
        {images.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666', pointerEvents: 'none' }}>
            
            {/* Giant Dynamic Drop SVG */}
            <div style={{ marginBottom: '15px', color: isDragging ? '#3498db' : '#666', transition: 'color 0.2s ease' }}>
              <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>

            <h3 style={{ margin: '0 0 5px 0', color: isDragging ? '#3498db' : '#888' }}>
              {isDragging ? 'Drop it here!' : 'Ready for your images'}
            </h3>
            <p style={{ margin: 0, fontSize: '15px' }}>Press <b>Ctrl+V</b> or <b>Drag and Drop</b> images</p>
          </div>
        ) : (
          images.map((img) => (
            <div key={img.id} style={{ 
              backgroundColor: '#121212', borderRadius: '8px', overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column',
              zIndex: 10 // Keeps cards above the drop zone background
            }}>
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', backgroundColor: '#0a0a0a' }}>
                <img src={img.src} alt="Extracted" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  value={img.name}
                  onChange={(e) => handleUpdateName(img.id, e.target.value)}
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #333', borderRadius: '4px', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleDownloadSingle(img)}
                    style={{ flex: 1, padding: '8px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => handleRemove(img.id)}
                    style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✖
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <Link to="/" style={{ color: '#a0a0a0', textDecoration: 'none' }}>← Back to Dashboard</Link>
      </div>
    </div>
  );
}