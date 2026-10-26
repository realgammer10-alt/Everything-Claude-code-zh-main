# Orchestrate 命令

适用于复杂任务的连续智能体工作流（Agent Workflow）。

## 使用方法

`/orchestrate [工作流类型] [任务描述]`

## 工作流类型（Workflow Types）

### feature
完整的功能实现工作流：
```
planner -> tdd-guide -> code-reviewer -> security-reviewer
```

### bugfix
Bug 调查与修复工作流：
```
explorer -> tdd-guide -> code-reviewer
```

### refactor
安全的重构（Refactor）工作流：
```
architect -> code-reviewer -> tdd-guide
```

### security
安全导向的审查工作流：
```
security-reviewer -> code-reviewer -> architect
```

## 执行模式

针对工作流中的每个智能体（Agent）：

1. 使用来自前一个智能体的上下文（Context）**调用智能体**
2. 将输出作为结构化的交付文档（Handoff Document）进行**收集**
3. **传递**给链条中的下一个智能体
4. 将结果**汇总**到最终报告中

## 交付文档（Handoff Document）格式

在智能体之间创建交付文档：

```markdown
## HANDOFF: [上一个智能体] -> [下一个智能体]

### 上下文 (Context)
[执行内容的摘要]

### 发现事项
[关键发现或决策]

### 已修改的文件
[已修改的文件列表]

### 未解决的问题
[为下一个智能体留下的待处理事项]

### 建议
[建议的后续步骤]
```

## 示例：功能工作流 (Feature Workflow)

```
/orchestrate feature "Add user authentication"
```

将执行以下操作：

1. **Planner 智能体**
   - 分析需求
   - 制定实现计划
   - 识别依赖关系
   - 输出：`HANDOFF: planner -> tdd-guide`

2. **TDD Guide 智能体**
   - 加载 Planner 的交付内容
   - 首先编写测试
   - 实现代码以通过测试
   - 输出：`HANDOFF: tdd-guide -> code-reviewer`

3. **Code Reviewer 智能体**
   - 审查实现代码
   - 检查问题
   - 提出改进建议
   - 输出：`HANDOFF: code-reviewer -> security-reviewer`

4. **Security Reviewer 智能体**
   - 安全审计
   - 漏洞检查
   - 最终批准
   - 输出：最终报告

## 最终报告格式

```
ORCHESTRATION REPORT
====================
Workflow: feature
Task: Add user authentication
Agents: planner -> tdd-guide -> code-reviewer -> security-reviewer

摘要 (SUMMARY)
-------
[一段文字摘要]

智能体输出 (AGENT OUTPUTS)
-------------
Planner: [摘要]
TDD Guide: [摘要]
Code Reviewer: [摘要]
Security Reviewer: [摘要]

修改的文件 (FILES CHANGED)
-------------
[列出所有已修改的文件]

测试结果 (TEST RESULTS)
------------
[测试通过/失败的摘要]

安全状态 (SECURITY STATUS)
---------------
[安全方面的发现事项]

建议 (RECOMMENDATION)
--------------
[可发布 / 需修正 / 已阻断]
```

## 并行执行

对于独立的检查项，并行执行智能体：

```markdown
### 并行阶段
同时运行：
- code-reviewer (质量)
- security-reviewer (安全)
- architect (设计)

### 结果合并
将输出合并为单一报告
```

## 参数 (Arguments)

$ARGUMENTS:
- `feature <描述>` - 完整的功能工作流
- `bugfix <描述>` - Bug 修复工作流
- `refactor <描述>` - 重构工作流
- `security <描述>` - 安全审查工作流
- `custom <智能体列表> <描述>` - 自定义智能体序列

## 自定义工作流示例

```
/orchestrate custom "architect,tdd-guide,code-reviewer" "Redesign caching layer"
```

## 提示 (Tips)

1. 对于复杂功能，建议**从 planner 开始**
2. 在合并代码前，**始终包含 code-reviewer**
3. 对于身份验证/支付/个人信息相关任务，请**使用 security-reviewer**
4. **保持交付内容（Handoff）简洁** —— 专注于下一个智能体所需的信息
5. 根据需要**在智能体之间执行验证**
