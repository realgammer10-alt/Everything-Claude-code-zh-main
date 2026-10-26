# 测试覆盖率 (Test Coverage)

分析测试覆盖率，并生成缺失的测试。

1. 运行带覆盖率统计的测试：`npm test --coverage` 或 `pnpm test --coverage`

2. 分析覆盖率报告 (`coverage/coverage-summary.json`)

3. 识别覆盖率低于 80% 阈值的文件

4. 针对覆盖率不足的每个文件：
   - 分析未测试的代码路径
   - 生成函数的单元测试 (Unit Test)
   - 生成 API 的集成测试 (Integration Test)
   - 生成关键流程的端到端测试 (E2E Test)

5. 验证新测试是否通过

6. 显示覆盖率指标的前后对比

7. 确保整个项目的覆盖率达到 80% 以上

重点项目：
- 正常路径场景 (Happy Path Scenario)
- 错误处理 (Error Handling)
- 边缘情况 (Edge Case，如 null、undefined、空值)
- 边界条件 (Boundary Condition)
