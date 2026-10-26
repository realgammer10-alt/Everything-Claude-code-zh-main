# 智能体编排（Agent Orchestration）

## 可用的智能体（Agent）

放置在 `~/.claude/agents/`：

| 智能体 (Agent) | 目的 | 使用时机 |
|-------|---------|-------------|
| planner | 实现计划 | 复杂功能、重构 |
| architect | 系统设计 | 架构决策 |
| tdd-guide | 测试驱动开发 | 新功能、Bug 修复 |
| code-reviewer | 代码审查 | 代码编写后 |
| security-reviewer | 安全分析 | 提交 (Commit) 前 |
| build-error-resolver | 构建错误修复 | 构建失败时 |
| e2e-runner | E2E 测试 | 关键用户流程 |
| refactor-cleaner | 死代码清理 | 代码维护 |
| doc-updater | 文档 | 文档更新 |

## 立即使用智能体（Agent）

无需用户提示词：
1. 复杂功能请求 - 使用 **planner** 智能体
2. 代码编写/修改后 - 使用 **code-reviewer** 智能体
3. Bug 修复或新功能 - 使用 **tdd-guide** 智能体
4. 架构决策 - 使用 **architect** 智能体

## 并行任务（Task）执行

对于相互独立的操作，请务必使用并行任务（Task）执行：

```markdown
# 推荐：并行执行
并行启动 3 个智能体：
1. 智能体 1：身份验证模块的安全分析
2. 智能体 2：缓存系统的性能审查
3. 智能体 3：工具类的类型检查

# 不推荐：不必要的串行执行
先启动智能体 1，接着启动智能体 2，然后启动智能体 3
```

## 多维度分析

针对复杂问题，使用分工明确的子智能体（Sub-agent）：
- 事实审查员
- 资深工程师
- 安全专家
- 一致性审查员
- 冗余检查员
