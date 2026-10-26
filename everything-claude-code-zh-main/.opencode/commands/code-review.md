---
description: 审查代码质量、安全性和可维护性
agent: code-reviewer
subtask: true
---

# 代码审查（Code Review）命令

针对代码质量、安全性和可维护性审查代码变更：$ARGUMENTS

## 你的任务

1. **获取已变更文件**：运行 `git diff --name-only HEAD`
2. **分析每个文件**的潜在问题
3. **生成结构化报告**
4. **提供可操作的改进建议**

## 检查项分类

### 安全问题（致命 - CRITICAL）
- [ ] 硬编码的凭据（Credentials）、API keys、tokens
- [ ] SQL 注入（SQL injection）漏洞
- [ ] XSS 漏洞
- [ ] 缺少输入验证（Input validation）
- [ ] 不安全的依赖项（Insecure dependencies）
- [ ] 路径穿越（Path traversal）风险
- [ ] 身份验证/授权（Authentication/authorization）缺陷

### 代码质量（高 - HIGH）
- [ ] 函数超过 50 行
- [ ] 文件超过 800 行
- [ ] 嵌套深度 > 4 层
- [ ] 缺少错误处理（Error handling）
- [ ] 遗留 `console.log` 语句
- [ ] TODO/FIXME 注释
- [ ] 公开 API 缺少 JSDoc

### 最佳实践（中 - MEDIUM）
- [ ] 可变模式（Mutation patterns，建议改用不可变模式 immutable）
- [ ] 不必要的复杂性
- [ ] 新代码缺少测试（Missing tests）
- [ ] 可访问性（Accessibility/a11y）问题
- [ ] 性能顾虑

### 风格（低 - LOW）
- [ ] 命名不一致
- [ ] 缺少类型注解（Type annotations）
- [ ] 格式化问题

## 报告格式

针对发现的每个问题：

```
**[SEVERITY]** file.ts:123
问题 (Issue): [Description]
修复 (Fix): [How to fix]
```

## 判定决策

- **CRITICAL（致命）或 HIGH（高）问题**：阻止提交，必须修复
- **MEDIUM（中）问题**：建议在合并前修复
- **LOW（低）问题**：可选的改进建议

---

**重要说明**：绝不要批准包含安全漏洞的代码！
