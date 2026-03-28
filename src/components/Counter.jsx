import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Counter() {
  const [searchParams] = useSearchParams();
  const isObs = searchParams.get("obs") === "true";

  // 1. Initialize count and label from local memory
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem("streamCounter");
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  });

  const [label, setLabel] = useState(() => {
    return localStorage.getItem("streamCounterLabel") || "DEATHS:";
  });

  // 2. New states for our custom controls
  const [step, setStep] = useState(1); // How much to add/subtract per click
  const [exactValue, setExactValue] = useState(""); // For jumping to a specific number

  const [copied, setCopied] = useState(false);

  // Save changes to local memory
  useEffect(() => {
    localStorage.setItem("streamCounter", count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem("streamCounterLabel", label);
  }, [label]);

  // Sync changes between windows/OBS docks
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "streamCounter") {
        setCount(parseInt(e.newValue, 10) || 0);
      }
      if (e.key === "streamCounterLabel") {
        setLabel(e.newValue || "");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Force transparent background for OBS overlay
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    const oldHtmlBg = html.style.backgroundColor;
    const oldBodyBg = body.style.backgroundColor;
    const oldRootBg = root ? root.style.backgroundColor : "";

    html.style.setProperty("background-color", "transparent", "important");
    body.style.setProperty("background-color", "transparent", "important");
    if (root)
      root.style.setProperty("background-color", "transparent", "important");

    return () => {
      html.style.backgroundColor = oldHtmlBg;
      body.style.backgroundColor = oldBodyBg;
      if (root) root.style.backgroundColor = oldRootBg;
    };
  }, []);

  const handleCopyObsLink = () => {
    const obsParams = new URLSearchParams(searchParams);
    obsParams.set("obs", "true");
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
      setExactValue(""); // Clear the input box after setting it
    }
  };

  return (
    <div style={{ textAlign: "center", padding: isObs ? 0 : "20px" }}>
      {/* The Display (Visible in OBS) */}
      <div
        style={{
          display: "inline-block",
          fontFamily: "monospace",
          fontSize: "60px",
          fontWeight: "bold",
          color: "white",
          textShadow:
            "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          padding: "10px 20px",
          whiteSpace: "nowrap",
        }}
      >
        {label} {count}
      </div>

      <br />

      {/* The Controls (Hidden in OBS) */}
      {!isObs && (
        <div className="control-panel">
          <h3>Counter Controls</h3>

          <div className="control-group">
            {/* Label Input */}
            <label className="control-label control-flex-2">
              Text Label
              <input
                type="text"
                className="control-input"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., DEATHS:"
              />
            </label>

            {/* Step Amount Input */}
            <label className="control-label control-flex-1">
              Step Amount
              <input
                type="number"
                className="control-input"
                value={step}
                onChange={(e) => setStep(parseInt(e.target.value, 10) || 1)}
                min="1"
              />
            </label>
          </div>

          {/* Plus / Minus Buttons */}
          <div className="control-group">
            <button
              className="control-btn danger control-flex-1"
              style={{ fontSize: "24px", padding: "15px" }}
              onClick={() => setCount((c) => c - step)}
            >
              - {step}
            </button>
            <button
              className="control-btn success control-flex-1"
              style={{ fontSize: "24px", padding: "15px" }}
              onClick={() => setCount((c) => c + step)}
            >
              + {step}
            </button>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #333", marginBottom: "20px" }} />

          {/* Set Exact Value Section */}
          <div className="control-group">
            <label className="control-label control-flex-1">
              Set Specific Number
              <input
                type="number"
                className="control-input"
                value={exactValue}
                onChange={(e) => setExactValue(e.target.value)}
                placeholder="e.g., 100"
                onKeyDown={(e) => e.key === "Enter" && handleSetExact()}
              />
            </label>
            <button
              className="control-btn primary"
              style={{ width: "auto" }}
              onClick={handleSetExact}
            >
              Set
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              className={`control-btn ${copied ? "success" : "secondary"}`}
              onClick={handleCopyObsLink}
            >
              {copied ? "✅ Copied!" : "📋 Copy OBS Link"}
            </button>

            <button
              className="control-btn secondary"
              style={{ backgroundColor: "#4a4a4a" }}
              onClick={() => {
                if (window.confirm("Are you sure you want to reset the counter to zero?")) {
                  setCount(0);
                }
              }}
            >
              Reset to Zero
            </button>
          </div>

          <div className="back-link-container">
            <Link to="/" className="back-link">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
