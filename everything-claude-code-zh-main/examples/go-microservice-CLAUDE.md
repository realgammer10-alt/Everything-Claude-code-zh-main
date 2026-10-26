# Go 微服务 — 项目 CLAUDE.md

> 这是一个使用 PostgreSQL、gRPC 和 Docker 的 Go 微服务真实示例。
> 请将此文件复制到项目根目录，并根据你的服务进行自定义。

## 项目概览 (Project Overview)

**技术栈 (Stack):** Go 1.22+、PostgreSQL、gRPC + REST (grpc-gateway)、Docker、sqlc (类型安全 SQL)、Wire (依赖注入)

**架构 (Architecture):** 采用领域层 (Domain)、仓储层 (Repository)、服务层 (Service) 和处理层 (Handler) 的整洁架构 (Clean Architecture)。以 gRPC 作为主要传输协议，并为外部客户端提供 REST 网关。

## 核心规则 (Critical Rules)

### Go 规范 (Go Conventions)

- 遵循 Effective Go 和 Go Code Review Comments 指南
- 使用 `errors.New` / `fmt.Errorf` 配合 `%w` 进行错误包装 —— 严禁对错误进行字符串匹配
- 禁止使用 `init()` 函数 —— 在 `main()` 或构造函数中进行显式初始化
- 禁止全局可变状态 —— 通过构造函数传递依赖项
- Context 必须作为第一个参数，并透传到所有层级

### 数据库 (Database)

- 所有查询均以纯 SQL 形式存放在 `queries/` 中 —— sqlc 会生成类型安全的 Go 代码
- 迁移文件存放在 `migrations/` 中并使用 golang-migrate —— 严禁直接修改数据库
- 对于多步操作，通过 `pgx.Tx` 使用事务
- 所有查询必须使用参数化占位符 (`$1`, `$2`) —— 严禁使用字符串格式化

### 错误处理 (Error Handling)

- 返回错误而非抛出 panic —— panic 仅用于真正不可恢复的情况
- 包装错误并带上上下文：`fmt.Errorf("creating user: %w", err)`
- 在 `domain/errors.go` 中定义业务逻辑的哨兵错误 (Sentinel Errors)
- 在处理层 (Handler Layer) 将领域错误映射为 gRPC 状态码

```go
// 领域层 — 哨兵错误
var (
    ErrUserNotFound  = errors.New("user not found")
    ErrEmailTaken    = errors.New("email already registered")
)

// 处理层 — 映射到 gRPC 状态码
func toGRPCError(err error) error {
    switch {
    case errors.Is(err, domain.ErrUserNotFound):
        return status.Error(codes.NotFound, err.Error())
    case errors.Is(err, domain.ErrEmailTaken):
        return status.Error(codes.AlreadyExists, err.Error())
    default:
        return status.Error(codes.Internal, "internal error")
    }
}
```

### 代码风格 (Code Style)

- 代码或注释中不得使用表情符号 (Emoji)
- 导出的类型和函数必须包含文档注释
- 函数行数控制在 50 行以内 —— 提取助手函数 (Helper Functions)
- 对所有逻辑使用包含多测试用例的表驱动测试 (Table-Driven Tests)
- 信号通道 (Signal Channels) 优先使用 `struct{}` 而非 `bool`

## 文件结构 (File Structure)

```
cmd/
  server/
    main.go              # 入口点，Wire 注入，优雅停机
internal/
  domain/                # 业务类型和接口
    user.go              # User 实体和 Repository 接口
    errors.go            # 哨兵错误
  service/               # 业务逻辑
    user_service.go
    user_service_test.go
  repository/            # 数据访问 (sqlc 生成 + 自定义)
    postgres/
      user_repo.go
      user_repo_test.go  # 使用 testcontainers 的集成测试
  handler/               # gRPC + REST 处理程序
    grpc/
      user_handler.go
    rest/
      user_handler.go
  config/                # 配置加载
    config.go
proto/                   # Protobuf 定义
  user/v1/
    user.proto
queries/                 # sqlc 使用的 SQL 查询
  user.sql
migrations/              # 数据库迁移
  001_create_users.up.sql
  001_create_users.down.sql
```

## 关键模式 (Key Patterns)

### 仓储接口 (Repository Interface)

```go
type UserRepository interface {
    Create(ctx context.Context, user *User) error
    FindByID(ctx context.Context, id uuid.UUID) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id uuid.UUID) error
}
```

### 带有依赖注入的服务 (Service with Dependency Injection)

```go
type UserService struct {
    repo   domain.UserRepository
    hasher PasswordHasher
    logger *slog.Logger
}

func NewUserService(repo domain.UserRepository, hasher PasswordHasher, logger *slog.Logger) *UserService {
    return &UserService{repo: repo, hasher: hasher, logger: logger}
}

func (s *UserService) Create(ctx context.Context, req CreateUserRequest) (*domain.User, error) {
    existing, err := s.repo.FindByEmail(ctx, req.Email)
    if err != nil && !errors.Is(err, domain.ErrUserNotFound) {
        return nil, fmt.Errorf("checking email: %w", err)
    }
    if existing != nil {
        return nil, domain.ErrEmailTaken
    }

    hashed, err := s.hasher.Hash(req.Password)
    if err != nil {
        return nil, fmt.Errorf("hashing password: %w", err)
    }

    user := &domain.User{
        ID:       uuid.New(),
        Name:     req.Name,
        Email:    req.Email,
        Password: hashed,
    }
    if err := s.repo.Create(ctx, user); err != nil {
        return nil, fmt.Errorf("creating user: %w", err)
    }
    return user, nil
}
```

### 表驱动测试 (Table-Driven Tests)

```go
func TestUserService_Create(t *testing.T) {
    tests := []struct {
        name    string
        req     CreateUserRequest
        setup   func(*MockUserRepo)
        wantErr error
    }{
        {
            name: "valid user",
            req:  CreateUserRequest{Name: "Alice", Email: "alice@example.com", Password: "secure123"},
            setup: func(m *MockUserRepo) {
                m.On("FindByEmail", mock.Anything, "alice@example.com").Return(nil, domain.ErrUserNotFound)
                m.On("Create", mock.Anything, mock.Anything).Return(nil)
            },
            wantErr: nil,
        },
        {
            name: "duplicate email",
            req:  CreateUserRequest{Name: "Alice", Email: "taken@example.com", Password: "secure123"},
            setup: func(m *MockUserRepo) {
                m.On("FindByEmail", mock.Anything, "taken@example.com").Return(&domain.User{}, nil)
            },
            wantErr: domain.ErrEmailTaken,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            repo := new(MockUserRepo)
            tt.setup(repo)
            svc := NewUserService(repo, &bcryptHasher{}, slog.Default())

            _, err := svc.Create(context.Background(), tt.req)

            if tt.wantErr != nil {
                assert.ErrorIs(t, err, tt.wantErr)
            } else {
                assert.NoError(t, err)
            }
        })
    }
}
```

## 环境变量 (Environment Variables)

```bash
# 数据库
DATABASE_URL=postgres://user:pass@localhost:5432/myservice?sslmode=disable

# gRPC
GRPC_PORT=50051
REST_PORT=8080

# 认证 (Auth)
JWT_SECRET=           # 生产环境中从 vault 加载
TOKEN_EXPIRY=24h

# 可观测性 (Observability)
LOG_LEVEL=info        # debug, info, warn, error
OTEL_ENDPOINT=        # OpenTelemetry 采集器
```

## 测试策略 (Testing Strategy)

```bash
/go-test             # Go 的 TDD 工作流
/go-review           # Go 专属代码审查
/go-build            # 修复构建错误
```

### 测试命令 (Test Commands)

```bash
# 单元测试 (快速，无外部依赖)
go test ./internal/... -short -count=1

# 集成测试 (需要 Docker 运行 testcontainers)
go test ./internal/repository/... -count=1 -timeout 120s

# 所有测试及其覆盖率
go test ./... -coverprofile=coverage.out -count=1
go tool cover -func=coverage.out  # 摘要
go tool cover -html=coverage.out  # 浏览器查看

# 竞态检测器 (Race detector)
go test ./... -race -count=1
```

## ECC 工作流 (ECC Workflow)

```bash
# 规划阶段 (Planning)
/plan "Add rate limiting to user endpoints"

# 开发阶段 (Development)
/go-test                  # 使用 Go 专属模式进行 TDD

# 审查阶段 (Review)
/go-review                # 检查 Go 惯用法、错误处理、并发等
/security-scan            # 检查密钥泄露和漏洞

# 合并前 (Before merge)
go vet ./...
staticcheck ./...
```

## Git 工作流 (Git Workflow)

- `feat:` 新功能，`fix:` 错误修复，`refactor:` 代码重构
- 从 `main` 分支拉取功能分支，合并需提交 PR
- CI：执行 `go vet`、`staticcheck`、`go test -race`、`golangci-lint`
- 部署：在 CI 中构建 Docker 镜像，部署到 Kubernetes
