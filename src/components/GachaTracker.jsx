import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GachaTracker() {
  const [totalPulls, setTotalPulls] = useState(0);
  const [ssrCount, setSsrCount] = useState(0);
  const [baseRate, setBaseRate] = useState(4.0); // Default 4% SSR rate

  const currentRate = totalPulls > 0 ? ((ssrCount / totalPulls) * 100).toFixed(2) : 0.00;
  const isLucky = currentRate >= baseRate;

  const handleAddPulls = (amount) => setTotalPulls(prev => prev + amount);
  const handleAddSSR = () => {
    setSsrCount(prev => prev + 1);
    // If they got an SSR but forgot to log the pull, automatically add a pull
    if (totalPulls === 0) setTotalPulls(1);
  };
  
  const handleReset = () => {
    if (window.confirm("Reset all gacha tracking data?")) {
      setTotalPulls(0);
      setSsrCount(0);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: '#f1c40f', marginBottom: '30px', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        Live Gacha Tracker
      </h2>

      {/* Main Stats Display */}
      <div style={{ 
        display: 'flex', gap: '20px', marginBottom: '30px', 
        justifyContent: 'center', flexWrap: 'wrap' 
      }}>
        {/* Total Pulls */}
        <div style={{ 
          backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', 
          border: '1px solid #333', flex: '1', minWidth: '150px' 
        }}>
          <div style={{ color: '#a0a0a0', fontSize: '14px', textTransform: 'uppercase' }}>Total Pulls</div>
          <div style={{ color: '#ffffff', fontSize: '3rem', fontWeight: 'bold' }}>{totalPulls}</div>
        </div>

        {/* SSR Count */}
        <div style={{ 
          backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', 
          border: '1px solid #333', flex: '1', minWidth: '150px' 
        }}>
          <div style={{ color: '#a0a0a0', fontSize: '14px', textTransform: 'uppercase' }}>SSR Pulled</div>
          <div style={{ color: '#f39c12', fontSize: '3rem', fontWeight: 'bold' }}>{ssrCount}</div>
        </div>

        {/* Current Rate */}
        <div style={{ 
          backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', 
          border: `2px solid ${totalPulls === 0 ? '#333' : (isLucky ? '#2ecc71' : '#e74c3c')}`, 
          flex: '1', minWidth: '150px',
          boxShadow: totalPulls > 0 ? `0 0 15px ${isLucky ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'}` : 'none'
        }}>
          <div style={{ color: '#a0a0a0', fontSize: '14px', textTransform: 'uppercase' }}>Current Rate</div>
          <div style={{ color: totalPulls === 0 ? '#ffffff' : (isLucky ? '#2ecc71' : '#e74c3c'), fontSize: '3rem', fontWeight: 'bold' }}>
            {currentRate}%
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
            Target: {baseRate}%
          </div>
        </div>
      </div>

      {/* Quick Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={() => handleAddPulls(1)}
          style={{ padding: '20px', fontSize: '1.2rem', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          +1 Pull
        </button>
        <button 
          onClick={() => handleAddPulls(10)}
          style={{ padding: '20px', fontSize: '1.2rem', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          +10 Pulls
        </button>
        <button 
          onClick={handleAddSSR}
          style={{ gridColumn: 'span 2', padding: '20px', fontSize: '1.5rem', backgroundColor: '#f39c12', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✨ Got an SSR! ✨
        </button>
      </div>

      {/* Settings & Reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a0a0a0', fontSize: '14px' }}>
          Target Rate (%):
          <input 
            type="number" 
            step="0.1" 
            value={baseRate} 
            onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
            style={{ width: '70px', padding: '8px', borderRadius: '4px', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #444', outline: 'none' }}
          />
        </label>

        <button 
          onClick={handleReset}
          style={{ padding: '10px 15px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '4px', cursor: 'pointer' }}
        >
          Reset Session
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ color: '#a0a0a0', textDecoration: 'none' }}>← Back to Dashboard</Link>
      </div>
    </div>
  );
}