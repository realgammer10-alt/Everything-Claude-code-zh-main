# Everything Claude Code - OpenCode 指令 (OpenCode Instructions)

本文档整合了 Claude Code 配置中的核心规则与指南，供 OpenCode 使用。

## 安全指南 (Security Guidelines - 关键)

### 强制性安全检查 (Mandatory Security Checks)

在进行任何提交（commit）之前：
- [ ] 无硬编码密钥（API 密钥、密码、令牌）
- [ ] 所有用户输入均已验证
- [ ] 防止 SQL 注入（参数化查询）
- [ ] 防止 XSS（清理 HTML）
- [ ] 已启用 CSRF 保护
- [ ] 身份验证/授权已验证
- [ ] 所有端点均已启用速率限制
- [ ] 错误消息不泄露敏感数据

### 密钥管理 (Secret Management)

```typescript
// 错误：硬编码密钥
const apiKey = "sk-proj-xxxxx"

// 正确：使用环境变量
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('未配置 OPENAI_API_KEY')
}
```

### 安全响应协议 (Security Response Protocol)

如果发现安全问题：
1. 立即停止（STOP）
2. 使用 **security-reviewer** 智能体（Agent）
3. 在继续之前修复关键（CRITICAL）问题
4. 轮换任何暴露的密钥
5. 检查整个代码库是否存在类似问题

---

## 代码风格 (Coding Style)

### 不可变性 (Immutability - 关键)

始终创建新对象，绝不修改原对象（Mutation）：

```javascript
// 错误：直接修改 (Mutation)
function updateUser(user, name) {
  user.name = name  // 修改了原对象！
  return user
}

// 正确：不可变性 (Immutability)
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### 文件组织 (File Organization)

大量小文件 > 少量大文件：
- 高内聚，低耦合
- 通常 200-400 行，最多 800 行
- 从大型组件中提取工具函数（Utilities）
- 按功能/领域组织，而不是按类型

### 错误处理 (Error Handling)

始终全面处理错误：

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('操作失败：', error)
  throw new Error('详细且用户友好的消息')
}
```

### 输入验证 (Input Validation)

始终验证用户输入：

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### 代码质量自检清单 (Code Quality Checklist)

在标记任务完成前：
- [ ] 代码可读且命名规范
- [ ] 函数短小（<50 行）
- [ ] 文件聚焦（<800 行）
- [ ] 无深层嵌套（>4 层）
- [ ] 完善的错误处理
- [ ] 无 `console.log` 语句
- [ ] 无硬编码值
- [ ] 无直接修改（采用不可变模式）

---

## 测试要求 (Testing Requirements)

### 最低测试覆盖率：80%

测试类型（全部必需）：
1. **单元测试 (Unit Tests)** - 独立函数、工具类、组件
2. **集成测试 (Integration Tests)** - API 端点、数据库操作
3. **端到端测试 (E2E Tests)** - 关键用户流程 (Playwright)

### 测试驱动开发 (Test-Driven Development - TDD)

强制执行的工作流：
1. 先写测试（红灯 - RED）
2. 运行测试 - 应该失败（FAIL）
3. 编写最简实现代码（绿灯 - GREEN）
4. 运行测试 - 应该通过（PASS）
5. 重构（改进 - IMPROVE）
6. 验证覆盖率（80%+）

### 测试失败排查

1. 使用 **tdd-guide** 智能体（Agent）
2. 检查测试隔离性
3. 验证模拟（Mocks）是否正确
4. 修复实现代码，而不是测试代码（除非测试代码本身错误）

---

## Git 工作流 (Git Workflow)

### 提交消息格式 (Commit Message Format)

```
<type>: <description>

<optional body>
```

类型（Types）：feat, fix, refactor, docs, test, chore, perf, ci

### 拉取请求工作流 (Pull Request Workflow)

创建 PR 时：
1. 分析完整的提交历史（不仅是最近一次提交）
2. 使用 `git diff [base-branch]...HEAD` 查看所有更改
3. 起草详细的 PR 摘要
4. 包含带有 TODO 的测试计划
5. 如果是新分支，推送时使用 `-u` 参数

### 功能实现工作流 (Feature Implementation Workflow)

1. **先规划 (Plan First)**
   - 使用 **planner** 智能体（Agent）创建实现计划
   - 识别依赖关系和风险
   - 拆分为多个阶段

2. **TDD 方法**
   - 使用 **tdd-guide** 智能体（Agent）
   - 先写测试（红灯 - RED）
   - 实现代码以通过测试（绿灯 - GREEN）
   - 重构（改进 - IMPROVE）
   - 验证 80%+ 覆盖率

3. **代码审查 (Code Review)**
   - 编写代码后立即使用 **code-reviewer** 智能体（Agent）
   - 解决关键（CRITICAL）和高（HIGH）风险问题
   - 尽可能修复中（MEDIUM）风险问题

4. **提交与推送 (Commit & Push)**
   - 详细的提交消息
   - 遵循约定式提交（Conventional Commits）格式

---

## 智能体编排 (Agent Orchestration)

### 可用智能体 (Available Agents)

| 智能体 (Agent) | 用途 | 何时使用 |
|-------|---------|-------------|
| planner | 实现规划 | 复杂功能、重构 |
| architect | 系统设计 | 架构决策 |
| tdd-guide | 测试驱动开发 | 新功能、漏洞修复 |
| code-reviewer | 代码审查 | 编写代码后 |
| security-reviewer | 安全分析 | 提交前 |
| build-error-resolver | 修复构建错误 | 构建失败时 |
| e2e-runner | E2E 测试 | 关键用户流程 |
| refactor-cleaner | 废弃代码清理 | 代码维护 |
| doc-updater | 文档编写 | 更新文档 |
| go-reviewer | Go 代码审查 | Go 项目 |
| go-build-resolver | Go 构建错误 | Go 构建失败 |
| database-reviewer | 数据库优化 | SQL、模式（Schema）设计 |

### 智能体即时使用 (Immediate Agent Usage)

无需用户提示：
1. 复杂功能请求 - 使用 **planner** 智能体
2. 刚刚编写/修改的代码 - 使用 **code-reviewer** 智能体
3. 漏洞修复或新功能 - 使用 **tdd-guide** 智能体
4. 架构决策 - 使用 **architect** 智能体

---

## 性能优化 (Performance Optimization)

### 模型选择策略 (Model Selection Strategy)

**Haiku**（具备 Sonnet 90% 的能力，节省 3 倍成本）：
- 频繁调用的轻量级智能体
- 结对编程与代码生成
- 多智能体系统中的工作智能体

**Sonnet**（最佳编程模型）：
- 主要开发工作
- 编排多智能体工作流
- 复杂的编程任务

**Opus**（最深层的推理）：
- 复杂的架构决策
- 最高推理需求
- 研究与分析任务

### 上下文窗口管理 (Context Window Management)

避免在上下文窗口最后 20% 时进行以下操作：
- 大规模重构
- 跨多个文件的功能实现
- 调试复杂的交互

### 构建问题排查 (Build Troubleshooting)

如果构建失败：
1. 使用 **build-error-resolver** 智能体
2. 分析错误消息
3. 增量修复
4. 每次修复后进行验证

---

## 通用模式 (Common Patterns)

### API 响应格式 (API Response Format)

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### 自定义 Hook 模式 (Custom Hooks Pattern)

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### 存储库模式 (Repository Pattern)

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

---

## OpenCode 特定说明 (OpenCode-Specific Notes)

由于 OpenCode 不支持钩子（Hooks），在 Claude Code 中自动执行的以下操作必须手动完成：

### 编写/编辑代码后
- 运行 `prettier --write <file>` 格式化 JS/TS 文件
- 运行 `npx tsc --noEmit` 检查 TypeScript 错误
- 检查并移除 `console.log` 语句

### 提交前
- 手动运行安全检查
- 验证代码中无密钥
- 运行完整测试套件

### 可用命令 (Commands Available)

在 OpenCode 中使用以下命令：
- `/plan` - 创建实现计划
- `/tdd` - 强制执行 TDD 工作流
- `/code-review` - 审查代码更改
- `/security` - 运行安全审查
- `/build-fix` - 修复构建错误
- `/e2e` - 生成 E2E 测试
- `/refactor-clean` - 移除废弃代码
- `/orchestrate` - 多智能体工作流

---

## 成功指标 (Success Metrics)

符合以下情况即为成功：
- 所有测试通过（80%+ 覆盖率）
- 无安全漏洞
- 代码可读且易于维护
- 性能可接受
- 满足用户需求
