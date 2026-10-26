# Rust API 服务 — 项目 CLAUDE.md

> 使用 Axum、PostgreSQL 和 Docker 构建的 Rust API 服务真实案例。
> 将此文件复制到项目根目录，并根据你的服务进行自定义。

## 项目概览 (Project Overview)

**技术栈 (Stack):** Rust 1.78+, Axum (Web 框架), SQLx (异步数据库), PostgreSQL, Tokio (异步运行时), Docker

**架构 (Architecture):** 采用 处理器 (handler) → 服务 (service) → 仓储 (repository) 分离的分层架构。Axum 处理 HTTP，SQLx 在编译时进行类型检查的 SQL，Tower 中件件处理横切关注点。

## 关键规则 (Critical Rules)

### Rust 规范 (Rust Conventions)

- 库错误使用 `thiserror`，仅在二进制 crate 或测试中使用 `anyhow`
- 生产代码中严禁使用 `.unwrap()` 或 `.expect()` — 使用 `?` 传播错误
- 函数参数优先使用 `&str` 而非 `String`；当所有权转移时返回 `String`
- 使用 `clippy` 并配置 `#![deny(clippy::all, clippy::pedantic)]` — 修复所有警告
- 所有公共类型都派生 `Debug`；仅在需要时派生 `Clone` 和 `PartialEq`
- 除非有 `// SAFETY:` 注释说明理由，否则禁止使用 `unsafe` 块

### 数据库 (Database)

- 所有查询均使用 SQLx `query!` 或 `query_as!` 宏 — 针对 Schema 进行编译时验证
- 迁移文件位于 `migrations/`，使用 `sqlx migrate` 执行 — 严禁直接修改数据库
- 使用 `sqlx::Pool<Postgres>` 作为共享状态 — 严禁为每个请求创建连接
- 所有查询均使用参数化占位符 (`$1`, `$2`) — 严禁使用字符串格式化

```rust
// 错误：字符串插值（存在 SQL 注入风险）
let q = format!("SELECT * FROM users WHERE id = '{}'", id);

// 正确：参数化查询，编译时检查
let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
    .fetch_optional(&pool)
    .await?;
```

### 错误处理 (Error Handling)

- 为每个模块定义一个使用 `thiserror` 的领域错误枚举
- 通过 `IntoResponse` 将错误映射到 HTTP 响应 — 严禁暴露内部细节
- 使用 `tracing` 进行结构化日志记录 — 严禁使用 `println!` 或 `eprintln!`

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Resource not found")]
    NotFound,
    #[error("Validation failed: {0}")]
    Validation(String),
    #[error("Unauthorized")]
    Unauthorized,
    #[error(transparent)]
    Internal(#[from] anyhow::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            Self::NotFound => (StatusCode::NOT_FOUND, self.to_string()),
            Self::Validation(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            Self::Unauthorized => (StatusCode::UNAUTHORIZED, self.to_string()),
            Self::Internal(err) => {
                tracing::error!(?err, "internal error");
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal error".into())
            }
        };
        (status, Json(json!({ "error": message }))).into_response()
    }
}
```

### 测试 (Testing)

- 单元测试位于每个源文件的 `#[cfg(test)]` 模块中
- 集成测试位于 `tests/` 目录，使用真实的 PostgreSQL（Testcontainers 或 Docker）
- 使用 `#[sqlx::test]` 进行数据库测试，支持自动迁移和回滚
- 使用 `mockall` 或 `wiremock` 模拟外部服务

### 代码风格 (Code Style)

- 最大行宽：100 字符（由 rustfmt 强制执行）
- 导入分组：`std`、外部 crate、`crate`/`super` — 用空行分隔
- 模块：每个模块一个文件，`mod.rs` 仅用于重导（re-exports）
- 类型：PascalCase，函数/变量：snake_case，常量：UPPER_SNAKE_CASE

## 文件结构 (File Structure)

```
src/
  main.rs              # 入口点，服务器设置，优雅停机
  lib.rs               # 用于集成测试的重导出
  config.rs            # 使用 envy 或 figment 处理环境配置
  router.rs            # 包含所有路由的 Axum 路由器
  middleware/
    auth.rs            # JWT 提取与验证
    logging.rs         # 请求/响应追踪
  handlers/
    mod.rs             # 路由处理器（薄层 — 委托给服务层）
    users.rs
    orders.rs
  services/
    mod.rs             # 业务逻辑
    users.rs
    orders.rs
  repositories/
    mod.rs             # 数据库访问（SQLx 查询）
    users.rs
    orders.rs
  domain/
    mod.rs             # 领域类型，错误枚举
    user.rs
    order.rs
migrations/
  001_create_users.sql
  002_create_orders.sql
tests/
  common/mod.rs        # 共享测试辅助工具，测试服务器设置
  api_users.rs         # 用户端点的集成测试
  api_orders.rs        # 订单端点的集成测试
```

## 关键模式 (Key Patterns)

### 处理器 Handler (薄层)

```rust
async fn create_user(
    State(ctx): State<AppState>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<(StatusCode, Json<UserResponse>), AppError> {
    let user = ctx.user_service.create(payload).await?;
    Ok((StatusCode::CREATED, Json(UserResponse::from(user))))
}
```

### 服务 Service (业务逻辑)

```rust
impl UserService {
    pub async fn create(&self, req: CreateUserRequest) -> Result<User, AppError> {
        if self.repo.find_by_email(&req.email).await?.is_some() {
            return Err(AppError::Validation("Email already registered".into()));
        }

        let password_hash = hash_password(&req.password)?;
        let user = self.repo.insert(&req.email, &req.name, &password_hash).await?;

        Ok(user)
    }
}
```

### 仓储 Repository (数据访问)

```rust
impl UserRepository {
    pub async fn find_by_email(&self, email: &str) -> Result<Option<User>, sqlx::Error> {
        sqlx::query_as!(User, "SELECT * FROM users WHERE email = $1", email)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn insert(
        &self,
        email: &str,
        name: &str,
        password_hash: &str,
    ) -> Result<User, sqlx::Error> {
        sqlx::query_as!(
            User,
            r#"INSERT INTO users (email, name, password_hash)
               VALUES ($1, $2, $3) RETURNING *"#,
            email, name, password_hash,
        )
        .fetch_one(&self.pool)
        .await
    }
}
```

### 集成测试 (Integration Test)

```rust
#[tokio::test]
async fn test_create_user() {
    let app = spawn_test_app().await;

    let response = app
        .client
        .post(&format!("{}/api/v1/users", app.address))
        .json(&json!({
            "email": "alice@example.com",
            "name": "Alice",
            "password": "securepassword123"
        }))
        .send()
        .await
        .expect("Failed to send request");

    assert_eq!(response.status(), StatusCode::CREATED);
    let body: serde_json::Value = response.json().await.unwrap();
    assert_eq!(body["email"], "alice@example.com");
}

#[tokio::test]
async fn test_create_user_duplicate_email() {
    let app = spawn_test_app().await;
    // 创建第一个用户
    create_test_user(&app, "alice@example.com").await;
    // 尝试重复创建
    let response = create_user_request(&app, "alice@example.com").await;
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}
```

## 环境变量 (Environment Variables)

```bash
# 服务器
HOST=0.0.0.0
PORT=8080
RUST_LOG=info,tower_http=debug

# 数据库
DATABASE_URL=postgres://user:pass@localhost:5432/myapp

# 认证
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY_HOURS=24

# 可选
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 测试策略 (Testing Strategy)

```bash
# 运行所有测试
cargo test

# 运行时输出日志
cargo test -- --nocapture

# 运行特定测试模块
cargo test api_users

# 检查覆盖率（需要 cargo-llvm-cov）
cargo llvm-cov --html
open target/llvm-cov/html/index.html

# Lint 检查
cargo clippy -- -D warnings

# 格式检查
cargo fmt -- --check
```

## ECC 工作流 (ECC Workflow)

```bash
# 计划 (Planning)
/plan "Add order fulfillment with Stripe payment"

# 基于 TDD 的开发 (Development with TDD)
/tdd                    # 基于 cargo test 的 TDD 工作流

# 审查 (Review)
/code-review            # Rust 特有的代码审查
/security-scan          # 依赖审计 + unsafe 扫描

# 验证 (Verification)
/verify                 # 编译、clippy、测试、安全扫描
```

## Git 工作流 (Git Workflow)

- `feat:` 新功能，`fix:` 错误修复，`refactor:` 代码重构
- 从 `main` 分支创建功能分支，必须通过 PR 合并
- CI 流程：`cargo fmt --check`、`cargo clippy`、`cargo test`、`cargo audit`
- 部署：基于 `scratch` 或 `distroless` 基础镜像的多阶段 Docker 构建
