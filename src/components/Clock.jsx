import { useState, useEffect } from 'react';
import moment from 'moment';
import { Link, useSearchParams } from 'react-router-dom';

export default function Clock() {
  const [time, setTime] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isObs = searchParams.get('obs') === 'true';
  const urlFormat = searchParams.get('format') || 'DD/MM/YYYY|(UTC+8)hh:mm:ssa';

  const [inputFormat, setInputFormat] = useState(urlFormat);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    const oldHtmlBg = html.style.backgroundColor;
    const oldBodyBg = body.style.backgroundColor;
    const oldRootBg = root ? root.style.backgroundColor : '';

    html.style.setProperty('background-color', 'transparent', 'important');
    body.style.setProperty('background-color', 'transparent', 'important');
    if (root) {
      root.style.setProperty('background-color', 'transparent', 'important');
    }

    const interval = setInterval(() => {
      setTime(moment().format(urlFormat)); 
    }, 1000);

    return () => {
      clearInterval(interval);
      html.style.backgroundColor = oldHtmlBg;
      body.style.backgroundColor = oldBodyBg;
      if (root) {
        root.style.backgroundColor = oldRootBg;
      }
    };
  }, [urlFormat]);

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (inputFormat.trim()) {
      newParams.set('format', inputFormat);
    } else {
      newParams.delete('format');
    }
    
    setSearchParams(newParams);
  };

  const handleCopyObsLink = () => {
    const obsParams = new URLSearchParams(searchParams);
    obsParams.set('obs', 'true');
    
    const fullUrl = `${window.location.origin}${window.location.pathname}#/clock?${obsParams.toString()}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  return (
    <div style={{ textAlign: 'left', padding: 0, margin: 0 }}>
      {/* The Clock Display - Locked back to original size/color */}
      <div style={{
        display: 'inline-block',
        fontFamily: 'monospace',
        fontSize: '30px',
        color: 'lightgray',
        textAlign: 'right',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        whiteSpace: 'nowrap'
      }}>
        {time}
      </div>
      
      <br />

      {/* The Control Panel */}
      {!isObs && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          border: '1px solid #e1e8ed',
          display: 'inline-block',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          minWidth: '350px'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50', marginBottom: '15px' }}>Clock Settings</h3>
          
          <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#7f8c8d', marginBottom: '20px' }}>
            Time Format (moment.js)
            <input 
              type="text" 
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #bdc3c7', marginTop: '6px', outline: 'none' }}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
          </label>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleApply}
              style={{ flex: 1, padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}
            >
              Apply Format
            </button>
            <button 
              onClick={handleCopyObsLink}
              style={{ flex: 1, padding: '10px', backgroundColor: copied ? '#27ae60' : '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}
            >
              {copied ? '✅ Copied!' : '📋 Copy OBS Link'}
            </button>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#7f8c8d', fontSize: '14px' }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}