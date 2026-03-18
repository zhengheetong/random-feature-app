import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Counter() {
  const [searchParams] = useSearchParams();
  const isObs = searchParams.get('obs') === 'true';

  // 1. Initialize count and label from local memory
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem('streamCounter');
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  });

  const [label, setLabel] = useState(() => {
    return localStorage.getItem('streamCounterLabel') || 'DEATHS:';
  });

  // 2. New states for our custom controls
  const [step, setStep] = useState(1); // How much to add/subtract per click
  const [exactValue, setExactValue] = useState(''); // For jumping to a specific number

  const [copied, setCopied] = useState(false);

  // Save changes to local memory
  useEffect(() => {
    localStorage.setItem('streamCounter', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('streamCounterLabel', label);
  }, [label]);

  // Sync changes between windows/OBS docks
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'streamCounter') {
        setCount(parseInt(e.newValue, 10) || 0);
      }
      if (e.key === 'streamCounterLabel') {
        setLabel(e.newValue || '');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Force transparent background for OBS overlay
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    const oldHtmlBg = html.style.backgroundColor;
    const oldBodyBg = body.style.backgroundColor;
    const oldRootBg = root ? root.style.backgroundColor : '';

    html.style.setProperty('background-color', 'transparent', 'important');
    body.style.setProperty('background-color', 'transparent', 'important');
    if (root) root.style.setProperty('background-color', 'transparent', 'important');

    return () => {
      html.style.backgroundColor = oldHtmlBg;
      body.style.backgroundColor = oldBodyBg;
      if (root) root.style.backgroundColor = oldRootBg;
    };
  }, []);

  const handleCopyObsLink = () => {
    const obsParams = new URLSearchParams(searchParams);
    obsParams.set('obs', 'true');
    const fullUrl = `${window.location.origin}${window.location.pathname}#/counter?${obsParams.toString()}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  // Function to handle setting an exact number
  const handleSetExact = () => {
    const parsed = parseInt(exactValue, 10);
    if (!isNaN(parsed)) {
      setCount(parsed);
      setExactValue(''); // Clear the input box after setting it
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: isObs ? 0 : '20px' }}>
      
      {/* The Display (Visible in OBS) */}
      <div style={{
        display: 'inline-block',
        fontFamily: 'monospace',
        fontSize: '60px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', 
        padding: '10px 20px',
        whiteSpace: 'nowrap'
      }}>
        {label} {count}
      </div>

      <br />

      {/* The Controls (Hidden in OBS) */}
      {!isObs && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          display: 'inline-block',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          minWidth: '320px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50', marginBottom: '15px', textAlign: 'center' }}>Counter Controls</h3>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            {/* Label Input */}
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#7f8c8d', flex: 2 }}>
              Text Label
              <input 
                type="text" 
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., DEATHS:"
                style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #bdc3c7', marginTop: '6px', outline: 'none' }}
              />
            </label>

            {/* Step Amount Input */}
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#7f8c8d', flex: 1 }}>
              Step Amount
              <input 
                type="number" 
                value={step}
                onChange={(e) => setStep(parseInt(e.target.value, 10) || 1)}
                min="1"
                style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #bdc3c7', marginTop: '6px', outline: 'none' }}
              />
            </label>
          </div>

          {/* Plus / Minus Buttons (Now use the Step Amount) */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <button 
              onClick={() => setCount(c => c - step)}
              style={{ flex: 1, padding: '15px', fontSize: '24px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              - {step}
            </button>
            <button 
              onClick={() => setCount(c => c + step)}
              style={{ flex: 1, padding: '15px', fontSize: '24px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + {step}
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ecf0f1', marginBottom: '20px' }} />

          {/* Set Exact Value Section */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#7f8c8d', flex: 1 }}>
              Set Specific Number
              <input 
                type="number" 
                value={exactValue}
                onChange={(e) => setExactValue(e.target.value)}
                placeholder="e.g., 100"
                style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #bdc3c7', marginTop: '6px', outline: 'none' }}
                onKeyDown={(e) => e.key === 'Enter' && handleSetExact()}
              />
            </label>
            <button 
              onClick={handleSetExact}
              style={{ padding: '10px 20px', height: '43px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Set
            </button>
          </div>

          <button 
            onClick={handleCopyObsLink}
            style={{ width: '100%', padding: '12px', backgroundColor: copied ? '#27ae60' : '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
          >
            {copied ? '✅ Copied!' : '📋 Copy OBS Link'}
          </button>

          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to reset the counter to zero?')) {
                setCount(0);
              }
            }}
            style={{ width: '100%', padding: '10px', backgroundColor: '#bdc3c7', color: '#2c3e50', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}
          >
            Reset to Zero
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#7f8c8d', fontSize: '14px' }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}