---
name: skill-create
description: 分析本地 git 历史以提取编码模式（Coding Patterns）并生成 SKILL.md 文件。这是 Skill Creator GitHub App 的本地版本。
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /skill-create - 本地技能生成

分析代码库的 git 历史以提取编码模式（Coding Patterns），并生成 SKILL.md 文件，用于向 Claude 传授团队的最佳实践（Practices）。

## 使用方法

```bash
/skill-create                    # 分析当前代码库
/skill-create --commits 100      # 分析最近 100 个提交
/skill-create --output ./skills  # 自定义输出目录
/skill-create --instincts        # 同时为 continuous-learning-v2 生成直觉（Instincts）
```

## 运行内容

1. **解析 Git 历史** - 分析提交（Commits）、文件变更和模式。
2. **检测模式** - 识别重复的工作流（Workflows）和约定。
3. **生成 SKILL.md** - 创建有效的 Claude Code 技能（Skill）文件。
4. **可选生成直觉（Instincts）** - 用于 continuous-learning-v2 系统。

## 分析步骤

### 步骤 1: 收集 Git 数据

```bash
# 获取包含文件变更的最近提交
git log --oneline -n ${COMMITS:-200} --name-only --pretty=format:"%H|%s|%ad" --date=short

# 获取各文件的提交频率
git log --oneline -n 200 --name-only | grep -v "^$" | grep -v "^[a-f0-9]" | sort | uniq -c | sort -rn | head -20

# 获取提交消息模式
git log --oneline -n 200 | cut -d' ' -f2- | head -50
```

### 步骤 2: 检测模式

寻找以下模式类型：

| 模式 | 检测方法 |
|---------|-----------------|
| **提交规范** | 提交消息的正则表达式 (feat:, fix:, chore:) |
| **文件共变** | 总是同时变更的文件 |
| **工作流序列** | 重复的文件变更模式 |
| **架构** | 文件夹结构和命名约定 |
| **测试模式** | 测试文件位置、命名、覆盖率 |

### 步骤 3: 生成 SKILL.md

输出格式：

```markdown
---
name: {repo-name}-patterns
description: 从 {repo-name} 提取的编码模式
version: 1.0.0
source: local-git-analysis
analyzed_commits: {count}
---

# {Repo Name} Patterns

## 提交规范
{检测到的提交消息模式}

## 代码架构
{检测到的文件夹结构与组成}

## 工作流
{检测到的重复文件变更模式}

## 测试模式
{检测到的测试规范}
```

### 步骤 4: 生成直觉（Instincts）（使用 --instincts 时）

用于 continuous-learning-v2 集成：

```yaml
---
id: {repo}-commit-convention
trigger: "when writing a commit message"
confidence: 0.8
domain: git
source: local-repo-analysis
---

# 使用约定式提交（Conventional Commits）

## Action
提交前缀：feat:, fix:, chore:, docs:, test:, refactor:

## Evidence
- 分析了 {n} 个提交
- {percentage}% 遵循约定式提交格式
```

## 输出示例

在 TypeScript 项目中运行 `/skill-create` 可能会生成类似以下的输出：

```markdown
---
name: my-app-patterns
description: 来自 my-app 代码库的编码模式
version: 1.0.0
source: local-git-analysis
analyzed_commits: 150
---

# My App Patterns

## 提交规范

该项目使用**约定式提交（conventional commits）**:
- `feat:` - 新功能
- `fix:` - 错误修复
- `chore:` - 维护任务
- `docs:` - 文档更新

## 代码架构

```
src/
├── components/     # React 组件 (PascalCase.tsx)
├── hooks/          # 自定义 Hook (use*.ts)
├── utils/          # 工具函数
├── types/          # TypeScript 类型定义
└── services/       # API 与外部服务
```

## 工作流

### 添加新组件
1. 创建 `src/components/ComponentName.tsx`
2. 在 `src/components/__tests__/ComponentName.test.tsx` 中添加测试
3. 从 `src/components/index.ts` 导出

### 数据库迁移
1. 修改 `src/db/schema.ts`
2. 运行 `pnpm db:generate`
3. 运行 `pnpm db:migrate`

## 测试模式

- 测试文件：`__tests__/` 目录或 `.test.ts` 后缀
- 覆盖率目标：80% 以上
- 框架：Vitest
```

## GitHub App 集成

如需高级功能（10k+ 提交、团队共享、自动 PR），请使用 [Skill Creator GitHub App](https://github.com/apps/skill-creator)：

- 安装：[github.com/apps/skill-creator](https://github.com/apps/skill-creator)
- 在任何 issue 中评论 `/skill-creator analyze`
- 接收包含生成的技能（Skill）的 PR

## 相关命令

- `/instinct-import` - 导入生成的直觉（Instincts）
- `/instinct-status` - 显示已学习的直觉（Instincts）
- `/evolve` - 将直觉（Instincts）聚类为技能（Skill）/智能体（Agent）

---

*[Everything Claude Code](https://github.com/affaan-m/everything-claude-code) 的一部分*
