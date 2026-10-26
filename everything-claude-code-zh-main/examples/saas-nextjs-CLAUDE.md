# SaaS 应用程序 — 项目 CLAUDE.md

> Next.js + Supabase + Stripe SaaS 应用程序的真实示例。
> 将此文件复制到项目根目录，并根据你的技术栈进行自定义。

## 项目概览 (Project Overview)

**技术栈 (Stack)：** Next.js 15 (App Router), TypeScript, Supabase (身份验证 + 数据库), Stripe (计费), Tailwind CSS, Playwright (E2E)

**架构 (Architecture)：** 默认使用服务端组件（Server Components）。仅在交互场景使用客户端组件（Client Components）。API 路由（API routes）用于 Webhook，服务端操作（Server Actions）用于数据变更（Mutations）。

## 关键规则 (Critical Rules)

### 数据库 (Database)

- 所有查询必须使用已启用行级安全（RLS）的 Supabase 客户端 —— 严禁绕过 RLS
- 迁移文件位于 `supabase/migrations/` —— 严禁直接修改数据库
- 使用 `select()` 时需明确列清单，不要使用 `select('*')`
- 所有面向用户的查询必须包含 `.limit()` 以防止无限制的结果集

### 身份验证 (Authentication)

- 服务端组件（Server Components）中使用 `@supabase/ssr` 的 `createServerClient()`
- 客户端组件（Client Components）中使用 `@supabase/ssr` 的 `createBrowserClient()`
- 受保护路由需检查 `getUser()` —— 严禁仅依赖 `getSession()` 进行鉴权
- `middleware.ts` 中的中间件（Middleware）需在每次请求时刷新身份验证令牌（Auth Tokens）

### 计费 (Billing)

- Stripe Webhook 处理程序位于 `app/api/webhooks/stripe/route.ts`
- 严禁信任客户端提供的价格数据 —— 始终从 Stripe 服务端获取
- 通过 `subscription_status` 列检查订阅状态，该状态由 Webhook 保持同步
- 免费版用户限制：3 个项目，100 次 API 调用/天

### 代码风格 (Code Style)

- 代码或注释中不得使用 Emoji 表情
- 仅使用不可变（Immutable）模式 —— 使用展开运算符（Spread Operator），严禁直接修改原始对象
- 服务端组件（Server Components）：不得使用 `'use client'` 指令，不得使用 `useState`/`useEffect`
- 客户端组件（Client Components）：顶部标注 `'use client'`，保持逻辑精简 —— 将逻辑提取至 Hooks 中
- 优先使用 Zod 模式（Zod schemas）进行所有输入验证（API 路由、表单、环境变量）

## 文件结构 (File Structure)

```
src/
  app/
    (auth)/          # 身份验证页面（登录、注册、找回密码）
    (dashboard)/     # 受保护的仪表盘页面
    api/
      webhooks/      # Stripe, Supabase Webhooks
    layout.tsx       # 包含 Provider 的根布局
  components/
    ui/              # Shadcn/ui 组件
    forms/           # 带有验证功能的表单组件
    dashboard/       # 仪表盘专用组件
  hooks/             # 自定义 React Hooks
  lib/
    supabase/        # Supabase 客户端工厂函数
    stripe/          # Stripe 客户端及辅助工具
    utils.ts         # 通用工具函数
  types/             # 共享的 TypeScript 类型定义
supabase/
  migrations/        # 数据库迁移文件
  seed.sql           # 开发环境种子数据
```

## 核心模式 (Key Patterns)

### API 响应格式 (API Response Format)

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }
```

### 服务端操作模式 (Server Action Pattern)

```typescript
'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const schema = z.object({
  name: z.string().min(1).max(100),
})

export async function createProject(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get('name') })
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('projects')
    .insert({ name: parsed.data.name, user_id: user.id })
    .select('id, name, created_at')
    .single()

  if (error) return { success: false, error: 'Failed to create project' }
  return { success: true, data }
}
```

## 环境变量 (Environment Variables)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # 仅服务端使用，严禁暴露给客户端

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# 应用程序
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 测试策略 (Testing Strategy)

```bash
/tdd                    # 新功能的单元测试 + 集成测试
/e2e                    # 身份验证流、计费、仪表盘的 Playwright 测试
/test-coverage          # 验证 80% 以上的覆盖率
```

### 关键端到端流程 (Critical E2E Flows)

1. 注册 → 邮件验证 → 创建第一个项目
2. 登录 → 进入仪表盘 → CRUD 操作
3. 升级方案 → Stripe 结账 → 订阅生效
4. Webhook：取消订阅 → 降级至免费版

## ECC 工作流 (ECC Workflow)

```bash
# 规划功能
/plan "Add team invitations with email notifications"

# 使用 TDD 进行开发
/tdd

# 提交代码前
/code-review
/security-scan

# 发布前
/e2e
/test-coverage
```

## Git 工作流 (Git Workflow)

- `feat:` 新功能，`fix:` 错误修复，`refactor:` 代码重构
- 从 `main` 分支拉取功能分支，必须通过 PR 合并
- CI 运行：Lint 检查、类型检查、单元测试、E2E 测试
- 部署：PR 时触发 Vercel 预览部署，合并至 `main` 时触发正式部署
