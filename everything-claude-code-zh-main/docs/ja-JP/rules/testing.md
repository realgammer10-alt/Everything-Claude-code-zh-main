# 测试要求 (Testing Requirements)

## 最低测试覆盖率：80%

测试类型（全部必选）：
1. **单元测试 (Unit Testing)** - 针对单个函数、工具类、组件
2. **集成测试 (Integration Testing)** - 针对 API 接口、数据库操作
3. **端到端测试 (E2E Testing)** - 针对关键用户流程（框架按语言选择）

## 测试驱动开发 (Test-Driven Development)

必选工作流：
1. 先编写测试（RED）
2. 运行测试 - 应当失败
3. 编写最小化实现（GREEN）
4. 运行测试 - 应当通过
5. 重构（IMPROVE）
6. 检查覆盖率（80%+）

## 测试失败排查

1. 使用 **tdd-guide** 智能体 (Agent)
2. 检查测试隔离性
3. 验证 Mock 数据是否正确
4. 修正实现代码，不修改测试代码（除非测试代码本身有误）

## 智能体 (Agent) 支持

- **tdd-guide** - 针对新功能积极使用，强制执行测试先行 (Test-First)
