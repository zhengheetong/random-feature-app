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
    if (!captureRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true, // Attempts to load external images if the server allows it
        backgroundColor: '#15202b', // X Dark mode background color
        scale: 2 // High-res
      });

      // Convert canvas to a Blob and write directly to the clipboard
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          } catch (clipErr) {
            console.error('Clipboard write failed:', clipErr);
            alert('Your browser might block direct clipboard image copying. Try downloading instead.');
          }
        }
        setIsProcessing(false);
      }, 'image/png');
      
    } catch (err) {
      console.error('Canvas capture failed:', err);
      setError('Failed to generate image.');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      
      {/* --- PREVIEW AREA --- */}
      <div 
        style={{
          padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '12px',
          marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          minWidth: '350px', minHeight: '200px', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}
      >
        {tweetId ? (
          // The wrapper ref target for html2canvas
          <div ref={captureRef} style={{ padding: '10px', backgroundColor: 'transparent', borderRadius: '12px', textAlign: 'left' }}>
            <div className="dark">
              <Tweet id={tweetId} />
            </div>
          </div>
        ) : (
          <div style={{ color: '#95a5a6', textAlign: 'center', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
            Paste an X link below<br/>to fetch the post
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