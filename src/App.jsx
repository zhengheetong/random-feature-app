import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Clock from './components/Clock';
import QRCodeGenerator from './components/QRCodeGenerator';
import Counter from './components/Counter';
import Wheel from './components/Wheel';
import Objectives from './components/Objectives';
import TweetGenerator from './components/TweetGenerator';

// We extract the dashboard into its own mini-component for cleaner code
function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="app-title">My Random Features</h1>
      <p className='app-subtitle'>Click on a card below to view the feature.</p>
      
      <div className="cards-grid">
        {/* We use React Router's <Link> instead of <a> tags so the page doesn't reload */}
        <Link to="/clock" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">🕒</div>
          <div className="feature-title">Simple Clock</div>
        </Link>

        <Link to="/qrcode" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">📱</div>
          <div className="feature-title">QR Generator</div>
        </Link>

        <Link to="/counter" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">💯</div>
          <div className="feature-title">Stream Counter</div>
        </Link>

        <Link to="/wheel" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">🎡</div>
          <div className="feature-title">Spin Wheel</div>
        </Link>
        <Link to="/objectives" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">📝</div>
          <div className="feature-title">Live Objectives</div>
        </Link>
        <Link to="/tweet" className="feature-card" style={{ textDecoration: 'none' }}>
          <div className="feature-icon">🐦</div>
          <div className="feature-title">Social Card</div>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;