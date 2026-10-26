# 技能（Skills）

技能（Skills）是 Claude Code 根据上下文加载的知识模块。它们包含工作流定义和领域知识。

## 技能分类

### 语言特定模式
- `python-patterns/` - Python 设计模式
- `golang-patterns/` - Go 设计模式
- `frontend-patterns/` - React/Next.js 模式
- `backend-patterns/` - API 与数据库模式

### 语言特定测试
- `python-testing/` - Python 测试策略
- `golang-testing/` - Go 测试策略
- `cpp-testing/` - C++ 测试

### 框架
- `django-patterns/` - Django 最佳实践
- `django-tdd/` - Django 测试驱动开发（TDD）
- `django-security/` - Django 安全
- `springboot-patterns/` - Spring Boot 模式
- `springboot-tdd/` - Spring Boot 测试
- `springboot-security/` - Spring Boot 安全

### 数据库
- `postgres-patterns/` - PostgreSQL 模式
- `jpa-patterns/` - JPA/Hibernate 模式

### 安全
- `security-review/` - 安全检查清单
- `security-scan/` - 安全扫描

### 工作流
- `tdd-workflow/` - 测试驱动开发（TDD）工作流
- `continuous-learning/` - 持续学习

### 领域特定
- `eval-harness/` - 评测工具链（Eval Harness）
- `iterative-retrieval/` - 迭代检索

## 技能结构

每个技能都在其目录中包含一个 `SKILL.md` 文件：

```
skills/
├── python-patterns/
│   └── SKILL.md          # 实现模式、示例、最佳实践
├── golang-testing/
│   └── SKILL.md
├── django-patterns/
│   └── SKILL.md
...
```

## 使用技能

Claude Code 会根据上下文自动加载技能。例如：

- 正在编辑 Python 文件时 → 加载 `python-patterns` 和 `python-testing`
- 在 Django 项目中 → 加载 `django-*` 相关的技能
- 进行测试驱动开发时 → 加载 `tdd-workflow`

## 创建技能

要创建新技能：

1. 创建 `skills/your-skill-name/` 目录
2. 添加 `SKILL.md` 文件
3. 模板如下：

```markdown
---
name: your-skill-name
description: Brief description shown in skill list
---

# 你的技能标题

简要概述。

## 核心概念 (Core Concepts)

关键模式与指南。

## 代码示例 (Code Examples)

\`\`\`language
// 实际的、经过测试的示例
\`\`\`

## 最佳实践 (Best Practices)

- 可操作的指南 1
- 可操作的指南 2

## 适用场景 (When to Use)

描述此技能适用的场景。
```

---

**请记住**：技能是参考资料。它们提供实现指导并展示最佳实践。请将技能与规则（Rules）结合使用，以确保代码质量。
