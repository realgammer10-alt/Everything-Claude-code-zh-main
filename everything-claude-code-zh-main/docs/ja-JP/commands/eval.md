# Eval 命令（Eval Command）

管理评测驱动开发（Eval-driven Development）工作流。

## 使用方法（Usage）

`/eval [define|check|report|list] [功能名]`

## 定义评测（Define Eval）

`/eval define 功能名`

创建一个新的评测定义。

1. 使用模板创建 `.claude/evals/功能名.md`:

```markdown
## EVAL: 功能名
创建日期: $(date)

### 功能评测（Feature Evals）
- [ ] [功能1的说明]
- [ ] [功能2的说明]

### 回归评测（Regression Evals）
- [ ] [现有行为1正常工作]
- [ ] [现有行为2正常工作]

### 成功标准（Success Criteria）
- 功能评测: pass@3 > 90%
- 回归评测: pass^3 = 100%
```

2. 提示用户填写具体标准。

## 检查评测（Check Eval）

`/eval check 功能名`

执行功能评测。

1. 从 `.claude/evals/功能名.md` 读取评测定义。
2. 针对每个功能评测：
   - 尝试验证标准
   - 记录通过/失败（PASS/FAIL）
   - 在 `.claude/evals/功能名.log` 中记录尝试过程
3. 针对每个回归评测：
   - 执行相关测试
   - 与基线进行比较
   - 记录通过/失败（PASS/FAIL）
4. 报告当前状态：

```
EVAL CHECK: 功能名
========================
功能评测: X/Y 通过
回归评测: X/Y 通过
状态: 进行中 / 准备就绪
```

## 生成评测报告（Report Eval）

`/eval report 功能名`

生成综合评测报告。

```
EVAL REPORT: 功能名
=========================
生成时间: $(date)

功能评测
----------------
[eval-1]: PASS (pass@1)
[eval-2]: PASS (pass@2) - 需要重试
[eval-3]: FAIL - 请参阅备注

回归评测
----------------
[test-1]: PASS
[test-2]: PASS
[test-3]: PASS

度量指标（Metrics）
-------
功能评测 pass@1: 67%
功能评测 pass@3: 100%
回归评测 pass^3: 100%

备注
-----
[问题、边界情况或观察结果]

建议
--------------
[可发布 / 需修正 / 阻塞中]
```

## 列出评测（List Evals）

`/eval list`

显示所有评测定义。

```
EVAL 定义列表
================
feature-auth      [3/5 通过] 进行中
feature-search    [5/5 通过] 准备就绪
feature-export    [0/4 通过] 未开始
```

## 参数（Arguments）

$ARGUMENTS:
- `define <名称>` - 创建新的评测定义
- `check <名称>` - 执行并检查评测
- `report <名称>` - 生成完整报告
- `list` - 显示所有评测
- `clean` - 清除旧的评测日志（保留最近 10 条）
