---
description: 以最小改动修复构建与 TypeScript 错误
agent: build-error-resolver
subtask: true
---

# 构建修复（Build Fix）命令

以最小改动修复构建与 TypeScript 错误：$ARGUMENTS

## 你的任务

1. **运行类型检查**：`npx tsc --noEmit`
2. **收集所有错误**
3. **逐一修复错误**，保持最小改动
4. **验证每次修复**，确保未引入新错误
5. **运行最终检查**，确认所有错误已解决

## 方法论（Approach）

### 建议（DO）：
- ✅ 使用正确的类型修复类型错误
- ✅ 添加缺失的导入（imports）
- ✅ 修复语法错误
- ✅ 保持最小改动
- ✅ 保留现有行为
- ✅ 每次改动后运行 `tsc --noEmit`

### 禁止（DON'T）：
- ❌ 重构（Refactor）代码
- ❌ 添加新功能
- ❌ 更改架构（Architecture）
- ❌ 使用 `any` 类型（除非绝对必要）
- ❌ 添加 `@ts-ignore` 注释
- ❌ 更改业务逻辑

## 常见错误修复

| 错误（Error） | 修复（Fix） |
|-------|-----|
| Type 'X' is not assignable to type 'Y' | 添加正确的类型标注 |
| Property 'X' does not exist | 在接口（interface）中添加属性或修复属性名 |
| Cannot find module 'X' | 安装包或修复导入路径 |
| Argument of type 'X' is not assignable | 进行类型转换或修复函数签名 |
| Object is possibly 'undefined' | 添加空值检查（null check）或可选链（optional chaining） |

## 验证步骤（Verification Steps）

修复后：
1. `npx tsc --noEmit` - 应显示 0 个错误
2. `npm run build` - 应构建成功
3. `npm test` - 测试应仍能通过

---

**重要提示**：仅关注修复错误。禁止重构、禁止改进、禁止架构变更。以最小的差异（diff）使构建通过（Get the build green）。
