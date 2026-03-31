"""
AI Agents Service - Bridge between PM Simulator and AI Agents System
"""

import os
import sys
import json
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
AI_AGENTS_PATH = Path(os.getenv('AI_AGENTS_SYSTEM_PATH', r'C:\Users\DELL\ai-agents-system'))
PROJECT_ROOT = Path(os.getenv('PM_SIMULATOR_ROOT', r'C:\Users\DELL\pm-simulator'))

# Add AI agents system to path
sys.path.insert(0, str(AI_AGENTS_PATH))

class AIAgentsService:
    """Service to interact with AI Agents System"""

    def __init__(self):
        self.agents = {}
        self._initialize_agents()

    def _initialize_agents(self):
        """Initialize all AI agents"""
        try:
            # Import agent modules
            from architect.designer import ArchitectAgent
            from builder.coder import BuilderAgent
            from qa.tester import QAEngineerAgent
            from security.auditor import SecurityAuditorAgent
            from devops.engineer import DevOpsEngineerAgent
            from documentation.writer import DocumentationWriterAgent

            # Initialize agents
            self.agents['architect'] = ArchitectAgent(PROJECT_ROOT)
            self.agents['builder'] = BuilderAgent(PROJECT_ROOT)
            self.agents['qa'] = QAEngineerAgent(PROJECT_ROOT)
            self.agents['security'] = SecurityAuditorAgent(PROJECT_ROOT)
            self.agents['devops'] = DevOpsEngineerAgent(PROJECT_ROOT)
            self.agents['docs'] = DocumentationWriterAgent(PROJECT_ROOT)

            print("All AI agents initialized successfully")
        except Exception as e:
            print(f"Warning: Could not initialize all agents: {e}")
            # Create mock agents for development
            self._create_mock_agents()

    def _create_mock_agents(self):
        """Create mock agents for development when real agents aren't available"""
        self.agents = {
            'architect': MockAgent('Architect'),
            'builder': MockAgent('Builder'),
            'qa': MockAgent('QA Engineer'),
            'security': MockAgent('Security Auditor'),
            'devops': MockAgent('DevOps Engineer'),
            'docs': MockAgent('Documentation Writer'),
        }

    def get_agent(self, agent_name: str):
        """Get an agent by name"""
        return self.agents.get(agent_name)

    def run_prd_generation(self, template_data: dict) -> dict:
        """Generate PRD content using AI agents"""
        try:
            docs_agent = self.agents.get('docs')
            if not docs_agent:
                return {'error': 'Documentation agent not available'}

            result = docs_agent.execute('generate_prd', {
                'template': template_data.get('template'),
                'industry': template_data.get('industry'),
                'scenario': template_data.get('scenario'),
                'user_inputs': template_data.get('formState', {})
            })

            return {'success': True, 'result': result}
        except Exception as e:
            return {'error': str(e)}

    def run_code_review(self, code: str, file_path: str) -> dict:
        """Review code using QA and Security agents"""
        try:
            qa_agent = self.agents.get('qa')
            security_agent = self.agents.get('security')

            qa_result = qa_agent.execute('code_review', {
                'code': code,
                'file_path': file_path
            })

            security_result = security_agent.execute('security_scan', {
                'code': code,
                'file_path': file_path
            })

            return {
                'success': True,
                'qa_review': qa_result,
                'security_review': security_result
            }
        except Exception as e:
            return {'error': str(e)}

    def run_security_scan(self, file_paths: list) -> dict:
        """Run security scan on files"""
        try:
            security_agent = self.agents.get('security')

            results = []
            for file_path in file_paths:
                result = security_agent.execute('security_scan', {
                    'file_path': str(file_path)
                })
                results.append(result)

            return {'success': True, 'results': results}
        except Exception as e:
            return {'error': str(e)}

    def generate_documentation(self, module_path: str) -> dict:
        """Generate documentation for a module"""
        try:
            docs_agent = self.agents.get('docs')

            result = docs_agent.execute('generate_docs', {
                'module_path': module_path
            })

            return {'success': True, 'result': result}
        except Exception as e:
            return {'error': str(e)}

    def run_architect_review(self, description: str) -> dict:
        """Get architectural review/suggestions"""
        try:
            architect_agent = self.agents.get('architect')

            result = architect_agent.execute('architect_review', {
                'description': description
            })

            return {'success': True, 'result': result}
        except Exception as e:
            return {'error': str(e)}


class MockAgent:
    """Mock agent for development"""

    def __init__(self, name: str):
        self.name = name

    def execute(self, action: str, data: dict) -> dict:
        """Execute a mock action"""
        return {
            'agent': self.name,
            'action': action,
            'status': 'mock_response',
            'message': f'{self.name} would process: {action}',
            'data': data
        }


# Global service instance
ai_service = AIAgentsService()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'agents': list(ai_service.agents.keys())
    })


@app.route('/api/agents', methods=['GET'])
def list_agents():
    """List available agents"""
    return jsonify({
        'agents': [
            {'name': 'architect', 'description': 'System architecture and design'},
            {'name': 'builder', 'description': 'Code generation and scaffolding'},
            {'name': 'qa', 'description': 'Code review and testing'},
            {'name': 'security', 'description': 'Security audits and vulnerability scanning'},
            {'name': 'devops', 'description': 'CI/CD and infrastructure'},
            {'name': 'docs', 'description': 'Documentation generation'},
        ]
    })


@app.route('/api/agents/<agent_name>/execute', methods=['POST'])
def execute_agent(agent_name):
    """Execute an agent action"""
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    agent = ai_service.get_agent(agent_name)
    if not agent:
        return jsonify({'error': f'Agent {agent_name} not found'}), 404

    action = data.get('action', 'default')
    result = agent.execute(action, data)

    return jsonify(result)


@app.route('/api/ai/generate-prd', methods=['POST'])
def generate_prd():
    """Generate PRD content using AI"""
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    result = ai_service.run_prd_generation(data)

    if 'error' in result:
        return jsonify(result), 500

    return jsonify(result)


@app.route('/api/ai/code-review', methods=['POST'])
def code_review():
    """Review code using AI"""
    data = request.json

    if not data or 'code' not in data:
        return jsonify({'error': 'No code provided'}), 400

    result = ai_service.run_code_review(
        data.get('code'),
        data.get('file_path', 'unknown')
    )

    if 'error' in result:
        return jsonify(result), 500

    return jsonify(result)


@app.route('/api/ai/security-scan', methods=['POST'])
def security_scan():
    """Run security scan on files"""
    data = request.json

    if not data or 'file_paths' not in data:
        return jsonify({'error': 'No file paths provided'}), 400

    result = ai_service.run_security_scan(data.get('file_paths'))

    if 'error' in result:
        return jsonify(result), 500

    return jsonify(result)


@app.route('/api/ai/generate-docs', methods=['POST'])
def generate_docs():
    """Generate documentation"""
    data = request.json

    if not data or 'module_path' not in data:
        return jsonify({'error': 'No module path provided'}), 400

    result = ai_service.generate_documentation(data.get('module_path'))

    if 'error' in result:
        return jsonify(result), 500

    return jsonify(result)


@app.route('/api/ai/architect-review', methods=['POST'])
def architect_review():
    """Get architectural review"""
    data = request.json

    if not data or 'description' not in data:
        return jsonify({'error': 'No description provided'}), 400

    result = ai_service.run_architect_review(data.get('description'))

    if 'error' in result:
        return jsonify(result), 500

    return jsonify(result)


if __name__ == '__main__':
    port = int(os.getenv('AI_SERVICE_PORT', 5001))
    print(f"Starting AI Agents Service on port {port}")
    print(f"AI Agents Path: {AI_AGENTS_PATH}")
    print(f"Project Root: {PROJECT_ROOT}")
    app.run(host='0.0.0.0', port=port, debug=True)
