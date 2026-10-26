---
description: 配置包管理器（Package Manager）首选项
agent: build
---

# 设置包管理器（Package Manager）命令

配置你首选的包管理器：$ARGUMENTS

## 你的任务

为项目或全局设置包管理器（Package Manager）首选项。

## 检测顺序

1. **环境变量（Environment variable）**：`CLAUDE_PACKAGE_MANAGER`
2. **项目配置（Project config）**：`.claude/package-manager.json`
3. **package.json**：`packageManager` 字段
4. **锁定文件（Lock file）**：从锁定文件中自动检测
5. **全局配置（Global config）**：`~/.claude/package-manager.json`
6. **备选方案（Fallback）**：第一个可用的包管理器

## 配置选项

### 选项 1：环境变量
```bash
export CLAUDE_PACKAGE_MANAGER=pnpm
```

### 选项 2：项目配置
```bash
# 创建 .claude/package-manager.json
echo '{"packageManager": "pnpm"}' > .claude/package-manager.json
```

### 选项 3：package.json
```json
{
  "packageManager": "pnpm@8.0.0"
}
```

### 选项 4：全局配置
```bash
# 创建 ~/.claude/package-manager.json
echo '{"packageManager": "yarn"}' > ~/.claude/package-manager.json
```

## 支持的包管理器

| 管理器（Manager） | 锁定文件（Lock File） | 命令（Commands） |
|---------|-----------|----------|
| npm | package-lock.json | `npm install`, `npm run` |
| pnpm | pnpm-lock.yaml | `pnpm install`, `pnpm run` |
| yarn | yarn.lock | `yarn install`, `yarn run` |
| bun | bun.lockb | `bun install`, `bun run` |

## 验证

检查当前设置：
```bash
node scripts/setup-package-manager.js --detect
```

---

**提示**：为了保持团队内的一致性，请在 `package.json` 中添加 `packageManager` 字段。
