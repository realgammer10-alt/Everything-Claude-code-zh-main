---
name: evolve
description: 将相关的 instincts 聚类为技能、命令或智能体
command: true
---

# Evolve 命令

## 实现

使用插件根路径执行 instinct CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" evolve [--generate]
```

如果未设置 `CLAUDE_PLUGIN_ROOT`（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py evolve [--generate]
```

分析直觉（Instincts），并将相关的项聚类（Cluster）到更高级别的结构中：
- **Commands（命令）**: 当 instincts 描述用户调用的操作时
- **Skills（技能）**: 当 instincts 描述自动触发的行为时
- **Agents（智能体）**: 当 instincts 描述复杂的多步骤流程时

## 使用方法

```
/evolve                    # 分析所有 instincts 并建议进化
/evolve --domain testing   # 仅进化 testing 领域的 instincts
/evolve --dry-run          # 显示将要创建的内容而不实际创建
/evolve --threshold 5      # 聚类至少需要 5 个相关的 instincts
```

## 进化规则

### → Command (用户调用)
当 instincts 描述用户明确要求执行的操作时：
- 关于“当用户要求...时”的多个 instincts
- 带有“创建新的 X 时”等触发器的 instincts
- 遵循可重复序列的 instincts

示例：
- `new-table-step1`: "添加数据库表时，创建迁移（migration）"
- `new-table-step2`: "添加数据库表时，更新架构（schema）"
- `new-table-step3`: "添加数据库表时，重新生成类型"

→ 创建：`/new-table` 命令

### → Skill (自动触发)
当 instincts 描述应当自动发生的行为时：
- 模式匹配（Pattern matching）触发器
- 错误处理响应
- 代码风格强制执行

示例：
- `prefer-functional`: "编写函数时，优先使用函数式风格"
- `use-immutable`: "更改状态时，使用不可变（Immutable）模式"
- `avoid-classes`: "设计模块时，避免基于类的设计"

→ 创建：`functional-patterns` 技能（Skill）

### → Agent (需要深度/解耦)
当 instincts 描述受益于解耦的复杂多步骤流程时：
- 调试工作流（Workflow）
- 重构序列
- 研究任务

示例：
- `debug-step1`: "调试时，首先检查日志"
- `debug-step2`: "调试时，隔离发生故障的组件"
- `debug-step3`: "调试时，创建最小化重现"
- `debug-step4`: "调试时，通过测试验证修复"

→ 创建：`debugger` 智能体（Agent）

## 执行内容

1. 从 `~/.claude/homunculus/instincts/` 读取所有 instincts
2. 按以下方式对 instincts 进行分组：
   - 领域相似性
   - 触发模式重叠
   - 操作序列关系
3. 对于包含 3 个及以上相关 instincts 的每个聚类：
   - 确定进化类型（command/skill/agent）
   - 生成相应文件
   - 保存至 `~/.claude/homunculus/evolved/{commands,skills,agents}/`
4. 将进化的结构链接到源 instincts

## 输出格式

```
🧬 Evolve Analysis
==================

发现 3 个已准备好进化的聚类：

## 聚类 1: 数据库迁移工作流
Instincts: new-table-migration, update-schema, regenerate-types
Type: Command
Confidence: 85%(基于 12 次观察)

创建: /new-table 命令
Files:
  - ~/.claude/homunculus/evolved/commands/new-table.md

## 聚类 2: 函数式代码风格
Instincts: prefer-functional, use-immutable, avoid-classes, pure-functions
Type: Skill
Confidence: 78%(基于 8 次观察)

创建: functional-patterns 技能
Files:
  - ~/.claude/homunculus/evolved/skills/functional-patterns.md

## 聚类 3: 调试流程
Instincts: debug-check-logs, debug-isolate, debug-reproduce, debug-verify
Type: Agent
Confidence: 72%(基于 6 次观察)

创建: debugger 智能体
Files:
  - ~/.claude/homunculus/evolved/agents/debugger.md

---
执行 `/evolve --execute` 以创建这些文件。
```

## 参数 (Flags)

- `--execute`: 实际创建进化的结构（默认为预览）
- `--dry-run`: 仅预览而不创建
- `--domain <name>`: 仅进化指定领域的 instincts
- `--threshold <n>`: 形成聚类所需的最小 instincts 数量（默认值: 3）
- `--type <command|skill|agent>`: 仅创建指定类型的结构

## 生成的文件格式

### Command
```markdown
---
name: new-table
description: 通过迁移、架构更新和类型生成来创建新的数据库表
command: /new-table
evolved_from:
  - new-table-migration
  - update-schema
  - regenerate-types
---

# New Table 命令

[基于聚类的 instincts 生成的内容]

## 步骤
1. ...
2. ...
```

### Skill
```markdown
---
name: functional-patterns
description: 强制执行函数式编程模式
evolved_from:
  - prefer-functional
  - use-immutable
  - avoid-classes
---

# Functional Patterns 技能

[基于聚类的 instincts 生成的内容]
```

### Agent
```markdown
---
name: debugger
description: 系统化调试智能体
model: sonnet
evolved_from:
  - debug-check-logs
  - debug-isolate
  - debug-reproduce
---

# Debugger 智能体

[基于聚类的 instincts 生成的内容]
```
