---
description: 保存验证状态与进度检查点（Checkpoint）
agent: build
---

# 检查点（Checkpoint）命令

保存当前验证状态并创建进度检查点（Checkpoint）：$ARGUMENTS

## 任务内容

创建一个包含以下内容的当前进度快照：

1. **测试状态（Tests status）** - 哪些测试通过/失败
2. **覆盖率（Coverage）** - 当前覆盖率指标
3. **构建状态（Build status）** - 构建成功或错误
4. **代码变更（Code changes）** - 修改摘要
5. **下一步计划（Next steps）** - 待办事项

## 检查点（Checkpoint）格式

### 检查点（Checkpoint）：[时间戳]

**测试（Tests）**
- 总数：X
- 通过：Y
- 失败：Z
- 覆盖率：XX%

**构建（Build）**
- 状态：✅ 通过 / ❌ 失败
- 错误：[如有]

**自上次检查点以来的变更**
```
git diff --stat [last-checkpoint-commit]
```

**已完成任务**
- [x] 任务 1
- [x] 任务 2
- [ ] 任务 3（进行中）

**阻塞性问题（Blocking Issues）**
- [问题描述]

**下一步计划**
1. 步骤 1
2. 步骤 2

## 与验证循环（Verification Loop）配合使用

检查点（Checkpoints）与验证循环深度集成：

```
/plan → implement → /checkpoint → /verify → /checkpoint → implement → ...
```

使用检查点（Checkpoints）来：
- 在高风险变更前保存状态
- 跟踪各阶段的进度
- 在需要时启用回滚（Rollback）
- 记录验证点

---

**提示**：在自然的断点处创建检查点：每个阶段结束后、重大重构前、修复关键错误后。
