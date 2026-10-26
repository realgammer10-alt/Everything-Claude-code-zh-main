# 向 Everything Claude Code 贡献

感谢您的贡献！本仓库是为 Claude Code 用户提供的社区资源。

## 目录

- [我们期待的贡献](#我们期待的贡献)
- [快速开始](#快速开始)
- [贡献技能（Skill）](#贡献技能（Skill）)
- [贡献智能体（Agent）](#贡献智能体（Agent）)
- [贡献钩子（Hook）](#贡献钩子（Hook）)
- [贡献命令（Command）](#贡献命令（Command）)
- [合并请求（Pull Request）流程](#合并请求（pull-request）流程)

---

## 我们期待的贡献

### 智能体（Agent）

能够出色处理特定任务的新智能体：
- 特定语言的审查者（Python、Go、Rust）
- 框架专家（Django、Rails、Laravel、Spring）
- DevOps 专家（Kubernetes、Terraform、CI/CD）
- 领域专家（ML 管道、数据工程、移动端）

### 技能（Skill）

工作流定义和领域知识：
- 语言最佳实践
- 框架模式
- 测试策略
- 架构指南

### 钩子（Hook）

有用的自动化：
- Lint / 格式化钩子
- 安全检查
- 验证钩子
- 通知钩子

### 命令（Command）

调用有用工作流的斜杠命令：
- 部署命令
- 测试命令
- 代码生成命令

---

## 快速开始

```bash
# 1. Fork 和克隆
gh repo fork affaan-m/everything-claude-code --clone
cd everything-claude-code

# 2. 创建分支
git checkout -b feat/my-contribution

# 3. 添加贡献（参见以下章节）

# 4. 本地测试
cp -r skills/my-skill ~/.claude/skills/  # 如果是技能
# 之后，在 Claude Code 中进行测试

# 5. 提交 PR
git add . && git commit -m "feat: add my-skill" && git push
```

---

## 贡献技能（Skill）

技能（Skill）是 Claude Code 根据上下文加载的知识模块。

### 目录结构

```
skills/
└── your-skill-name/
    └── SKILL.md
```

### SKILL.md 模板

```markdown
---
name: your-skill-name
description: 显示在技能列表中的简短描述
---

# Your Skill Title

该技能所涵盖内容的概述。

## Core Concepts

解释主要模式和指南。

## Code Examples

\`\`\`typescript
// 包含经过测试的实际示例
function example() {
  // 带有详细注释的代码
}
\`\`\`

## Best Practices

- 可执行的指南
- 推荐做法与避坑指南
- 应避免的常见陷阱

## When to Use

说明该技能适用的场景。
```

### 技能自检清单

- [ ] 专注于单一领域/技术
- [ ] 包含实际代码示例
- [ ] 少于 500 行
- [ ] 使用清晰的章节标题
- [ ] 已在 Claude Code 中测试

### 示例技能

| 技能 | 用途 |
|-------|---------|
| `coding-standards/` | TypeScript/JavaScript 模式 |
| `frontend-patterns/` | React 和 Next.js 最佳实践 |
| `backend-patterns/` | API 和数据库模式 |
| `security-review/` | 安全自检清单 |

---

## 贡献智能体（Agent）

智能体（Agent）是通过 Task 工具调用的特殊助手。

### 文件位置

```
agents/your-agent-name.md
```

### 智能体模板

```markdown
---
name: your-agent-name
description: 该智能体执行的操作以及 Claude 应该调用它的时机。请具体说明！
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

你是一位 [角色] 专家。

## Your Role

- 主要职责
- 次要职责
- 你不执行的操作（边界）

## Workflow

### Step 1: Understand
如何处理任务。

### Step 2: Execute
如何执行工作。

### Step 3: Verify
如何验证结果。

## Output Format

返回给用户的内容。

## Examples

### Example: [Scenario]
Input: [用户提供的内容]
Action: [执行的操作]
Output: [返回的内容]
```

### 智能体字段

| 字段 | 说明 | 示例 |
|-------|-------------|---------|
| `name` | 小写，连字符分隔 | `code-reviewer` |
| `description` | 用于判断是否调用 | 请具体说明！ |
| `tools` | 仅包含必要的工具 | `Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task` |
| `model` | 复杂度级别 | `haiku`（简单）、`sonnet`（编码）、`opus`（复杂） |

### 示例智能体

| 智能体 | 用途 |
|-------|---------|
| `tdd-guide.md` | 测试驱动开发 |
| `code-reviewer.md` | 代码审查 |
| `security-reviewer.md` | 安全扫描 |
| `build-error-resolver.md` | 修复构建错误 |

---

## 贡献钩子（Hook）

钩子（Hook）是由 Claude Code 事件触发的自动行为。

### 文件位置

```
hooks/hooks.json
```

### 钩子类型

| 类型 | 触发器 | 使用场景 |
|------|---------|----------|
| `PreToolUse` | 工具执行前 | 验证、警告、阻止 |
| `PostToolUse` | 工具执行后 | 格式化、检查、通知 |
| `SessionStart` | 会话开始 | 加载上下文 |
| `Stop` | 会话结束 | 清理、审计 |

### 钩子格式

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"rm -rf /\"",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[Hook] BLOCKED: Dangerous command' && exit 1"
          }
        ],
        "description": "阻止危险的 rm 命令"
      }
    ]
  }
}
```

### 匹配器（Matcher）语法

```javascript
// 匹配特定工具
tool == "Bash"
tool == "Edit"
tool == "Write"

// 匹配输入模式
tool_input.command matches "npm install"
tool_input.file_path matches "\\.tsx?$"

// 组合条件
tool == "Bash" && tool_input.command matches "git push"
```

### 钩子示例

```json
// 在 tmux 之外阻止开发服务器运行
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [{"type": "command", "command": "echo 'Use tmux for dev servers' && exit 1"}],
  "description": "确保开发服务器在 tmux 中运行"
}

// TypeScript 编辑后自动格式化
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.tsx?$\"",
  "hooks": [{"type": "command", "command": "npx prettier --write \"$file_path\""}],
  "description": "编辑后格式化 TypeScript 文件"
}

// git push 前警告
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{"type": "command", "command": "echo '[Hook] Review changes before pushing'"}],
  "description": "推送前提醒审查更改"
}
```

### 钩子自检清单

- [ ] 匹配器具体明确（不要过宽）
- [ ] 包含清晰的错误/信息提示
- [ ] 使用正确的退出码（`exit 1` 阻止，`exit 0` 允许）
- [ ] 经过彻底测试
- [ ] 包含描述

---

## 贡献命令（Command）

命令（Command）是通过 `/command-name` 调用的用户启动操作。

### 文件位置

```
commands/your-command.md
```

### 命令模板

```markdown
---
description: 显示在 /help 中的简短描述
---

# Command Name

## Purpose

该命令执行的操作。

## Usage

\`\`\`
/your-command [args]
\`\`\`

## Workflow

1. 第一步
2. 第二步
3. 最后一步

## Output

用户收到的内容。
```

### 示例命令

| 命令 | 用途 |
|---------|---------|
| `commit.md` | 创建 git 提交 |
| `code-review.md` | 审查代码更改 |
| `tdd.md` | TDD 工作流 |
| `e2e.md` | E2E 测试 |

---

## 合并请求（Pull Request）流程

### 1. PR 标题格式

```
feat(skills): add rust-patterns skill
feat(agents): add api-designer agent
feat(hooks): add auto-format hook
fix(skills): update React patterns
docs: improve contributing guide
```

### 2. PR 说明

```markdown
## Summary
添加了什么，以及原因。

## Type
- [ ] Skill
- [ ] Agent
- [ ] Hook
- [ ] Command

## Testing
你是如何测试的。

## Checklist
- [ ] 遵循格式指南
- [ ] 已在 Claude Code 中测试
- [ ] 无敏感信息（API 密钥、路径）
- [ ] 包含清晰的说明
```

### 3. 审查流程

1. 维护者将在 48 小时内进行审查
2. 如果有需要，根据反馈进行调整
3. 批准后，合并到 main 分支

---

## 指南

### 应该做

- 贡献应保持专注且模块化
- 包含清晰的说明
- 提交前进行测试
- 遵循现有模式
- 文档化依赖关系

### 不该做

- 包含敏感数据（API 密钥、Token、路径）
- 添加过于复杂或小众的配置
- 提交未经测试的贡献
- 创建与现有功能重复的内容

---

## 文件命名规范

- 使用小写字母和连字符：`python-reviewer.md`
- 描述性命名：使用 `tdd-workflow.md` 而非 `workflow.md`
- 确保名称与文件名一致

---

## 有疑问吗？

- **Issues:** [github.com/affaan-m/everything-claude-code/issues](https://github.com/affaan-m/everything-claude-code/issues)
- **X/Twitter:** [@affaanmustafa](https://x.com/affaanmustafa)

---

感谢您的贡献。让我们一起构建出色的资源。
