# Execute - 多模型协作实现

多模型协作实现 - 从计划获取原型 → Claude 进行重构并实现 → 多模型审计与交付。

$ARGUMENTS

---

## 核心协议

- **语言协议**: 与工具/模型交互时使用**英语**，与用户交流时使用用户的语言。
- **代码主权**: 外部模型对**文件系统具有零写入权限**，所有更改均由 Claude 执行。
- **脏原型重构**: 将 Codex/Gemini 的统一差分（Unified Diff）视为“脏原型（Dirty Prototype）”，必须重构为生产级代码。
- **止损机制**: 在当前阶段的输出通过验证之前，不得进入下一阶段。
- **前提条件**: 仅在用户对 `/ccg:plan` 的输出明确回复“Y”后执行（若缺失则需先进行确认）。

---

## 多模型调用规范

**调用语法**（并行：使用 `run_in_background: true`）：

```
# 会话恢复调用（推荐） - 实现原型
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <任务说明>
Context: <计划内容 + 目标文件>
</TASK>
OUTPUT: 仅输出统一差分补丁。严禁进行实际更改。
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要说明"
})

# 新会话调用 - 实现原型
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}- \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <任务说明>
Context: <计划内容 + 目标文件>
</TASK>
OUTPUT: 仅输出统一差分补丁。严禁进行实际更改。
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要说明"
})
```

**审计调用语法**（代码审查/审计）：

```
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Scope: 审计最终的代码更改。
Inputs:
- 已应用的补丁 (git diff / 最终统一差分)
- 已更改的文件 (根据需要提供相关片段)
Constraints:
- 不得修改文件。
- 不得输出基于文件系统访问权限的工具命令。
</TASK>
OUTPUT:
1) 优先级排序的问题列表（严重程度、文件、依据）
2) 具体修复建议；如果需要更改代码，请在围栏代码块中包含统一差分补丁。
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要说明"
})
```

**模型参数注意事项**:
- `{{GEMINI_MODEL_FLAG}}`: 使用 `--backend gemini` 时，替换为 `--gemini-model gemini-3-pro-preview`（注意末尾空格）；使用 codex 时为空字符串。

**角色提示词 (Role Prompt)**:

| 阶段 | Codex | Gemini |
|-------|-------|--------|
| 实现 | `~/.claude/.ccg/prompts/codex/architect.md` | `~/.claude/.ccg/prompts/gemini/frontend.md` |
| 评审 | `~/.claude/.ccg/prompts/codex/reviewer.md` | `~/.claude/.ccg/prompts/gemini/reviewer.md` |

**会话复用**: 如果 `/ccg:plan` 提供了 SESSION_ID，请使用 `resume <SESSION_ID>` 来复用上下文。

**后台任务等待**（最大超时 600000ms = 10 分钟）：

```
TaskOutput({ task_id: "<task_id>", block: true, timeout: 600000 })
```

**重要**:
- 必须指定 `timeout: 600000`。如果不指定，默认会在 30 秒后提前超时。
- 10 分钟后若仍未完成，请通过 `TaskOutput` 继续轮询，**不要强制终止进程**。
- 如果由于超时跳过了等待，**必须调用 `AskUserQuestion` 询问用户是继续等待还是强制终止任务**。

---

## 执行工作流

**执行任务**: $ARGUMENTS

### 阶段 0: 读取计划

`[Mode: Prepare]`

1. **识别输入类型**:
   - 计划文件路径（例如：`.claude/plan/xxx.md`）
   - 直接任务说明

2. **读取计划内容**:
   - 若提供计划文件路径，进行读取和解析。
   - 提取：任务类型、实现步骤、关键文件、SESSION_ID。

3. **执行前确认**:
   - 若输入为“直接任务说明”，或者计划中缺失 `SESSION_ID` / 关键文件：先向用户确认。
   - 若无法确认用户已对计划回复“Y”：在推进前需再次确认。

4. **任务类型路由**:

   | 任务类型 | 检测特征 | 路由目标 |
   |-----------|-----------|-------|
   | **前端** | 页面、组件、UI、样式、布局 | Gemini |
   | **后端** | API、接口、数据库、逻辑、算法 | Codex |
   | **全栈** | 同时包含前端和后端内容 | Codex ∥ Gemini 并行 |

---

### 阶段 1: 快速上下文获取

`[Mode: Retrieval]`

**必须使用 MCP 工具进行快速上下文获取。严禁逐个手动读取文件。**

根据计划中的“关键文件”列表，调用 `mcp__ace-tool__search_context`：

```
mcp__ace-tool__search_context({
  query: "<基于计划内容的语义查询，包含关键文件、模块、函数名等>",
  project_root_path: "$PWD"
})
```

**获取策略**:
- 从计划的“关键文件”表格中提取目标路径。
- 构建覆盖范围的语义查询：入口文件、依赖模块、相关类型定义。
- 若结果不足，追加 1-2 次递归获取。
- **绝不**使用 Bash + find/ls 手动探索项目结构。

**获取后**:
- 整理获取的代码片段。
- 确认实现所需的完整上下文。
- 进入阶段 3。

---

### 阶段 3: 获取原型

`[Mode: Prototype]`

**根据任务类型进行路由**:

#### 路由 A: 前端/UI/样式 → Gemini

**限制**: 上下文 < 32k tokens

1. 调用 Gemini（使用 `~/.claude/.ccg/prompts/gemini/frontend.md`）。
2. 输入：计划内容 + 已获取的上下文 + 目标文件。
3. OUTPUT: `仅输出统一差分补丁。严禁进行实际更改。`。
4. **Gemini 是前端设计的权威，其 CSS/React/Vue 原型是最终视觉基准。**
5. **警告**: 忽略 Gemini 的后端逻辑建议。
6. 若计划包含 `GEMINI_SESSION`：优先使用 `resume <GEMINI_SESSION>`。

#### 路由 B: 后端/逻辑/算法 → Codex

1. 调用 Codex（使用 `~/.claude/.ccg/prompts/codex/architect.md`）。
2. 输入：计划内容 + 已获取的上下文 + 目标文件。
3. OUTPUT: `仅输出统一差分补丁。严禁进行实际更改。`。
4. **Codex 是后端逻辑的权威，利用其逻辑推理和调试能力。**
5. 若计划包含 `CODEX_SESSION`：优先使用 `resume <CODEX_SESSION>`。

#### 路由 C: 全栈 → 并行调用

1. **并行调用** (`run_in_background: true`)：
   - Gemini：处理前端部分。
   - Codex：处理后端部分。
2. 通过 `TaskOutput` 等待两个模型的完整结果。
3. 分别使用计划中对应的 `SESSION_ID` 进行 `resume`（若缺失则创建新会话）。

**请遵守上述“多模型调用规范”中的“重要”指示。**

---

### 阶段 4: 代码实现

`[Mode: Implement]`

**作为代码主权者的 Claude 执行以下步骤**:

1. **读取差分**: 解析 Codex/Gemini 返回的统一差分补丁。

2. **思维沙盒 (Mental Sandbox)**:
   - 模拟将差分应用到目标文件。
   - 检查逻辑一致性。
   - 识别潜在冲突或副作用。

3. **重构与清理**:
   - 将“脏原型”重构为**高可读性、可维护性、企业级**的代码。
   - 删除冗余代码。
   - 确保符合项目现有的代码标准。
   - **除非必要，否则不生成注释/文档**，代码应具有自解释性。

4. **最小范围原则**:
   - 更改仅限于需求范围内。
   - **必须评审**副作用。
   - 执行针对性修复。

5. **应用更改**:
   - 使用 Edit/Write 工具执行实际更改。
   - **仅更改必要的代码**，不影响用户现有的其他功能。

6. **自我验证**（强烈推荐）：
   - 运行项目现有的 lint / typecheck / tests（优先执行最小相关范围）。
   - 若失败：先修复回归（Regression），然后再进入阶段 5。

---

### 阶段 5: 审计与交付

`[Mode: Audit]`

#### 5.1 自动审计

**在更改生效后，必须立即并行调用 Codex 和 Gemini 进行代码审查**:

1. **Codex 评审** (`run_in_background: true`)：
   - ROLE_FILE: `~/.claude/.ccg/prompts/codex/reviewer.md`
   - 输入：已更改的差分 + 目标文件。
   - 重点：安全性、性能、错误处理、逻辑正确性。

2. **Gemini 评审** (`run_in_background: true`)：
   - ROLE_FILE: `~/.claude/.ccg/prompts/gemini/reviewer.md`
   - 输入：已更改的差分 + 目标文件。
   - 重点：可访问性（Accessibility）、设计一致性、用户体验。

通过 `TaskOutput` 等待两个模型的完整评审结果。为了保持上下文一致性，优先复用阶段 3 的会话 (`resume <SESSION_ID>`)。

#### 5.2 集成与修正

1. 集成 Codex + Gemini 的评审反馈。
2. 基于信任规则进行加权：后端听从 Codex，前端听从 Gemini。
3. 执行必要的修正。
4. 根据需要重复阶段 5.1（直到风险在可接受范围内）。

#### 5.3 交付确认

审计通过后，向用户报告：

```markdown
## 实现完成

### 更改摘要
| 文件 | 操作 | 说明 |
|------|-----------|-------------|
| path/to/file.ts | 变更 | 说明 |

### 审计结果
- Codex: <通过 / 发现 N 个问题>
- Gemini: <通过 / 发现 N 个问题>

### 建议操作
1. [ ] <建议的测试步骤>
2. [ ] <建议的验证步骤>
```

---

## 重要规则

1. **代码主权** – 所有文件更改均由 Claude 执行，外部模型具有零写入权限。
2. **脏原型重构** – 将 Codex/Gemini 的输出视为草稿，必须进行重构。
3. **信任规则** – 后端听从 Codex，前端听从 Gemini。
4. **最小化更改** – 仅更改必要代码，无副作用。
5. **强制审计** – 更改后必须进行多模型代码评审。

---

## 使用方法

```bash
# 执行计划文件
/ccg:execute .claude/plan/feature-name.md

# 直接执行任务（针对上下文中已讨论过的计划）
/ccg:execute 根据之前的计划实现用户认证
```

---

## 与 /ccg:plan 的关系

1. `/ccg:plan` 生成计划 + SESSION_ID。
2. 用户回复“Y”进行确认。
3. `/ccg:execute` 读取计划，复用 SESSION_ID 并执行实现。
