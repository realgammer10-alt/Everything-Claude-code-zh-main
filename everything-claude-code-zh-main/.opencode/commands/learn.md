---
description: 从当前会话中提取模式和学习心得
agent: build
---

# 学习命令 (Learn Command)

从当前会话（Session）中提取模式（Patterns）、学习心得（Learnings）和可复用的见解：$ARGUMENTS

## 你的任务

分析对话和代码变更以提取：

1. **发现的模式 (Patterns discovered)** - 重复出现的解决方案或方法
2. **应用的最佳实践 (Best practices applied)** - 效果良好的技术
3. **应避免的错误 (Mistakes to avoid)** - 遇到的问题及其解决方案
4. **可复用代码段 (Reusable snippets)** - 值得保存的代码模式

## 输出格式

### 发现的模式 (Patterns Discovered)

**模式：[名称]**
- 上下文（Context）：何时使用此模式
- 实现（Implementation）：如何应用它
- 示例（Example）：代码片段

### 应用的最佳实践 (Best Practices Applied)

1. [实践名称]
   - 为什么有效
   - 何时应用

### 应避免的错误 (Mistakes to Avoid)

1. [错误描述]
   - 出了什么问题
   - 如何防止

### 建议的技能更新 (Suggested Skill Updates)

如果发现的模式具有重要意义，请建议更新以下文件：
- `skills/coding-standards/SKILL.md`
- `skills/[domain]/SKILL.md`
- `rules/[category].md`

## 本能格式 (Instinct Format - 用于 continuous-learning-v2)

```json
{
  "trigger": "[触发此学习的情况]",
  "action": "[该做什么]",
  "confidence": 0.7,
  "source": "session-extraction",
  "timestamp": "[ISO 时间戳]"
}
```

---

**提示 (TIP)**：在长会话期间定期运行 `/learn`，以便在上下文压缩（Context Compaction）之前捕获见解。
