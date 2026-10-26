# 安全指南（Security Guidelines）

## 必备安全检查（Required Security Checks）

在所有提交（Commit）前：
- [ ] 无硬编码密钥（Secret）（API 密钥、密码、令牌/Token）
- [ ] 所有用户输入均已验证
- [ ] 防止 SQL 注入（使用参数化查询）
- [ ] 防止 XSS 攻击（对 HTML 进行清理/Sanitize）
- [ ] CSRF 保护已启用
- [ ] 身份验证/授权（Authentication/Authorization）已验证
- [ ] 所有端点（Endpoints）均设有频率限制（Rate Limiting）
- [ ] 错误消息不泄露敏感数据

## 密钥管理（Secret Management）

- 严禁在源代码中硬编码密钥
- 始终使用环境变量或密钥管理服务（Secret Manager）
- 在启动时验证所需密钥是否存在
- 对可能泄露的密钥进行轮换（Rotation）

## 安全响应协议（Security Response Protocol）

如果发现安全问题：
1. 立即停止当前操作
2. 使用 **security-reviewer** 智能体（Agent）进行分析
3. 在继续后续工作前，必须修复所有关键（CRITICAL）问题
4. 轮换已泄露的密钥
5. 对整个代码库进行审查，确保没有类似问题
