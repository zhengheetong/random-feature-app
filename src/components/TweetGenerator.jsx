import { useState, useRef, useEffect } from 'react';
import { Tweet } from 'react-tweet';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';

export default function TweetGenerator() {
  const [inputUrl, setInputUrl] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRounded, setIsRounded] = useState(true);
  
  const captureRef = useRef(null);

  const handleFetchTweet = () => {
    setError('');
    setCopied(false);
    
    if (!inputUrl.trim()) {
      setError('Please enter a link first.');
      return;
    }

    try {
      const urlObj = new URL(inputUrl);
      const pathParts = urlObj.pathname.split('/');
      const statusIndex = pathParts.indexOf('status');
      
      if (statusIndex !== -1 && pathParts.length > statusIndex + 1) {
        setTweetId(pathParts[statusIndex + 1]);
      } else {
        setError('Could not find a valid Tweet ID. Make sure it is a full post URL.');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Please enter a valid URL starting with http:// or https://');
    }
    
  };

  const forceHighResImages = async (containerElement) => {
    const images = containerElement.querySelectorAll('img');
    const loadPromises = [];

    images.forEach((img) => {
      let currentSrc = img.src;
      
      if (currentSrc.includes('name=')) {
        const newSrc = currentSrc.replace(/name=[a-zA-Z0-9]+/, 'name=large');

        if (currentSrc !== newSrc) {
          loadPromises.push(new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; 
            
            img.removeAttribute('srcset');
            img.removeAttribute('sizes');
            
            img.src = newSrc; 
          }));
        }
      }
    });

    await Promise.all(loadPromises);
  };

  useEffect(() => {
    // If there is no preview box yet, do nothing
    if (!captureRef.current) return;

    // Create a "guard" that watches the preview box for changes
    const observer = new MutationObserver(() => {
      // Whenever react-tweet injects new HTML/images, run our HD sniper!
      forceHighResImages(captureRef.current);
    });

    // Tell the guard to watch everything inside the preview box
    observer.observe(captureRef.current, { childList: true, subtree: true });

    // Clean up the guard when we leave the page
    return () => observer.disconnect();
  }, [tweetId]);


  const handleCopyImage = async () => {
    const tweetElement = captureRef.current?.querySelector('article');
    if (!tweetElement) return;

    setIsProcessing(true);
    setError(''); 

    try {
      // 🚨 WE CALL IT HERE! Right before taking the screenshot 🚨
      await forceHighResImages(tweetElement);

      const rect = tweetElement.getBoundingClientRect();

      const canvas = await html2canvas(tweetElement, {
        useCORS: true, 
        backgroundColor: '#null', 
        scale: 4, // 4K Resolution
        width: Math.floor(rect.width),   // Snaps width to a clean integer
        height: Math.floor(rect.height), // Snaps height to a clean integer
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError('Failed to create image blob.');
          setIsProcessing(false);
          return;
        }

        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } catch (clipErr) {
          console.error('Clipboard error:', clipErr);
          setError('WhatsApp Web often blocks clipboard images. Use "Download" instead!');
        }
        setIsProcessing(false);
      }, 'image/png');
      
    } catch (err) {
      console.error('Capture failed:', err);
      setError('Security block: X does not allow saving these images directly.');
      setIsProcessing(false);
    }
  };

  // Add a separate Download function for a 100% success rate
  const handleDownloadImage = async () => {
    const tweetElement = captureRef.current?.querySelector('article');
    if (!tweetElement) return;

    setIsProcessing(true);
    try {
      // 🚨 WE CALL IT HERE TOO! 🚨
      await forceHighResImages(tweetElement);

      const rect = tweetElement.getBoundingClientRect();

      const canvas = await html2canvas(tweetElement, {
        useCORS: true, 
        backgroundColor: '#null', 
        scale: 4, // 4K Resolution
        width: Math.floor(rect.width),   // Snaps width to a clean integer
        height: Math.floor(rect.height), // Snaps height to a clean integer
        logging: false,
      });
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `x-post-${tweetId}.png`;
      link.click();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Could not download image due to X security restrictions.');
    }
    setIsProcessing(false);
  };

  return (
    // Main Container: Now takes up the full screen height
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      
      {/* --- PREVIEW AREA (Centered) --- */}
      <div 
        style={{
          padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          minHeight: '200px', display: 'flex',
          justifyContent: 'center', alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {tweetId ? (
          <div ref={captureRef} className={!isRounded ? 'square-corners' : ''} style={{ textAlign: 'left', width: '600px' }}>            
            <div className="dark" style={{ display: 'flex', justifyContent: 'center'}}>
              <Tweet id={tweetId} />
            </div>
          </div>
        ) : (
          <div style={{ color: '#95a5a6', textAlign: 'center', fontFamily: 'sans-serif', fontStyle: 'italic', padding: '40px' }}>
            Paste an X link below<br/>to fetch the post
          </div>
        )}
      </div>

      {/* --- FLOATING CONTROL PANEL (Top Right) --- */}
      <div style={{ 
        position: 'fixed', // This makes it float!
        top: '20px',
        right: '20px',
        width: '360px', // Slightly thinner to save screen space
        maxHeight: 'calc(100vh - 40px)', // Prevents it from going off-screen
        overflowY: 'auto', // Adds a scrollbar if the screen is short
        padding: '25px', 
        backgroundColor: 'rgba(30, 30, 30, 0.85)', // Slightly transparent
        backdropFilter: 'blur(12px)', // Adds a modern frosted-glass blur
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle light border
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)', // Deep shadow for 3D effect
        textAlign: 'left',
        zIndex: 1000 // Ensures it always stays on top of the tweet
      }}>
        <h3 style={{ marginTop: 0, color: '#e0e0e0', marginBottom: '20px', textAlign: 'center' }}>X Post Fetcher</h3>
        
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#a0a0a0', marginBottom: '15px' }}>
          Paste X / Twitter URL
          <input 
            type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} 
            placeholder="https://x.com/..."
            style={{ 
              padding: '12px', fontSize: '15px', borderRadius: '6px', 
              backgroundColor: 'rgba(0,0,0,0.5)', color: '#ffffff', 
              border: error ? '1px solid #e74c3c' : '1px solid #444', 
              marginTop: '6px', outline: 'none' 
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchTweet()}
          />
        </label>
        
        <div 
          onClick={() => setIsRounded(!isRounded)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '15px', 
            cursor: 'pointer', 
            color: '#e0e0e0', 
            fontSize: '14px',
            userSelect: 'none' // Prevents text highlighting when clicking fast
          }}
        >
          {/* The Switch Track */}
          <div style={{
            position: 'relative', 
            width: '46px', 
            height: '24px',
            backgroundColor: isRounded ? '#1d9bf0' : '#444444', // X Blue when ON, dark gray when OFF
            borderRadius: '24px', 
            transition: 'background-color 0.3s ease'
          }}>
            {/* The Switch Knob */}
            <div style={{
              position: 'absolute', 
              top: '2px', 
              left: isRounded ? '24px' : '2px', // Slides right when ON
              width: '20px', 
              height: '20px', 
              backgroundColor: '#ffffff',
              borderRadius: '50%', 
              transition: 'left 0.3s ease',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
            }} />
          </div>
          
          <span style={{ fontWeight: isRounded ? 'bold' : 'normal', transition: 'all 0.3s ease' }}>
            {isRounded ? 'Rounded Corners' : 'Square Corners'}
          </span>
        </div>

        {error && <div style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '15px' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexDirection: 'column' }}>
          <button 
            onClick={handleFetchTweet}
            style={{ width: '100%', padding: '15px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            Fetch Post
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleCopyImage}
              disabled={!tweetId || isProcessing}
              style={{ 
                flex: 1, padding: '12px', 
                backgroundColor: copied ? '#2ecc71' : (tweetId ? '#3498db' : '#444444'), 
                color: tweetId ? 'white' : '#888888', border: 'none', borderRadius: '6px', 
                cursor: tweetId && !isProcessing ? 'pointer' : 'not-allowed', 
                fontWeight: 'bold', fontSize: '14px' 
              }}
            >
              {isProcessing ? 'Wait...' : (copied ? '✅ Copied' : '📋 Copy')}
            </button>

            <button 
              onClick={handleDownloadImage}
              disabled={!tweetId || isProcessing}
              style={{ 
                flex: 1, padding: '12px', 
                backgroundColor: tweetId ? '#e67e22' : '#444444', 
                color: tweetId ? 'white' : '#888888', border: 'none', borderRadius: '6px', 
                cursor: tweetId ? 'pointer' : 'not-allowed', 
                fontWeight: 'bold', fontSize: '14px' 
              }}
            >
              📥 Download
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#a0a0a0', fontSize: '14px' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}