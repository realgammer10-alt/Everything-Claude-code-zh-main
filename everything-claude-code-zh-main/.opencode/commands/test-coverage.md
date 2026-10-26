---
description: 分析并改进测试覆盖率
agent: tdd-guide
subtask: true
---

# 测试覆盖率命令 (Test Coverage Command)

分析测试覆盖率并识别缺口：$ARGUMENTS

## 你的任务 (Your Task)

1. **运行覆盖率报告**：`npm test -- --coverage`
2. **分析结果** - 识别低覆盖率区域
3. **优先处理缺口** - 核心代码优先
4. **生成缺失的测试** - 针对未覆盖的代码

## 覆盖率目标 (Coverage Targets)

| 代码类型 | 目标 |
|-----------|--------|
| 标准代码 | 80% |
| 金融逻辑 | 100% |
| 认证/安全 | 100% |
| 工具库 | 90% |
| UI 组件 | 70% |

## 覆盖率报告分析 (Coverage Report Analysis)

### 摘要 (Summary)
```
文件           | % 语句 | % 分支 | % 函数 | % 行数
---------------|---------|----------|---------|--------
所有文件       |   XX    |    XX    |   XX    |   XX
```

### 低覆盖率文件 (Low Coverage Files)
[低于目标的文件，按重要程度排序]

### 未覆盖的行 (Uncovered Lines)
[需要测试的具体行]

## 测试生成 (Test Generation)

对于每个未覆盖的区域：

### [函数/组件名称]

**位置**: `src/path/file.ts:123`

**覆盖率缺口**: [说明]

**建议的测试**:
```typescript
describe('functionName', () => {
  it('should [expected behavior]', () => {
    // 测试代码
  })

  it('should handle [edge case]', () => {
    // 边界情况测试
  })
})
```

## 覆盖率提升计划 (Coverage Improvement Plan)

1. **紧急** (立即添加)
   - [ ] file1.ts - 认证逻辑
   - [ ] file2.ts - 支付处理

2. **高** (本迭代添加)
   - [ ] file3.ts - 核心业务逻辑

3. **中** (修改文件时添加)
   - [ ] file4.ts - 工具库

---

**重要提示**: 覆盖率是一个指标，而非最终目标。应专注于有意义的测试，而不只是为了追求数字。
