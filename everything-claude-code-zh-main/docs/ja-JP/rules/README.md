# 规则 (Rules)

## 结构 (Structure)

规则由 **通用 (common)** 层和 **语言特定 (language-specific)** 目录组成：

```
rules/
├── common/          # 与语言无关的原则（始终安装）
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md
│   ├── performance.md
│   ├── patterns.md
│   ├── hooks.md
│   ├── agents.md
│   └── security.md
├── typescript/      # TypeScript/JavaScript 特定
├── python/          # Python 特定
└── golang/          # Go 特定
```

- **common/** 包含普适性原则。不包含特定语言的代码示例。
- **语言目录** 通过框架特定的模式、工具和代码示例扩展通用规则。每个文件都会引用对应的 common 文件。

## 安装 (Installation)

### 选项 1：安装脚本（推荐）

```bash
# 安装 common + 一个或多个语言特定规则集
./install.sh typescript
./install.sh python
./install.sh golang

# 一次性安装多种语言
./install.sh typescript python
```

### 选项 2：手动安装

> **重要：** 请务必复制整个目录。请勿使用 `/*` 进行平铺复制。
> 通用 (Common) 和语言特定目录中包含同名文件。
> 如果将它们平铺到单个目录中，语言特定文件将覆盖通用规则，
> 并且语言特定文件使用的相对路径 `../common/` 引用将会失效。

```bash
# 安装通用规则（所有项目必需）
cp -r rules/common ~/.claude/rules/common

# 根据项目的技术栈安装语言特定规则
cp -r rules/typescript ~/.claude/rules/typescript
cp -r rules/python ~/.claude/rules/python
cp -r rules/golang ~/.claude/rules/golang

# 注意！请根据实际项目需求进行配置。此处的配置仅为参考示例。
```

## 规则 (Rules) vs 技能 (Skills)

- **规则 (Rules)** 定义了广泛适用的标准、规范和检查清单（例如：“80% 测试覆盖率”、“禁止硬编码机密信息”）。
- **技能 (Skills)**（`skills/` 目录）为特定任务提供详细且可执行的参考资料（例如：`python-patterns`、`golang-testing`）。

语言特定的规则文件会根据需要引用相关的技能。规则说明 *做什么 (what)*，而技能说明 *如何做 (how)*。

## 添加新语言

要添加对新语言（例如 `rust/`）的支持：

1. 创建 `rules/rust/` 目录
2. 添加扩展通用规则的文件：
   - `coding-style.md` — 格式化工具、惯用写法、错误处理模式
   - `testing.md` — 测试框架、覆盖率工具、测试配置
   - `patterns.md` — 语言特定的设计模式
   - `hooks.md` — 用于格式化程序、代码检查器（Linter）、类型检查器的 PostToolUse 钩子 (Hooks)
   - `security.md` — 机密管理、安全扫描工具
3. 每个文件请以此内容开头：
   ```
   > 本文件使用 <语言> 特定内容扩展 [common/xxx.md](../common/xxx.md)。
   ```
4. 引用现有的可用技能，或在 `skills/` 下创建新技能。
