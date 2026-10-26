---
description: 分析直觉（instincts）并建议或生成进化后的结构
agent: build
---

# Evolve 命令

在 continuous-learning-v2 中分析并进化直觉（instincts）：$ARGUMENTS

## 任务说明

执行：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" evolve $ARGUMENTS
```

如果 `CLAUDE_PLUGIN_ROOT` 不可用，请使用：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py evolve $ARGUMENTS
```

## 支持的参数 (v2.1)

- 无参数：仅进行分析
- `--generate`：同时在 `evolved/{skills,commands,agents}` 下生成文件

## 行为说明

- 使用项目（Project）+ 全局（Global）直觉（instincts）进行分析。
- 显示来自触发器和领域聚类的技能（Skill）/ 命令（Command）/ 智能体（Agent）候选。
- 显示项目（Project）-> 全局（Global）的晋升（Promotion）候选。
- 使用 `--generate` 时，输出路径为：
  - 项目上下文（Project context）：`~/.claude/homunculus/projects/<project-id>/evolved/`
  - 全局回退（Global fallback）：`~/.claude/homunculus/evolved/`
