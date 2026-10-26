# 重构清理（Refactor Clean）

通过测试验证安全地识别并删除死代码（Dead Code）：

1. 运行死代码分析工具（Dead Code Analysis Tools）：
   - knip：检测未使用的导出（Exports）和文件
   - depcheck：检测未使用的依赖项（Dependencies）
   - ts-prune：检测未使用的 TypeScript 导出

2. 在 `.reports/dead-code-analysis.md` 中生成全面的报告

3. 按严重程度对发现结果进行分类：
   - SAFE：测试文件、未使用的工具（Utilities）
   - CAUTION：API 路由、组件（Components）
   - DANGER：配置文件、主入口点（Entry Points）

4. 仅建议进行安全删除

5. 在每次删除操作前：
   - 运行完整的测试套件（Test Suite）
   - 确认测试通过
   - 应用更改
   - 重新运行测试
   - 如果测试失败，则回滚（Rollback）

6. 显示已清理项的摘要

切勿在未运行测试的情况下直接删除代码！
