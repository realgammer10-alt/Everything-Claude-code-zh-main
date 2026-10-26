# 命令（Commands）

命令是通过斜杠（`/command-name`）触发的用户触发动作。它们用于执行有用的工作流（Workflow）和开发任务。

## 命令类别

### 构建与错误修复
- `/build-fix` - 修复构建错误
- `/go-build` - 解决 Go 构建错误
- `/go-test` - 运行 Go 测试

### 代码质量
- `/code-review` - 评审代码变更
- `/python-review` - 评审 Python 代码
- `/go-review` - 评审 Go 代码

### 测试与验证
- `/tdd` - 测试驱动开发（TDD）工作流
- `/e2e` - 运行端到端（E2E）测试
- `/test-coverage` - 检查测试覆盖率
- `/verify` - 验证实现

### 计划与实现
- `/plan` - 创建功能实现计划
- `/skill-create` - 创建新技能（Skill）
- `/multi-*` - 多项目工作流

### 文档
- `/update-docs` - 更新文档
- `/update-codemaps` - 更新 Codemap

### 开发与部署
- `/checkpoint` - 实现检查点
- `/evolve` - 功能演进
- `/learn` - 学习项目相关知识
- `/orchestrate` - 工作流编排（Orchestration）
- `/pm2` - PM2 部署管理
- `/setup-pm` - 配置 PM2
- `/sessions` - 会话（Session）管理

### Instinct 功能
- `/instinct-import` - 导入 Instinct
- `/instinct-export` - 导出 Instinct
- `/instinct-status` - Instinct 状态

## 执行命令

在 Claude Code 中执行命令：

```bash
/plan
/tdd
/code-review
/build-fix
```

或者通过 AI 智能体（Agent）：

```
用户：“计划一个新功能”
Claude：执行 → `/plan` 命令
```

## 常用命令

### 开发工作流
1. `/plan` - 创建实现计划
2. `/tdd` - 编写测试并实现功能
3. `/code-review` - 评审代码质量
4. `/build-fix` - 修复构建错误
5. `/e2e` - 运行端到端（E2E）测试
6. `/update-docs` - 更新文档

### 调试工作流
1. `/verify` - 验证实现
2. `/code-review` - 检查质量
3. `/build-fix` - 修复错误
4. `/test-coverage` - 检查覆盖率

## 添加自定义命令

要创建自定义命令：

1. 在 `commands/` 中创建一个 `.md` 文件
2. 添加 Frontmatter：

```markdown
---
description: Brief description shown in /help
---

# Command Name

## Purpose

What this command does.

## Usage

\`\`\`
/command-name [args]
\`\`\`

## Workflow

1. Step 1
2. Step 2
3. Step 3
```

---

**请记住**：命令可以自动化工作流并简化重复性任务。建议针对团队的通用模式创建新的命令。
