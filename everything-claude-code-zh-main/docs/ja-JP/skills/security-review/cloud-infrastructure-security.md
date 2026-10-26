| name | description |
|------|-------------|
| cloud-infrastructure-security | 在部署到云平台、配置基础架构、管理 IAM 策略、设置日志/监控以及实现 CI/CD 流水线（Pipeline）时使用此技能（Skill）。提供符合最佳实践的云安全检查清单（Checklist）。 |

# 云基础架构安全技能（Cloud and Infrastructure Security Skill）

此技能（Skill）用于确保云基础架构、CI/CD 流水线（Pipeline）和部署配置遵循安全最佳实践，并符合行业标准。

## 激活时机

- 将应用程序部署到云平台（AWS、Vercel、Railway、Cloudflare）
- 配置 IAM 角色（Role）和权限
- 配置 CI/CD 流水线（Pipeline）
- 以代码形式实现基础架构（Infrastructure as Code, Terraform, CloudFormation）
- 设置日志（Logging）和监控（Monitoring）
- 在云环境中管理机密（Secrets）
- 配置 CDN 和边缘安全（Edge Security）
- 实现容灾恢复（Disaster Recovery）和备份策略

## 云安全检查清单（Cloud Security Checklist）

### 1. IAM 与访问控制

#### 最小权限原则（Principle of Least Privilege）

```yaml
# ✅ 正确：最小限度的权限
iam_role:
  permissions:
    - s3:GetObject  # 仅读取访问
    - s3:ListBucket
  resources:
    - arn:aws:s3:::my-bucket/*  # 仅针对特定存储桶

# ❌ 错误：权限过于宽泛
iam_role:
  permissions:
    - s3:*  # 所有 S3 操作
  resources:
    - "*"  # 所有资源
```

#### 多因素身份验证（MFA）

```bash
# 始终在 root/admin 账户上启用 MFA
aws iam enable-mfa-device \
  --user-name admin \
  --serial-number arn:aws:iam::123456789:mfa/admin \
  --authentication-code1 123456 \
  --authentication-code2 789012
```

#### 验证步骤

- [ ] 不在生产环境中使用 root 账户
- [ ] 在所有特权账户上启用 MFA
- [ ] 服务账户使用角色（Role）而非长期凭据（Credentials）
- [ ] IAM 策略遵循最小权限原则
- [ ] 定期进行访问审查
- [ ] 轮换或删除未使用的凭据

### 2. 机密管理（Secrets Management）

#### 云机密管理器（Cloud Secret Manager）

```typescript
// ✅ 正确：使用云机密管理器
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({ region: 'us-east-1' });
const secret = await client.getSecretValue({ SecretId: 'prod/api-key' });
const apiKey = JSON.parse(secret.SecretString).key;

// ❌ 错误：硬编码或仅使用环境变量
const apiKey = process.env.API_KEY; // 不会被轮换，且无法审计
```

#### 机密轮换（Secret Rotation）

```bash
# 配置数据库凭据的自动轮换
aws secretsmanager rotate-secret \
  --secret-id prod/db-password \
  --rotation-lambda-arn arn:aws:lambda:region:account:function:rotate \
  --rotation-rules AutomaticallyAfterDays=30
```

#### 验证步骤

- [ ] 将所有机密保存在云机密管理器中（如 AWS Secrets Manager、Vercel Secrets）
- [ ] 启用数据库凭据的自动轮换
- [ ] 至少每季度轮换一次 API 密钥（API Key）
- [ ] 代码、日志和错误消息中不包含机密
- [ ] 启用机密访问的审计日志

### 3. 网络安全

#### VPC 与防火墙配置

```terraform
# ✅ 正确：受限的安全组（Security Group）
resource "aws_security_group" "app" {
  name = "app-sg"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # 仅限内部 VPC
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # 仅允许 HTTPS 发送
  }
}

# ❌ 错误：向互联网公开
resource "aws_security_group" "bad" {
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # 所有端口，所有 IP！
  }
}
```

#### 验证步骤

- [ ] 数据库不可公开访问
- [ ] SSH/RDP 端口仅限制在 VPN/堡垒机（Bastion）访问
- [ ] 安全组（Security Group）遵循最小权限原则
- [ ] 配置网络 ACL
- [ ] 启用 VPC 流日志（Flow Logs）

### 4. 日志与监控

#### CloudWatch/日志配置

```typescript
// ✅ 正确：全面的日志记录
import { CloudWatchLogsClient, CreateLogStreamCommand } from '@aws-sdk/client-cloudwatch-logs';

const logSecurityEvent = async (event: SecurityEvent) => {
  await cloudwatch.putLogEvents({
    logGroupName: '/aws/security/events',
    logStreamName: 'authentication',
    logEvents: [{
      timestamp: Date.now(),
      message: JSON.stringify({
        type: event.type,
        userId: event.userId,
        ip: event.ip,
        result: event.result,
        // 不要在日志中记录敏感数据
      })
    }]
  });
};
```

#### 验证步骤

- [ ] 在所有服务中启用 CloudWatch/日志记录
- [ ] 记录失败的身份验证尝试
- [ ] 审计管理员操作
- [ ] 配置日志保留（出于合规性考虑，通常为 90 天以上）
- [ ] 为可疑活动设置告警（Alert）
- [ ] 集中管理日志并防止篡改

### 5. CI/CD 流水线安全

#### 安全的流水线配置

```yaml
# ✅ 正确：安全的 GitHub Actions 工作流
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read  # 最小限度的权限

    steps:
      - uses: actions/checkout@v4

      # 扫描机密
      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main

      # 依赖项审计
      - name: Audit dependencies
        run: npm audit --audit-level=high

      # 使用 OIDC 而非长期令牌（Token）
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
          aws-region: us-east-1
```

#### 供应链安全

```json
// package.json - 使用锁定文件（Lockfile）和完整性检查
{
  "scripts": {
    "install": "npm ci",  // 使用 ci 以进行可复现的构建
    "audit": "npm audit --audit-level=moderate",
    "check": "npm outdated"
  }
}
```

#### 验证步骤

- [ ] 使用 OIDC 而非长期凭据（Credentials）
- [ ] 在流水线中进行机密扫描
- [ ] 扫描依赖项漏洞
- [ ] 扫描容器镜像（如适用）
- [ ] 强制执行分支保护规则
- [ ] 合并前必须经过代码审查（Code Review）
- [ ] 强制执行签名提交

### 6. Cloudflare 与 CDN 安全

#### Cloudflare 安全设置

```typescript
// ✅ 正确：带有安全标头（Security Headers）的 Cloudflare Workers
export default {
  async fetch(request: Request): Promise<Response> {
    const response = await fetch(request);

    // 添加安全标头
    const headers = new Headers(response.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=()');

    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};
```

#### WAF 规则

```bash
# 启用 Cloudflare WAF 管理规则
# - OWASP Core Ruleset
# - Cloudflare Managed Ruleset
# - 速率限制规则（Rate Limiting）
# - Bot 防护
```

#### 验证步骤

- [ ] 启用带有 OWASP 规则的 WAF
- [ ] 配置速率限制（Rate Limiting）
- [ ] 启用 Bot 防护
- [ ] 启用 DDoS 防护
- [ ] 配置安全标头（Security Headers）
- [ ] 启用 SSL/TLS 严格模式

### 7. 备份与容灾恢复

#### 自动备份

```terraform
# ✅ 正确：自动 RDS 备份
resource "aws_db_instance" "main" {
  allocated_storage     = 20
  engine               = "postgres"

  backup_retention_period = 30  # 保留 30 天
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  enabled_cloudwatch_logs_exports = ["postgresql"]

  deletion_protection = true  # 防止意外删除
}
```

#### 验证步骤

- [ ] 配置每日自动备份
- [ ] 备份保留符合合规性要求
- [ ] 启用时间点恢复（Point-in-Time Recovery）
- [ ] 每季度进行一次备份测试
- [ ] 编写容灾恢复计划（Disaster Recovery Plan）文档
- [ ] 定义并测试 RPO 和 RTO

## 部署前云安全检查清单

在所有生产环境云部署之前：

- [ ] **IAM**：不使用 root 账户，启用 MFA，遵循最小权限策略
- [ ] **机密**：将所有机密存放在带有轮换功能的云机密管理器中
- [ ] **网络**：限制安全组，不公开数据库
- [ ] **日志**：启用带有保留期限的 CloudWatch/日志记录
- [ ] **监控**：配置异常告警
- [ ] **CI/CD**：使用 OIDC 身份验证、机密扫描、依赖项审计
- [ ] **CDN/WAF**：启用带有 OWASP 规则的 Cloudflare WAF
- [ ] **加密**：对静态数据和传输中的数据进行加密
- [ ] **备份**：配置经过恢复测试的自动备份
- [ ] **合规性**：符合 GDPR/HIPAA 要求（如适用）
- [ ] **文档**：记录基础架构信息，编写操作手册（Runbook）
- [ ] **事件响应**：制定安全事件响应计划

## 常见的云安全配置错误

### S3 存储桶公开暴露

```bash
# ❌ 错误：公开存储桶
aws s3api put-bucket-acl --bucket my-bucket --acl public-read

# ✅ 正确：具有特定访问权限的私有存储桶
aws s3api put-bucket-acl --bucket my-bucket --acl private
aws s3api put-bucket-policy --bucket my-bucket --policy file://policy.json
```

### RDS 公开访问

```terraform
# ❌ 错误
resource "aws_db_instance" "bad" {
  publicly_accessible = true  # 绝对不要这样做！
}

# ✅ 正确
resource "aws_db_instance" "good" {
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.db.id]
}
```

## 资源

- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [CIS AWS Foundations Benchmark](https://www.cisecurity.org/benchmark/amazon_web_services)
- [Cloudflare Security Documentation](https://developers.cloudflare.com/security/)
- [OWASP Cloud Security](https://owasp.org/www-project-cloud-security/)
- [Terraform Security Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/)

**请记住**：云配置错误是导致数据泄露的主要原因。一个公开的 S3 存储桶或权限过大的 IAM 策略都可能危及整个基础架构的安全。请务必遵循最小权限原则和多层防御策略。
