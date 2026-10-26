---
description: Run evaluation against acceptance criteria
agent: build
---

# Eval 命令

根据准入标准（Acceptance Criteria）评估实现情况：$ARGUMENTS

## 你的任务

执行结构化评测（Evaluation），验证实现是否符合需求。

## 评测框架（Evaluation Framework）

### 评分器（Grader）类型

1. **二元评分器（Binary Grader）** - 通过/失败（Pass/Fail）
   - 是否工作？是/否
   - 适用场景：功能完成度、缺陷修复（Bug Fixes）

2. **标量评分器（Scalar Grader）** - 分数 0-100
   - 工作效果如何？
   - 适用场景：性能、质量指标

3. **量规评分器（Rubric Grader）** - 维度评分
   - 多维度评估
   - 适用场景：全面审查

## 评测流程

### 步骤 1：定义标准

```
Acceptance Criteria:
1. [标准 1] - [权重]
2. [标准 2] - [权重]
3. [标准 3] - [权重]
```

### 步骤 2：运行测试

针对每个标准：
- 执行相关测试
- 收集证据
- 评分结果

### 步骤 3：计算得分

```
Final Score = Σ (criterion_score × weight) / total_weight
```

### 步骤 4：生成报告

## 评测报告

### 总体情况：[通过/失败] (得分: X/100)

### 标准细分

| 标准 (Criterion) | 得分 | 权重 | 加权分 |
|-----------|-------|--------|----------|
| [标准 1] | X/10 | 30% | X |
| [标准 2] | X/10 | 40% | X |
| [标准 3] | X/10 | 30% | X |

### 证据（Evidence）

**标准 1：[名称]**
- 测试：[测试内容]
- 结果：[产出结果]
- 证据：[截图、日志、输出]

### 建议

[如果未通过，需要改进的地方]

## Pass@K 指标

针对非确定性评测：
- 运行 K 次
- 计算通过率
- 报告："Pass@K = X/K"

---

**提示**：在标记功能完成之前，建议使用 eval 进行准入测试（Acceptance Testing）。
