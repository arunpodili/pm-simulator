## 📋 实施计划：移除 LLM 模拟，整合规则模拟到 Simulator

### 任务类型
- [x] 前端 (→ Gemini)

### 需求概述
将规则模拟（Rule-Based Simulation，当前位于 `/simulate`）整合到 Simulator 页面（`/simulator`），同时移除 LLM Agent Simulation 功能及其相关代码。

### 当前架构
- **Port 3009** (`/simulator`): Templates, User Simulation, Case Studies, Community, Resources, Mastery Lab, LLM Simulation (待移除)
- **Port 3007** (`/simulate`): Rule-Based Simulation (4步骤：Define → Configure → Simulate → Analyze)

### 实施步骤

#### 步骤 1: 更新 Simulator 主页面
**文件**: `src/app/simulator/page.tsx`
- 移除 LLM Simulation Banner (第108-130行)
- 添加 Rule-Based Simulation Banner，链接到 `/simulate`
- 保持其他功能不变 (User Simulation, Templates, Frameworks)

#### 步骤 2: 删除 LLM Simulation 路由
**操作**: 删除目录 `src/app/simulator/llm-simulation/`
- 包含文件: `page.tsx`

#### 步骤 3: 删除 LLM 专用组件
**操作**: 删除以下文件
- `src/components/simulation/BriefForm.tsx` (LLM专用表单)
- `src/components/simulation/LLMSimulationResults.tsx` (LLM结果页)
- `src/components/simulation/LLMSimulationRunning.tsx` (LLM运行状态)
- `src/components/simulation/Agent3DGraph.tsx` (3D可视化，LLM专用)
- `src/components/simulation/AgentDetailPanel.tsx` (代理详情，LLM专用)

#### 步骤 4: 删除 LLM API 客户端
**操作**: 删除文件
- `src/lib/llm-simulation-api.ts`

#### 步骤 5: 清理导航链接
**检查**: 全局搜索并移除指向 `/simulator/llm-simulation` 的链接

### 关键文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/app/simulator/page.tsx` | 修改 | 移除LLM Banner，添加Rule-Based Banner |
| `src/app/simulator/llm-simulation/page.tsx` | 删除 | 整个LLM模拟页面 |
| `src/components/simulation/BriefForm.tsx` | 删除 | LLM专用表单组件 |
| `src/components/simulation/LLMSimulationResults.tsx` | 删除 | LLM结果展示组件 |
| `src/components/simulation/LLMSimulationRunning.tsx` | 删除 | LLM运行状态组件 |
| `src/components/simulation/Agent3DGraph.tsx` | 删除 | 3D可视化组件 |
| `src/components/simulation/AgentDetailPanel.tsx` | 删除 | 代理详情面板 |
| `src/lib/llm-simulation-api.ts` | 删除 | LLM API客户端 |

### 保留的文件 (Rule-Based Simulation)
- `src/app/simulate/page.tsx` - 规则模拟主页面
- `src/components/simulation/SimulationSetup.tsx`
- `src/components/simulation/SimulationRunning.tsx`
- `src/components/simulation/SimulationResults.tsx`
- `src/components/simulation/AgentGraph.tsx` (2D图，非3D)

### 保留的 Simulator 功能
- `/simulator` - 主入口 (Templates, Frameworks)
- `/simulator/user-simulation` - 用户模拟
- `/mastery-lab` - 精通实验室
- `/case-studies` - 案例研究
- `/templates` - 模板库

### 伪代码

```typescript
// src/app/simulator/page.tsx - 修改内容
// 移除:
<Link href="/simulator/llm-simulation">
  <Sparkles /> LLM Agent Simulation
</Link>

// 替换为:
<Link href="/simulate">
  <BarChart3 /> Rule-Based Simulation
</Link>
// 描述: Statistical market analysis with 1000 personas
```

### 验收标准
- [ ] LLM Simulation Banner 从 `/simulator` 页面移除
- [ ] Rule-Based Simulation Banner 显示在 `/simulator` 页面
- [ ] 点击 Rule-Based Banner 导航到 `/simulate`
- [ ] `/simulator/llm-simulation` 返回404
- [ ] 其他功能 (User Simulation, Templates, Mastery Lab) 正常工作
- [ ] `/simulate` 页面正常运行

### SESSION_ID
- 待执行时生成
