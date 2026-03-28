import { useState, useEffect } from "react";
import moment from "moment";
import { Link, useSearchParams } from "react-router-dom";

export default function Clock() {
  const [time, setTime] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const isObs = searchParams.get("obs") === "true";
  const urlFormat = searchParams.get("format") || "DD/MM/YYYY|(UTC+8)hh:mm:ssa";

  const [inputFormat, setInputFormat] = useState(urlFormat);
  const [copied, setCopied] = useState(false);

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

    const interval = setInterval(() => {
      setTime(moment().format(urlFormat));
    }, 1000);

    return () => {
      clearInterval(interval);
      html.style.backgroundColor = oldHtmlBg;
      body.style.backgroundColor = oldBodyBg;
      if (root) root.style.backgroundColor = oldRootBg;
    };
  }, [urlFormat]);

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams);
    if (inputFormat.trim()) newParams.set("format", inputFormat);
    else newParams.delete("format");
    setSearchParams(newParams);
  };

  const handleCopyObsLink = () => {
    const obsParams = new URLSearchParams(searchParams);
    obsParams.set("obs", "true");
    const fullUrl = `${window.location.origin}${window.location.pathname}#/clock?${obsParams.toString()}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        textAlign: "left",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: isObs ? "flex-start" : "center",
      }}
    >
      {/* OBS Stream Display */}
      <div
        style={{
          display: "inline-block",
          fontFamily: "monospace",
          fontSize: "30px",
          color: "lightgray",
          textAlign: "right",
          borderRadius: "10px",
          padding: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          whiteSpace: "nowrap",
        }}
      >
        {time}
      </div>

      <br />

      {/* Dark Mode Control Panel */}
      {!isObs && (
        <div className="control-panel">
          <h3>Clock Settings</h3>

          <label className="control-label">
            Time Format (moment.js)
            <input
              type="text"
              className="control-input"
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
            />
          </label>

          <div className="control-group">
            <button
              className="control-btn primary control-flex-1"
              onClick={handleApply}
            >
              Apply Format
            </button>
            <button
              className={`control-btn ${copied ? "success" : "secondary"} control-flex-1`}
              onClick={handleCopyObsLink}
            >
              {copied ? "✅ Copied!" : "📋 Copy OBS Link"}
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
