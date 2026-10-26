# Plan - 多模型协同规划

多模型协同规划 - 上下文获取 + 双模型分析 → 生成分步实施计划。

$ARGUMENTS

---

## 核心协议

- **语言协议**: 与工具/模型交互时使用**英语（English）**，与用户交流时使用用户的母语。
- **强制并行**: 调用 Codex/Gemini 时必须使用 `run_in_background: true`（包括单模型调用，以避免阻塞主线程）。
- **代码主权**: 外部模型**对文件系统零写入权限**，所有变更均由 Claude 执行。
- **损耗限制机制**: 在当前阶段的输出经过验证之前，不得进入下一阶段。
- **仅限规划**: 此命令允许读取上下文并写入 `.claude/plan/*` 规划文件，但**不得修改生产代码**。

---

## 多模型调用规范

**调用语法**（并行：使用 `run_in_background: true`）：

```
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}- \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <强化后的需求>
Context: <获取的项目上下文>
</TASK>
OUTPUT: 包含伪代码的分步实施计划。不得修改文件。
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要说明"
})
```

**模型参数注意事项**：
- `{{GEMINI_MODEL_FLAG}}`：使用 `--backend gemini` 时，替换为 `--gemini-model gemini-3-pro-preview`（注意末尾空格）；对于 codex，使用空字符串。

**角色提示词（Role Prompts）**：

| 阶段 | Codex | Gemini |
|-------|-------|--------|
| 分析 | `~/.claude/.ccg/prompts/codex/analyzer.md` | `~/.claude/.ccg/prompts/gemini/analyzer.md` |
| 规划 | `~/.claude/.ccg/prompts/codex/architect.md` | `~/.claude/.ccg/prompts/gemini/architect.md` |

**会话复用**：每次调用都会返回 `SESSION_ID: xxx`（通常由封装器输出），**必须保存**以便后续使用 `/ccg:execute`。

**等待后台任务**（最大超时 600000ms = 10 分钟）：

```
TaskOutput({ task_id: "<task_id>", block: true, timeout: 600000 })
```

**重要提示**：
- 必须指定 `timeout: 600000`。如果不指定，默认的 30 秒会导致过早超时。
- 如果 10 分钟后仍未完成，请通过 `TaskOutput` 继续轮询，**不要强制终止进程**。
- 如果因超时跳过等待，**必须调用 `AskUserQuestion` 询问用户是继续等待还是强制终止任务**。

---

## 执行工作流

**规划任务**: $ARGUMENTS

### 阶段 1：完整上下文获取（Context Acquisition）

`[Mode: Research]`

#### 1.1 提示词强化（必须首先执行）

**必须调用 `mcp__ace-tool__enhance_prompt` 工具**：

```
mcp__ace-tool__enhance_prompt({
  prompt: "$ARGUMENTS",
  conversation_history: "<最近 5-10 个对话轮次>",
  project_root_path: "$PWD"
})
```

等待强化后的提示词，并**在后续所有阶段中用强化结果替换原始 $ARGUMENTS**。

#### 1.2 上下文检索

**调用 `mcp__ace-tool__search_context` 工具**：

```
mcp__ace-tool__search_context({
  query: "<基于强化需求的语义查询>",
  project_root_path: "$PWD"
})
```

- 使用自然语言构建语义查询（Where/What/How）。
- **严禁基于假设进行回答**。
- 如果 MCP 不可用：回退到 Glob + Grep 进行文件检测和关键符号定位。

#### 1.3 完整性检查

- 必须获取相关类、函数、变量的**完整定义和签名**。
- 如果上下文不足，触发**递归获取**。
- 优先级输出：入口文件 + 行号 + 关键符号名；仅在消除歧义时添加最小的代码片段。

#### 1.4 需求对齐

- 如果需求仍存在歧义，**务必**向用户输出引导性问题。
- 直到需求边界清晰（无遗漏、无冗余）。

### 阶段 2：多模型协同分析

`[Mode: Analysis]`

#### 2.1 输入分配

**并行调用 Codex 和 Gemini**（`run_in_background: true`）：

将**原始需求**（无预设意见）分配给两个模型：

1. **Codex 后端分析**：
   - ROLE_FILE: `~/.claude/.ccg/prompts/codex/analyzer.md`
   - 关注点：技术可行性、架构影响、性能考虑、潜在风险。
   - 输出（OUTPUT）：多维方案 + 优缺点分析。

2. **Gemini 前端分析**：
   - ROLE_FILE: `~/.claude/.ccg/prompts/gemini/analyzer.md`
   - 关注点：UI/UX 影响、用户体验、视觉设计。
   - 输出（OUTPUT）：多维方案 + 优缺点分析。

使用 `TaskOutput` 等待两个模型的完整结果。保存 **SESSION_ID**（`CODEX_SESSION` 和 `GEMINI_SESSION`）。

#### 2.2 交叉验证（Cross-Validation）

整合观点并迭代优化：

1. **确定共识**（强信号）。
2. **识别分歧**（需要权衡）。
3. **优势互补**：后端逻辑遵循 Codex，前端设计遵循 Gemini。
4. **逻辑推理**：消除方案中的逻辑缺口。

#### 2.3 （可选但推荐）双模型规划草案

为了降低 Claude 整合规划时的遗漏风险，可以让两个模型并行输出“规划草案”（但**不允许**修改文件）：

1. **Codex 规划草案**（后端权威）：
   - ROLE_FILE: `~/.claude/.ccg/prompts/codex/architect.md`
   - 输出（OUTPUT）：分步计划 + 伪代码（关注：数据流/边缘案例/错误处理/测试策略）。

2. **Gemini 规划草案**（前端权威）：
   - ROLE_FILE: `~/.claude/.ccg/prompts/gemini/architect.md`
   - 输出（OUTPUT）：分步计划 + 伪代码（关注：信息架构/交互/无障碍/视觉一致性）。

使用 `TaskOutput` 等待两个模型的完整结果，并记录建议中的主要差异。

#### 2.4 生成实施计划（Claude 最终版本）

整合两方的分析，生成**分步实施计划**：

```markdown
## 实施计划：<任务名称>

### 任务类型
- [ ] 前端 (→ Gemini)
- [ ] 后端 (→ Codex)
- [ ] 全栈 (→ 并行)

### 技术方案
<从 Codex + Gemini 分析中整合的最优方案>

### 实施步骤
1. <步骤 1> - 预期成果
2. <步骤 2> - 预期成果
...

### 关键文件
| 文件 | 操作 | 说明 |
|------|-----------|-------------|
| path/to/file.ts:L10-L50 | 修改 | 说明 |

### 风险与缓解措施
| 风险 | 缓解措施 |
|------|------------|

### SESSION_ID (用于 /ccg:execute)
- CODEX_SESSION: <session_id>
- GEMINI_SESSION: <session_id>
```

### 阶段 2 结束：交付规划（非实施）

**`/ccg:plan` 的职责至此结束。必须执行以下操作**：

1. 向用户展示完整的实施计划（包含伪代码）。
2. 将计划保存到 `.claude/plan/<feature-name>.md`（从需求中提取功能名称，例如 `user-auth`、`payment-module`）。
3. 使用**粗体文本**输出提示（**必须使用保存的实际文件路径**）：

   ---
   **规划已生成并保存至 `.claude/plan/actual-feature-name.md`**

   **请审查上方规划。您可以：**
   - **修改规划**：告诉我需要调整的地方，我将更新规划。
   - **执行规划**：将以下命令复制到新会话中：

   ```
   /ccg:execute .claude/plan/actual-feature-name.md
   ```
   ---

   **注意**：上方的 `actual-feature-name.md` 必须替换为实际保存的文件名！

4. **立即结束当前响应**（在此停止，不再进行任何工具调用）。

**绝对禁止**：
- 询问用户“Y/N”后自动执行（执行是 `/ccg:execute` 的职责）。
- 对生产代码进行写入操作。
- 自动调用 `/ccg:execute` 或任何实施操作。
- 在用户未明确要求修改的情况下，持续触发模型调用。

---

## 规划保存

规划完成后，将其保存至：

- **初始规划**：`.claude/plan/<feature-name>.md`
- **迭代版本**：`.claude/plan/<feature-name>-v2.md`、`.claude/plan/<feature-name>-v3.md` ...

必须在向用户展示规划之前完成规划文件的写入。

---

## 规划变更流

如果用户要求修改规划：

1. 根据用户反馈调整规划内容。
2. 更新 `.claude/plan/<feature-name>.md` 文件。
3. 重新展示修改后的规划。
4. 再次提示用户审查或执行。

---

## 下一步

用户批准后，**手动**执行：

```bash
/ccg:execute .claude/plan/<feature-name>.md
```

---

## 重要规则

1. **仅限规划，严禁实施** – 此命令不会执行任何代码修改。
2. **无需 Y/N 提示** – 仅展示规划，由用户决定下一步操作。
3. **信任规则** – 后端遵循 Codex，前端遵循 Gemini。
4. 外部模型**对文件系统零写入权限**。
5. **SESSION_ID 传递** – 规划最后必须包含 `CODEX_SESSION` / `GEMINI_SESSION`（以便使用 `/ccg:execute resume <SESSION_ID>`）。
