---
description: 关于惯用模式（Idiomatic Patterns）、并发安全（Concurrency Safety）、错误处理（Error Handling）和安全性（Security）的全面 Go 代码审查。调用 go-reviewer 智能体（Agent）。
---

# Go 代码审查（Go Code Review）

此命令调用 **go-reviewer** 智能体（Agent）进行针对 Go 语言特性的全面代码审查。

## 此命令的功能

1. **识别 Go 变更**: 使用 `git diff` 检测已更改的 `.go` 文件
2. **执行静态分析**: 运行 `go vet`、`staticcheck` 和 `golangci-lint`
3. **安全性扫描**: 检查 SQL 注入、命令注入及竞态条件（Race Conditions）
4. **并发审查**: 分析 goroutine 安全性、通道（Channel）使用及互斥锁（Mutex）模式
5. **惯用 Go 检查**: 确保代码遵循 Go 的惯例和最佳实践
6. **生成报告**: 按严重程度对发现的问题进行分类

## 使用场景

在以下情况下使用 `/go-review`：
- 编写或修改 Go 代码后
- 提交 Go 变更前
- 审查包含 Go 变更的合并请求（Pull Request）时
- 新加入 Go 代码库时（Onboarding）
- 学习惯用 Go 模式时

## 审查类别

### 严重 CRITICAL（必须修复）
- SQL/命令注入漏洞
- 未经同步的竞态条件（Race Conditions）
- goroutine 泄漏
- 硬编码的凭证信息
- 不安全的指针（unsafe.Pointer）使用
- 关键路径中忽略错误处理

### 高 HIGH（建议修复）
- 缺少包含上下文（Context）的错误包装（Error Wrapping）
- 使用 panic 代替错误返回
- 上下文（Context）未传递
- 会导致死锁的无缓冲通道（Unbuffered Channels）
- 接口未实现错误
- 缺少互斥锁（Mutex）保护

### 中 MEDIUM（建议考虑）
- 非惯用的代码模式
- 导出项缺少 godoc 注释
- 低效的字符串拼接
- 未预分配容量的切片（Slice）
- 未使用表格驱动测试（Table-driven tests）

## 执行的自动检查

```bash
# 静态分析
go vet ./...

# 高级检查（如果已安装）
staticcheck ./...
golangci-lint run

# 竞态检测
go build -race ./...

# 安全漏洞扫描
govulncheck ./...
```

## 使用示例

```text
User: /go-review

Agent:
# Go 代码审查报告

## 已审查的文件
- internal/handler/user.go (变更)
- internal/service/auth.go (变更)

## 静态分析结果
✓ go vet: 未发现问题
✓ staticcheck: 未发现问题

## 发现的问题

[CRITICAL] 竞态条件（Race Condition）
File: internal/service/auth.go:45
Issue: 在未经同步的情况下访问共享 Map
```go
var cache = map[string]*Session{}  // 并发访问！

func GetSession(id string) *Session {
    return cache[id]  // 竞态条件
}
```
Fix: 使用 sync.RWMutex 或 sync.Map
```go
var (
    cache   = map[string]*Session{}
    cacheMu sync.RWMutex
)

func GetSession(id string) *Session {
    cacheMu.RLock()
    defer cacheMu.RUnlock()
    return cache[id]
}
```

[HIGH] 缺少错误上下文
File: internal/handler/user.go:28
Issue: 返回不带上下文的错误
```go
return err  // 缺少上下文
```
Fix: 使用上下文进行包装
```go
return fmt.Errorf("get user %s: %w", userID, err)
```

## 摘要
- CRITICAL: 1
- HIGH: 1
- MEDIUM: 0

建议: ❌ 在修复 CRITICAL 问题前，阻止合并
```

## 批准标准

| 状态 | 条件 |
|--------|-----------|
| ✅ 通过 | 无 CRITICAL 或 HIGH 问题 |
| ⚠️ 警告 | 仅存在 MEDIUM 问题（需谨慎合并） |
| ❌ 阻止 | 发现 CRITICAL 或 HIGH 问题 |

## 与其他命令的集成

- 首先使用 `/go-test` 确保测试通过
- 在出现构建错误时使用 `/go-build`
- 在提交前使用 `/go-review`
- 对于非 Go 特有的问题，使用 `/code-review`

## 相关链接

- Agent: `agents/go-reviewer.md`
- Skills: `skills/golang-patterns/`, `skills/golang-testing/`
