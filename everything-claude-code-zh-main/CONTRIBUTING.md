# 贡献指南 - Everything Claude Code

感谢你愿意为本项目做出贡献！本仓库是 Claude Code 用户的社区资源库。

## 目录

- [我们正在寻找的贡献](#我们正在寻找的贡献)
- [快速入门](#快速入门)
- [贡献技能（Skills）](#贡献技能skills)
- [贡献智能体（Agents）](#贡献智能体agents)
- [贡献钩子（Hooks）](#贡献钩子hooks)
- [贡献命令（Commands）](#贡献命令commands)
- [合并请求（PR）流程](#合并请求pr流程)

---

## 我们正在寻找的贡献

### 智能体（Agents）
能够出色处理特定任务的新智能体：
- 特定语言的代码审查器（Python, Go, Rust）
- 框架专家（Django, Rails, Laravel, Spring）
- DevOps 专家（Kubernetes, Terraform, CI/CD）
- 领域专家（ML 流水线、数据工程、移动端）

### 技能（Skills）
工作流定义与领域知识：
- 编程语言最佳实践
- 框架模式
- 测试策略
- 架构指南

### 钩子（Hooks）
实用的自动化脚本：
- Lint/格式化钩子
- 安全检查
- 验证钩子
- 通知钩子

### 命令（Commands）
调用实用工作流的斜杠命令：
- 部署命令
- 测试命令
- 代码生成命令

---

## 快速入门

```bash
# 1. Fork 并克隆仓库
gh repo fork affaan-m/everything-claude-code --clone
cd everything-claude-code

# 2. 创建分支
git checkout -b feat/my-contribution

# 3. 添加你的贡献（参见下方各章节）

# 4. 本地测试
cp -r skills/my-skill ~/.claude/skills/  # 针对技能（Skills）
# 然后使用 Claude Code 进行测试

# 5. 提交 PR
git add . && git commit -m "feat: add my-skill" && git push
```

---

## 贡献技能（Skills）

技能（Skills）是 Claude Code 根据上下文加载的知识模块。

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
origin: ECC
---

# 你的技能标题

简要概述此技能涵盖的内容。

## 核心概念

解释关键模式与指南。

## 代码示例

\`\`\`typescript
// 包含实际的、经过测试的示例
function example() {
  // 注释清晰的代码
}
\`\`\`

## 最佳实践

- 可操作的指南
- 推荐做法与禁忌
- 需避免的常见陷阱

## 适用场景

描述此技能适用的场景。
```

### 技能自检清单

- [ ] 专注于单一领域/技术
- [ ] 包含实用的代码示例
- [ ] 少于 500 行
- [ ] 使用清晰的章节标题
- [ ] 已通过 Claude Code 测试

### 示例技能

| 技能 | 用途 |
|-------|---------|
| `coding-standards/` | TypeScript/JavaScript 模式 |
| `frontend-patterns/` | React 与 Next.js 最佳实践 |
| `backend-patterns/` | API 与数据库模式 |
| `security-review/` | 安全自检清单 |

---

## 贡献智能体（Agents）

智能体（Agents）是通过 Task 工具调用的专门助手。

### 文件位置

```
agents/your-agent-name.md
```

### 智能体模板

```markdown
---
name: your-agent-name
description: 此智能体的功能以及 Claude 应在何时调用它。请务必具体！
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

你是一名 [角色] 专家。

## 你的职责

- 主要职责
- 次要职责
- 你**不**做的事情（边界）

## 工作流

### 第一步：理解
你如何着手处理任务。

### 第二步：执行
你如何执行具体工作。

### 第三步：验证
你如何验证结果。

## 输出格式

你向用户返回的内容。

## 示例

### 示例：[场景]
输入：[用户提供的内容]
操作：[你执行的操作]
输出：[你返回的内容]
```

### 智能体字段说明

| 字段 | 描述 | 选项 |
|-------|-------------|---------|
| `name` | 小写，用连字符分隔 | `code-reviewer` |
| `description` | 用于决定何时调用 | 务必具体！ |
| `tools` | 仅包含所需的工具 | `Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task` |
| `model` | 复杂度级别 | `haiku` (简单), `sonnet` (编程), `opus` (复杂) |

### 示例智能体

| 智能体 | 用途 |
|-------|---------|
| `tdd-guide.md` | 测试驱动开发（TDD） |
| `code-reviewer.md` | 代码审查 |
| `security-reviewer.md` | 安全扫描 |
| `build-error-resolver.md` | 修复构建错误 |

---

## 贡献钩子（Hooks）

钩子（Hooks）是由 Claude Code 事件触发的自动行为。

### 文件位置

```
hooks/hooks.json
```

### 钩子类型

| 类型 | 触发时机 | 使用场景 |
|------|---------|----------|
| `PreToolUse` | 工具运行前 | 验证、警告、阻断 |
| `PostToolUse` | 工具运行后 | 格式化、检查、通知 |
| `SessionStart` | 会话开始时 | 加载上下文 |
| `Stop` | 会话结束时 | 清理、审计 |

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
// 在 tmux 之外阻断开发服务器运行
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [{"type": "command", "command": "echo '请在 tmux 中运行开发服务器' && exit 1"}],
  "description": "确保开发服务器在 tmux 中运行"
}

// 编辑 TypeScript 后自动格式化
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.tsx?$\"",
  "hooks": [{"type": "command", "command": "npx prettier --write \"$file_path\""}],
  "description": "编辑后格式化 TypeScript 文件"
}

// 在 git push 前发出警告
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{"type": "command", "command": "echo '[Hook] 请在推送前检查更改'"}],
  "description": "推送前的检查提醒"
}
```

### 钩子自检清单

- [ ] 匹配器（Matcher）具体明确（不过于宽泛）
- [ ] 包含清晰的错误/信息提示
- [ ] 使用正确的退出码（`exit 1` 阻断，`exit 0` 允许）
- [ ] 经过充分测试
- [ ] 包含描述信息

---

## 贡献命令（Commands）

命令是用户通过 `/command-name` 调用的操作。

### 文件位置

```
commands/your-command.md
```

### 命令模板

```markdown
---
description: 显示在 /help 中的简短描述
---

# 命令名称

## 用途

此命令的功能。

## 用法

\`\`\`
/your-command [args]
\`\`\`

## 工作流

1. 第一步
2. 第二步
3. 最终步

## 输出

用户接收到的内容。
```

### 示例命令

| 命令 | 用途 |
|---------|---------|
| `commit.md` | 创建 git 提交 |
| `code-review.md` | 审查代码更改 |
| `tdd.md` | TDD 工作流 |
| `e2e.md` | E2E 测试 |

---

## 合并请求（PR）流程

### 1. PR 标题格式

```
feat(skills): add rust-patterns skill
feat(agents): add api-designer agent
feat(hooks): add auto-format hook
fix(skills): update React patterns
docs: improve contributing guide
```

### 2. PR 描述

```markdown
## 摘要
你添加了什么以及原因。

## 类型
- [ ] 技能 (Skill)
- [ ] 智能体 (Agent)
- [ ] 钩子 (Hook)
- [ ] 命令 (Command)

## 测试
你如何测试此项贡献。

## 自检清单
- [ ] 遵循格式指南
- [ ] 已通过 Claude Code 测试
- [ ] 无敏感信息（API 密钥、路径等）
- [ ] 描述清晰
```

### 3. 审查流程

1. 维护者会在 48 小时内进行审查
2. 根据要求处理反馈意见
3. 获批后，合并至 main 分支

---

## 指南

### 应该做的（Do）
- 保持贡献内容集中且模块化
- 包含清晰的描述
- 提交前进行测试
- 遵循现有的模式
- 记录依赖项

### 不该做的（Don't）
- 包含敏感数据（API 密钥、Token、路径等）
- 添加过于复杂或冷门的配置
- 提交未经测试的贡献
- 创建现有功能的重复项

---

## 文件命名规范

- 使用小写字母并以连字符连接：`python-reviewer.md`
- 具有描述性：使用 `tdd-workflow.md` 而非 `workflow.md`
- 名称与文件名匹配

---

## 有疑问？

- **Issues:** [github.com/affaan-m/everything-claude-code/issues](https://github.com/affaan-m/everything-claude-code/issues)
- **X/Twitter:** [@affaanmustafa](https://x.com/affaanmustafa)

---

感谢你的贡献！让我们共同构建一个优秀的资源库。
