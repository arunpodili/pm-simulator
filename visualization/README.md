# PM Simulator - Interactive Visualization

An interactive, explorable graph of the PM Simulator architecture. This runs on your local machine and lets you click through every component to understand how the system works.

## Quick Start

### Option 1: Double-click to run (Windows)
1. Double-click `run.bat`
2. Wait for the browser to open automatically (or manually go to http://localhost:5003)

### Option 2: Command line
```bash
cd visualization
pip install -r requirements.txt
python app.py
```

Then open http://localhost:5003 in your browser.

## Features

### 🖱️ Interactive Graph
- **Click nodes** → See detailed information in the sidebar
- **Drag nodes** → Rearrange the layout
- **Scroll** → Zoom in/out
- **Hover** → See quick tooltip

### ▶️ Simulation Playback
Click "Play Simulation" to see animated data flow through the system.

### 📊 Mode Comparison
Click "Compare Modes" to see a side-by-side comparison of Mock, Rule-Based, and LLM Debate modes.

## What You'll See

The visualization shows:

1. **Input (Green)** - Where you enter your product brief
2. **Router (Yellow)** - Decides which simulation mode to run
3. **Simulation Modes (Blue)** - The three engines:
   - Mock Mode (2 seconds)
   - Rule-Based (5 minutes)
   - LLM Debate (15 minutes)
4. **Process Steps (Gray)** - Internal workings of each mode
5. **Output (Red)** - The results dashboard
6. **Support Components (Purple)** - Validation and storage

## Architecture

```
visualization/
├── app.py              # Flask server
├── run.bat            # Windows launcher
├── requirements.txt   # Python dependencies
├── README.md          # This file
└── templates/
    └── index.html     # Interactive D3.js visualization
```

## Troubleshooting

**Port already in use?**
- Change the port in `app.py` (line 166) from 5003 to something else

**Flask not found?**
```bash
pip install flask
```

**Browser doesn't open?**
- Manually navigate to http://localhost:5003

## Tech Stack

- **Backend**: Python Flask
- **Frontend**: D3.js v7
- **Visualization**: Force-directed graph with zoom/pan
- **No external data needed** - All data is embedded
