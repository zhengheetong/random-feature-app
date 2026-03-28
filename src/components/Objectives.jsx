import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Objectives() {
  const [searchParams] = useSearchParams();
  const isObs = searchParams.get("obs") === "true";
  const [copied, setCopied] = useState(false);

  // 1. Initialize our task list from memory
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("streamObjectives");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, text: "Start Stream", completed: true },
          { id: 2, text: "Write some React code", completed: false },
          { id: 3, text: "Deploy to GitHub Pages", completed: false },
        ];
  });

  const [newTaskText, setNewTaskText] = useState("");

  // 2. Sync tasks to memory and listen for changes from the Dock
  useEffect(() => {
    localStorage.setItem("streamObjectives", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "streamObjectives") {
        setTasks(JSON.parse(e.newValue || "[]"));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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

  // 3. Task Management Functions
  const addTask = () => {
    if (newTaskText.trim() === "") return;
    const newTask = {
      id: Date.now(), // simple unique ID
      text: newTaskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Clear all objectives?")) setTasks([]);
  };

  const handleCopyObsLink = () => {
    const obsParams = new URLSearchParams(searchParams);
    obsParams.set("obs", "true");
    const fullUrl = `${window.location.origin}${window.location.pathname}#/objectives?${obsParams.toString()}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        padding: isObs ? "10px" : "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: isObs ? "flex-start" : "center",
      }}
    >
      {/* --- THE OVERLAY (Visible on Stream) --- */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "15px 25px",
          borderRadius: "12px",
          color: "white",
          fontFamily: "sans-serif",
          minWidth: "250px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2
          style={{
            margin: "0 0 15px 0",
            fontSize: "20px",
            color: "#f1c40f",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Current Objectives
        </h2>

        {tasks.length === 0 ? (
          <div
            style={{ color: "#7f8c8d", fontStyle: "italic", fontSize: "15px" }}
          >
            No active objectives.
          </div>
        ) : (
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "18px",
                  // Smooth CSS transition for the strike-through effect
                  opacity: task.completed ? 0.4 : 1,
                  textDecoration: task.completed ? "line-through" : "none",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <span style={{ color: task.completed ? "#2ecc71" : "#e74c3c" }}>
                  {task.completed ? "✓" : "○"}
                </span>
                {task.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- THE CONTROLS (Hidden in OBS) --- */}
      {!isObs && (
        <div className="control-panel">
          <h3>Objective Controls</h3>

          {/* Add New Task */}
          <div className="control-group" style={{ marginBottom: "20px" }}>
            <input
              type="text"
              className="control-input control-flex-2"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="What are we doing next?"
              style={{ margin: 0 }}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button
              className="control-btn primary control-flex-1"
              onClick={addTask}
              style={{ width: "auto" }}
            >
              Add
            </button>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #333", marginBottom: "15px" }} />

          {/* Manage Tasks List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "20px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#2c2c2c",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  border: "1px solid #444",
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  style={{ cursor: "pointer", width: "18px", height: "18px" }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: "15px",
                    color: task.completed ? "#95a5a6" : "#e0e0e0",
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.text}
                </span>
                <button
                  className="control-btn danger"
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: "5px 10px", width: "auto", fontSize: "12px" }}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="control-group">
            <button className="control-btn secondary control-flex-1" onClick={clearAll}>
              Clear All
            </button>
            <button
              className={`control-btn ${copied ? "success" : "secondary"} control-flex-2`}
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
