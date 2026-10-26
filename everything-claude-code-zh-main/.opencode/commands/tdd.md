---
description: 强制执行覆盖率达 80% 以上的测试驱动开发（TDD）工作流
agent: tdd-guide
subtask: true
---

# TDD 命令 (TDD Command)

使用严格的测试驱动开发（TDD）实现以下内容：$ARGUMENTS

## TDD 循环（强制执行）

```
RED → GREEN → REFACTOR → REPEAT
```

1. **红 (RED)**：**首先**编写一个失败的测试
2. **绿 (GREEN)**：编写最小化的代码以通过测试
3. **重构 (REFACTOR)**：在保持测试通过的同时改进代码
4. **重复 (REPEAT)**：持续进行直到功能开发完成

## 你的任务

### 步骤 1：定义接口 (SCAFFOLD)
- 为输入/输出定义 TypeScript 接口（Interfaces）
- 使用 `throw new Error('Not implemented')` 创建函数签名

### 步骤 2：编写失败的测试 (RED)
- 编写测试接口的代码
- 包含正常路径 (happy path)、边界情况 (edge cases) 和错误条件 (error conditions)
- 运行测试 —— 验证其结果为 **失败 (FAIL)**

### 3 步：实现最小化代码 (GREEN)
- 编写足以让测试通过的代码即可
- 不要进行过早优化
- 运行测试 —— 验证其结果为 **通过 (PASS)**

### 步骤 4：重构 (IMPROVE)
- 提取常量，改进命名
- 消除重复
- 运行测试 —— 验证其结果仍为 **通过 (PASS)**

### 步骤 5：检查覆盖率 (Coverage)
- 目标：最低 80%
- 关键业务逻辑：100%
- 如有需要，添加更多测试

## 覆盖率要求

| 代码类型 | 最低标准 |
|-----------|---------|
| 标准代码 (Standard code) | 80% |
| 财务计算 (Financial calculations) | 100% |
| 身份验证逻辑 (Authentication logic) | 100% |
| 安全关键代码 (Security-critical code) | 100% |

## 应包含的测试类型

- **单元测试 (Unit Tests)**：单个函数
- **边界情况 (Edge Cases)**：空、null、最大值、边界
- **错误条件 (Error Conditions)**：无效输入、网络故障
- **集成测试 (Integration Tests)**：API 端点、数据库操作

---

**强制执行**：必须在实现**之前**编写测试。严禁跳过红 (RED) 阶段。
