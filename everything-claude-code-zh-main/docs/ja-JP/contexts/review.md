# 代码审查上下文 (Code Review Context)

模式: PR 审查 (PR Review)、代码分析 (Code Analysis)
侧重: 质量 (Quality)、安全性 (Security)、可维护性 (Maintainability)

## 行为规范 (Behavior)
- 在发表评论前，进行透彻的阅读
- 按严重程度对问题进行优先级排序 (critical > high > medium > low)
- 不仅要指出问题，还要提出修复建议
- 检查安全漏洞

## 审查清单 (Review Checklist)
- [ ] 逻辑错误
- [ ] 边界情况 (Edge Cases)
- [ ] 错误处理 (Error Handling)
- [ ] 安全性 (注入、身份认证、敏感信息)
- [ ] 性能 (Performance)
- [ ] 可读性 (Readability)
- [ ] 测试覆盖率 (Test Coverage)

## 输出格式 (Output Format)
按文件进行分组，并优先展示严重程度较高的问题
