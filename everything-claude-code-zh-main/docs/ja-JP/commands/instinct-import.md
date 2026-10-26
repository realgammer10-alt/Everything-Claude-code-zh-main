---
name: instinct-import
description: 从团队成员、Skill Creator 或其他来源导入本能（Instincts）
command: true
---

# 本能导入命令 (Instinct Import Command)

## 实现

使用插件根路径执行本能 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" import <file-or-url> [--dry-run] [--force] [--min-confidence 0.7]
```

或者，如果未设置 `CLAUDE_PLUGIN_ROOT`（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py import <file-or-url>
```

您可以从以下来源导入本能（Instincts）：
- 团队成员的导出文件
- 技能生成器（Skill Creator）（存储库分析）
- 社区集合
- 以前机器的备份

## 使用方法

```
/instinct-import team-instincts.yaml
/instinct-import https://github.com/org/repo/instincts.yaml
/instinct-import --from-skill-creator acme/webapp
```

## 执行内容

1. 获取本能文件（本地路径或 URL）
2. 解析并验证格式
3. 检查与现有本能的重复项
4. 合并或添加新本能
5. 保存到 `~/.claude/homunculus/instincts/inherited/`

## 导入过程

```
📥 Importing instincts from: team-instincts.yaml
================================================

Found 12 instincts to import.

Analyzing conflicts...

## New Instincts (8)
These will be added:
  ✓ use-zod-validation (confidence: 0.7)
  ✓ prefer-named-exports (confidence: 0.65)
  ✓ test-async-functions (confidence: 0.8)
  ...

## Duplicate Instincts (3)
Already have similar instincts:
  ⚠️ prefer-functional-style
     Local: 0.8 confidence, 12 observations
     Import: 0.7 confidence
     → Keep local (higher confidence)

  ⚠️ test-first-workflow
     Local: 0.75 confidence
     Import: 0.9 confidence
     → Update to import (higher confidence)

## Conflicting Instincts (1)
These contradict local instincts:
  ❌ use-classes-for-services
     Conflicts with: avoid-classes
     → Skip (requires manual resolution)

---
Import 8 new, update 1, skip 3?
```

## 合并策略 (Merge Strategy)

### 重复情况
导入与现有本能一致的本能时：
- **高置信度优先**：保留置信度较高的一方
- **合并证据**：合并观察次数
- **更新时间戳**：标记为最近验证

### 冲突情况
导入与现有本能矛盾的本能时：
- **默认跳过**：不导入冲突的本能
- **标记待查**：将两者均标记为需要注意
- **手动解决**：用户决定保留哪一个

## 来源追踪 (Source Tracking)

导入的本能将按如下方式标记：
```yaml
source: "inherited"
imported_from: "team-instincts.yaml"
imported_at: "2025-01-22T10:30:00Z"
original_source: "session-observation"  # 或 "repo-analysis"
```

## 技能生成器（Skill Creator）集成

从 Skill Creator 导入时：

```
/instinct-import --from-skill-creator acme/webapp
```

这将获取从存储库分析中生成的本能：
- 来源：`repo-analysis`
- 初始置信度高（0.7 以上）
- 链接到源存储库

## 参数标志 (Flags)

- `--dry-run`：仅预览，不执行导入
- `--force`：即使存在冲突也强制导入
- `--merge-strategy <higher|local|import>`：重复项处理方式
- `--from-skill-creator <owner/repo>`：从 Skill Creator 分析中导入
- `--min-confidence <n>`：仅导入高于阈值的本能

## 输出

导入后：
```
✅ Import complete!

Added: 8 instincts
Updated: 1 instinct
Skipped: 3 instincts (2 duplicates, 1 conflict)

New instincts saved to: ~/.claude/homunculus/instincts/inherited/

Run /instinct-status to see all instincts.
```
