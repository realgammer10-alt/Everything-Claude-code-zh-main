# 钩子（Hooks）系统

## 钩子（Hook）类型

- **PreToolUse**: 工具执行前（验证、参数修改）
- **PostToolUse**: 工具执行后（自动格式化、检查）
- **Stop**: 会话（Session）结束时（最终验证）

## 自动批准权限（Auto-approval Permissions）

谨慎使用：
- 针对可靠且定义明确的计划进行启用
- 在探索性任务中禁用
- 切勿使用 `dangerously-skip-permissions` 标志
- 改为在 `~/.claude.json` 中配置 `allowedTools`

## TodoWrite 最佳实践

使用 TodoWrite 工具：
- 追踪多步骤任务的进度
- 验证对指令的理解
- 实现实时调整
- 展示详细的实现步骤

Todo 列表可以揭示：
- 顺序错误的步骤
- 缺失的条目
- 不必要的冗余条目
- 粒度错误
- 被误解的需求
