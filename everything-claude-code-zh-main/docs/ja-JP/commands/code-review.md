# 代码审查 (Code Review)

对未提交的变更进行全面的安全与质量审查：

1. 获取已变更的文件：`git diff --name-only HEAD`

2. 对每个已变更的文件进行检查：

**安全问题 (Security Issues)（严重）：**

* 硬编码的凭据、API 密钥、令牌 (Token)
* SQL 注入漏洞
* XSS 漏洞
* 输入验证不足
* 不安全的依赖项
* 路径遍历风险

**代码质量 (Code Quality)（高）：**

* 函数长度超过 50 行
* 文件长度超过 800 行
* 嵌套深度超过 4 层
* 缺少错误处理
* `console.log` 语句
* `TODO`/`FIXME` 注释
* 公开 API 缺少 JSDoc

**最佳实践 (Best Practices)（中）：**

* 可变模式（应使用不可变 (Immutable) 模式）
* 在代码/注释中使用表情符号 (Emoji)
* 新代码缺少测试
* 无障碍访问 (Accessibility) 问题（a11y）

3. 生成包含以下内容的报告：
   * 严重程度：严重 (Critical)、高 (High)、中 (Medium)、低 (Low)
   * 文件位置和行号
   * 问题说明
   * 建议的修复方法

4. 如果发现严重或高优先级的问题，则拦截提交 (Commit)

绝对不允许包含安全漏洞的代码！
