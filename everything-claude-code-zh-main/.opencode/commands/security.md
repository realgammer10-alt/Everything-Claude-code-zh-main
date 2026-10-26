---
description: 执行全面的安全审查 (Security Review)
agent: security-reviewer
subtask: true
---

# 安全审查命令 (Security Review Command)

执行全面的安全审查：$ARGUMENTS

## 你的任务 (Your Task)

根据 OWASP 指南和安全最佳实践，分析指定代码中的安全漏洞。

## 安全检查清单 (Security Checklist)

### OWASP Top 10

1. **注入 (Injection)** (SQL, NoSQL, OS 命令, LDAP)
   - 检查参数化查询 (Parameterized Queries)
   - 验证输入清理 (Input Sanitization)
   - 审查动态查询构建

2. **身份验证损坏 (Broken Authentication)**
   - 密码存储 (bcrypt, argon2)
   - 会话管理 (Session Management)
   - 多因素身份验证 (MFA)
   - 密码重置流程

3. **敏感数据泄露 (Sensitive Data Exposure)**
   - 静态与传输中的加密 (Encryption at rest and in transit)
   - 妥善的密钥管理 (Key Management)
   - PII (个人可识别信息) 处理

4. **XML 外部实体 (XXE)**
   - 禁用 DTD 处理
   - 对 XML 进行输入验证

5. **失效的访问控制 (Broken Access Control)**
   - 在每个端点进行授权检查
   - 基于角色的访问控制 (RBAC)
   - 资源所有权验证

6. **安全配置错误 (Security Misconfiguration)**
   - 移除默认凭据 (Default Credentials)
   - 错误处理不泄露信息
   - 配置安全标头 (Security Headers)

7. **跨站脚本 (XSS)**
   - 输出编码 (Output Encoding)
   - 内容安全策略 (CSP)
   - 输入清理 (Input Sanitization)

8. **不安全的反序列化 (Insecure Deserialization)**
   - 验证序列化数据
   - 实施完整性检查

9. **使用具有已知漏洞的组件 (Using Components with Known Vulnerabilities)**
   - 运行 `npm audit`
   - 检查过时的依赖项

10. **日志记录和监控不足 (Insufficient Logging & Monitoring)**
    - 记录安全事件
    - 日志中不含敏感数据
    - 配置告警 (Alerting)

### 其他检查项 (Additional Checks)

- [ ] 代码中的密钥/凭据 (API 密钥, 密码)
- [ ] 环境变量处理
- [ ] CORS 配置
- [ ] 速率限制 (Rate Limiting)
- [ ] CSRF 防护
- [ ] 安全 Cookie 标志 (Secure Cookie Flags)

## 报告格式 (Report Format)

### 严重问题 (Critical Issues)
[必须立即修复的问题]

### 高优先级 (High Priority)
[应在发布前修复的问题]

### 建议 (Recommendations)
[建议考虑的安全改进]

---

**重要提示**：安全问题属于阻塞性问题 (Blockers)。在严重问题解决之前，请勿继续。
