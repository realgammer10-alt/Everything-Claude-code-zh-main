---
description: 从 Git 历史分析中生成技能
agent: build
---

# Skill Create 命令

分析 Git 历史（Git history）以生成 Claude Code 技能（Skill）：$ARGUMENTS

## 你的任务

1. **分析提交（Commits）** - 从历史记录中进行模式识别（Pattern recognition）
2. **提取模式** - 常见的实践与约定
3. **生成 SKILL.md** - 结构化的技能文档
4. **创建直觉（Instincts）** - 用于 continuous-learning-v2

## 分析过程

### 第 1 步：收集提交数据
```bash
# 最近的提交
git log --oneline -100

# 按文件类型统计提交
git log --name-only --pretty=format: | sort | uniq -c | sort -rn

# 修改最频繁的文件
git log --pretty=format: --name-only | sort | uniq -c | sort -rn | head -20
```

### 第 2 步：识别模式

**提交信息模式**：
- 常见前缀 (feat, fix, refactor)
- 命名约定
- 共同作者（Co-author）模式

**代码模式**：
- 文件结构约定
- 导入（Import）组织方式
- 错误处理方法

**评审（Review）模式**：
- 常见的评审反馈
- 反复出现的修复类型
- 质量门禁（Quality gates）

### 第 3 步：生成 SKILL.md

```markdown
# [技能名称]

## 概述
[此技能教授的内容]

## 模式（Patterns）

### 模式 1：[名称]
- 何时使用
- 实现方式
- 示例

### 模式 2：[名称]
- 何时使用
- 实现方式
- 示例

## 最佳实践

1. [实践 1]
2. [实践 2]
3. [实践 3]

## 常见错误

1. [错误 1] - 如何避免
2. [错误 2] - 如何避免

## 示例

### 正面示例
```[language]
// 代码示例
```

### 反面模式（Anti-pattern）
```[language]
// 不应该做的写法
```
```

### 第 4 步：生成直觉（Instincts）

用于 continuous-learning-v2：

```json
{
  "instincts": [
    {
      "trigger": "[场景/状况]",
      "action": "[响应动作]",
      "confidence": 0.8,
      "source": "git-history-analysis"
    }
  ]
}
```

## 输出

创建：
- `skills/[name]/SKILL.md` - 技能文档
- `skills/[name]/instincts.json` - 直觉集合

---

**提示（TIP）**：运行 `/skill-create --instincts` 以同时生成用于持续学习（continuous learning）的直觉。
