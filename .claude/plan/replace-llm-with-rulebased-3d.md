## 📋 实施计划：替换LLM模拟为规则模拟 + 3D可视化

### 任务类型
- [x] 全栈 (→ Codex + Gemini 并行)

### 需求概述
将 `/simulator/llm-simulation` 从LLM Agent模拟改为Rule-Based Statistical模拟，并保留3D可视化展示1000个虚拟用户及其社交网络影响关系。

### 数据映射
| LLM 数据结构 | Rule-Based 数据结构 |
|-------------|-------------------|
| agent.id | persona.id |
| agent.name | persona.name |
| agent.position (support/oppose/neutral) | persona.current_state (promoter/passive/detector) |
| agent.confidence | persona.satisfaction_score |
| agent.reasoning | persona.archetype + adoption_factors |
| agent.influencedBy[] | social_graph[persona.id] connections |
| agent.debateRounds[] | timeline events (day-by-day actions) |

### 实施步骤

#### 步骤 1: 修改 LLM Simulation 页面 (Frontend)
**文件**: `src/app/simulator/llm-simulation/page.tsx`
- 保留页面结构和UI (紫色渐变风格)
- 将 `llmSimulationApi` 调用替换为 `simulationsApi`
- 使用 Rule-based 配置参数 (persona_count=1000等)
- 数据转换：将 rule-based 结果转换为 Agent3DGraph 需要的格式

#### 步骤 2: 更新 BriefForm 组件
**文件**: `src/components/simulation/BriefForm.tsx`
- 替换 LLMConfig 为 SimulationConfig
- 更新表单字段：product_name, product_description, target_market等
- 移除 fast_mode, debate_rounds 等LLM特有选项
- 保留/添加 persona_count slider (100-5000)

#### 步骤 3: 适配 Agent3DGraph 到 Rule-Based 数据
**文件**: `src/components/simulation/Agent3DGraph.tsx`
- 修改 graphData 生成逻辑，处理 rule-based persona 结构
- 颜色映射：promoter(green), passive(yellow), detractor(red)
- 节点大小映射：satisfaction_score → val
- 连接关系：从 social_graph 提取 influenced_by

#### 步骤 4: 更新 AgentDetailPanel
**文件**: `src/components/simulation/AgentDetailPanel.tsx`
- 显示 rule-based persona 详情：archetype, adoption_factors
- 显示每日行为时间线替代 debate rounds
- 显示社交网络连接数

#### 步骤 5: 更新或创建结果组件
**文件**: `src/components/simulation/LLMSimulationResults.tsx`
- 重命名为 SimulationResults3D.tsx
- 保留3D Network tab
- 添加 Rule-based 特有的 tabs: Overview, Adoption Curve, Cohort Analysis

#### 步骤 6: 更新 API 客户端
**文件**: `src/lib/llm-simulation-api.ts`
- 或者创建新的 `src/lib/rule-simulation-api.ts`
- 映射到后端 `/api/simulation/*` 端点 (非 `/api/simulation/llm/*`)

### 关键文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/app/simulator/llm-simulation/page.tsx` | 修改 | 替换LLM API为Rule-based API |
| `src/components/simulation/BriefForm.tsx` | 修改 | Rule-based参数表单 |
| `src/components/simulation/Agent3DGraph.tsx` | 修改 | 适配rule-based数据结构 |
| `src/components/simulation/AgentDetailPanel.tsx` | 修改 | 显示persona详情而非agent详情 |
| `src/lib/llm-simulation-api.ts` | 修改/重命名 | 改为rule-simulation-api.ts |

### 后端确认
Rule-based simulation 已存在：
- `ai-agents-service/simulation/simulation_engine.py`
- 提供 persona 数据、social_graph、timeline
- API endpoints: `/api/simulation/create`, `/api/simulation/{id}/run`, `/api/simulation/{id}/results`

### 伪代码

```typescript
// 数据转换: Rule-based → 3D Graph format
const transformToGraphData = (simulationData) => {
  const nodes = simulationData.personas.map(p => ({
    id: p.id,
    name: p.name,
    val: p.satisfaction_score * 10,
    color: getStateColor(p.current_state), // promoter=green, detractor=red
    position: mapStateToPosition(p.current_state),
    confidence: p.satisfaction_score / 10,
    reasoning: `${p.archetype}: ${p.adoption_factors.join(', ')}`,
    influencedBy: simulationData.social_graph[p.id]?.map(c => c.source_id) || []
  }));
  
  const links = [];
  Object.entries(simulationData.social_graph).forEach(([sourceId, connections]) => {
    connections.forEach(conn => {
      links.push({
        source: sourceId,
        target: conn.target_id,
        value: conn.influence_strength
      });
    });
  });
  
  return { nodes, links };
};
```

### 验收标准
- [ ] `/simulator/llm-simulation` 使用Rule-based模拟
- [ ] 3D Network显示1000个节点(personas)
- [ ] 节点颜色表示采纳状态 (promoter/passive/detractor)
- [ ] 连线表示社交影响关系
- [ ] 点击节点显示persona详情面板
- [ ] 保留其他功能: Templates, User Simulation等

### SESSION_ID
- 待执行时生成
