---
description: 显示已学习的直觉（项目 + 全局）及其置信度
agent: build
---

# 直觉状态命令（Instinct Status Command）

显示来自 continuous-learning-v2 的直觉（Instinct）状态：$ARGUMENTS

## 你的任务

执行：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

如果 `CLAUDE_PLUGIN_ROOT` 不可用，请使用：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py status
```

## 行为说明

- 输出内容包括项目作用域（Project-scoped）和全局（Global）直觉。
- 当 ID 冲突时，项目直觉将覆盖全局直觉。
- 输出按领域（Domain）分组，并带有置信度条（Confidence bars）。
- 此命令在 v2.1 版本中不支持额外的过滤器（Filters）。
