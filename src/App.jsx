import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Clock from './components/Clock';
import QRCodeGenerator from './components/QRCodeGenerator';
import Counter from './components/Counter';
import Wheel from './components/Wheel';
import Objectives from './components/Objectives';
import TweetGenerator from './components/TweetGenerator';
import GachaTracker from './components/GachaTracker';
import ClipboardSaver from './components/ClipboardSaver';

// We extract the dashboard into its own mini-component for cleaner code
function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="app-title">My Random Features</h1>
      <p className='app-subtitle'>Click on a card below to view the feature.</p>
      
      <div className="cards-grid">
        {/* 1. OBS CLOCK */}
        <Link to="/clock" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="feature-title">OBS Clock</div>
        </Link>

        {/* 2. QR GENERATOR */}
        <Link to="/qr" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="7" y="7" width="1" height="1"/><rect x="16" y="7" width="1" height="1"/><rect x="7" y="16" width="1" height="1"/></svg>
          </div>
          <div className="feature-title">QR Generator</div>
        </Link>

        {/* 3. SPIN WHEEL */}
        <Link to="/wheel" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/></svg>
          </div>
          <div className="feature-title">Spin Wheel</div>
        </Link>

        {/* 4. X POST FETCHER */}
        <Link to="/tweet" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </div>
          <div className="feature-title">X Post Fetcher</div>
        </Link>

        {/* 5. OBJECTIVES LIST */}
        <Link to="/objectives" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            {/* Square with Tick SVG */}
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="feature-title">Objectives</div>
        </Link>

        {/* 6. COUNTER */}
        <Link to="/counter" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
          <div className="feature-title">Counter</div>
        </Link>

        {/* 7. GACHA TRACKER */}
        <Link to="/gacha" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            {/* A Star icon for Gacha pulls */}
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="feature-title">Gacha Tracker</div>
        </Link>

        {/* 8. CLIPBOARD SAVER */}
        <Link to="/clipboard" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">
            {/* A modern clipboard/image SVG */}
            <svg viewBox="0 0 24 24">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <circle cx="9" cy="14" r="2" />
              <path d="M20 12l-6.5-6.5a1.5 1.5 0 0 0-2.12 0L4 13" />
            </svg>
          </div>
          <div className="feature-title">Clipboard Image Saver</div>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* The main dashboard is at the root URL (/) */}
          <Route path="/" element={<Dashboard />} />
          
          {/* These are your direct URLs that you can paste into OBS */}
          <Route path="/clock" element={<Clock />} />
          <Route path="/qrcode" element={<QRCodeGenerator />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/wheel" element={<Wheel />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/tweet" element={<TweetGenerator />} />
          <Route path="/gacha" element={<GachaTracker />} />
          <Route path="/clipboard" element={<ClipboardSaver />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;