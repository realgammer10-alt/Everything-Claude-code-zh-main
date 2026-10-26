---
description: Go 代码审查（Go code review），针对惯用模式（idiomatic patterns）
agent: go-reviewer
subtask: true
---

# Go 代码审查（Go Review）命令

审查 Go 代码的惯用模式（idiomatic patterns）和最佳实践：$ARGUMENTS

## 你的任务

1. **分析 Go 代码** 的惯用语和模式
2. **检查并发性（Concurrency）** - goroutines、channels、mutexes
3. **审查错误处理（Error handling）** - 正确的错误包装（error wrapping）
4. **验证性能** - 内存分配（allocations）、瓶颈（bottlenecks）

## 审查清单（Review Checklist）

### 惯用 Go 代码（Idiomatic Go）
- [ ] 包命名（全小写，不含下划线）
- [ ] 变量命名（驼峰式 camelCase，保持简短）
- [ ] 接口命名（以 -er 结尾）
- [ ] 错误命名（以 Err 开头）

### 错误处理（Error Handling）
- [ ] 检查错误而非忽略
- [ ] 使用上下文包装错误（`fmt.Errorf("...: %w", err)`）
- [ ] 适当地使用哨兵错误（Sentinel errors）
- [ ] 必要时使用自定义错误类型

### 并发（Concurrency）
- [ ] 妥善管理 Goroutines
- [ ] 适当地缓冲 Channels
- [ ] 无数据竞态（使用 `-race` 标志）
- [ ] 传递 Context 以支持取消操作
- [ ] 正确使用 WaitGroups

### 性能
- [ ] 避免不必要的内存分配
- [ ] 针对频繁的分配使用 `sync.Pool`
- [ ] 对于小型结构体，优先使用值接收者（value receivers）
- [ ] 对 I/O 操作进行缓冲

### 代码组织
- [ ] 小型且专注的包
- [ ] 清晰的依赖方向
- [ ] 使用 internal 包存放私有代码
- [ ] 在导出内容上添加 Godoc 注释

## 报告格式

### 惯用法问题
- [file:line] 问题描述
  建议：如何修复

### 错误处理问题
- [file:line] 问题描述
  建议：如何修复

### 并发问题
- [file:line] 问题描述
  建议：如何修复

### 性能问题
- [file:line] 问题描述
  建议：如何修复

---

**提示（TIP）**：运行 `go vet` 和 `staticcheck` 进行额外的自动化检查。
