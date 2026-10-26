---
description: 删除死代码并合并重复项 (Remove dead code and consolidate duplicates)
agent: refactor-cleaner
subtask: true
---

# 重构清理 (Refactor Clean) 命令

分析并清理代码库：$ARGUMENTS

## 你的任务 (Your Task)

1. 使用分析工具**检测死代码 (Dead code)**
2. **识别重复项**与合并机会
3. **安全删除**未使用的代码并记录文档
4. **验证**没有功能被破坏

## 检测阶段 (Detection Phase)

### 运行分析工具

```bash
# 查找未使用的导出 (exports)
npx knip

# 查找未使用的依赖项 (dependencies)
npx depcheck

# 查找未使用的 TypeScript 导出
npx ts-prune
```

### 手动检查

- 未使用的函数（无调用方）
- 未使用的变量
- 未使用的导入 (imports)
- 被注释掉的代码
- 不可达代码 (Unreachable code)
- 未使用的 CSS 类

## 删除阶段 (Removal Phase)

### 删除前准备

1. **搜索用法** - 使用 grep、查找引用 (find references)
2. **检查导出** - 可能被外部使用
3. **验证测试** - 确保没有测试依赖它
4. **记录删除** - git 提交信息 (commit message)

### 安全删除顺序

1. 首先删除未使用的导入 (imports)
2. 删除未使用的私有函数
3. 删除未使用的导出函数
4. 删除未使用的类型/接口 (types/interfaces)
5. 删除未使用的文件

## 合并阶段 (Consolidation Phase)

### 识别重复项

- 具有细微差异的相似函数
- 复制粘贴的代码块
- 重复的模式 (patterns)

### 合并策略

1. **提取工具函数 (Utility function)** - 针对重复逻辑
2. **创建基类 (Base class)** - 针对相似的类
3. **使用高阶函数 (Higher-order functions)** - 针对重复模式
4. **创建共享常量** - 针对魔术值 (magic values)

## 验证 (Verification)

清理完成后：

1. `npm run build` - 成功构建
2. `npm test` - 所有测试通过
3. `npm run lint` - 无新增 lint 错误
4. 手动冒烟测试 (Smoke test) - 功能正常运行

## 报告格式 (Report Format)

```
死代码分析报告 (Dead Code Analysis)
==================

已删除：
- file.ts: functionName (未使用的导出)
- utils.ts: helperFunction (无调用方)

已合并：
- formatDate() 和 formatDateTime() → dateUtils.format()

剩余项（需手动审查）：
- oldComponent.tsx: 可能未使用，需向团队确认
```

---

**注意 (CAUTION)**：删除前务必验证。如有疑问，请询问或添加 `// TODO: verify usage` 注释。
