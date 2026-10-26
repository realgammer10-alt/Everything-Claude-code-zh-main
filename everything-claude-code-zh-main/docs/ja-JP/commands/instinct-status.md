---
name: instinct-status
description: 显示所有已学习的直觉（Instincts）及其置信度水平
command: true
---

# 直觉状态（Instinct Status）命令

按领域（Domain）分组显示所有已学习的直觉（Instincts）及其置信度（Confidence）分值。

## 实现

使用插件根路径执行直觉 CLI（Instinct CLI）：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

或者，在未设置 `CLAUDE_PLUGIN_ROOT`（手动安装）的情况下：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py status
```

## 使用方法

```
/instinct-status
/instinct-status --domain code-style
/instinct-status --low-confidence
```

## 执行逻辑

1. 从 `~/.claude/homunculus/instincts/personal/` 读取所有个人直觉文件
2. 从 `~/.claude/homunculus/instincts/inherited/` 读取所有继承的直觉
3. 按领域分组，并配合置信度条显示

## 输出格式

```
📊 Instinct Status
==================

## Code Style (4 instincts)

### prefer-functional-style
Trigger: 编写新函数时
Action: 使用函数式模式而非类
Confidence: ████████░░ 80%
Source: session-observation | 最后更新: 2025-01-22

### use-path-aliases
Trigger: 导入模块时
Action: 使用 @/ 路径别名代替相对导入
Confidence: ██████░░░░ 60%
Source: repo-analysis (github.com/acme/webapp)

## Testing (2 instincts)

### test-first-workflow
Trigger: 添加新功能时
Action: 先写测试，后写实现
Confidence: █████████░ 90%
Source: session-observation

## Workflow (3 instincts)

### grep-before-edit
Trigger: 修改代码时
Action: 先用 Grep 搜索，再用 Read 确认，最后 Edit
Confidence: ███████░░░ 70%
Source: session-observation

---
总计: 9 条直觉 (4 条个人, 5 条继承)
观察者（Observer）: 运行中 (上次分析: 5 分钟前)
```

## 参数（Flags）

- `--domain <name>`: 按领域筛选（如 code-style、testing、git 等）
- `--low-confidence`: 仅显示置信度 < 0.5 的直觉
- `--high-confidence`: 仅显示置信度 >= 0.7 的直觉
- `--source <type>`: 按来源筛选（session-observation、repo-analysis、inherited）
- `--json`: 以 JSON 格式输出，方便程序化调用
