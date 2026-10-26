**语言:** English | [简体中文](../../README.zh-CN.md) | [繁体中文](docs/zh-TW/README.md) | [日本語](docs/ja-JP/README.md)

# Everything Claude Code

[![Stars](https://img.shields.io/github/stars/affaan-m/everything-claude-code?style=flat)](https://github.com/affaan-m/everything-claude-code/stargazers)
[![Forks](https://img.shields.io/github/forks/affaan-m/everything-claude-code?style=flat)](https://github.com/affaan-m/everything-claude-code/network/members)
[![Contributors](https://img.shields.io/github/contributors/affaan-m/everything-claude-code?style=flat)](https://github.com/affaan-m/everything-claude-code/graphs/contributors)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Shell](https://img.shields.io/badge/-Shell-4EAA25?logo=gnu-bash&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white)
![Java](https://img.shields.io/badge/-Java-ED8B00?logo=openjdk&logoColor=white)
![Markdown](https://img.shields.io/badge/-Markdown-000000?logo=markdown&logoColor=white)

> **42K+ stars** | **5K+ forks** | **24 contributors** | **支持 6 种语言**

---

<div align="center">

**🌐 语言 / Language / 語言**

[**English**](README.md) | [简体中文](README.zh-CN.md) | [繁体中文](docs/zh-TW/README.md) | [日本語](docs/ja-JP/README.md)

</div>

---

**由 Anthropic 黑客松获胜者提供的完整 Claude Code 配置集。**

经过 10 个月以上的密集日常使用，在实际产品构建过程中不断进化，包含生产级可用的智能体（Agents）、技能（Skills）、钩子（Hooks）、命令（Commands）、规则（Rules）以及 MCP 配置。

---

## 指南 (Guides)

本仓库仅包含原始代码。以下指南将解释一切。

<table>
<tr>
<td width="50%">
<a href="https://x.com/affaanmustafa/status/2012378465664745795">
<img src="https://github.com/user-attachments/assets/1a471488-59cc-425b-8345-5245c7efbcef" alt="The Shorthand Guide to Everything Claude Code" />
</a>
</td>
<td width="50%">
<a href="https://x.com/affaanmustafa/status/2014040193557471352">
<img src="https://github.com/user-attachments/assets/c9ca43bc-b149-427f-b551-af6840c368f0" alt="The Longform Guide to Everything Claude Code" />
</a>
</td>
</tr>
<tr>
<td align="center"><b>简明指南</b><br/>安装、基础、哲学。<b>请先阅读此篇。</b></td>
<td align="center"><b>长篇指南</b><br/>Token 优化、内存持久化、评测、并行化。</td>
</tr>
</table>

| 主题 | 学习内容 |
|-------|-------------------|
| Token 优化 | 模型选择、系统提示词削减、后台进程 |
| 内存持久化 (Memory Persistence) | 在会话之间自动保存/加载上下文的钩子 (Hooks) |
| 持续学习 (Continuous Learning) | 从会话中自动提取模式并转换为可复用的技能 (Skills) |
| 验证循环 (Verification Loop) | 检查点与持续评估、评分器类型、pass@k 指标 |
| 并行化 (Parallelization) | Git 工作树、级联方法、扩展时机 |
| 子智能体编排 (Sub-agent Orchestration) | 上下文问题、迭代搜索模式 |

---

## 新功能

### v1.4.1 — 错误修复 (2026年2月)

- **修复 instinct 导入时的内容丢失** — 修复了运行 `/instinct-import` 时，`parse_instinct_file()` 会静默删除 frontmatter 之后所有内容（Action、Evidence、Examples 部分）的问题。该问题由社区贡献者 @ericcai0814 解决（[#148](https://github.com/affaan-m/everything-claude-code/issues/148), [#161](https://github.com/affaan-m/everything-claude-code/pull/161)）

### v1.4.0 — 多语言规则、安装向导 & PM2 (2026年2月)

- **交互式安装向导** — 新的 `configure-ecc` 技能提供带合并/覆盖检测的引导式设置
- **PM2 & 多智能体编排** — 6 个新命令（`/pm2`, `/multi-plan`, `/multi-execute`, `/multi-backend`, `/multi-frontend`, `/multi-workflow`）用于管理复杂的多服务工作流
- **多语言规则架构** — 将规则从扁平文件重构为 `common/` + `typescript/` + `python/` + `golang/` 目录，可仅安装所需的语言
- **简体中文 (zh-CN) 翻译** — 所有智能体、命令、技能、规则的完整翻译（80+ 文件）
- **GitHub Sponsors 支持** — 可以通过 GitHub Sponsors 资助本项目
- **强化 CONTRIBUTING.md** — 为每种贡献类型提供详细的 PR 模板

### v1.3.0 — 支持 OpenCode 插件 (2026年2月)

- **完整 OpenCode 集成** — 12 个智能体、24 个命令、16 个技能，通过 20+ 事件类型支持 OpenCode 插件系统的钩子
- **3 个原生自定义工具** — run-tests、check-coverage、security-audit
- **LLM 文档** — 用于完整 OpenCode 文档的 `llms.txt`

### v1.2.0 — 集成命令与技能 (2026年2月)

- **Python/Django 支持** — Django 模式、安全、TDD、验证技能
- **Java Spring Boot 技能** — Spring Boot 模式、安全、TDD、验证
- **会话管理** — 用于查看会话历史的 `/sessions` 命令
- **持续学习 v2** — 基于直觉 (instinct) 的学习，包含置信度评分、导入/导出及演化功能

查看完整变更日志请参考 [Releases](https://github.com/affaan-m/everything-claude-code/releases)。

---

## 🚀 快速上手

2 分钟内即可完成部署：

### 第 1 步：安装插件

```bash
# 添加市场
/plugin marketplace add affaan-m/everything-claude-code

# 安装插件
/plugin install everything-claude-code@everything-claude-code
```

### 第 2 步：安装规则（必选）

> ⚠️ **重要:** Claude Code 插件无法自动分发 `rules`。请手动安装：

```bash
# 首先克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git

# 安装通用规则（必选）
cp -r everything-claude-code/rules/common/* ~/.claude/rules/

# 安装语言特定规则（选择您的技术栈）
cp -r everything-claude-code/rules/typescript/* ~/.claude/rules/
cp -r everything-claude-code/rules/python/* ~/.claude/rules/
cp -r everything-claude-code/rules/golang/* ~/.claude/rules/
```

### 第 3 步：开始使用

```bash
# 尝试命令（插件采用命名空间格式）
/everything-claude-code:plan "添加用户认证"

# 手动安装（选项 2）使用简写格式：
# /plan "添加用户认证"

# 查看可用命令
/plugin list everything-claude-code@everything-claude-code
```

✨ **完成！** 现在您可以访问 13 个智能体、43 个技能和 31 个命令。

---

## 🌐 跨平台支持

该插件完全支持 **Windows、macOS 和 Linux**。所有钩子和脚本均采用 Node.js 重写，以实现最大兼容性。

### 包管理器检测

插件会自动检测您偏好的包管理器（npm、pnpm、yarn、bun），优先级如下：

1. **环境变量**: `CLAUDE_PACKAGE_MANAGER`
2. **项目设置**: `.claude/package-manager.json`
3. **package.json**: `packageManager` 字段
4. **锁文件**: 从 package-lock.json、yarn.lock、pnpm-lock.yaml、bun.lockb 检测
5. **全局设置**: `~/.claude/package-manager.json`
6. **备选项**: 第一个可用的包管理器

设置您偏好的包管理器：

```bash
# 通过环境变量
export CLAUDE_PACKAGE_MANAGER=pnpm

# 通过全局设置
node scripts/setup-package-manager.js --global pnpm

# 通过项目设置
node scripts/setup-package-manager.js --project bun

# 检测当前配置
node scripts/setup-package-manager.js --detect
```

或者在 Claude Code 中使用 `/setup-pm` 命令。

---

## 📦 包含内容

本仓库是一个 **Claude Code 插件** — 您可以直接安装或手动复制组件。

```
everything-claude-code/
|-- .claude-plugin/   # 插件与市场清单
|   |-- plugin.json         # 插件元数据与组件路径
|   |-- marketplace.json    # 用于 /plugin marketplace add 的市场目录
|
|-- agents/           # 委派任务的专业子智能体 (Sub-agents)
|   |-- planner.md           # 功能实现计划
|   |-- architect.md         # 系统设计决策
|   |-- tdd-guide.md         # 测试驱动开发
|   |-- code-reviewer.md     # 质量与安全审查
|   |-- security-reviewer.md # 漏洞分析
|   |-- build-error-resolver.md
|   |-- e2e-runner.md        # Playwright E2E 测试
|   |-- refactor-cleaner.md  # 冗余代码清理
|   |-- doc-updater.md       # 文档同步
|   |-- go-reviewer.md       # Go 代码审查
|   |-- go-build-resolver.md # Go 构建错误解决
|   |-- python-reviewer.md   # Python 代码审查（新增）
|   |-- database-reviewer.md # 数据库/Supabase 审查（新增）
|
|-- skills/           # 工作流定义与领域知识
|   |-- coding-standards/           # 语言最佳实践
|   |-- backend-patterns/           # API、数据库、缓存模式
|   |-- frontend-patterns/          # React、Next.js 模式
|   |-- continuous-learning/        # 从会话中自动提取模式（长篇指南）
|   |-- continuous-learning-v2/     # 带置信度评分的直觉驱动学习
|   |-- iterative-retrieval/        # 用于子智能体的阶段性上下文精炼
|   |-- strategic-compact/          # 手动压缩建议（长篇指南）
|   |-- tdd-workflow/               # TDD 方法论
|   |-- security-review/            # 安全检查列表
|   |-- eval-harness/               # 验证循环评估（长篇指南）
|   |-- verification-loop/          # 持续验证（长篇指南）
|   |-- golang-patterns/            # Go 惯用法与最佳实践
|   |-- golang-testing/             # Go 测试模式、TDD、基准测试
|   |-- cpp-testing/                # C++ 测试 GoogleTest、CMake/CTest（新增）
|   |-- django-patterns/            # Django 模式、模型、视图（新增）
|   |-- django-security/            # Django 安全最佳实践（新增）
|   |-- django-tdd/                 # Django TDD 工作流（新增）
|   |-- django-verification/        # Django 验证循环（新增）
|   |-- python-patterns/            # Python 惯用法与最佳实践（新增）
|   |-- python-testing/             # 使用 pytest 的 Python 测试（新增）
|   |-- springboot-patterns/        # Java Spring Boot 模式（新增）
|   |-- springboot-security/        # Spring Boot 安全（新增）
|   |-- springboot-tdd/             # Spring Boot TDD（新增）
|   |-- springboot-verification/    # Spring Boot 验证（新增）
|   |-- configure-ecc/              # 交互式安装向导（新增）
|   |-- security-scan/              # AgentShield 安全审计集成（新增）
|
|-- commands/         # 斜杠命令快速执行
|   |-- tdd.md              # /tdd - 测试驱动开发
|   |-- plan.md             # /plan - 实现计划
|   |-- e2e.md              # /e2e - E2E 测试生成
|   |-- code-review.md      # /code-review - 质量审查
|   |-- build-fix.md        # /build-fix - 构建错误修复
|   |-- refactor-clean.md   # /refactor-clean - 冗余代码清理
|   |-- learn.md            # /learn - 会话中的模式提取（长篇指南）
|   |-- checkpoint.md       # /checkpoint - 保存验证状态（长篇指南）
|   |-- verify.md           # /verify - 执行验证循环（长篇指南）
|   |-- setup-pm.md         # /setup-pm - 配置包管理器
|   |-- go-review.md        # /go-review - Go 代码审查（新增）
|   |-- go-test.md          # /go-test - Go TDD 工作流（新增）
|   |-- go-build.md         # /go-build - 修复 Go 构建错误（新增）
|   |-- skill-create.md     # /skill-create - 从 Git 历史生成技能（新增）
|   |-- instinct-status.md  # /instinct-status - 显示学习到的直觉（新增）
|   |-- instinct-import.md  # /instinct-import - 导入直觉（新增）
|   |-- instinct-export.md  # /instinct-export - 导出直觉（新增）
|   |-- evolve.md           # /evolve - 将直觉聚类为技能
|   |-- pm2.md              # /pm2 - PM2 服务生命周期管理（新增）
|   |-- multi-plan.md       # /multi-plan - 多智能体任务分解（新增）
|   |-- multi-execute.md    # /multi-execute - 编排多智能体工作流（新增）
|   |-- multi-backend.md    # /multi-backend - 后端多服务编排（新增）
|   |-- multi-frontend.md   # /multi-frontend - 前端多服务编排（新增）
|   |-- multi-workflow.md   # /multi-workflow - 通用多服务工作流（新增）
|
|-- rules/            # 始终遵循的准则（需复制到 ~/.claude/rules/）
|   |-- README.md            # 结构概览与安装指南
|   |-- common/              # 语言无关的原则
|   |   |-- coding-style.md    # 不可变性、文件组织
|   |   |-- git-workflow.md    # 提交格式、PR 流程
|   |   |-- testing.md         # TDD、80% 覆盖率要求
|   |   |-- performance.md     # 模型选择、上下文管理
|   |   |-- patterns.md        # 设计模式、骨架项目
|   |   |-- hooks.md           # 钩子架构、TodoWrite
|   |   |-- agents.md          # 何时委派给子智能体
|   |   |-- security.md        # 必须的安全检查
|   |-- typescript/          # TypeScript/JavaScript 特定
|   |-- python/              # Python 特定
|   |-- golang/              # Go 特定
|
|-- hooks/            # 基于触发器的自动化
|   |-- hooks.json                # 所有钩子设置（PreToolUse、PostToolUse、Stop 等）
|   |-- memory-persistence/       # 会话生命周期钩子（长篇指南）
|   |-- strategic-compact/        # 压缩建议（长篇指南）
|
|-- scripts/          # 跨平台 Node.js 脚本（新增）
|   |-- lib/                     # 共享工具库
|   |   |-- utils.js             # 跨平台文件/路径/系统工具
|   |   |-- package-manager.js   # 包管理器检测与选择
|   |-- hooks/                   # 钩子实现
|   |   |-- session-start.js     # 会话开始时加载上下文
|   |   |-- session-end.js       # 会话结束时保存状态
|   |   |-- pre-compact.js       # 压缩前保存状态
|   |   |-- suggest-compact.js   # 战略性压缩建议
|   |   |-- evaluate-session.js  # 从会话中提取模式
|   |-- setup-package-manager.js # 交互式 PM 设置
|
|-- tests/            # 测试套件（新增）
|   |-- lib/                     # 库测试
|   |-- hooks/                   # 钩子测试
|   |-- run-all.js               # 执行所有测试
|
|-- contexts/         # 动态系统提示词注入上下文（长篇指南）
|   |-- dev.md              # 开发模式上下文
|   |-- review.md           # 代码审查模式上下文
|   |-- research.md         # 研究/探索模式上下文
|
|-- examples/         # 配置示例与会话
|   |-- CLAUDE.md           # 项目级配置示例
|   |-- user-CLAUDE.md      # 用户级配置示例
|
|-- mcp-configs/      # MCP 服务配置
|   |-- mcp-servers.json    # GitHub、Supabase、Vercel、Railway 等
|
|-- marketplace.json  # 自托管市场配置（用于 /plugin marketplace add）
```

---

## 🛠️ 生态工具

### 技能创建工具 (Skill Creator)

从代码仓库生成 Claude Code 技能的两种方法：

#### 选项 A：本地分析（内置）

无需外部服务，使用 `/skill-create` 命令进行本地分析：

```bash
/skill-create                    # 分析当前仓库
/skill-create --instincts        # 同时生成用于持续学习的直觉
```

这将本地分析 Git 历史并生成 SKILL.md 文件。

#### 选项 B：GitHub App（高级功能）

适用于高级功能（10k+ 提交、自动 PR、团队共享）：

[安装 GitHub App](https://github.com/apps/skill-creator) | [ecc.tools](https://ecc.tools)

```bash
# 在任何 Issue 中评论：
/skill-creator analyze

# 或推送至默认分支时自动触发
```

两个选项都会生成：
- **SKILL.md 文件** - 可在 Claude Code 中立即使用的技能
- **instinct 集合** - 用于 continuous-learning-v2
- **模式提取** - 从提交历史中学习

### AgentShield — 安全审计工具

扫描 Claude Code 配置中的漏洞、误配置和注入风险。

```bash
# 快速扫描（无需安装）
npx ecc-agentshield scan

# 自动修复安全问题
npx ecc-agentshield scan --fix

# 使用 Opus 4.6 进行深度分析
npx ecc-agentshield scan --opus --stream

# 从零生成安全配置
npx ecc-agentshield init
```

检查 CLAUDE.md、settings.json、MCP 服务、钩子、智能体定义。生成安全等级（A-F）和可执行的结果。

可以在 Claude Code 中运行 `/security-scan`，或通过 [GitHub Action](https://github.com/affaan-m/agentshield) 添加到 CI。

[GitHub](https://github.com/affaan-m/agentshield) | [npm](https://www.npmjs.com/package/ecc-agentshield)

### 🧠 持续学习 v2

基于直觉 (instinct) 的学习系统会自动学习模式：

```bash
/instinct-status        # 显示带置信度的已学习直觉
/instinct-import <file> # 导入他人的直觉
/instinct-export        # 导出直觉以便分享
/evolve                 # 将相关的直觉聚类为技能
```

完整文档请参阅 `skills/continuous-learning-v2/`。

---

## 📋 要求

### Claude Code CLI 版本

**最低版本: v2.1.0 或更高**

本插件需要 Claude Code CLI v2.1.0+，因为插件系统处理钩子的方式发生了变化。

查看版本：
```bash
claude --version
```

### 重要: 钩子自动加载行为

> ⚠️ **面向贡献者:** 请勿在 `.claude-plugin/plugin.json` 中添加 `"hooks"` 字段。这将在回归测试中强制执行。

Claude Code v2.1+ 会自动加载已安装插件的 `hooks/hooks.json`（惯例）。在 `plugin.json` 中显式声明会导致错误：

```
Duplicate hooks file detected: ./hooks/hooks.json resolves to already-loaded file
```

**背景:** 这在本仓库中引起了多次 修复/回滚 循环（[#29](https://github.com/affaan-m/everything-claude-code/issues/29), [#52](https://github.com/affaan-m/everything-claude-code/issues/52), [#103](https://github.com/affaan-m/everything-claude-code/issues/103)）。由于 Claude Code 版本间行为变化导致了混乱。现已通过回归测试防止未来再次发生。

---

## 📥 安装

### 选项 1：作为插件安装（推荐）

使用本仓库最简单的方法 — 作为 Claude Code 插件安装：

```bash
# 将本仓库添加为市场
/plugin marketplace add affaan-m/everything-claude-code

# 安装插件
/plugin install everything-claude-code@everything-claude-code
```

或者直接添加到 `~/.claude/settings.json`：

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

现在您可以立即访问所有命令、智能体、技能和钩子。

> **注:** Claude Code 插件系统无法通过插件分发 `rules`（[上游限制](https://code.claude.com/docs/en/plugins-reference)）。规则必须手动安装：
>
> ```bash
> # 首先克隆仓库
> git clone https://github.com/affaan-m/everything-claude-code.git
>
> # 选项 A：用户级规则（适用于所有项目）
> mkdir -p ~/.claude/rules
> cp -r everything-claude-code/rules/common/* ~/.claude/rules/
> cp -r everything-claude-code/rules/typescript/* ~/.claude/rules/   # 选择技术栈
> cp -r everything-claude-code/rules/python/* ~/.claude/rules/
> cp -r everything-claude-code/rules/golang/* ~/.claude/rules/
>
> # 选项 B：项目级规则（仅限当前项目）
> mkdir -p .claude/rules
> cp -r everything-claude-code/rules/common/* .claude/rules/
> cp -r everything-claude-code/rules/typescript/* .claude/rules/     # 选择技术栈
> ```

---

### 🔧 选项 2：手动安装

如果您想手动控制安装内容：

```bash
# 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git

# 将智能体复制到 Claude 配置
cp everything-claude-code/agents/*.md ~/.claude/agents/

# 复制规则（通用 + 语言特定）
cp -r everything-claude-code/rules/common/* ~/.claude/rules/
cp -r everything-claude-code/rules/typescript/* ~/.claude/rules/   # 选择技术栈
cp -r everything-claude-code/rules/python/* ~/.claude/rules/
cp -r everything-claude-code/rules/golang/* ~/.claude/rules/

# 复制命令
cp everything-claude-code/commands/*.md ~/.claude/commands/

# 复制技能
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

#### 在 settings.json 中添加钩子

将 `hooks/hooks.json` 中的钩子复制到 `~/.claude/settings.json`。

#### 配置 MCP

从 `mcp-configs/mcp-servers.json` 中将所需的 MCP 服务复制到 `~/.claude.json`。

**重要:** 请将 `YOUR_*_HERE` 占位符替换为真实的 API 密钥。

---

## 🎯 核心概念

### 智能体 (Agents)

子智能体处理有限范围的任务。例如：

```markdown
---
name: code-reviewer
description: 审查代码质量、安全性和可维护性
tools: ["Read", "Grep", "Glob", "Bash"]
model: opus
---

你是一位经验丰富的代码审查员...

```

### 技能 (Skills)

技能是由命令或智能体调用的工作流定义：

```markdown
# TDD 工作流

1. 首先定义接口
2. 让测试失败 (RED)
3. 实现最小代码 (GREEN)
4. 重构 (IMPROVE)
5. 验证 80%+ 的覆盖率
```

### 钩子 (Hooks)

钩子在工具事件上触发。例如 — 关于 console.log 的警告：

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
  }]
}
```

### 规则 (Rules)

规则是始终遵循的指南，组织在 `common/`（语言无关）+ 语言特定目录中：

```
rules/
  common/          # 普遍原则（始终安装）
  typescript/      # TS/JS 特定模式与工具
  python/          # Python 特定模式与工具
  golang/          # Go 特定模式与工具
```

安装与结构的详细信息请参阅 [`rules/README.md`](rules/README.md)。

---

## 🧪 执行测试

插件包含完整的测试套件：

```bash
# 执行所有测试
node tests/run-all.js

# 执行单个测试文件
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
node tests/hooks/hooks.test.js
```

---

## 🤝 贡献

**非常欢迎并鼓励贡献。**

本仓库旨在成为社区资源。如果您有：
- 有用的智能体或技能
- 巧妙的钩子
- 更好的 MCP 设置
- 改进后的规则

欢迎提交贡献！指南请参考 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 贡献思路

- 语言特定技能 (Rust, C#, Swift, Kotlin) — 已包含 Go, Python, Java
- 框架特定配置 (Rails, Laravel, FastAPI, NestJS) — 已包含 Django, Spring Boot
- DevOps 智能体 (Kubernetes, Terraform, AWS, Docker)
- 测试策略（不同框架、视觉回归）
- 专业领域知识（机器学习、数据工程、移动开发）

---

## Cursor IDE 支持

ecc-universal 包含 [Cursor IDE](https://cursor.com) 的预翻译配置。`.cursor/` 目录包含针对 Cursor 格式适配的规则、智能体、技能、命令和 MCP 配置。

### 快速上手 (Cursor)

```bash
# 安装包
npm install ecc-universal

# 安装语言规则
./install.sh --target cursor typescript
./install.sh --target cursor python golang
```

### 翻译内容

| 组件 | Claude Code → Cursor | 契合度 |
|-----------|---------------------|--------|
| 规则 (Rules) | 添加 YAML Frontmatter，路径扁平化 | 完全 |
| 智能体 (Agents) | 模型 ID 展开，工具 → 只读标志 | 完全 |
| 技能 (Skills) | 无需变更（标准一致） | 一致 |
| 命令 (Commands) | 路径引用更新，multi-* 存根化 | 部分 |
| MCP 配置 | 环境插值语法更新 | 完全 |
| 钩子 (Hooks) | Cursor 无等效功能 | 参考其他方法 |

详情请参阅 [.cursor/README.md](.cursor/README.md) 及完整迁移指南 [.cursor/MIGRATION.md](.cursor/MIGRATION.md)。

---

## 🔌 OpenCode 支持

ECC 提供**完整 OpenCode 支持**，包含插件与钩子。

### 快速上手

```bash
# 安装 OpenCode
npm install -g opencode

# 在仓库根目录运行
opencode
```

配置将从 `.opencode/opencode.json` 自动检测。

### 功能契合度

| 功能 | Claude Code | OpenCode | 状态 |
|---------|-------------|----------|--------|
| 智能体 | ✅ 14 个智能体 | ✅ 12 个智能体 | **Claude Code 领先** |
| 命令 | ✅ 30 个命令 | ✅ 24 个命令 | **Claude Code 领先** |
| 技能 | ✅ 28 个技能 | ✅ 16 个技能 | **Claude Code 领先** |
| 钩子 | ✅ 3 个阶段 | ✅ 20+ 事件 | **OpenCode 更多！** |
| 规则 | ✅ 8 条规则 | ✅ 8 条规则 | **完全对等** |
| MCP 服务 | ✅ 完整 | ✅ 完整 | **完全对等** |
| 自定义工具 | ✅ 通过钩子 | ✅ 原生支持 | **OpenCode 更好** |

### 插件驱动的钩子支持

OpenCode 的插件系统比 Claude Code 更先进，支持 20+ 事件类型：

| Claude Code 钩子 | OpenCode 插件事件 |
|-----------------|----------------------|
| PreToolUse | `tool.execute.before` |
| PostToolUse | `tool.execute.after` |
| Stop | `session.idle` |
| SessionStart | `session.created` |
| SessionEnd | `session.deleted` |

**额外 OpenCode 事件**: `file.edited`, `file.watcher.updated`, `message.updated`, `lsp.client.diagnostics`, `tui.toast.show` 等。

### 可用命令 (24)

| 命令 | 说明 |
|---------|-------------|
| `/plan` | 创建实现计划 |
| `/tdd` | 执行 TDD 工作流 |
| `/code-review` | 审查代码变更 |
| `/security` | 执行安全审查 |
| `/build-fix` | 修复构建错误 |
| `/e2e` | 生成 E2E 测试 |
| `/refactor-clean` | 清理冗余代码 |
| `/orchestrate` | 多智能体工作流 |
| `/learn` | 从会话中提取模式 |
| `/checkpoint` | 保存验证状态 |
| `/verify` | 执行验证循环 |
| `/eval` | 针对基准进行评估 |
| `/update-docs` | 更新文档 |
| `/update-codemaps` | 更新代码图谱 |
| `/test-coverage` | 分析覆盖率 |
| `/go-review` | Go 代码审查 |
| `/go-test` | Go TDD 工作流 |
| `/go-build` | 修复 Go 构建错误 |
| `/skill-create` | 从 Git 生成技能 |
| `/instinct-status` | 显示学习到的直觉 |
| `/instinct-import` | 导入直觉 |
| `/instinct-export` | 导出直觉 |
| `/evolve` | 将直觉聚类为技能 |
| `/setup-pm` | 配置包管理器 |

### 插件安装

**选项 1：直接使用**
```bash
cd everything-claude-code
opencode
```

**选项 2：作为 npm 包安装**
```bash
npm install ecc-universal
```

随后添加到 `opencode.json`：
```json
{
  "plugin": ["ecc-universal"]
}
```

### 文档

- **迁移指南**: `.opencode/MIGRATION.md`
- **OpenCode 插件 README**: `.opencode/README.md`
- **集成规则**: `.opencode/instructions/INSTRUCTIONS.md`
- **LLM 文档**: `llms.txt`（完整的 OpenCode 文档）

---

## 📖 背景

自实验性发布以来，我一直使用 Claude Code。2025 年 9 月，我与 [@DRodriguezFX](https://x.com/DRodriguezFX) 一起使用 Claude Code 构建了 [zenith.chat](https://zenith.chat)，并赢得了 Anthropic x Forum Ventures 黑客松。

这些配置已在多个生产环境应用中经过实战测试。

---

## ⚠️ 重要说明

### 上下文窗口管理 (Context Window Management)

**重要:** 请勿一次性启用所有 MCP。启用过多工具可能会使 200k 的上下文窗口缩小至 70k。

经验法则：
- 配置 20-30 个 MCP
- 每个项目保持启用少于 10 个
- 活跃工具总数少于 80 个

在项目配置中使用 `disabledMcpServers` 来禁用不使用的工具。

### 自定义

这些配置适用于我的工作流。您应该：
1. 从您认同的部分开始
2. 根据您的技术栈进行修改
3. 删除不使用的部分
4. 添加您自己的模式

---

## 🌟 Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=affaan-m/everything-claude-code&type=Date)](https://star-history.com/#affaan-m/everything-claude-code&Date)

---

## 🔗 链接

- **简明指南（先看这个）:** [Everything Claude Code 简明指南](https://x.com/affaanmustafa/status/2012378465664745795)
- **详细指南（高级）:** [Everything Claude Code 详细指南](https://x.com/affaanmustafa/status/2014040193557471352)
- **关注我:** [@affaanmustafa](https://x.com/affaanmustafa)
- **zenith.chat:** [zenith.chat](https://zenith.chat)
- **技能目录:** awesome-agent-skills（社区维护的智能体技能目录）

---

## 📄 许可证

MIT - 自由使用、根据需要修改，如果可能请贡献回馈。

---

**如果这个仓库对您有帮助，请给个 Star。请阅读两份指南。构建伟大的产品。**
