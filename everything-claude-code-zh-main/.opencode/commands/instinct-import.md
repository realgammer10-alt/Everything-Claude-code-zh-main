---
description: 从外部源导入直觉（Instincts）
agent: build
---

# 直觉导入命令（Instinct Import Command）

从文件或 URL 导入直觉（Instincts）：$ARGUMENTS

## 你的任务（Your Task）

将直觉导入到持续学习系统（continuous-learning-v2）中。

## 导入源（Import Sources）

### 文件导入
```
/instinct-import path/to/instincts.json
```

### URL 导入
```
/instinct-import https://example.com/instincts.json
```

### 团队共享导入
```
/instinct-import @teammate/instincts
```

## 导入格式（Import Format）

预期的 JSON 结构：

```json
{
  "instincts": [
    {
      "trigger": "[场景描述]",
      "action": "[建议的操作]",
      "confidence": 0.7,
      "category": "coding",
      "source": "imported"
    }
  ],
  "metadata": {
    "version": "1.0",
    "exported": "2025-01-15T10:00:00Z",
    "author": "username"
  }
}
```

## 导入流程（Import Process）

1. **校验格式（Validate format）** - 检查 JSON 结构
2. **去重（Deduplicate）** - 跳过已存在的直觉
3. **调整置信度（Adjust confidence）** - 降低导入直觉的置信度 (×0.8)
4. **合并（Merge）** - 添加到本地直觉库
5. **报告（Report）** - 显示导入摘要

## 导入报告（Import Report）

```
导入摘要（Import Summary）
==============
来源: [路径或 URL]
文件内总数: X
已导入: Y
已跳过 (重复): Z
错误: W

已导入的直觉:
- [trigger] (置信度: 0.XX)
- [trigger] (置信度: 0.XX)
...
```

## 冲突解决（Conflict Resolution）

导入重复项时：
- 保留置信度较高的版本
- 合并应用计数（Application counts）
- 更新时间戳

---

**提示（TIP）**: 导入完成后，使用 `/instinct-status` 查看已导入的直觉。
