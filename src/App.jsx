import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Clock from './components/Clock';
import QRCodeGenerator from './components/QRCodeGenerator';

// We extract the dashboard into its own mini-component for cleaner code
function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>My Random Features</h1>
      <p>Click on a card below to view the feature.</p>
      
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

        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <div className="feature-title">Feature 3</div>
        </div>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;