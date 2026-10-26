---
description: 编排（Orchestrate）多个智能体（Agent）以处理复杂任务
agent: planner
subtask: true
---

# 编排（Orchestrate）命令

为此复杂任务编排多个专业智能体（Agent）：$ARGUMENTS

## 你的任务

1. **分析任务复杂度**并分解为子任务
2. 为每个子任务**确定最佳智能体（Agent）**
3. **创建执行计划**并明确依赖关系
4. **协调执行** - 尽可能并行处理
5. 将结果**汇总（Synthesize）**为统一输出

## 可用的智能体（Available Agents）

| 智能体（Agent） | 专长 | 适用场景 |
|-------|-----------|---------|
| planner | 实施规划 | 复杂功能设计 |
| architect | 系统设计 | 架构决策 |
| code-reviewer | 代码质量 | 审查变更 |
| security-reviewer | 安全分析 | 漏洞检测 |
| tdd-guide | 测试驱动开发 | 功能实现 |
| build-error-resolver | 构建修复 | TypeScript/构建错误 |
| e2e-runner | E2E 测试 | 用户流程测试 |
| doc-updater | 文档编写 | 更新文档 |
| refactor-cleaner | 代码清理 | 冗余代码移除 |
| go-reviewer | Go 代码 | Go 特有的代码审查 |
| go-build-resolver | Go 构建 | Go 构建错误 |
| database-reviewer | 数据库 | 查询优化 |

## 编排模式（Orchestration Patterns）

### 顺序执行（Sequential Execution）
```
planner → tdd-guide → code-reviewer → security-reviewer
```
适用场景：后续任务依赖于前期结果。

### 并行执行（Parallel Execution）
```
┌→ security-reviewer
planner →├→ code-reviewer
└→ architect
```
适用场景：任务之间相互独立。

### 扇出/扇入（Fan-Out/Fan-In）
```
         ┌→ agent-1 ─┐
planner →├→ agent-2 ─┼→ synthesizer
         └→ agent-3 ─┘
```
适用场景：需要多个维度的视角。

## 执行计划格式

### 阶段 1：[名称]
- 智能体（Agent）：[agent-name]
- 任务：[具体任务内容]
- 依赖项：[无或前一阶段]

### 阶段 2：[名称]（并行）
- 智能体 A：[agent-name]
  - 任务：[具体任务内容]
- 智能体 B：[agent-name]
  - 任务：[具体任务内容]
- 依赖项：阶段 1

### 阶段 3：汇总（Synthesis）
- 结合阶段 2 的结果
- 生成统一输出

## 协调原则（Coordination Rules）

1. **先规划后执行** - 首先创建完整的执行计划
2. **最小化交接** - 减少上下文切换（Context switching）
3. **尽可能并行化** - 并行处理独立任务
4. **明确边界** - 每个智能体（Agent）都有特定的职责范围
5. **单一事实来源** - 每个产出物由一个智能体（Agent）负责

---

**注意**：复杂任务受益于多智能体编排。简单任务应直接使用单个智能体。
