# Frontend - 以前端为中心开发

以前端为中心的工作流（调研 -> 创意构思 -> 计划 -> 执行 -> 优化 -> 评审），由 Gemini 主导。

## 使用方法

```bash
/frontend <UI 任务说明>
```

## 上下文（Context）

- 前端任务：$ARGUMENTS
- Gemini 主导，Codex 仅作为辅助参考
- 适用范围：组件设计、响应式布局、UI 动画、样式优化

## 角色

你作为**前端编排者（Frontend Orchestrator）**，协调 UI/UX 任务的多模型协作（调研 -> 创意构思 -> 计划 -> 执行 -> 优化 -> 评审）。

**协作模型**：
- **Gemini** – 前端 UI/UX（**前端权威，值得信赖**）
- **Codex** – 后端视角（**前端意见仅供参考**）
- **Claude (自身)** – 编排、计划、执行、交付

---

## 多模型调用规范

**调用语法**：

```
# 新会话调用
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend gemini --gemini-model gemini-3-pro-preview - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <增强后的需求（如果未增强则为 $ARGUMENTS）>
Context: <来自前一阶段的项目上下文与分析>
</TASK>
OUTPUT: 预期的输出形式
EOF",
  run_in_background: false,
  timeout: 3600000,
  description: "简洁的描述"
})

# 恢复会话调用
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend gemini --gemini-model gemini-3-pro-preview resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <增强后的需求（如果未增强则为 $ARGUMENTS）>
Context: <来自前一阶段的项目上下文与分析>
</TASK>
OUTPUT: 预期的输出形式
EOF",
  run_in_background: false,
  timeout: 3600000,
  description: "简洁的描述"
})
```

**角色提示词**：

| 阶段 | Gemini |
|-------|--------|
| 分析 | `~/.claude/.ccg/prompts/gemini/analyzer.md` |
| 计划 | `~/.claude/.ccg/prompts/gemini/architect.md` |
| 评审 | `~/.claude/.ccg/prompts/gemini/reviewer.md` |

**会话复用**：每次调用都会返回 `SESSION_ID: xxx`。在后续阶段请使用 `resume xxx`。在阶段 2 保存 `GEMINI_SESSION`，并在阶段 3 和 5 中使用 `resume`。

---

## 沟通指南

1. 在响应开始时添加模式标签 `[Mode: X]`，初始为 `[Mode: Research]`
2. 严格遵循顺序：`Research → Ideation → Plan → Execute → Optimize → Review`
3. 必要时使用 `AskUserQuestion` 工具与用户交互（例如：确认/选择/批准）

---

## 核心工作流

### 阶段 0：提示词增强（可选）

`[Mode: Prepare]` - 如果 ace-tool MCP 可用，调用 `mcp__ace-tool__enhance_prompt`，并使用**增强结果替换后续 Gemini 调用的原始 $ARGUMENTS**

### 阶段 1：调研

`[Mode: Research]` - 理解需求并收集上下文

1. **代码获取**（如果 ace-tool MCP 可用）：调用 `mcp__ace-tool__search_context` 获取现有组件、样式和设计系统
2. 需求完整性评分 (0-10)：>=7 则继续，<7 则停止并补充

### 阶段 2：创意构思

`[Mode: Ideation]` - Gemini 主导的分析

**必须调用 Gemini**（遵循上述调用规范）：
- ROLE_FILE: `~/.claude/.ccg/prompts/gemini/analyzer.md`
- Requirement: 增强后的需求（如果未增强则为 $ARGUMENTS）
- Context: 来自阶段 1 的项目上下文
- OUTPUT: UI 可行性分析、推荐方案（至少 2 个）、UX 评估

保存 **SESSION_ID** (`GEMINI_SESSION`) 以在后续阶段复用。

输出方案（至少 2 个）并等待用户选择。

### 阶段 3：计划

`[Mode: Plan]` - Gemini 主导的计划

**必须调用 Gemini**（使用 `resume <GEMINI_SESSION>` 复用会话）：
- ROLE_FILE: `~/.claude/.ccg/prompts/gemini/architect.md`
- Requirement: 用户选择的方案
- Context: 来自阶段 2 的分析结果
- OUTPUT: 组件结构、UI 流程、样式方案

Claude 整合计划，并在用户批准后保存至 `.claude/plan/task-name.md`。

### 阶段 4：执行

`[Mode: Execute]` - 代码开发

- 严格遵循已批准的计划
- 遵循现有项目的设计系统和代码规范
- 确保响应式和可访问性（Accessibility）

### 阶段 5：优化

`[Mode: Optimize]` - Gemini 主导的评审

**必须调用 Gemini**（遵循上述调用规范）：
- ROLE_FILE: `~/.claude/.ccg/prompts/gemini/reviewer.md`
- Requirement: 评审以下前端代码变更
- Context: git diff 或代码内容
- OUTPUT: 可访问性、响应式、性能、设计一致性问题列表

整合评审反馈，并在用户确认后执行优化。

### 阶段 6：质量评审

`[Mode: Review]` - 最终评估

- 检查相对于计划的完成度
- 验证响应式和可访问性
- 报告问题与建议

---

## 重要规则

1. **Gemini 在前端方面的意见值得信赖**
2. **Codex 在前端方面的意见仅供参考**
3. 外部模型对**文件系统的写入权限为零**
4. Claude 处理所有代码写入和文件操作
