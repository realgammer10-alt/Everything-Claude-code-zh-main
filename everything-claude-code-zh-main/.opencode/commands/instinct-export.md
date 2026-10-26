---
description: 导出直觉（Instincts）以供共享
agent: build
---

# 直觉导出命令 (Instinct Export Command)

导出直觉以便与他人共享：$ARGUMENTS

## 任务 (Your Task)

从 continuous-learning-v2 系统中导出直觉（Instincts）。

## 导出选项 (Export Options)

### 导出全部 (Export All)
```
/instinct-export
```

### 仅导出高置信度内容 (Export High Confidence Only)
```
/instinct-export --min-confidence 0.8
```

### 按类别导出 (Export by Category)
```
/instinct-export --category coding
```

### 导出到特定路径 (Export to Specific Path)
```
/instinct-export --output ./my-instincts.json
```

## 导出格式 (Export Format)

```json
{
  "instincts": [
    {
      "id": "instinct-123",
      "trigger": "[情境描述]",
      "action": "[推荐操作]",
      "confidence": 0.85,
      "category": "coding",
      "applications": 10,
      "successes": 9,
      "source": "session-observation"
    }
  ],
  "metadata": {
    "version": "1.0",
    "exported": "2025-01-15T10:00:00Z",
    "author": "username",
    "total": 25,
    "filter": "confidence >= 0.8"
  }
}
```

## 导出报告 (Export Report)

```
导出摘要 (Export Summary)
==============
输出：./instincts-export.json
直觉总数：X
已过滤：Y
已导出：Z

类别 (Categories)：
- coding: N
- testing: N
- security: N
- git: N

顶级直觉（按置信度排序）：
1. [触发器] (0.XX)
2. [触发器] (0.XX)
3. [触发器] (0.XX)
```

## 共享 (Sharing)

导出后：
- 直接分享 JSON 文件
- 上传到团队仓库
- 发布到直觉注册表 (Instinct Registry)

---

**提示 (TIP)**：导出高置信度（>0.8）的直觉（Instincts）以获得更高质量的分享内容。
