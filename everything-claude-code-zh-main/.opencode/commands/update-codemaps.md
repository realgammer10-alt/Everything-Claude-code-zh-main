---
description: 更新代码映射（Codemaps）以进行代码库导航
agent: doc-updater
subtask: true
---

# 更新代码映射（Update Codemaps）命令

更新代码映射以反映当前代码库结构：$ARGUMENTS

## 你的任务

在 `docs/CODEMAPS/` 目录下生成或更新代码映射（Codemaps）：

1. **分析代码库结构**
2. **生成组件映射**
3. **记录组件关系**
4. **更新导航指南**

## 代码映射类型

### 架构映射（Architecture Map）
```
docs/CODEMAPS/ARCHITECTURE.md
```
- 高层级系统概览
- 组件关系
- 数据流图

### 模块映射（Module Map）
```
docs/CODEMAPS/MODULES.md
```
- 模块描述
- 公共 API
- 依赖项

### 文件映射（File Map）
```
docs/CODEMAPS/FILES.md
```
- 目录结构
- 文件用途
- 核心文件

## 代码映射格式

### [模块名称]

**用途（Purpose）**: [简要描述]

**位置（Location）**: `src/[path]/`

**核心文件（Key Files）**:
- `file1.ts` - [用途]
- `file2.ts` - [用途]

**依赖项（Dependencies）**:
- [模块 A]
- [模块 B]

**导出（Exports）**:
- `functionName()` - [描述]
- `ClassName` - [描述]

**用法示例**:
```typescript
import { functionName } from '@/module'
```

## 生成过程

1. 扫描目录结构
2. 解析导入/导出（Imports/Exports）
3. 构建依赖图
4. 生成 Markdown 映射文件
5. 验证链接

---

**提示（TIP）**: 在添加新模块或进行重大重构时，请保持代码映射（Codemaps）的同步更新。
