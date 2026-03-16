import { useState, useEffect } from 'react';
import moment from 'moment';
import { Link, useSearchParams } from 'react-router-dom';

export default function Clock() {
  const [time, setTime] = useState('');
  const [searchParams] = useSearchParams();
  const isObs = searchParams.get('obs') === 'true';

  useEffect(() => {
    // 1. Target all the layers React uses and force them to be transparent
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    // Save the original colors to restore them later if you leave the page
    const oldHtmlBg = html.style.backgroundColor;
    const oldBodyBg = body.style.backgroundColor;
    const oldRootBg = root ? root.style.backgroundColor : '';

    // Apply strict transparency
    html.style.setProperty('background-color', 'transparent', 'important');
    body.style.setProperty('background-color', 'transparent', 'important');
    if (root) {
      root.style.setProperty('background-color', 'transparent', 'important');
    }

    // 2. Run the clock timer
    const interval = setInterval(() => {
      setTime(moment().format('DD/MM/YYYY|(UTC+8)hh:mm:ssa')); 
    }, 1000);

    // 3. Cleanup on exit
    return () => {
      clearInterval(interval);
      html.style.backgroundColor = oldHtmlBg;
      body.style.backgroundColor = oldBodyBg;
      if (root) {
        root.style.backgroundColor = oldRootBg;
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'left', padding: 0, margin: 0 }}>
      {/* Restored the exact styling from your original HTML file */}
      <div style={{
        display: 'inline-block',
        fontFamily: 'monospace',
        fontSize: '30px',
        textAlign: 'right',
        color: 'lightgray',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        whiteSpace: 'nowrap'
      }}>
        {time}
      </div>
      
      <br />

      {!isObs && (
        <Link to="/" className="back-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
          ← Back to Features
        </Link>
      )}
    </div>
  );
}