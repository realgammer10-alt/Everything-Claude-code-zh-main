# PM2 初始化

自动分析项目并生成 PM2 服务命令。

**命令**: `$ARGUMENTS`

---

## 工作流

1. 检查 PM2（如果缺失则通过 `npm install -g pm2` 安装）
2. 扫描项目以识别服务（前端/后端/数据库）
3. 生成配置文件和独立的命令文件

---

## 服务检测

| 类型 | 检测依据 | 默认端口 |
|------|-----------|--------------|
| Vite | vite.config.* | 5173 |
| Next.js | next.config.* | 3000 |
| Nuxt | nuxt.config.* | 3000 |
| CRA | package.json 中的 react-scripts | 3000 |
| Express/Node | server/backend/api 目录 + package.json | 3000 |
| FastAPI/Flask | requirements.txt / pyproject.toml | 8000 |
| Go | go.mod / main.go | 8080 |

**端口检测优先级**: 用户指定 > .env > 配置文件 > 脚本参数 > 默认端口

---

## 生成的文件

```
project/
├── ecosystem.config.cjs              # PM2 配置
├── {backend}/start.cjs               # Python 包装器（如果适用）
└── .claude/
    ├── commands/
    │   ├── pm2-all.md                # 启动全部 + monit
    │   ├── pm2-all-stop.md           # 停止全部
    │   ├── pm2-all-restart.md        # 重启全部
    │   ├── pm2-{port}.md             # 单个启动 + 日志
    │   ├── pm2-{port}-stop.md        # 单个停止
    │   ├── pm2-{port}-restart.md     # 单个重启
    │   ├── pm2-logs.md               # 显示所有日志
    │   └── pm2-status.md             # 显示状态
    └── scripts/
        ├── pm2-logs-{port}.ps1       # 单个服务日志
        └── pm2-monit.ps1             # PM2 监控器
```

---

## Windows 设置（重要）

### ecosystem.config.cjs

**必须使用 `.cjs` 扩展名**

```javascript
module.exports = {
  apps: [
    // Node.js (Vite/Next/Nuxt)
    {
      name: 'project-3000',
      cwd: './packages/web',
      script: 'node_modules/vite/bin/vite.js',
      args: '--port 3000',
      interpreter: 'C:/Program Files/nodejs/node.exe',
      env: { NODE_ENV: 'development' }
    },
    // Python
    {
      name: 'project-8000',
      cwd: './backend',
      script: 'start.cjs',
      interpreter: 'C:/Program Files/nodejs/node.exe',
      env: { PYTHONUNBUFFERED: '1' }
    }
  ]
}
```

**框架脚本路径:**

| 框架 | script | args |
|-----------|--------|------|
| Vite | `node_modules/vite/bin/vite.js` | `--port {port}` |
| Next.js | `node_modules/next/dist/bin/next` | `dev -p {port}` |
| Nuxt | `node_modules/nuxt/bin/nuxt.mjs` | `dev --port {port}` |
| Express | `src/index.js` 或 `server.js` | - |

### Python 包装脚本 (start.cjs)

```javascript
const { spawn } = require('child_process');
const proc = spawn('python', ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000', '--reload'], {
  cwd: __dirname, stdio: 'inherit', windowsHide: true
});
proc.on('close', (code) => process.exit(code));
```

---

## 命令文件模板（极简内容）

### pm2-all.md（启动全部 + monit）
````markdown
启动所有服务并打开 PM2 监控器。
```bash
cd "{PROJECT_ROOT}" && pm2 start ecosystem.config.cjs && start wt.exe -d "{PROJECT_ROOT}" pwsh -NoExit -c "pm2 monit"
```
````

### pm2-all-stop.md
````markdown
停止所有服务。
```bash
cd "{PROJECT_ROOT}" && pm2 stop all
```
````

### pm2-all-restart.md
````markdown
重启所有服务。
```bash
cd "{PROJECT_ROOT}" && pm2 restart all
```
````

### pm2-{port}.md（单个启动 + 日志）
````markdown
启动 {name}({port}) 并打开日志。
```bash
cd "{PROJECT_ROOT}" && pm2 start ecosystem.config.cjs --only {name} && start wt.exe -d "{PROJECT_ROOT}" pwsh -NoExit -c "pm2 logs {name}"
```
````

### pm2-{port}-stop.md
````markdown
停止 {name}({port})。
```bash
cd "{PROJECT_ROOT}" && pm2 stop {name}
```
````

### pm2-{port}-restart.md
````markdown
重启 {name}({port})。
```bash
cd "{PROJECT_ROOT}" && pm2 restart {name}
```
````

### pm2-logs.md
````markdown
显示所有 PM2 日志。
```bash
cd "{PROJECT_ROOT}" && pm2 logs
```
````

### pm2-status.md
````markdown
显示 PM2 状态。
```bash
cd "{PROJECT_ROOT}" && pm2 status
```
````

### PowerShell 脚本 (pm2-logs-{port}.ps1)
```powershell
Set-Location "{PROJECT_ROOT}"
pm2 logs {name}
```

### PowerShell 脚本 (pm2-monit.ps1)
```powershell
Set-Location "{PROJECT_ROOT}"
pm2 monit
```

---

## 重要规则

1. **配置文件**: `ecosystem.config.cjs`（不是 .js）
2. **Node.js**: 直接指定 bin 路径 + 解释器（interpreter）
3. **Python**: Node.js 包装脚本 + `windowsHide: true`
4. **打开新窗口**: `start wt.exe -d "{path}" pwsh -NoExit -c "command"`
5. **极简内容**: 每个命令文件仅包含 1-2 行说明 + bash 代码块
6. **直接执行**: 无需 AI 分析，直接执行 bash 命令即可

---

## 执行

基于 `$ARGUMENTS` 执行初始化：

1. 扫描项目服务
2. 生成 `ecosystem.config.cjs`
3. 为 Python 服务生成 `{backend}/start.cjs`（如果适用）
4. 在 `.claude/commands/` 生成命令文件
5. 在 `.claude/scripts/` 生成脚本文件
6. 使用 PM2 信息更新**项目的 CLAUDE.md**（见下文）
7. **显示完成摘要**，包含终端命令

---

## 初始化后：更新 CLAUDE.md

生成文件后，在项目的 `CLAUDE.md` 中添加 PM2 章节（如果不存在则创建）：

````markdown
## PM2 服务

| 端口 | 名称 | 类型 |
|------|------|------|
| {port} | {name} | {type} |

**终端命令:**
```bash
pm2 start ecosystem.config.cjs   # 首次运行
pm2 start all                    # 首次之后
pm2 stop all / pm2 restart all
pm2 start {name} / pm2 stop {name}
pm2 logs / pm2 status / pm2 monit
pm2 save                         # 保存进程列表
pm2 resurrect                    # 恢复保存的列表
```
````

**CLAUDE.md 更新规则:**
- 如果 PM2 章节已存在，则替换它
- 如果不存在，则追加到末尾
- 内容保持极简且仅包含必要项

---

## 初始化后：显示摘要

所有文件生成后，输出以下内容：

```
## PM2 初始化完成

**服务:**

| 端口 | 名称 | 类型 |
|------|------|------|
| {port} | {name} | {type} |

**Claude 命令:** /pm2-all, /pm2-all-stop, /pm2-{port}, /pm2-{port}-stop, /pm2-logs, /pm2-status

**终端命令:**
## 首次运行（使用配置文件）
pm2 start ecosystem.config.cjs && pm2 save

## 首次之后（简化）
pm2 start all          # 启动全部
pm2 stop all           # 停止全部
pm2 restart all        # 重启全部
pm2 start {name}       # 启动单个
pm2 stop {name}        # 停止单个
pm2 logs               # 查看日志
pm2 monit              # 监控面板
pm2 resurrect          # 恢复已保存进程

**提示:** 首次启动后执行 `pm2 save` 即可使用简化的命令。
```
