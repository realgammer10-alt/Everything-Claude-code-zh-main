# Git 工作流 (Git Workflow)

## 提交信息格式 (Commit Message Format)

```
<type>: <description>

<optional body>
```

类型 (Type): feat, fix, refactor, docs, test, chore, perf, ci

注：归属（Attribution）已在 ~/.claude/settings.json 中全局禁用。

## Pull Request 工作流

在创建 PR 时：
1. 分析完整的提交历史（不仅是最近的一次提交）
2. 使用 `git diff [base-branch]...HEAD` 确认所有变更
3. 创建全面的 PR 摘要 (Summary)
4. 包含带有 TODO 的测试计划
5. 对于新分支，使用 `-u` 标志进行推送 (push)

## 功能实现工作流

1. **首先进行规划**
   - 使用 **规划者智能体 (planner agent)** 创建实现计划
   - 识别依赖项和风险
   - 将其划分为多个阶段

2. **TDD 方法**
   - 使用 **TDD 指导智能体 (tdd-guide agent)**
   - 先编写测试（RED）
   - 实现功能使测试通过（GREEN）
   - 重构（IMPROVE）
   - 确认 80%+ 的覆盖率

3. **代码审查**
   - 编写代码后立即使用 **代码审查智能体 (code-reviewer agent)**
   - 处理 严重 (CRITICAL) 和 高危 (HIGH) 级别的问题
   - 尽可能修复 中等 (MEDIUM) 级别的问题

4. **提交并推送**
   - 详细的提交信息
   - 遵循 约定式提交 (Conventional Commits) 格式
