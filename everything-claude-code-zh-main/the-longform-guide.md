# Everything Claude Code 深度指南

![页眉：Everything Claude Code 深度指南](./assets/images/longform/01-header.png)

---

> **前提条件**：本指南建立在 [Everything Claude Code 速查指南（Shorthand Guide）](./the-shortform-guide.md) 的基础之上。如果你尚未配置技能（Skills）、钩子（Hooks）、子智能体（Subagents）、MCP 和插件（Plugins），请先阅读该指南。

![参考速查指南](./assets/images/longform/02-shortform-reference.png)
*速查指南 - 请先阅读*

在速查指南中，我介绍了基础设置：技能（Skills）与命令（Commands）、钩子（Hooks）、子智能体（Subagents）、MCP、插件（Plugins）以及构成高效 Claude Code 工作流骨干的配置模式。那是安装指南和基础架构。

本深度指南将深入探讨区分高效会话与低效会话的技术。如果你还没看过速查指南，请先回去配置好你的环境。接下来的内容假设你已经配置并运行了技能、智能体、钩子和 MCP。

这里的主题包括：Token 经济学、记忆持久化、验证模式、并行化策略，以及构建可重用工作流带来的复利效应。这些是我在 10 个多月的日常使用中提炼出的模式，它们决定了你是会在第一个小时内就受困于上下文衰减（Context Rot），还是能保持数小时的高效会话。

速查指南和深度指南中涵盖的所有内容都可以在 GitHub 上找到：`github.com/affaan-m/everything-claude-code`

---

## 提示与技巧（Tips and Tricks）

### 部分 MCP 是可替代的，且能释放上下文窗口（Context Window）

对于版本控制（GitHub）、数据库（Supabase）、部署（Vercel, Railway）等 MCP —— 大多数平台已经拥有强大的 CLI，MCP 本质上只是对它们的包装。MCP 虽然是一个不错的封装，但它是有代价的。

为了让 CLI 的功能更像 MCP 而不实际使用 MCP（从而避免随之而来的上下文窗口减少），可以考虑将功能捆绑到技能（Skills）和命令（Commands）中。剥离出 MCP 暴露的那些让事情变得简单的工具，并将它们转化为命令。

示例：不要一直加载 GitHub MCP，而是创建一个 `/gh-pr` 命令，包装 `gh pr create` 并带上你首选的选项。不要让 Supabase MCP 消耗上下文，而是创建直接使用 Supabase CLI 的技能。

通过延迟加载（Lazy Loading），上下文窗口问题基本得到了解决。但 Token 的使用和成本并没有以同样的方式解决。CLI + 技能的方法仍然是一种 Token 优化手段。

---

## 重要内容（IMPORTANT STUFF）

### 上下文与记忆管理

为了跨会话共享记忆，最好的办法是编写一个技能（Skill）或命令（Command），用于总结和检查进度，然后保存到 `.claude` 文件夹中的 `.tmp` 文件，并在会话结束前不断追加内容。第二天，它可以将该文件作为上下文并从你离开的地方继续。为每个会话创建一个新文件，这样你就不会把旧的上下文污染到新的工作中。

![会话存储文件树](./assets/images/longform/03-session-storage.png)
*会话存储示例 -> https://github.com/affaan-m/everything-claude-code/tree/main/examples/sessions*

Claude 会创建一个总结当前状态的文件。检查它，如果需要则要求修改，然后重新开始。对于新的对话，只需提供文件路径。当你达到上下文限制并需要继续复杂工作时，这特别有用。这些文件应包含：
- 哪些方法有效（有证据可验证）
- 尝试过但无效的方法
- 尚未尝试的方法以及待办事项

**战略性清除上下文：**

一旦你制定了计划并清除了上下文（现在 Claude Code 的计划模式中的默认选项），你就可以根据计划开展工作。当你积累了大量与执行不再相关的探索性上下文时，这非常有用。对于战略性压缩（Strategic Compacting），请禁用自动压缩（Auto Compact）。在逻辑间隔手动压缩，或者创建一个为你执行此操作的技能。

**高级：动态系统提示词（System Prompt）注入**

我学到的一个模式：不要只把所有东西放在 `CLAUDE.md`（用户范围）或 `.claude/rules/`（项目范围）中，因为它们每个会话都会加载，而是使用 CLI 标志动态注入上下文。

```bash
claude --system-prompt "$(cat memory.md)"
```

这让你可以更精确地控制何时加载哪些上下文。系统提示词内容比用户消息具有更高的权威性，而用户消息又比工具结果具有更高的权威性。

**实际设置：**

```bash
# 日常开发
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'

# PR 评审模式
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'

# 研究/探索模式
alias claude-research='claude --system-prompt "$(cat ~/.claude/contexts/research.md)"'
```

**高级：记忆持久化钩子（Hooks）**

有一些大多数人不知道的钩子可以帮助记忆：

- **PreCompact Hook**：在上下文压缩发生之前，将重要状态保存到文件。
- **Stop Hook (会话结束)**：在会话结束时，将学习成果持久化到文件。
- **SessionStart Hook**：在新会话开始时，自动加载之前的上下文。

我已经构建了这些钩子，它们在仓库的 `github.com/affaan-m/everything-claude-code/tree/main/hooks/memory-persistence` 中。

---

### 持续学习 / 记忆

如果你不得不重复多次提示（Prompt），且 Claude 遇到了同样的问题或给出了你听过的回答 —— 这些模式必须被追加到技能（Skills）中。

**问题：** 浪费 Token，浪费上下文，浪费时间。

**解决方案：** 当 Claude Code 发现了一些非同小可的事情 —— 比如调试技巧、权宜之计、某些特定于项目的模式 —— 它会将这些知识保存为一项新技能。下次出现类似问题时，该技能会自动加载。

我构建了一个执行此操作的持续学习技能：`github.com/affaan-m/everything-claude-code/tree/main/skills/continuous-learning`

**为什么是 Stop 钩子（而不是 UserPromptSubmit）：**

核心设计决策是使用 **Stop 钩子** 而不是 UserPromptSubmit。UserPromptSubmit 在每条消息上都会运行 —— 为每个提示词增加了延迟。Stop 在会话结束时只运行一次 —— 轻量级，不会在会话期间拖慢你的速度。

---

### Token 优化

**核心策略：子智能体（Subagent）架构**

优化你使用的工具和子智能体架构，旨在委派足以胜任任务的最便宜模型。

**模型选择快速参考：**

![模型选择表](./assets/images/longform/04-model-selection.png)
*各种常见任务中子智能体的假设设置及其选择背后的理由*

| 任务类型 | 模型 | 原因 |
| :--- | :--- | :--- |
| 探索/搜索 | Haiku | 快速、便宜，足以查找文件 |
| 简单编辑 | Haiku | 单文件更改，指令清晰 |
| 多文件实现 | Sonnet | 编码的最佳平衡点 |
| 复杂架构 | Opus | 需要深度推理 |
| PR 评审 | Sonnet | 理解上下文，捕捉细微差别 |
| 安全分析 | Opus | 无法承担遗漏漏洞的后果 |
| 撰写文档 | Haiku | 结构简单 |
| 调试复杂 Bug | Opus | 需要将整个系统铭记于心 |

90% 的编码任务默认使用 Sonnet。当第一次尝试失败、任务涉及 5 个以上文件、需要架构决策或安全关键代码时，升级到 Opus。

**价格参考：**

![Claude 模型定价](./assets/images/longform/05-pricing-table.png)
*来源：https://platform.claude.com/docs/en/about-claude/pricing*

**针对工具的优化：**

用 `mgrep` 替换 `grep` —— 与传统的 `grep` 或 `ripgrep` 相比，平均可减少约 50% 的 Token 消耗：

![mgrep 基准测试](./assets/images/longform/06-mgrep-benchmark.png)
*在我们包含 50 个任务的基准测试中，mgrep + Claude Code 使用的 Token 比基于 grep 的工作流少约 2 倍，且判断质量相似或更好。来源：@mixedbread-ai 的 mgrep*

**模块化代码库的好处：**

拥有更具模块化的代码库，使主文件行数保持在几百行而不是几千行，既有助于优化 Token 成本，也有助于在第一次尝试时就正确完成任务。

---

### 验证循环（Verification Loops）与评测（Evals）

**基准测试工作流：**

比较在使用和不使用技能的情况下请求相同的内容，并检查输出差异：

派生（Fork）对话，在其中一个没有技能的工作区启动一个新的工作树（Worktree），最后拉取差异（Diff），看看记录了什么。

**评测模式类型：**

- **基于检查点（Checkpoint）的评测**：设置显式检查点，根据定义的标准进行验证，在继续之前进行修复。
- **持续评测**：每 N 分钟或在重大更改后运行一次，运行完整测试套件 + Lint。

**核心指标：**

```
pass@k: k 次尝试中至少有一次成功
        k=1: 70%  k=3: 91%  k=5: 97%

pass^k: 所有 k 次尝试都必须成功
        k=1: 70%  k=3: 34%  k=5: 17%
```

当你只需要它工作时，使用 **pass@k**。当一致性至关重要时，使用 **pass^k**。

---

## 并行化（PARALLELIZATION）

在多 Claude 终端设置中派生（Forking）对话时，确保派生操作和原始对话的操作范围定义明确。在涉及代码更改时，目标是尽量减少重叠。

**我首选的模式：**

主聊天用于代码更改，派生对话用于询问有关代码库及其当前状态的问题，或研究外部服务。

**关于任意终端数量：**

![Boris 论并行终端](./assets/images/longform/07-boris-parallel.png)
*Boris (Anthropic) 谈运行多个 Claude 实例*

Boris 对并行化有一些建议。他建议在本地运行 5 个 Claude 实例，在上游运行 5 个。我不建议设置任意的终端数量。增加终端应该是出于真正的必要。

你的目标应该是：**以最小可行量的并行化完成尽可能多的工作。**

**用于并行实例的 Git 工作树（Worktrees）：**

```bash
# 为并行工作创建工作树
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
git worktree add ../project-refactor refactor-branch

# 每个工作树都有自己的 Claude 实例
cd ../project-feature-a && claude
```

如果你开始扩展实例，并且有多个 Claude 实例在相互重叠的代码上工作，那么必须使用 git 工作树并为每个实例制定非常明确的计划。使用 `/rename <此处命名>` 为你所有的聊天命名。

![双终端设置](./assets/images/longform/08-two-terminals.png)
*初始设置：左侧终端用于编码，右侧终端用于提问 —— 使用 /rename 和 /fork*

**级联法（The Cascade Method）：**

当运行多个 Claude Code 实例时，使用“级联”模式进行组织：

- 在右侧的新标签页中开启新任务
- 从左向右扫视，从旧到新
- 一次最多关注 3-4 个任务

---

## 基础工作（GROUNDWORK）

**双实例启动模式：**

对于我自己的工作流管理，我喜欢以 2 个开启的 Claude 实例启动一个空仓库。

**实例 1：脚手架智能体（Scaffolding Agent）**
- 奠定脚手架和基础工作
- 创建项目结构
- 设置配置（CLAUDE.md、规则、智能体）

**实例 2：深度研究智能体（Deep Research Agent）**
- 连接到你所有的服务、网页搜索
- 创建详细的 PRD
- 创建架构 Mermaid 图表
- 汇编带有实际文档片段的参考资料

**llms.txt 模式：**

如果可用，你可以在许多文档参考页面通过在其后添加 `/llms.txt` 来找到 `llms.txt`。这会给你一个干净的、针对 LLM 优化的文档版本。

**哲学：构建可重用模式**

来自 @omarsar0：“早期，我花时间构建可重用的工作流/模式。构建起来很乏味，但随着模型和智能体控制器的改进，这产生了疯狂的复利效应。”

**值得投资的方向：**

- 子智能体（Subagents）
- 技能（Skills）
- 命令（Commands）
- 规划模式
- MCP 工具
- 上下文工程模式

---

## 智能体（Agents）与子智能体（Sub-Agents）最佳实践

**子智能体上下文问题：**

子智能体存在的意义是通过返回摘要而不是倾倒所有内容来节省上下文。但编排者（Orchestrator）拥有子智能体缺乏的语义上下文。子智能体只知道字面上的查询，而不知道请求背后的“目的（PURPOSE）”。

**迭代检索模式：**

1. 编排者评估子智能体的每一次返回。
2. 在接受之前提出追问。
3. 子智能体回到源头，获取答案并返回。
4. 循环直到满足要求（最多 3 个周期）。

**关键：** 传递目标上下文（Objective Context），而不只是查询。

**带有顺序阶段的编排者：**

```markdown
阶段 1：研究 RESEARCH (使用 Explore 智能体) → research-summary.md
阶段 2：计划 PLAN (使用 planner 智能体) → plan.md
阶段 3：实现 IMPLEMENT (使用 tdd-guide 智能体) → 代码更改
阶段 4：评审 REVIEW (使用 code-reviewer 智能体) → review-comments.md
阶段 5：验证 VERIFY (如果需要，使用 build-error-resolver) → 完成或循环回溯
```

**关键规则：**

1. 每个智能体获得一个明确的输入，并产生一个明确的输出。
2. 输出成为下一阶段的输入。
3. 绝不跳过阶段。
4. 在智能体之间使用 `/clear`。
5. 将中间输出存储在文件中。

---

## 趣味贴士 / 非关键但有趣的技巧

### 自定义状态栏

你可以使用 `/statusline` 进行设置 —— 然后 Claude 会说你没有状态栏，但可以为你设置并询问你想要在其中包含什么。

另请参阅：ccstatusline（用于自定义 Claude Code 状态栏的社区项目）

### 语音转录

通过语音与 Claude Code 对话。对许多人来说比打字更快。

- Mac 上的 superwhisper, MacWhisper
- 即使有转录错误，Claude 也能理解意图

### 终端别名（Terminal Aliases）

```bash
alias c='claude'
alias gb='github'
alias co='code'
alias q='cd ~/Desktop/projects'
```

---

## 里程碑

![25k+ GitHub Stars](./assets/images/longform/09-25k-stars.png)
*不到一周获得 25,000+ GitHub Stars*

---

## 资源

**智能体编排：**

- claude-flow — 社区构建的企业级编排平台，拥有 54+ 个专业智能体。

**自我改进记忆：**

- 请参阅本仓库中的 `skills/continuous-learning/`
- rlancemartin.github.io/2025/12/01/claude_diary/ - 会话反思模式

**系统提示词参考：**

- system-prompts-and-models-of-ai-tools — AI 系统提示词社区集合（110k+ stars）

**官方：**

- Anthropic Academy: anthropic.skilljar.com

---

## 参考资料

- [Anthropic: 为 AI 智能体揭秘评测 (evals)](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [YK: 32 个 Claude Code 技巧](https://agenticcoding.substack.com/p/32-claude-code-tips-from-basics-to)
- [RLanceMartin: 会话反思模式](https://rlancemartin.github.io/2025/12/01/claude_diary/)
- @PerceptualPeak: 子智能体上下文协商
- @menhguin: 智能体抽象层级列表
- @omarsar0: 复利效应哲学

---

*这两份指南中涵盖的所有内容都可以在 GitHub 上的 [everything-claude-code](https://github.com/affaan-m/everything-claude-code) 找到。*
