import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";

// A curated list of gorgeous, professional gradient pairs!
const GRADIENT_PRESETS = [
  ["#ff7e5f", "#feb47b"], // Sunset
  ["#00c6ff", "#0072ff"], // Blue Skies
  ["#f12711", "#f5af19"], // Fire
  ["#8e2de2", "#4a00e0"], // Purple Dream
  ["#11998e", "#38ef7d"], // Green Grass
  ["#fc4a1a", "#f7b733"], // Orange Juice
  ["#00b09b", "#96c93d"], // Emerald
  ["#ee0979", "#ff6a00"], // Peach
  ["#a8c0ff", "#3f2b96"], // Deep Blue
  ["#fd1d1d", "#833ab4"], // Cyberpunk/Instagram
];

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState("");
  const [qrValue, setQrValue] = useState("");

  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const [borderSize, setBorderSize] = useState(20);
  const [borderType, setBorderType] = useState("gradient");
  const [borderColor1, setBorderColor1] = useState("#3498db");
  const [borderColor2, setBorderColor2] = useState("#9b59b6");

  const qrRef = useRef(null);

  const handleGenerate = () => {
    if (inputText.trim()) {
      setQrValue(inputText);
    }
  };

  const handleDownload = () => {
    if (!qrValue) return;

    const originalCanvas = qrRef.current.querySelector("canvas");
    if (originalCanvas) {
      const canvasWithBorder = document.createElement("canvas");
      const ctx = canvasWithBorder.getContext("2d");
      const border = parseInt(borderSize, 10);

      canvasWithBorder.width = originalCanvas.width + border * 2;
      canvasWithBorder.height = originalCanvas.height + border * 2;

      if (borderType === "gradient") {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvasWithBorder.width,
          canvasWithBorder.height,
        );
        gradient.addColorStop(0, borderColor1);
        gradient.addColorStop(1, borderColor2);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = borderColor1;
      }

      ctx.fillRect(0, 0, canvasWithBorder.width, canvasWithBorder.height);
      ctx.drawImage(originalCanvas, border, border);

      const pngUrl = canvasWithBorder.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "custom-qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Picks a random pair from our curated list
  const handleRandomGradient = () => {
    const randomPair =
      GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];
    setBorderColor1(randomPair[0]);
    setBorderColor2(randomPair[1]);
  };

  const previewBackground = !qrValue
    ? "#ecf0f1"
    : borderType === "gradient"
      ? `linear-gradient(135deg, ${borderColor1}, ${borderColor2})`
      : borderColor1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* QR Code Display Area */}
      <div
        ref={qrRef}
        style={{
          background: previewBackground,
          padding: `${borderSize}px`,
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          marginBottom: "30px",
          minWidth: "220px",
          minHeight: "220px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "padding 0.2s",
        }}
      >
        {qrValue ? (
          <QRCodeCanvas
            value={qrValue}
            size={500}
            fgColor={fgColor}
            bgColor={bgColor}
            level={"H"}
            includeMargin={false}
          />
        ) : (
          <div
            style={{
              color: "#95a5a6",
              textAlign: "center",
              fontFamily: "sans-serif",
              fontStyle: "italic",
            }}
          >
            Enter a link below
            <br />
            to generate QR
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div
        className="control-panel"
        style={{
          position: "fixed", // This makes it float!
          top: "20px",
          right: "20px",
          marginTop: 0,
          width: "360px", // Slightly thinner to save screen space
          maxHeight: "calc(100vh - 40px)", // Prevents it from going off-screen
          overflowY: "auto", // Adds a scrollbar if the screen is short
          backgroundColor: "rgba(30, 30, 30, 0.85)", // Slightly transparent override
          backdropFilter: "blur(12px)", // Adds a modern frosted-glass blur
          zIndex: 1000, // Ensures it always stays on top of the tweet
          boxShadow: "0 16px 40px rgba(0,0,0,0.6)", // Deep shadow for 3D effect
        }}
      >
        <h3>QR Code Generator</h3>

        <label className="control-label">
          Content / Link
          <input
            type="text"
            className="control-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a URL or text..."
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </label>

        <div className="control-group">
          <label className="control-label control-flex-1">
            QR Dots Color
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                style={{
                  width: "35px",
                  height: "35px",
                  padding: "0",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
              />
              <span style={{ color: "#e0e0e0", fontFamily: "monospace" }}>
                {fgColor.toUpperCase()}
              </span>
            </div>
          </label>
          <label className="control-label control-flex-1">
            QR Background
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{
                  width: "35px",
                  height: "35px",
                  padding: "0",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
              />
              <span style={{ color: "#e0e0e0", fontFamily: "monospace" }}>
                {bgColor.toUpperCase()}
              </span>
            </div>
          </label>
        </div>

        <div
          style={{
            backgroundColor: "#252525",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "25px",
            border: "1px solid #333",
          }}
        >
          <h4
            style={{
              margin: "0 0 15px 0",
              color: "#a0a0a0",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Border Settings
          </h4>

          <div className="control-group" style={{ marginBottom: "15px" }}>
            <label className="control-label control-flex-1">
              Border Style
              <select
                className="control-input"
                style={{ marginTop: "6px", width: "100%", padding: "10px" }}
                value={borderType}
                onChange={(e) => setBorderType(e.target.value)}
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
              </select>
            </label>

            <label className="control-label control-flex-1">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Size</span>
                <span style={{ fontFamily: "monospace", color: "#a0a0a0" }}>
                  {borderSize}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={borderSize}
                onChange={(e) => setBorderSize(e.target.value)}
                style={{ width: "100%", marginTop: "10px", cursor: "pointer" }}
              />
            </label>
          </div>

          <div
            className="control-group"
            style={{ marginBottom: borderType === "gradient" ? "15px" : "0" }}
          >
            <label className="control-label control-flex-1">
              {borderType === "gradient" ? "Start Color" : "Border Color"}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <input
                  type="color"
                  value={borderColor1}
                  onChange={(e) => setBorderColor1(e.target.value)}
                  style={{
                    width: "35px",
                    height: "35px",
                    padding: "0",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </label>

            {borderType === "gradient" && (
              <label className="control-label control-flex-1">
                End Color
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                  <input
                    type="color"
                    value={borderColor2}
                    onChange={(e) => setBorderColor2(e.target.value)}
                    style={{
                      width: "35px",
                      height: "35px",
                      padding: "0",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
              </label>
            )}
          </div>

          {/* --- NEW: Randomize Button --- */}
          {borderType === "gradient" && (
            <button className="control-btn secondary" onClick={handleRandomGradient}>
              🎲 Randomize Gradient
            </button>
          )}
        </div>

        <div className="control-group">
          <button
            className="control-btn primary control-flex-1"
            onClick={handleGenerate}
            style={{ fontSize: "15px", padding: "12px" }}
          >
            Generate
          </button>

          <button
            className={`control-btn ${qrValue ? "success" : "secondary"} control-flex-1`}
            disabled={!qrValue}
            onClick={handleDownload}
            style={{ fontSize: "15px", padding: "12px", cursor: qrValue ? "pointer" : "not-allowed" }}
          >
            Download PNG
          </button>
        </div>

        <div className="back-link-container">
          <Link to="/" className="back-link">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
