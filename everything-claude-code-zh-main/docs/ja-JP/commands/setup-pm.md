---
description: 设置首选包管理器 (npm/pnpm/yarn/bun)
disable-model-invocation: true
---

# 包管理器配置 (Package Manager Setup)

设置当前项目或全局环境下的首选包管理器 (Package Manager)。

## 使用方法

```bash
# 检测当前的包管理器
node scripts/setup-package-manager.js --detect

# 指定全局配置
node scripts/setup-package-manager.js --global pnpm

# 指定项目配置
node scripts/setup-package-manager.js --project bun

# 列出所有可用的包管理器
node scripts/setup-package-manager.js --list
```

## 检测优先级

在确定要使用的包管理器时，将按以下顺序进行检查：

1. **环境变量**: `CLAUDE_PACKAGE_MANAGER`
2. **项目配置**: `.claude/package-manager.json`
3. **package.json**: `packageManager` 字段
4. **锁定文件 (Lockfile)**: 检测 package-lock.json、yarn.lock、pnpm-lock.yaml、bun.lockb 是否存在
5. **全局配置**: `~/.claude/package-manager.json`
6. **后备方案 (Fallback)**: 使用第一个可用的包管理器（优先级：pnpm > bun > yarn > npm）

## 配置文件

### 全局配置
```json
// ~/.claude/package-manager.json
{
  "packageManager": "pnpm"
}
```

### 项目配置
```json
// .claude/package-manager.json
{
  "packageManager": "bun"
}
```

### package.json
```json
{
  "packageManager": "pnpm@8.6.0"
}
```

## 环境变量

设置 `CLAUDE_PACKAGE_MANAGER` 环境变量将覆盖所有其他检测方法：

```bash
# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"

# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm
```

## 执行检测

若要查看当前包管理器的检测结果，请运行以下命令：

```bash
node scripts/setup-package-manager.js --detect
```
