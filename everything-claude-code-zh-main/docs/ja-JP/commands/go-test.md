---
description: 应用 Go 的测试驱动开发（TDD）工作流。先编写表格驱动测试，然后进行实现。通过 go test -cover 确认覆盖率达到 80% 以上。
---

# Go TDD 命令

此命令应用了使用 Go 惯用测试模式的测试驱动开发（TDD）方法。

## 此命令的功能

1. **定义类型/接口**: 先进行函数签名的脚手架搭建（Scaffolding）
2. **编写表格驱动测试（Table-driven tests）**: 创建全面的测试用例（RED）
3. **运行测试**: 确认测试因正确的理由而失败
4. **实现代码**: 编写通过测试所需的最少代码（GREEN）
5. **重构（Refactor）**: 在保持测试通过的同时改进代码
6. **确认覆盖率（Coverage）**: 确保 80% 以上的覆盖率

## 使用场景

`/go-test` 适用于以下场景：
- 实现新的 Go 函数时
- 为现有代码添加测试覆盖率时
- 修复 Bug 时（先创建失败的测试）
- 构建核心业务逻辑时
- 学习 Go 的 TDD 工作流时

## TDD 循环

```
RED     → 创建失败的表格驱动测试
GREEN   → 实现通过测试所需的最少代码
REFACTOR → 改进代码，保持测试为绿色（通过）
REPEAT  → 进入下一个测试用例
```

## 会话示例

```text
User: /go-test 我需要一个验证电子邮件地址的函数

Agent:
# TDD 会话：电子邮件验证器

## 步骤 1：定义接口

```go
// validator/email.go
package validator

// ValidateEmail checks if the given string is a valid email address.
// Returns nil if valid, error describing the issue otherwise.
func ValidateEmail(email string) error {
    panic("not implemented")
}
```

## 步骤 2：创建表格驱动测试 (RED)

```go
// validator/email_test.go
package validator

import (
    "testing"
)

func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        // 有效的电子邮件地址
        {"simple email", "user@example.com", false},
        {"with subdomain", "user@mail.example.com", false},
        {"with plus", "user+tag@example.com", false},
        {"with dots", "first.last@example.com", false},

        // 无效的电子邮件地址
        {"empty string", "", true},
        {"no at sign", "userexample.com", true},
        {"no domain", "user@", true},
        {"no local part", "@example.com", true},
        {"double at", "user@@example.com", true},
        {"spaces", "user @example.com", true},
        {"no tld", "user@example", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if tt.wantErr && err == nil {
                t.Errorf("ValidateEmail(%q) = nil; want error", tt.email)
            }
            if !tt.wantErr && err != nil {
                t.Errorf("ValidateEmail(%q) = %v; want nil", tt.email, err)
            }
        })
    }
}
```

## 步骤 3：运行测试 - 确认失败

```bash
$ go test ./validator/...

--- FAIL: TestValidateEmail (0.00s)
    --- FAIL: TestValidateEmail/simple_email (0.00s)
        panic: not implemented

FAIL
```

✓ 测试如预期般失败（panic）。

## 步骤 4：实现最少代码 (GREEN)

```go
// validator/email.go
package validator

import (
    "errors"
    "regexp"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

var (
    ErrEmailEmpty   = errors.New("email cannot be empty")
    ErrEmailInvalid = errors.New("email format is invalid")
)

func ValidateEmail(email string) error {
    if email == "" {
        return ErrEmailEmpty
    }
    if !emailRegex.MatchString(email) {
        return ErrEmailInvalid
    }
    return nil
}
```

## 步骤 5：运行测试 - 确认通过

```bash
$ go test ./validator/...

PASS
ok      project/validator    0.003s
```

✓ 所有测试均已通过！

## 步骤 6：确认覆盖率

```bash
$ go test -cover ./validator/...

PASS
coverage: 100.0% of statements
ok      project/validator    0.003s
```

✓ 覆盖率：100%

## TDD 完成！
```

## 测试模式

### 表格驱动测试（Table-driven tests）
```go
tests := []struct {
    name     string
    input    InputType
    want     OutputType
    wantErr  bool
}{
    {"case 1", input1, want1, false},
    {"case 2", input2, want2, true},
}

for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        got, err := Function(tt.input)
        // assertions
    })
}
```

### 并行测试（Parallel tests）
```go
for _, tt := range tests {
    tt := tt // Capture
    t.Run(tt.name, func(t *testing.T) {
        t.Parallel()
        // test body
    })
}
```

### 测试助手（Test Helpers）
```go
func setupTestDB(t *testing.T) *sql.DB {
    t.Helper()
    db := createDB()
    t.Cleanup(func() { db.Close() })
    return db
}
```

## 覆盖率命令

```bash
# 基础覆盖率
go test -cover ./...

# 覆盖率分析文件（Profile）
go test -coverprofile=coverage.out ./...

# 在浏览器中查看
go tool cover -html=coverage.out

# 按函数查看覆盖率
go tool cover -func=coverage.out

# 带有竞态检测（Race Detection）
go test -race -cover ./...
```

## 覆盖率目标

| 代码类型 | 目标 |
|-----------|--------|
| 核心业务逻辑 | 100% |
| 公共 API | 90%+ |
| 普通代码 | 80%+ |
| 生成的代码 | 排除 |

## TDD 最佳实践

**推荐做法：**
- 在实现代码前先写测试
- 每次修改后运行测试
- 使用表格驱动测试以获得全面的覆盖率
- 测试行为而非实现细节
- 包含边界情况（空值、nil、最大值）

**应避免的做法：**
- 在写测试前编写实现代码
- 跳过 RED 阶段
- 直接测试私有函数
- 在测试中使用 `time.Sleep`
- 忽视不稳定的测试（Flaky tests）

## 相关命令

- `/go-build` - 修复构建错误
- `/go-review` - 实现后的代码审查
- `/verify` - 执行完整的验证循环

## 相关链接

- 技能：`skills/golang-testing/`
- 技能：`skills/tdd-workflow/`
