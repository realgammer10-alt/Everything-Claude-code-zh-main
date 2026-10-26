---
description: 带有表格驱动测试的 Go TDD 工作流
agent: tdd-guide
subtask: true
---

# Go 测试命令 (Go Test Command)

使用 Go 测试驱动开发（TDD）方法论实现：$ARGUMENTS

## 任务目标

遵循 Go 惯用法应用测试驱动开发：

1. **定义类型** - 接口（Interfaces）与结构体（Structs）
2. **编写表格驱动测试（Table-Driven Tests）** - 确保全面覆盖
3. **编写最小代码实现** - 通过测试
4. **基准测试（Benchmark）** - 验证性能

## Go 语言的 TDD 循环

### 步骤 1：定义接口
```go
type Calculator interface {
    Calculate(input Input) (Output, error)
}

type Input struct {
    // 字段
}

type Output struct {
    // 字段
}
```

### 步骤 2：表格驱动测试
```go
func TestCalculate(t *testing.T) {
    tests := []struct {
        name    string
        input   Input
        want    Output
        wantErr bool
    }{
        {
            name:  "有效输入",
            input: Input{...},
            want:  Output{...},
        },
        {
            name:    "无效输入",
            input:   Input{...},
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Calculate(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("Calculate() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("Calculate() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

### 步骤 3：运行测试（失败/红色 - RED）
```bash
go test -v ./...
```

### 步骤 4：实现（通过/绿色 - GREEN）
```go
func Calculate(input Input) (Output, error) {
    // 最小化实现
}
```

### 步骤 5：基准测试
```go
func BenchmarkCalculate(b *testing.B) {
    input := Input{...}
    for i := 0; i < b.N; i++ {
        Calculate(input)
    }
}
```

## Go 测试相关命令

```bash
# 运行所有测试
go test ./...

# 运行并显示详细输出
go test -v ./...

# 运行并显示覆盖率
go test -cover ./...

# 运行并开启竞态检测
go test -race ./...

# 运行基准测试
go test -bench=. ./...

# 生成覆盖率报告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## 测试文件组织结构

```
package/
├── calculator.go       # 实现代码
├── calculator_test.go  # 测试代码
├── testdata/           # 测试固件/样本数据
│   └── input.json
└── mock_test.go        # Mock 实现
```

---

**提示（TIP）**：可以使用 `testify/assert` 实现更清晰的断言，或者为了保持简洁而坚持使用标准库。
