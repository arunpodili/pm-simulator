"""
Interactive PM Simulator Visualization Server
Run: python app.py
then open http://localhost:5003 in your browser
"""

from flask import Flask, render_template, jsonify, send_from_directory
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

# PM Simulator Architecture Data
SIMULATION_DATA = {
    "nodes": [
        # User Input
        {"id": "user_input", "label": "Product Brief", "type": "input", "x": 400, "y": 50,
         "description": "User enters product idea with problem, target, pricing, and category",
         "details": ["Problem statement", "Target users", "Pricing strategy", "Product category"]},

        # Router
        {"id": "router", "label": "Mode Router", "type": "router", "x": 400, "y": 150,
         "description": "Determines which simulation mode to run based on user needs",
         "details": ["Quick validation needed? → Mock Mode", "Market numbers? → Rule-Based", "Deep insights? → LLM Debate"]},

        # Three Modes
        {"id": "mock_mode", "label": "Mock Mode", "type": "mode", "x": 150, "y": 300,
         "description": "Fast template-based simulation for quick iteration",
         "details": ["Speed: 2 seconds", "Uses: Template personas", "Output: Quick Go/No-Go", "Best for: Idea iteration"],
         "metrics": {"time": "2s", "personas": 5, "accuracy": "Medium"}},

        {"id": "rule_based", "label": "Rule-Based", "type": "mode", "x": 400, "y": 300,
         "description": "Statistical simulation of 1000 users with behavioral modeling",
         "details": ["Speed: 5 minutes", "Uses: 1000 statistical agents", "Output: Conversion %, viral coef", "Best for: Market projections"],
         "metrics": {"time": "5min", "personas": 1000, "accuracy": "High"}},

        {"id": "llm_debate", "label": "LLM Debate", "type": "mode", "x": 650, "y": 300,
         "description": "Multi-agent AI debate for qualitative insights",
         "details": ["Speed: 15 minutes", "Uses: 50 AI agents", "Output: Deep insights, objections", "Best for: Feature refinement"],
         "metrics": {"time": "15min", "personas": 50, "accuracy": "Very High"}},

        # Mock Mode Steps
        {"id": "mock_step1", "label": "Template Lookup", "type": "step", "x": 50, "y": 450,
         "description": "Load pre-defined persona templates for the category",
         "details": ["No LLM calls", "Instant template matching", "Category-based archetypes"]},

        {"id": "mock_step2", "label": "Calculate Scores", "type": "step", "x": 150, "y": 550,
         "description": "Randomized but realistic scoring based on archetype adoption probabilities",
         "details": ["Apply adoption probabilities", "Add realistic variance", "Aggregate support/oppose"]},

        {"id": "mock_step3", "label": "Generate Report", "type": "step", "x": 250, "y": 450,
         "description": "Create recommendation using template strings",
         "details": ["Executive summary", "Recommendation (GO/ITERATE/NO-GO)", "Key insights", "Risks"]},

        # Rule-Based Steps
        {"id": "rule_step1", "label": "Generate 1000 Personas", "type": "step", "x": 300, "y": 450,
         "description": "Create statistical personas using real demographic distributions",
         "details": ["Age: Normal distribution", "Income: Log-normal", "Tech adoption: Rogers' diffusion", "Social connections: Power-law"]},

        {"id": "rule_step2", "label": "Build Social Graph", "type": "step", "x": 400, "y": 550,
         "description": "Create realistic network structure for viral effects",
         "details": ["10% super-connectors (50+ connections)", "60% average (5-15 connections)", "30% isolates (0-3 connections)"]},

        {"id": "rule_step3", "label": "30-Day Simulation", "type": "step", "x": 500, "y": 450,
         "description": "Run day-by-day simulation with market events and agent decisions",
         "details": ["Market events (competitors, viral moments)", "Agent decision loop", "Social graph updates", "Daily metrics recording"]},

        # LLM Debate Steps
        {"id": "llm_step1", "label": "Entity Extraction", "type": "step", "x": 550, "y": 450,
         "description": "LLM extracts key entities from the brief",
         "details": ["Problem, target users", "Value propositions", "Potential objections", "Market factors"]},

        {"id": "llm_step2", "label": "Generate Personas", "type": "step", "x": 650, "y": 550,
         "description": "Create focused behavioral archetypes",
         "details": ["Meeting Fatigue Manager", "Async-First Advocate", "Engineering Skeptic", "Enterprise Security Lead"]},

        {"id": "llm_step3", "label": "Multi-Agent Debate", "type": "step", "x": 750, "y": 450,
         "description": "10 rounds of AI agents debating the product",
         "details": ["90 LLM calls total", "Position tracking", "Influence networks", "Consensus building"]},

        # Results
        {"id": "results", "label": "Results Dashboard", "type": "output", "x": 400, "y": 700,
         "description": "Interactive visualization of simulation results",
         "details": ["Recommendation", "Metrics & charts", "Persona breakdown", "Actionable insights"]},

        # Supporting Components
        {"id": "validation", "label": "Validation Framework", "type": "support", "x": 100, "y": 650,
         "description": "Statistical validation against real-world benchmarks",
         "details": ["Kolmogorov-Smirnov tests", "Industry benchmark comparison", "Pattern matching"]},

        {"id": "database", "label": "SQLite Storage", "type": "support", "x": 700, "y": 650,
         "description": "Persistent storage for simulations and results",
         "details": ["Simulation history", "Threat database", "Scan results"]},
    ],
    "links": [
        # Main flow
        {"source": "user_input", "target": "router", "label": "brief"},
        {"source": "router", "target": "mock_mode", "label": "quick"},
        {"source": "router", "target": "rule_based", "label": "metrics"},
        {"source": "router", "target": "llm_debate", "label": "deep"},

        # Mock mode flow
        {"source": "mock_mode", "target": "mock_step1", "label": "start"},
        {"source": "mock_step1", "target": "mock_step2", "label": "templates"},
        {"source": "mock_step2", "target": "mock_step3", "label": "scores"},
        {"source": "mock_step3", "target": "results", "label": "report"},

        # Rule-based flow
        {"source": "rule_based", "target": "rule_step1", "label": "start"},
        {"source": "rule_step1", "target": "rule_step2", "label": "personas"},
        {"source": "rule_step2", "target": "rule_step3", "label": "network"},
        {"source": "rule_step3", "target": "results", "label": "metrics"},

        # LLM debate flow
        {"source": "llm_debate", "target": "llm_step1", "label": "start"},
        {"source": "llm_step1", "target": "llm_step2", "label": "entities"},
        {"source": "llm_step2", "target": "llm_step3", "label": "personas"},
        {"source": "llm_step3", "target": "results", "label": "insights"},

        # Support connections
        {"source": "validation", "target": "rule_step3", "label": "validates"},
        {"source": "database", "target": "results", "label": "stores"},
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    return jsonify(SIMULATION_DATA)

@app.route('/api/flow/<path>')
def get_flow(path):
    """Get detailed flow information for each mode"""
    flows = {
        'mock': {
            'title': 'Mock Mode Flow',
            'steps': [
                {'name': 'Input', 'desc': 'Product brief received', 'time': '0ms'},
                {'name': 'Category Match', 'desc': 'Find template for category', 'time': '10ms'},
                {'name': 'Load Archetypes', 'desc': 'Load 3-5 persona templates', 'time': '20ms'},
                {'name': 'Score Calculation', 'desc': 'Calculate support/oppose scores', 'time': '50ms'},
                {'name': 'Report Generation', 'desc': 'Generate template-based report', 'time': '100ms'},
                {'name': 'Output', 'desc': 'Return recommendation', 'time': '2s total'},
            ]
        },
        'rule': {
            'title': 'Rule-Based Simulation Flow',
            'steps': [
                {'name': 'Input', 'desc': 'Product brief + config', 'time': '0s'},
                {'name': 'Generate Personas', 'desc': 'Create 1000 statistical agents', 'time': '30s'},
                {'name': 'Build Network', 'desc': 'Create social graph', 'time': '45s'},
                {'name': 'Day 1-10', 'desc': 'Initial market penetration', 'time': '90s'},
                {'name': 'Day 11-20', 'desc': 'Viral growth phase', 'time': '90s'},
                {'name': 'Day 21-30', 'desc': 'Market saturation', 'time': '90s'},
                {'name': 'Calculate Metrics', 'desc': 'Final statistics', 'time': '15s'},
                {'name': 'Output', 'desc': 'Return predictions', 'time': '5min total'},
            ]
        },
        'llm': {
            'title': 'LLM Debate Flow',
            'steps': [
                {'name': 'Input', 'desc': 'Product brief', 'time': '0s'},
                {'name': 'Extract Entities', 'desc': 'LLM Call #1', 'time': '5s'},
                {'name': 'Generate Personas', 'desc': 'LLM Call #2 (5-7 archetypes)', 'time': '15s'},
                {'name': 'Debate Round 1', 'desc': 'LLM Calls #3-12', 'time': '60s'},
                {'name': 'Debate Round 2', 'desc': 'LLM Calls #13-22', 'time': '60s'},
                {'name': 'Debate Round 3-10', 'desc': 'LLM Calls #23-92', 'time': '8min'},
                {'name': 'Synthesize Report', 'desc': 'LLM Call #93', 'time': '10s'},
                {'name': 'Output', 'desc': 'Return insights', 'time': '15min total'},
            ]
        }
    }
    return jsonify(flows.get(path, {}))

if __name__ == '__main__':
    print("=" * 60)
    print("PM Simulator Interactive Visualization")
    print("=" * 60)
    print("\nOpen your browser and go to: http://localhost:5003")
    print("\nFeatures:")
    print("  • Click nodes to see details")
    print("  • Drag nodes to rearrange")
    print("  • Scroll to zoom")
    print("  • Click 'Play Simulation' to animate")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5003, debug=True)
