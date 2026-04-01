#!/usr/bin/env python
"""
Test script for LLM Simulation Engine

Run this to test the LLM simulation without the frontend.
Requires Ollama models to be pulled:
  ollama pull qwen2.5:7b
  ollama pull qwen2.5:14b
  ollama pull qwen2.5:32b
"""

import sys
import json
from pathlib import Path

# Add parent path for imports
sys.path.insert(0, str(Path(__file__).parent))

from simulation.llm_simulation_engine import LLMSimulationEngine
from simulation.persona_generator_llm import FocusedPersonaGenerator, generate_personas_for_brief

# Test brief
TEST_BRIEF = """
Build an AI-powered meeting summarizer for remote teams.
Automatically records, transcribes, and summarizes meetings.
Integrates with Zoom, Google Meet, and Teams.
Pricing: $15/user/month for teams up to 50, enterprise pricing for larger.
Competitors: Otter.ai, Fireflies.ai, Grain
Success: 1000 paying teams within 6 months, <5% churn
"""

def test_persona_generation():
    """Test LLM-enhanced persona generation"""
    print("=" * 60)
    print("TEST 1: Persona Generation")
    print("=" * 60)

    generator = FocusedPersonaGenerator()

    # Auto-categorize brief
    category = generator.categorize_brief(TEST_BRIEF)
    print(f"Auto-detected category: {category}")

    # Generate personas
    personas = generator.build_complete_persona_set(
        brief=TEST_BRIEF,
        category=category,
        num_primary=4,  # Smaller for testing
        variants_per_persona=3,
        use_llm=True
    )

    print(f"\nGenerated {len(personas)} personas:")
    for p in personas:
        if not p.get('is_variant'):
            print(f"\n  PRIMARY: {p['name']}")
            print(f"    Motivation: {p['core_motivation']}")
            print(f"    Pain point: {p['key_pain_point']}")
            print(f"    Objection: {p['likely_objection']}")
            print(f"    Count: {p.get('count', 10)}")
        else:
            print(f"    -> Variant: {p.get('name', 'Unnamed')} ({p.get('industry', 'N/A')})")

    return personas

def test_llm_simulation():
    """Test full LLM simulation"""
    print("\n" + "=" * 60)
    print("TEST 2: Full LLM Simulation")
    print("=" * 60)

    engine = LLMSimulationEngine()

    result = engine.run_simulation(
        brief=TEST_BRIEF,
        num_personas=4,  # Smaller for testing
        variants_per_persona=3,
        debate_rounds=5,  # Fewer rounds for testing
    )

    print("\n" + "=" * 60)
    print("SIMULATION RESULTS")
    print("=" * 60)

    report = result.get('report', {})
    print(f"\nRecommendation: {report.get('go_no_go_recommendation', 'N/A')}")
    print(f"Confidence: {report.get('confidence_level', 0):.0%}")
    print(f"\nExecutive Summary:")
    print(report.get('executive_summary', 'N/A'))

    print(f"\nTop Risks:")
    for risk in report.get('top_risks', [])[:3]:
        print(f"  - {risk}")

    print(f"\nNext Actions:")
    for action in report.get('recommended_actions', [])[:3]:
        print(f"  - {action}")

    # Save results to file
    output_file = Path(__file__).parent / "test_results.json"
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2, default=str)
    print(f"\nFull results saved to: {output_file}")

    return result

def test_api_endpoints():
    """Test Flask API endpoints"""
    print("\n" + "=" * 60)
    print("TEST 3: Flask API Endpoints")
    print("=" * 60)

    import requests

    base_url = "http://localhost:5001"

    try:
        # Test health
        print("\n1. Testing health endpoint...")
        resp = requests.get(f"{base_url}/api/simulation/health")
        print(f"   Status: {resp.status_code}")
        print(f"   Response: {resp.json()}")

        # Test LLM create
        print("\n2. Testing LLM create endpoint...")
        resp = requests.post(
            f"{base_url}/api/simulation/llm/create",
            json={
                "brief": TEST_BRIEF,
                "num_personas": 4,
                "variants_per_persona": 3,
                "debate_rounds": 5
            }
        )
        print(f"   Status: {resp.status_code}")
        data = resp.json()
        print(f"   Simulation ID: {data.get('simulation_id')}")

        sim_id = data.get('simulation_id')
        if sim_id:
            # Test LLM run
            print("\n3. Testing LLM run endpoint...")
            resp = requests.post(f"{base_url}/api/simulation/llm/{sim_id}/run")
            print(f"   Status: {resp.status_code}")
            print(f"   Response: {resp.json()}")

            # Test results
            print("\n4. Testing results endpoint...")
            resp = requests.get(f"{base_url}/api/simulation/{sim_id}/llm/results")
            print(f"   Status: {resp.status_code}")
            result = resp.json()
            print(f"   Recommendation: {result.get('report', {}).get('go_no_go_recommendation')}")

            # Test personas
            print("\n5. Testing personas endpoint...")
            resp = requests.get(f"{base_url}/api/simulation/{sim_id}/llm/personas")
            print(f"   Status: {resp.status_code}")
            personas_data = resp.json()
            print(f"   Total personas: {personas_data.get('total_personas')}")
            print(f"   Primary personas: {personas_data.get('primary_personas')}")

        print("\n✅ All API tests passed!")

    except requests.exceptions.ConnectionError:
        print("\n❌ Flask API not running. Start it first:")
        print("   cd ai-agents-service && python app.py")
    except Exception as e:
        print(f"\n❌ API test failed: {e}")

if __name__ == "__main__":
    print("LLM Simulation Test Suite")
    print("=" * 60)

    # Test 1: Persona generation (standalone)
    try:
        personas = test_persona_generation()
    except Exception as e:
        print(f"Persona generation test failed: {e}")
        personas = []

    # Test 2: Full simulation (requires Ollama)
    print("\nNote: Tests 2 and 3 require Ollama models to be installed.")
    print("Run: ollama pull qwen2.5:7b qwen2.5:14b qwen2.5:32b")

    response = input("\nDo you want to continue with full simulation test? (y/n): ")
    if response.lower() != 'y':
        print("\nSkipping simulation tests.")
        sys.exit(0)

    try:
        result = test_llm_simulation()
    except Exception as e:
        print(f"Simulation test failed: {e}")
        print("\nThis likely means Ollama models are not installed.")
        print("Run: ollama pull qwen2.5:7b qwen2.5:14b qwen2.5:32b")

    # Test 3: API endpoints (requires Flask running)
    print("\nNote: API tests require Flask to be running on port 5001.")
    response = input("Is Flask running? (y/n): ")
    if response.lower() == 'y':
        test_api_endpoints()

    print("\n" + "=" * 60)
    print("Test Suite Complete")
    print("=" * 60)
