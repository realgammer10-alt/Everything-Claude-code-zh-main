# 插件（Plugins）与市场（Marketplaces）

插件通过新的工具和能力扩展了 Claude Code。本指南仅涵盖安装说明——有关何时以及为何使用它们，请参阅[完整文章](https://x.com/affaanmustafa/status/2012378465664745795)。

---

## 市场（Marketplaces）

市场是可安装插件的仓库。

### 添加市场

```bash
# 添加官方 Anthropic 市场
claude plugin marketplace add https://github.com/anthropics/claude-plugins-official

# 添加社区市场（由 @mixedbread-ai 提供的 mgrep）
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep
```

### 推荐市场

| 市场（Marketplace） | 来源（Source） |
|-------------|--------|
| claude-plugins-official | `anthropics/claude-plugins-official` |
| claude-code-plugins | `anthropics/claude-code` |
| Mixedbread-Grep (@mixedbread-ai) | `mixedbread-ai/mgrep` |

---

## 安装插件（Installing Plugins）

```bash
# 打开插件浏览器
/plugins

# 或直接安装
claude plugin install typescript-lsp@claude-plugins-official
```

### 推荐插件

**开发（Development）：**
- `typescript-lsp` - TypeScript 智能提示
- `pyright-lsp` - Python 类型检查
- `hookify` - 通过对话方式创建钩子（Hooks）
- `code-simplifier` - 重构代码

**代码质量（Code Quality）：**
- `code-review` - 代码审查
- `pr-review-toolkit` - PR 自动化工具包
- `security-guidance` - 安全检查指导

**搜索（Search）：**
- `mgrep` - 增强型搜索（优于 ripgrep）
- `context7` - 实时文档查找

**工作流（Workflow）：**
- `commit-commands` - Git 工作流
- `frontend-design` - UI 模式
- `feature-dev` - 功能开发

---

## 快速设置

```bash
# 添加市场
claude plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# 打开 /plugins 并安装你需要的插件
```

---

## 插件文件位置

```
~/.claude/plugins/
|-- cache/                    # 已下载的插件
|-- installed_plugins.json    # 已安装列表
|-- known_marketplaces.json   # 已添加的市场
|-- marketplaces/             # 市场数据
```
