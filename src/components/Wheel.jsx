import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#34495e'];

export default function Wheel() {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const isObs = searchParams.get('obs') === 'true';

  const [options, setOptions] = useState(() => {
    const saved = localStorage.getItem('wheelOptions');
    return saved ? JSON.parse(saved) : ['Play Game', 'Write Code', 'Take a Break', 'Just Chatting'];
  });

  const [inputText, setInputText] = useState(options.join('\n'));
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const executeSpin = (targetRotation, winningText) => {
    setIsSpinning(true);
    setWinner('');
    setRotation(targetRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winningText);
    }, 4000); 
  };

  useEffect(() => {
    localStorage.setItem('wheelOptions', JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'wheelOptions') {
        const newOptions = JSON.parse(e.newValue);
        setOptions(newOptions);
        setInputText(newOptions.join('\n'));
      }
      if (e.key === 'wheelSpinTrigger' && e.newValue) {
        const data = JSON.parse(e.newValue);
        executeSpin(data.targetRotation, data.winningText);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  const handleUpdateOptions = () => {
    const newOpts = inputText.split('\n').map(opt => opt.trim()).filter(opt => opt !== '');
    if (newOpts.length < 2) {
      alert('Please enter at least 2 options to spin!');
      return;
    }
    setOptions(newOpts);
    setWinner('');
    setRotation(0);
  };

  const handleSpinClick = () => {
    if (isSpinning || options.length < 2) return;

    const sliceAngle = 360 / options.length;
    const randomSliceIndex = Math.floor(Math.random() * options.length);
    
    const extraSpins = 360 * 5;
    const baseRotation = rotation + extraSpins;
    
    const winningSliceCenter = (randomSliceIndex * sliceAngle) + (sliceAngle / 2);
    const sliceSpecificRotation = (0 - winningSliceCenter + 360) % 360;

    const currentBasePos = baseRotation % 360;
    let neededForwardSpin = sliceSpecificRotation - currentBasePos;
    
    if (neededForwardSpin <= 0) neededForwardSpin += 360;
    
    const finalCalculatedRotation = baseRotation + neededForwardSpin;
    
    const varianceThreshold = sliceAngle * 0.4;
    const variance = (Math.random() * (varianceThreshold * 2)) - varianceThreshold;
    
    const finalRotation = finalCalculatedRotation + variance;
    const winningText = options[randomSliceIndex];

    executeSpin(finalRotation, winningText);

    localStorage.setItem('wheelSpinTrigger', JSON.stringify({
      targetRotation: finalRotation,
      winningText,
      timestamp: Date.now() 
    }));
  };

  const handleCopyObsLink = () => {
    const obsParams = new URLSearchParams(searchParams);
    obsParams.set('obs', 'true');
    const fullUrl = `${window.location.origin}${window.location.pathname}#/wheel?${obsParams.toString()}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  const sliceAngle = 360 / options.length;
  const conicParts = options.map((_, i) => {
    const color = COLORS[i % COLORS.length];
    return `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
  }).join(', ');

  return (
    <div style={{ padding: isObs ? 0 : '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* THE SUPERSIZED WHEEL CONTAINER (Now 500x500) */}
      <div style={{ position: 'relative', width: '500px', height: '500px', marginTop: '20px', marginLeft: isObs ? '-40px' : '0' }}>
        
        {/* SCALED UP POINTER */}
        <div style={{
          position: 'absolute', right: '-40px', top: 'calc(50% - 20px)', zIndex: 10,
          width: 0, height: 0, 
          borderTop: '20px solid transparent', borderBottom: '20px solid transparent', borderRight: '50px solid white', 
          filter: 'drop-shadow(-3px 0 4px rgba(0,0,0,0.6))'
        }} />

        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: `conic-gradient(${conicParts})`,
          transition: 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)',
          transform: `rotate(${rotation}deg)`,
          boxShadow: '0 0 25px rgba(0,0,0,0.5)', // Bigger glow
          border: '6px solid white', // Thicker border
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {options.map((opt, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '250px', // Half of the new 500px width
              height: '30px', // Taller container for bigger text
              marginTop: '-15px', // Adjusted to center vertically
              transformOrigin: 'left center',
              transform: `rotate(${i * sliceAngle + (sliceAngle / 2)}deg)`,
              textAlign: 'right',
              paddingRight: '35px', // Pushed further away from the edge
              boxSizing: 'border-box',
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)', // Stronger text shadow
              fontSize: '20px', // Much larger text
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {opt}
            </div>
          ))}
        </div>
      </div>

      {/* SCALED UP WINNER TEXT */}
      <div style={{
        height: '50px', marginTop: '30px', fontSize: '38px', fontWeight: 'bold',
        color: 'white', textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
        opacity: winner ? 1 : 0, transition: 'opacity 0.3s ease', fontFamily: 'sans-serif',
        marginLeft: isObs ? '-40px' : '0' 
      }}>
        🎉 {winner} 🎉
      </div>


      {/* THE CONTROLS */}
      {!isObs && (
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
          <h3 style={{ marginTop: 0, color: '#e0e0e0', marginBottom: '15px' }}>Wheel Settings</h3>
          
          <p style={{ fontSize: '13px', color: '#a0a0a0', margin: '0 0 10px 0', textAlign: 'left' }}>
            Enter options below (one per line):
          </p>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            style={{ 
              width: '100%', height: '400px', padding: '10px', fontSize: '15px', borderRadius: '6px', 
              backgroundColor: '#2c2c2c', color: '#ffffff',
              border: '1px solid #444', marginBottom: '15px', boxSizing: 'border-box',
              fontFamily: 'sans-serif', resize: 'vertical', outline: 'none'
            }}
          />
          
          <button 
            onClick={handleUpdateOptions}
            style={{ width: '100%', padding: '12px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
          >
            Update Wheel Slices
          </button>

          <button 
            onClick={handleSpinClick}
            disabled={isSpinning}
            style={{ 
              width: '100%', padding: '18px', backgroundColor: isSpinning ? '#555' : '#f39c12', 
              color: 'white', border: 'none', borderRadius: '8px', cursor: isSpinning ? 'not-allowed' : 'pointer', 
              marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase',
              boxShadow: isSpinning ? 'none' : '0 4px 0 #d68910', transform: isSpinning ? 'translateY(4px)' : 'none', transition: 'all 0.1s'
            }}
          >
            {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
          </button>

          <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '20px 0' }} />

          <button 
            onClick={handleCopyObsLink}
            style={{ width: '100%', padding: '12px', backgroundColor: copied ? '#27ae60' : '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
          >
            {copied ? '✅ Copied!' : '📋 Copy OBS Link'}
          </button>

          <Link to="/" style={{ textDecoration: 'none', color: '#a0a0a0', fontSize: '14px' }}>
            ← Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}