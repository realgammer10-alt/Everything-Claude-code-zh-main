---
description: 修复 Go 构建与 vet 错误
agent: go-build-resolver
subtask: true
---

# Go 构建命令 (Go Build Command)

修复 Go 构建 (build)、静态检查 (vet) 和编译错误：$ARGUMENTS

## 任务步骤

1. **执行构建**：`go build ./...`
2. **执行静态检查**：`go vet ./...`
3. **逐个修复错误**
4. **验证修复是否引入新错误**

## 常见 Go 错误

### 导入错误 (Import Errors)
```
imported and not used: "package"
```
**修复**：移除未使用的导入，或使用 `_` 前缀

### 类型错误 (Type Errors)
```
cannot use x (type T) as type U
```
**修复**：添加类型转换或修复类型定义

### 未定义错误 (Undefined Errors)
```
undefined: identifier
```
**修复**：导入包、定义变量或修复拼写错误

### Vet 静态检查错误 (Vet Errors)
```
printf: call has arguments but no formatting directives
```
**修复**：添加格式化占位符或移除参数

## 修复顺序

1. **导入错误** - 修复或移除导入
2. **类型定义** - 确保类型已定义
3. **函数签名** - 确保参数匹配
4. **Vet 警告** - 处理静态分析发现的问题

## 构建命令

```bash
# 构建所有包
go build ./...

# 使用竞态检测器构建
go build -race ./...

# 为特定操作系统/架构构建
GOOS=linux GOARCH=amd64 go build ./...

# 运行 go vet
go vet ./...

# 运行 staticcheck
staticcheck ./...

# 格式化代码
gofmt -w .

# 整理依赖
go mod tidy
```

## 验证

修复后：
```bash
go build ./...    # 应当构建成功
go vet ./...      # 应当无警告
go test ./...     # 测试应当通过
```

---

**重要说明**：仅修复错误。不要进行重构或改进。以最小的改动使构建通过。
