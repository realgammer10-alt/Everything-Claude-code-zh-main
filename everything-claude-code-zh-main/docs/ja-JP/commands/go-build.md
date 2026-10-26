---
description: 逐步修复 Go 构建错误、go vet 警告及 Linter 问题。调用 go-build-resolver 智能体（Agent）进行最小化的外科手术式修复。
---

# Go 构建与修复 (Go Build and Fix)

此命令调用 **go-build-resolver** 智能体（Agent），通过最小化的更改逐步修复 Go 构建错误。

## 此命令的功能

1. **执行诊断**：运行 `go build`、`go vet`、`staticcheck`
2. **分析错误**：按文件进行分组，并按重要程度排序
3. **逐步修复**：一次修复一个错误
4. **验证每次修复**：在每次更改后重新运行构建
5. **报告摘要**：显示已修复的内容和残留问题

## 使用时机

在以下情况下使用 `/go-build`：
- `go build ./...` 因错误而失败
- `go vet ./...` 报告问题
- `golangci-lint run` 显示警告
- 模块依赖关系损坏
- 在拉取了破坏构建的更改之后

## 执行的诊断命令

```bash
# 主要构建检查
go build ./...

# 静态分析
go vet ./...

# 扩展 Lint 检查（如果可用）
staticcheck ./...
golangci-lint run

# 模块问题
go mod verify
go mod tidy -v
```

## 会话示例

```text
User: /go-build

Agent:
# Go 构建修复

## 初始诊断

```bash
$ go build ./...
internal/service/user.go:25:15: undefined: UserRepository
internal/handler/api.go:42:9: cannot use x (type string) as type int
internal/handler/api.go:58:2: missing return at end of function
```

检测到错误：3 个

## 修复 1：未定义的标识符

文件：internal/service/user.go:25
错误：undefined: UserRepository
原因：缺少导入

```go
// 添加导入
import "project/internal/repository"

// 修改前
var repo UserRepository
// 修改后
var repo repository.UserRepository
```

```bash
$ go build ./...
# 剩余 2 个错误
```

## 修复 2：类型不匹配

文件：internal/handler/api.go:42
错误：cannot use x (type string) as type int

```go
// 修改前
count := params.Get("count")
// 修改后
countStr := params.Get("count")
count, _ := strconv.Atoi(countStr)
```

```bash
$ go build ./...
# 剩余 1 个错误
```

## 修复 3：缺少返回值

文件：internal/handler/api.go:58
错误：missing return at end of function

```go
func GetUser(id string) (*User, error) {
    if id == "" {
        return nil, ErrInvalidID
    }
    user := findUser(id)
    // 添加缺失的返回值
    return user, nil
}
```

```bash
$ go build ./...
# 构建成功！
```

## 最终验证

```bash
$ go vet ./...
# 无问题

$ go test ./...
ok      project/internal/service   0.015s
ok      project/internal/handler   0.023s
```

## 摘要

| 指标 | 数量 |
|--------|-------|
| 已修复的构建错误 | 3 |
| 已修复的 Vet 警告 | 0 |
| 已修改文件 | 2 |
| 残留问题 | 0 |

构建状态：✅ 成功
```

## 常见修复错误

| 错误 | 典型修复方式 |
|-------|-------------|
| `undefined: X` | 添加导入或修复拼写错误 |
| `cannot use X as Y` | 修复类型转换或赋值 |
| `missing return` | 添加 return 语句 |
| `X does not implement Y` | 添加缺失的方法 |
| `import cycle` | 重构包结构 |
| `declared but not used` | 删除或使用该变量 |
| `cannot find package` | 执行 `go get` 或 `go mod tidy` |

## 修复策略

1. **优先处理构建错误** - 代码必须首先能够编译
2. **其次处理 Vet 警告** - 修复可疑的结构
3. **最后处理 Lint 警告** - 代码风格与最佳实践
4. **一次只做一个修复** - 验证每次更改
5. **最小化更改** - 仅进行修复，不进行重构

## 停止条件

在以下情况下，智能体将停止并报告：
- 同一错误在尝试 3 次后仍然存在
- 修复引发了更多错误
- 需要进行架构调整
- 缺少外部依赖项

## 相关命令

- `/go-test` - 构建成功后运行测试
- `/go-review` - 审查代码质量
- `/verify` - 完整的验证循环

## 相关

- 智能体（Agent）：`agents/go-build-resolver.md`
- 技能（Skill）：`skills/golang-patterns/`
