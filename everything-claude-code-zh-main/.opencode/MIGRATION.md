# 迁移指南：从 Claude Code 到 OpenCode

本指南将帮助你在使用 Everything Claude Code (ECC) 配置时，从 Claude Code 迁移到 OpenCode。

## 概览 (Overview)

OpenCode 是一个用于 AI 辅助开发的替代 CLI，它支持与 Claude Code **完全相同**的功能，但在配置格式上略有不同。

## 关键差异 (Key Differences)

| 特性 (Feature) | Claude Code | OpenCode | 备注 |
|---------|-------------|----------|-------|
| 配置 (Configuration) | `CLAUDE.md`, `plugin.json` | `opencode.json` | 不同的文件格式 |
| 智能体 (Agents) | Markdown frontmatter | JSON 对象 | 完全一致 |
| 命令 (Commands) | `commands/*.md` | `command` 对象或 `.md` 文件 | 完全一致 |
| 技能 (Skills) | `skills/*/SKILL.md` | `instructions` 数组 | 作为上下文加载 |
| **钩子 (Hooks)** | `hooks.json` (3 个阶段) | **插件系统 (20+ 事件)** | **完全一致 + 更多支持！** |
| 规则 (Rules) | `rules/*.md` | `instructions` 数组 | 合并或独立存在 |
| MCP | 完全支持 | 完全支持 | 完全一致 |

## 钩子迁移 (Hook Migration)

**OpenCode 通过其插件系统完全支持钩子 (Hooks)**，其插件系统实际上比 Claude Code 更先进，支持 20 多种事件类型。

### 钩子事件映射 (Hook Event Mapping)

| Claude Code 钩子 | OpenCode 插件事件 | 备注 |
|-----------------|----------------------|-------|
| `PreToolUse` | `tool.execute.before` | 可以修改工具输入 |
| `PostToolUse` | `tool.execute.after` | 可以修改工具输出 |
| `Stop` | `session.idle` 或 `session.status` | 会话生命周期 |
| `SessionStart` | `session.created` | 会话开始 |
| `SessionEnd` | `session.deleted` | 会话结束 |
| N/A | `file.edited` | OpenCode 独有：文件变更 |
| N/A | `file.watcher.updated` | OpenCode 独有：文件系统监听 |
| N/A | `message.updated` | OpenCode 独有：消息变更 |
| N/A | `lsp.client.diagnostics` | OpenCode 独有：LSP 集成 |
| N/A | `tui.toast.show` | OpenCode 独有：通知推送 |

### 将钩子转换为插件 (Converting Hooks to Plugins)

**Claude Code 钩子 (hooks.json):**
```json
{
  "PostToolUse": [{
    "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
    "hooks": [{
      "type": "command",
      "command": "prettier --write \"$file_path\""
    }]
  }]
}
```

**OpenCode 插件 (.opencode/plugins/prettier-hook.ts):**
```typescript
export const PrettierPlugin = async ({ $ }) => {
  return {
    "file.edited": async (event) => {
      if (event.path.match(/\.(ts|tsx|js|jsx)$/)) {
        await $`prettier --write ${event.path}`
      }
    }
  }
}
```

### 包含的 ECC 插件钩子 (ECC Plugin Hooks Included)

ECC OpenCode 配置包含了翻译后的钩子：

| 钩子 (Hook) | OpenCode 事件 | 用途 |
|------|----------------|---------|
| Prettier 自动格式化 | `file.edited` | 编辑后格式化 JS/TS 文件 |
| TypeScript 检查 | `tool.execute.after` | 编辑 .ts 文件后运行 tsc |
| console.log 警告 | `file.edited` | 对 console.log 语句发出警告 |
| 会话通知 | `session.idle` | 任务完成时通知 |
| 安全检查 | `tool.execute.before` | 提交前检查敏感信息 |

## 迁移步骤 (Migration Steps)

### 1. 安装 OpenCode

```bash
# 安装 OpenCode CLI
npm install -g opencode
# 或者
curl -fsSL https://opencode.ai/install | bash
```

### 2. 使用 ECC OpenCode 配置

本仓库中的 `.opencode/` 目录包含了转换后的配置：

```
.opencode/
├── opencode.json              # 主配置文件
├── plugins/                   # 钩子插件（从 hooks.json 翻译而来）
│   ├── ecc-hooks.ts           # 所有作为插件的 ECC 钩子
│   └── index.ts               # 插件导出
├── tools/                     # 自定义工具
│   ├── run-tests.ts           # 运行测试套件
│   ├── check-coverage.ts      # 检查覆盖率
│   └── security-audit.ts      # npm audit 封装
├── commands/                  # 全部 23 个命令 (markdown)
│   ├── plan.md
│   ├── tdd.md
│   └── ... (还有 21 个)
├── prompts/
│   └── agents/                # 智能体提示词文件 (12个)
├── instructions/
│   └── INSTRUCTIONS.md        # 合并后的规则
├── package.json               # 用于 npm 分发
├── tsconfig.json              # TypeScript 配置
└── MIGRATION.md               # 本文件
```

### 3. 运行 OpenCode

```bash
# 在仓库根目录下运行
opencode

# 配置会自动从 .opencode/opencode.json 检测
```

## 概念映射 (Concept Mapping)

### 智能体 (Agents)

**Claude Code:**
```markdown
---
name: planner
description: Expert planning specialist...
tools: ["Read", "Grep", "Glob"]
model: opus
---

You are an expert planning specialist...
```

**OpenCode:**
```json
{
  "agent": {
    "planner": {
      "description": "Expert planning specialist...",
      "mode": "subagent",
      "model": "anthropic/claude-opus-4-5",
      "prompt": "{file:.opencode/prompts/agents/planner.txt}",
      "tools": { "read": true, "bash": true }
    }
  }
}
```

### 命令 (Commands)

**Claude Code:**
```markdown
---
name: plan
description: Create implementation plan
---

Create a detailed implementation plan for: {input}
```

**OpenCode (JSON):**
```json
{
  "command": {
    "plan": {
      "description": "Create implementation plan",
      "template": "Create a detailed implementation plan for: $ARGUMENTS",
      "agent": "planner"
    }
  }
}
```

**OpenCode (Markdown - .opencode/commands/plan.md):**
```markdown
---
description: Create implementation plan
agent: planner
---

Create a detailed implementation plan for: $ARGUMENTS
```

### 技能 (Skills)

**Claude Code:** 技能从 `skills/*/SKILL.md` 文件加载。

**OpenCode:** 技能被添加到 `instructions` 数组中：
```json
{
  "instructions": [
    "skills/tdd-workflow/SKILL.md",
    "skills/security-review/SKILL.md",
    "skills/coding-standards/SKILL.md"
  ]
}
```

### 规则 (Rules)

**Claude Code:** 规则位于独立的 `rules/*.md` 文件中。

**OpenCode:** 规则可以合并到 `instructions` 中或保持独立：
```json
{
  "instructions": [
    ".opencode/instructions/INSTRUCTIONS.md",
    "rules/common/security.md",
    "rules/common/coding-style.md"
  ]
}
```

## 模型映射 (Model Mapping)

| Claude Code | OpenCode |
|-------------|----------|
| `opus` | `anthropic/claude-opus-4-5` |
| `sonnet` | `anthropic/claude-sonnet-4-5` |
| `haiku` | `anthropic/claude-haiku-4-5` |

## 可用命令 (Available Commands)

迁移后，所有 23 个命令均可用：

| 命令 | 描述 |
|---------|-------------|
| `/plan` | 创建实施计划 |
| `/tdd` | 强制执行 TDD 工作流 |
| `/code-review` | 审查代码变更 |
| `/security` | 运行安全审查 |
| `/build-fix` | 修复构建错误 |
| `/e2e` | 生成 E2E 测试 |
| `/refactor-clean` | 移除冗余代码 |
| `/orchestrate` | 多智能体工作流编排 |
| `/learn` | 会话中途提取模式 |
| `/checkpoint` | 保存验证状态 |
| `/verify` | 运行验证循环 |
| `/eval` | 运行评测 |
| `/update-docs` | 更新文档 |
| `/update-codemaps` | 更新代码映射 (codemaps) |
| `/test-coverage` | 检查测试覆盖率 |
| `/setup-pm` | 配置包管理器 |
| `/go-review` | Go 代码审查 |
| `/go-test` | Go TDD 工作流 |
| `/go-build` | 修复 Go 构建错误 |
| `/skill-create` | 从 git 历史记录生成技能 |
| `/instinct-status` | 查看已学习的直觉 (instincts) |
| `/instinct-import` | 导入直觉 |
| `/instinct-export` | 导出直觉 |
| `/evolve` | 将直觉聚类为技能 |
| `/promote` | 将项目直觉提升至全局范围 |
| `/projects` | 列出已知项目及直觉统计数据 |

## 可用智能体 (Available Agents)

| 智能体 (Agent) | 描述 |
|-------|-------------|
| `planner` | 实施计划制定 |
| `architect` | 系统设计 |
| `code-reviewer` | 代码审查 |
| `security-reviewer` | 安全分析 |
| `tdd-guide` | 测试驱动开发指南 |
| `build-error-resolver` | 修复构建错误 |
| `e2e-runner` | E2E 测试执行 |
| `doc-updater` | 文档更新 |
| `refactor-cleaner` | 冗余代码清理 |
| `go-reviewer` | Go 代码审查 |
| `go-build-resolver` | Go 构建错误解决 |
| `database-reviewer` | 数据库优化 |

## 插件安装 (Plugin Installation)

### 选项 1：直接使用 ECC 配置

`.opencode/` 目录已包含预先配置好的一切。

### 选项 2：作为 npm 包安装

```bash
npm install ecc-universal
```

然后在你的 `opencode.json` 中配置：
```json
{
  "plugin": ["ecc-universal"]
}
```

## 故障排除 (Troubleshooting)

### 配置未加载

1. 验证仓库根目录下是否存在 `.opencode/opencode.json`
2. 检查 JSON 语法是否有效：`cat .opencode/opencode.json | jq .`
3. 确保所有引用的提示词 (prompt) 文件都存在

### 插件未加载

1. 验证插件文件是否存在于 `.opencode/plugins/` 中
2. 检查 TypeScript 语法是否有效
3. 确保 `opencode.json` 中的 `plugin` 数组包含了对应路径

### 未找到智能体 (Agent Not Found)

1. 检查智能体是否在 `opencode.json` 的 `agent` 对象下定义
2. 验证提示词文件路径是否正确
3. 确保指定的路径下确实存在提示词文件

### 命令无法工作

1. 验证命令是否在 `opencode.json` 中定义，或作为 `.md` 文件存在于 `.opencode/commands/` 中
2. 检查引用的智能体是否存在
3. 确保模板使用 `$ARGUMENTS` 来接收用户输入

## 最佳实践 (Best Practices)

1. **从零开始**：不要尝试同时运行 Claude Code 和 OpenCode
2. **检查配置**：验证 `opencode.json` 加载时无错误
3. **测试命令**：逐一运行每个命令以验证其功能
4. **使用插件**：利用插件钩子实现自动化
5. **使用智能体**：充分发挥各专业智能体的作用

## 回退到 Claude Code (Reverting to Claude Code)

如果你需要切回：

1. 只需运行 `claude` 而不是 `opencode`
2. Claude Code 会使用它自己的配置 (`CLAUDE.md`, `plugin.json` 等)
3. `.opencode/` 目录不会干扰 Claude Code

## 功能等效性总结 (Feature Parity Summary)

| 特性 (Feature) | Claude Code | OpenCode | 状态 |
|---------|-------------|----------|--------|
| 智能体 (Agents) | ✅ 12 个智能体 | ✅ 12 个智能体 | **完全一致** |
| 命令 (Commands) | ✅ 23 个命令 | ✅ 23 个命令 | **完全一致** |
| 技能 (Skills) | ✅ 16 个技能 | ✅ 16 个技能 | **完全一致** |
| 钩子 (Hooks) | ✅ 3 个阶段 | ✅ 20+ 事件 | **OpenCode 支持更多** |
| 规则 (Rules) | ✅ 8 条规则 | ✅ 8 条规则 | **完全一致** |
| MCP 服务器 | ✅ 全面支持 | ✅ 全面支持 | **完全一致** |
| 自定义工具 | ✅ 通过钩子实现 | ✅ 原生支持 | **OpenCode 表现更佳** |

## 反馈 (Feedback)

针对以下特定问题：
- **OpenCode CLI**: 报告至 OpenCode 的问题追踪器 (issue tracker)
- **ECC 配置**: 报告至 [github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
