# 性能优化

## 模型选择策略

**Haiku 4.5**（具备 Sonnet 90% 的能力，成本仅为其 1/3）:
- 高频调用的轻量级智能体（Agent）
- 结对编程与代码生成
- 多智能体系统（Multi-agent systems）中的工作智能体（Worker agent）

**Sonnet 4.5**（最强编码模型）:
- 核心开发任务
- 多智能体工作流（Multi-agent workflow）编排
- 复杂的编码任务

**Opus 4.5**（最深层的推理能力）:
- 复杂的架构决策
- 极高的推理需求
- 调研与分析任务

## 上下文窗口（Context Window）管理

在以下场景下，应避免占用上下文窗口最后 20% 的空间：
- 大规模重构
- 跨多文件的功能实现
- 复杂交互的调试

对上下文敏感度较低的任务：
- 单文件编辑
- 创建独立的实用工具（Utility）
- 更新文档
- 简单的 Bug 修复

## 扩展思考（Extended Thinking）+ 计划模式（Plan Mode）

扩展思考默认开启，并为内部推理预留最多 31,999 个 Token。

扩展思考控制：
- **切换快捷键**: Option+T (macOS) / Alt+T (Windows/Linux)
- **设置**: 在 `~/.claude/settings.json` 中配置 `alwaysThinkingEnabled`
- **预算上限**: `export MAX_THINKING_TOKENS=10000`
- **详细模式**: 使用 Ctrl+O 显示思考过程输出

对于需要深度推理的复杂任务：
1. 确保已启用扩展思考（默认开启）
2. 启用 **计划模式（Plan Mode）** 以采用结构化方法
3. 通过多轮评审（Criticism rounds）进行彻底分析
4. 使用分工明确的子智能体（Sub-agent）以获取多元视角

## 构建故障排除（Build Troubleshooting）

当构建失败时：
1. 使用 **build-error-resolver** 智能体（Agent）
2. 分析错误信息
3. 逐步进行修复
4. 每次修复后进行验证
