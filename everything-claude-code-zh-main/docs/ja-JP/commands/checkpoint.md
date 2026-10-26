# Checkpoint 命令（Checkpoint Command）

在工作流（Workflow）中创建或验证检查点（Checkpoint）。

## 使用方法（Usage）

`/checkpoint [create|verify|list] [name]`

## 创建检查点（Create Checkpoint）

创建检查点时：

1. 执行 `/verify quick` 以确保当前状态为干净（Clean）状态。
2. 使用检查点名称创建 `git stash` 或提交（Commit）。
3. 将检查点记录到 `.claude/checkpoints.log`：

```bash
echo "$(date +%Y-%m-%d-%H:%M) | $CHECKPOINT_NAME | $(git rev-parse --short HEAD)" >> .claude/checkpoints.log
```

4. 报告检查点创建结果。

## 验证检查点（Verify Checkpoint）

针对检查点进行验证时：

1. 从日志中读取检查点信息。

2. 将当前状态与检查点进行对比：
   * 自检查点以来新增的文件
   * 自检查点以来修改的文件
   * 当前测试通过率与当时的对比
   * 当前覆盖率（Coverage）与当时的对比

3. 报告内容：

```
CHECKPOINT COMPARISON: $NAME
============================
Files changed: X
Tests: +Y passed / -Z failed
Coverage: +X% / -Y%
Build: [PASS/FAIL]
```

## 列出检查点（List Checkpoints）

显示所有检查点，包括：

* 名称（Name）
* 时间戳（Timestamp）
* Git SHA
* 状态（Status：current、behind、ahead）

## 工作流（Workflow）

典型的检查点流程：

```
[Start] --> /checkpoint create "feature-start"
   |
[Implement] --> /checkpoint create "core-done"
   |
[Test] --> /checkpoint verify "core-done"
   |
[Refactor] --> /checkpoint create "refactor-done"
   |
[PR] --> /checkpoint verify "feature-start"
```

## 参数（Arguments）

$ARGUMENTS:

* `create <name>` - 以指定名称创建检查点
* `verify <name>` - 针对指定名称的检查点进行验证
* `list` - 显示所有检查点
* `clear` - 删除旧的检查点（保留最近的 5 个）
