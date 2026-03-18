import { useState, useRef } from 'react';
import { Tweet } from 'react-tweet';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';

export default function TweetGenerator() {
  const [inputUrl, setInputUrl] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
    } catch (err) {
      setError('Please enter a valid URL starting with http:// or https://');
    }
  };

  const handleCopyImage = async () => {
    const tweetElement = captureRef.current?.querySelector('article');
    if (!tweetElement) return;

    setIsProcessing(true);
    setError(''); // Clear previous errors

    try {
      const canvas = await html2canvas(tweetElement, {
        useCORS: true, 
        // Change 'null' to a solid color to help WhatsApp process the image
        backgroundColor: '#15202b', 
        scale: 3, 
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
          // If clipboard fails, we tell the user why
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
      const canvas = await html2canvas(tweetElement, {
        useCORS: true,
        backgroundColor: '#15202b',
        scale: 3,
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `x-post-${tweetId}.png`;
      link.click();
    } catch (err) {
      setError('Could not download image due to X security restrictions.');
    }
    setIsProcessing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      
      {/* --- PREVIEW AREA --- */}
      <div style={{
        padding: '40px', 
        backgroundColor: '#1e1e1e', 
        borderRadius: '12px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {tweetId ? (
          <div ref={captureRef} style={{ textAlign: 'left' }}>
            <div className="dark">
              <Tweet id={tweetId} />
            </div>
          </div>
        ) : (
          <div style={{ color: '#95a5a6', fontStyle: 'italic' }}>
            Paste an X link below
          </div>
        )}
      </div>

      {/* --- CONTROL PANEL --- */}
      <div style={{ 
        padding: '25px', backgroundColor: '#1e1e1e', borderRadius: '12px',
        border: '1px solid #333333', boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        minWidth: '400px', textAlign: 'left'
      }}>
        <h3 style={{ marginTop: 0, color: '#e0e0e0', marginBottom: '20px', textAlign: 'center' }}>X Post Fetcher</h3>
        
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#a0a0a0', marginBottom: '15px' }}>
          Paste X / Twitter URL
          <input 
            type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} 
            placeholder="https://x.com/..."
            style={{ 
              padding: '12px', fontSize: '15px', borderRadius: '6px', 
              backgroundColor: '#2c2c2c', color: '#ffffff', 
              border: error ? '1px solid #e74c3c' : '1px solid #444', 
              marginTop: '6px', outline: 'none' 
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchTweet()}
          />
        </label>

        {error && <div style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '15px' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button 
            onClick={handleFetchTweet}
            style={{ flex: 1, padding: '15px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            Fetch Post
          </button>
          
          <button 
            onClick={handleCopyImage}
            disabled={!tweetId || isProcessing}
            style={{ 
              flex: 1, padding: '15px', 
              backgroundColor: copied ? '#2ecc71' : (tweetId ? '#3498db' : '#444444'), 
              color: tweetId ? 'white' : '#888888', border: 'none', borderRadius: '6px', 
              cursor: tweetId && !isProcessing ? 'pointer' : 'not-allowed', 
              fontWeight: 'bold', fontSize: '15px' 
            }}
          >
            {isProcessing ? 'Processing...' : (copied ? '✅ Copied to Clipboard!' : '📋 Copy Image')}
          </button>

          <button 
            onClick={handleDownloadImage}
            disabled={!tweetId || isProcessing}
            style={{ 
              flex: 1, padding: '15px', 
              backgroundColor: '#e67e22', 
              color: 'white', border: 'none', 
              borderRadius: '6px', 
              cursor: tweetId ? 'pointer' : 'not-allowed' }}
          >
            📥 Download
          </button>
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