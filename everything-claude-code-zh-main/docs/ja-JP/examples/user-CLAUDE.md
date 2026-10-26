# 用户级 CLAUDE.md 示例

这是用户级 CLAUDE.md 文件的示例。请将其放置在 `~/.claude/CLAUDE.md`。

用户级配置全局适用于所有项目。用于以下用途：
- 个人编码偏好
- 希望始终适用的通用规则
- 指向模块化规则的链接

---

## 核心哲学

你是 Claude Code。我会使用专门针对复杂任务的智能体（Agents）和技能（Skills）。

**主要原则：**
1. **智能体优先（Agent-First）**：将复杂工作委派给专业智能体。
2. **并行执行**：尽可能在多个智能体上使用 Task 工具。
3. **先规划后执行**：复杂操作使用规划模式（Plan Mode）。
4. **测试驱动**：在实现前编写测试。
5. **安全优先**：绝不在安全问题上妥协。

---

## 模块化规则

详细指南位于 `~/.claude/rules/`：

| 规则文件 | 内容 |
|-----------|----------|
| security.md | 安全检查、机密信息管理 |
| coding-style.md | 不可变性、文件结构、错误处理 |
| testing.md | TDD 工作流、80% 覆盖率要求 |
| git-workflow.md | 提交格式、PR 工作流 |
| agents.md | 智能体编排（Agent Orchestration）、何时使用哪个智能体 |
| patterns.md | API 响应、存储库模式（Repository Pattern） |
| performance.md | 模型选择、上下文管理 |
| hooks.md | 钩子系统（Hook System） |

---

## 可用智能体（Agents）

放置在 `~/.claude/agents/`：

| 智能体 | 目的 |
|-------|---------|
| planner | 功能实现规划 |
| architect | 系统设计与架构 |
| tdd-guide | 测试驱动开发 |
| code-reviewer | 质量/安全代码审查 |
| security-reviewer | 安全漏洞分析 |
| build-error-resolver | 构建错误解决 |
| e2e-runner | Playwright E2E 测试 |
| refactor-cleaner | 无用代码清理 |
| doc-updater | 文档更新 |

---

## 个人设置

### 隐私
- 始终脱敏日志；不粘贴机密信息（API 密钥/令牌/密码/JWT）
- 在共享前审查输出 - 删除所有敏感数据

### 代码风格
- 不在代码、注释或文档中使用表情符号（Emoji）
- 不可变性优先 - 绝不修改对象或数组
- 倾向于多个小文件而非少数大文件
- 通常 200-400 行，每个文件最大 800 行

### Git
- 约定式提交（Conventional Commits）：`feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- 提交前始终进行本地测试
- 小而聚焦的提交

### 测试
- TDD：先写测试
- 最低 80% 覆盖率
- 关键流程包含单元 + 集成 + E2E 测试

---

## 编辑器集成

使用 Zed 作为主要编辑器：
- 用于文件追踪的智能体面板
- 用于命令面板的 CMD+Shift+R
- 启用 Vim 模式

---

## 成功指标

在以下情况下视为成功：
- 所有测试通过（80% 以上覆盖率）
- 无安全漏洞
- 代码易读且可维护
- 满足用户需求

---

**哲学**：智能体优先设计、并行执行、行前规划、码前测试、始终安全。
