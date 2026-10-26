# 验证命令 (Verify Command)

对当前代码库状态执行全面验证。

## 步骤 (Steps)

请严格按此顺序执行验证：

1. **构建检查 (Build Check)**
   - 运行此项目的构建命令
   - 如果失败，报告错误并**停止**

2. **类型检查 (Type Check)**
   - 运行 TypeScript/类型检查器
   - 报告所有错误及其对应的 文件名:行号

3. **Lint 检查**
   - 运行 Linter
   - 报告警告与错误

4. **测试套件 (Test Suite)**
   - 运行所有测试
   - 报告通过/失败的数量
   - 报告覆盖率百分比

5. **Console.log 审计**
   - 在源文件中搜索 `console.log`
   - 报告所在位置

6. **Git 状态**
   - 显示未提交的变更
   - 显示自上次提交以来更改的文件

## 输出 (Output)

生成简洁的验证报告：

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Secrets:  [OK/X found]
Logs:     [OK/X console.logs]

Ready for PR: [YES/NO]
```

如果存在重大问题，将列出问题及修复建议。

## 参数 (Arguments)

`$ARGUMENTS` 为以下之一：
- `quick` - 仅构建 + 类型检查
- `full` - 所有检查（默认）
- `pre-commit` - 与提交相关的检查
- `pre-pr` - 完整检查 + 安全扫描
