# Token 优化指南 (Token Optimization Guide)

减少 Token 消耗、提升会话质量并在每日限额内完成更多工作的实用设置与习惯。

> 另请参阅：`rules/common/performance.md` 了解模型选择策略，`skills/strategic-compact/` 获取自动压缩（Compaction）建议。

---

## 建议设置 (Recommended Settings)

以下是适用于大多数用户的推荐默认设置。高级用户可以根据其工作负载进一步微调数值——例如，针对简单任务调低 `MAX_THINKING_TOKENS`，或针对复杂的架构工作调高该值。

将以下内容添加到你的 `~/.claude/settings.json`：

```json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

### 各项设置的作用

| 设置项 | 默认值 | 推荐值 | 效果 |
|---------|---------|-------------|--------|
| `model` | opus | **sonnet** | Sonnet 能很好地处理约 80% 的编码任务。对于复杂推理，可通过 `/model opus` 切换。成本可降低约 60%。 |
| `MAX_THINKING_TOKENS` | 31,999 | **10,000** | 扩展思考（Extended thinking）为每个请求预留多达 31,999 个输出 Token 用于内部推理。降低此值可减少约 70% 的隐藏成本。对于简单任务，可设为 `0` 禁用。 |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 95 | **50** | 当上下文达到容量的此百分比时触发自动压缩。默认的 95% 触发太晚——质量在此之前就会下降。在 50% 时压缩能保持会话更健康。 |
| `CLAUDE_CODE_SUBAGENT_MODEL` | _(继承主模型)_ | **haiku** | 子智能体（Subagents，即 Task 工具）运行在此模型上。Haiku 便宜约 80%，且足以胜任探索、文件读取和运行测试。 |

### 切换扩展思考 (Toggling extended thinking)

- **Alt+T** (Windows/Linux) 或 **Option+T** (macOS) — 开启/关闭
- **Ctrl+O** — 查看思考输出（详尽模式）

---

## 模型选择 (Model Selection)

为任务选择合适的模型：

| 模型 | 最适合 | 成本 |
|-------|----------|------|
| **Haiku** | 子智能体探索、文件读取、简单查询 | 最低 |
| **Sonnet** | 日常编码、审查、编写测试、功能实现 | 中等 |
| **Opus** | 复杂架构、多步推理、调试隐蔽问题 | 最高 |

在会话中途切换模型：

```
/model sonnet     # 大多数工作的默认选择
/model opus       # 复杂推理
/model haiku      # 快速查询
```

---

## 上下文管理 (Context Management)

### 命令

| 命令 | 使用时机 |
|---------|-------------|
| `/clear` | 在不相关的任务之间使用。陈旧的上下文会浪费后续每条消息的 Token。 |
| `/compact` | 在逻辑任务断点（规划后、调试后、切换重点前）。 |
| `/cost` | 检查当前会话的 Token 支出。 |

### 策略性压缩 (Strategic compaction)

`strategic-compact` 技能（位于 `skills/strategic-compact/`）建议在逻辑间隔处使用 `/compact`，而不是依赖可能在任务中途触发的自动压缩。有关钩子（Hook）设置的说明，请参阅该技能的 README。

**何时进行压缩：**
- 探索结束、实现开始前
- 完成一个里程碑（Milestone）后
- 调试结束、继续新工作前
- 发生重大上下文切换前

**何时不要压缩：**
- 相关更改的实现中途
- 正在调试活跃问题时
- 进行多文件重构期间

### 子智能体保护你的上下文 (Subagents protect your context)

使用子智能体（Task 工具）进行探索，而不是在主会话中读取大量文件。子智能体读取 20 个文件但只返回摘要——这能保持你的主上下文整洁。

---

## MCP 服务端管理 (MCP Server Management)

每个启用的 MCP 服务端都会向你的上下文窗口添加工具定义。README 警告：**每个项目启用的服务端应保持在 10 个以下**。

技巧：
- 运行 `/mcp` 查看活跃的服务器及其上下文成本
- 优先使用 CLI 工具（如用 `gh` 代替 GitHub MCP，用 `aws` 代替 AWS MCP）
- 在项目配置中使用 `disabledMcpServers` 按项目禁用服务器
- `memory` MCP 服务器默认已配置，但未被任何技能、智能体或钩子使用——可以考虑禁用它

---

## 智能体团队成本警告 (Agent Teams Cost Warning)

[智能体团队（Agent Teams）](https://code.claude.com/docs/en/agent-teams)（实验性功能）会产生多个独立的上下文窗口。每个团队成员都会单独消耗 Token。

- 仅在并行化能带来明确价值的任务中使用（多模块工作、并行审查）
- 对于简单的顺序任务，子智能体（Task 工具）更具 Token 效率
- 在设置中启用：`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

---

## 未来规划：configure-ecc 集成

`configure-ecc` 安装向导可以在设置过程中提供设置这些环境变量的选项，并解释成本权衡。这将帮助新用户从第一天起就进行优化，而不是在达到限额后才发现这些设置。

---

## 快速参考 (Quick Reference)

```bash
# 日常工作流
/model sonnet              # 从这里开始
/model opus                # 仅用于复杂推理
/clear                     # 在不相关的任务之间
/compact                   # 在逻辑断点处
/cost                      # 检查支出

# 环境变量（添加到 ~/.claude/settings.json 的 "env" 代码块中）
MAX_THINKING_TOKENS=10000
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50
CLAUDE_CODE_SUBAGENT_MODEL=haiku
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```
