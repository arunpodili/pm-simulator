# Free LLM Research for PM-Simulator

**Date:** 2026-04-23
**Purpose:** Identify best free/open-source LLMs to improve simulation accuracy and speed

---

## Executive Summary

For PM-Simulator's persona simulation, we recommend a **hybrid approach**:
1. **DeepSeek R1** for deep reasoning (persona decision-making)
2. **Qwen 3 32B** for fast, multilingual persona generation
3. **Mistral Large 2** for function-calling (tool-using agents)

**Cost savings:** Self-hosting is **50-150x cheaper** than GPT-4o API.

---

## Top Open-Source LLMs (2026)

### 1. DeepSeek V3.2-Speciale / R1

| Attribute | Value |
|-----------|-------|
| Parameters | 685B MoE (37B active per token) |
| Context Window | 128K tokens |
| License | MIT (fully open, commercial use) |
| GitHub Stars | 102K+ |
| Best For | Chain-of-thought reasoning, decision-making |

**Benchmarks:**
- MMLU-Pro: ~86%
- HumanEval (Code): ~89%
- MATH-500: ~94%
- Arena-Hard: 85.5 (beats GPT-4o-0513 at 80.4)

**Why for PM-Simulator:**
- Best-in-class reasoning for persona decision-making
- MIT license = unrestricted commercial use
- Free API via `platform.deepseek.com`
- Ollama support: `ollama run deepseek-r1`

**Links:**
- [DeepSeek V3](https://deepseak.org/deepseek-v3/)
- [GitHub: deepseek-ai/DeepSeek-V3](https://github.com/deepseek-ai/DeepSeek-V3)
- [API Docs](https://api-docs.deepseek.com/news/news251201)

---

### 2. Qwen 3 (Alibaba)

| Attribute | Value |
|-----------|-------|
| Parameters | 0.6B to 235B MoE variants |
| Context Window | Up to 128K (32K for smaller) |
| License | Apache 2.0 (unrestricted) |
| Languages | 100+ with native fluency |
| Best For | Multilingual, coding, fast inference |

**Key Models:**
- `qwen3:8b` - Fits RTX 4070 (6GB VRAM with Q4)
- `qwen3:32b` - Best balance of speed/quality (20GB VRAM)
- `qwen3:235B-A22B` - Flagship, rivals GPT-4

**Hybrid Thinking Modes:**
- **Thinking mode** (`/think`): Chain-of-thought for complex reasoning
- **Non-thinking mode**: Fast responses for simple tasks

**Ollama Deployment:**
```bash
ollama run qwen3:8b     # Development
ollama run qwen3:32b    # Production
```

**Links:**
- [HuggingFace Guide](https://huggingface.co/blog/lynn-mikami/qwen-3-ollama-vllm)
- [GitHub: QwenLM/Qwen3](https://github.com/QwenLM/Qwen3)

---

### 3. Mistral Large 2

| Attribute | Value |
|-----------|-------|
| Parameters | 123B |
| Context Window | 128K |
| License | Apache 2.0 |
| Best For | Function-calling, tool-using agents |

**Why for PM-Simulator:**
- Best function-calling accuracy for tool integration
- European-hosted (GDPR compliant)
- Strong multi-step reasoning

---

### 4. Llama 4 Scout

| Attribute | Value |
|-----------|-------|
| Parameters | 109B MoE (17B active) |
| Context Window | **10M tokens** (unmatched) |
| License | Llama License (700M MAU limit) |
| Best For | Long-context, full codebase analysis |

**Why consider:**
- 10M token context = entire simulation history in context
- Good for analyzing full agent journeys over 90-day simulations

---

## Hardware Requirements

| RAM/VRAM | Models That Fit |
|----------|-----------------|
| 6-8 GB | Qwen3-4B, Gemma 3 (4B) |
| 16 GB | Qwen3-8B, Mistral 12B |
| 24-32 GB | Qwen3-32B (Q4 quantized) |
| 64 GB | Qwen3-235B, Mixtral 8x22B |
| 128 GB+ | DeepSeek-R1, Llama 4 Maverick |

**Your system (6.9GB RAM):** Best fits `qwen3:4b` or `qwen3:8b` with Q4 quantization via Ollama.

---

## Cost Comparison

| Approach | Cost per Million Tokens |
|----------|------------------------|
| GPT-4o API | $2.50 - $10.00 |
| DeepSeek API | $0.14 - $0.28 |
| Self-hosted Qwen3-32B | $0.05 - $0.10 |
| Self-hosted Qwen3-8B | $0.01 - $0.02 |

**Self-hosting saves 50-150x compared to GPT-4o.**

---

## Research Papers on Persona Simulation

### Key Papers (2025-2026)

1. **[SPASM: Stable Persona-driven Agent Simulation](https://www.arxiv.org/abs/2604.09212)** (April 2026)
   - Addresses persona drift, role confusion, "echoing"
   - Tested on 4,500 personas, 45,000 conversations
   - Models tested: GPT-4o-mini, DeepSeek-V3.2, Qwen-Plus

2. **[The Persona Selection Model](https://alignment.anthropic.com/2026/psm)** (Anthropic, Feb 2026)
   - LLMs learn diverse personas during pre-training
   - Post-training elicits "Assistant" persona
   - Inoculation prompting for persona stability

3. **[TinyTroupe](https://arxiv.org/html/2507.09788v1)** (Microsoft, July 2025)
   - Multiagent persona simulation toolkit
   - Population sampling, experimentation support
   - Market research, brainstorming applications

4. **[Agentic Persona Control](https://arxiv.org/abs/2601.15290)** (Nov 2025)
   - Multi-agent framework: User Agent, State Tracking, Message Generation
   - 55% inconsistency reduction via multi-turn RL fine-tuning

---

## Recommended Integration for PM-Simulator

### Phase 1: Replace Rule-Based with LLM-Powered Personas

```python
# Current: Rule-based statistical simulation
# Proposed: LLM-powered persona reasoning

class LLMPersonaEngine:
    def __init__(self, model="qwen3:8b"):
        self.llm = OllamaClient(model)
    
    async def generate_decision(self, persona, context, product_info):
        """Generate realistic persona decision with reasoning"""
        prompt = f"""
        You are {persona.name}, a {persona.role} with these traits:
        - Pain points: {persona.pain_points}
        - Decision style: {persona.decision_style}
        - Tech savviness: {persona.tech_savviness}/10
        
        Product: {product_info}
        
        Given your situation, would you:
        1. Sign up (aware -> signed_up)
        2. Activate (signed_up -> active)  
        3. Engage (active -> engaged)
        4. Churn (any -> churned)
        5. Stay in current state
        
        Think through your decision step by step.
        """
        return await self.llm.generate(prompt)
```

### Phase 2: Cognitive Decision Model

Based on research, implement a **multi-agent decomposition**:

1. **State Tracking Agent** - Maintains persona's current state
2. **Decision Agent** - Generates choices based on persona traits
3. **Reasoning Agent** - Explains why decisions were made

### Phase 3: Consistency Improvements

From SPASM paper:
- **Egocentric Context Projection** - Filter context through persona's perspective
- **Multi-turn consistency scoring** - Check decisions align with past behavior
- **Inoculation prompting** - "Stay in character as [persona name]"

---

## Implementation Roadmap

### Week 1: Local LLM Setup
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull qwen3:8b
ollama pull deepseek-r1:7b  # Smaller variant for testing
```

### Week 2: Integrate with Backend
- Add `utils/llm_client.py` support for Ollama API
- Create `simulation/llm_persona_engine.py`
- Add persona consistency validation

### Week 3: Hybrid Architecture
- Route simple decisions to Qwen3-8b (fast)
- Route complex reasoning to DeepSeek-R1 (accurate)
- A/B test accuracy vs rule-based baseline

---

## Sources

- [DeepSeek V3](https://deepseak.org/deepseek-v3/)
- [DeepSeek API Docs](https://api-docs.deepseek.com/news/news251201)
- [GitHub: deepseek-ai/DeepSeek-V3](https://github.com/deepseek-ai/DeepSeek-V3)
- [Qwen 3 Ollama Guide](https://huggingface.co/blog/lynn-mikami/qwen-3-ollama-vllm)
- [GitHub: QwenLM/Qwen3](https://github.com/QwenLM/Qwen3)
- [Open-Source LLM Comparison](https://moltbook-ai.com/posts/open-source-llms-for-ai-agents-2026)
- [Best Open Source LLMs 2026](https://deploybase.ai/articles/best-open-source-llm)
- [SPASM Paper](https://www.arxiv.org/abs/2604.09212)
- [Persona Selection Model](https://alignment.anthropic.com/2026/psm)
- [TinyTroupe](https://arxiv.org/html/2507.09788v1)
- [Agentic Persona Control](https://arxiv.org/abs/2601.15290)