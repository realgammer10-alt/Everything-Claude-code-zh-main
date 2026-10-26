---
description: 创建带有风险评估的实施计划（Create implementation plan with risk assessment）
agent: planner
subtask: true
---

# 计划命令（Plan Command）

为以下内容创建详细的实施计划：$ARGUMENTS

## 你的任务（Your Task）

1. **重述需求（Restate Requirements）** - 明确需要构建的内容
2. **识别风险（Identify Risks）** - 发现潜在问题、阻塞点和依赖项
3. **创建分步计划（Create Step Plan）** - 将实施过程分解为若干阶段
4. **等待确认（Wait for Confirmation）** - 在继续之前**必须**获得用户批准

## 输出格式（Output Format）

### 需求重述（Requirements Restatement）
[对将要构建的内容进行清晰、简洁的重述]

### 实施阶段（Implementation Phases）
[阶段 1：描述]
- 步骤 1.1
- 步骤 1.2
...

[阶段 2：描述]
- 步骤 2.1
- 步骤 2.2
...

### 依赖项（Dependencies）
[列出所需的外部依赖、API 和服务]

### 风险（Risks）
- 高（HIGH）：[可能阻碍实施的关键风险]
- 中（MEDIUM）：[需要处理的中度风险]
- 低（LOW）：[次要顾虑]

### 预计复杂度（Estimated Complexity）
[高/中/低（HIGH/MEDIUM/LOW），并附带时间预估]

**等待确认（WAITING FOR CONFIRMATION）**：是否执行此计划？(yes/no/modify)

---

**关键（CRITICAL）**：在用户明确通过 "yes"、"proceed" 或类似的肯定回复确认之前，**不要**编写任何代码。
