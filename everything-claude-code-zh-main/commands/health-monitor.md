# API 健康监控 (API Health Monitor)

使用内置监控脚本检查 HTTP API，并在终端实时显示服务状态。

## 配置

在当前项目根目录创建 `healthchecks.json`：

```json
{
  "intervalMs": 5000,
  "timeoutMs": 2000,
  "checks": [
    {
      "name": "Web API",
      "url": "http://localhost:3000/health",
      "expectedStatus": 200
    },
    {
      "name": "Readiness",
      "url": "http://localhost:3000/ready",
      "expectedStatus": 200
    }
  ]
}
```

- `checks` 必须包含至少一个端点；名称必须唯一。
- 端点仅支持 HTTP/HTTPS，且 URL 不得包含用户名或密码。
- `expectedStatus` 默认为 `200`，可设置为 `100` 至 `599` 的整数。
- `intervalMs` 默认为 `5000`（允许 `250` 至 `3600000`）。
- `timeoutMs` 默认为 `2000`（允许 `100` 至 `120000`）。

## 运行

从项目根目录持续监控并刷新状态面板：

```bash
npm run health-monitor -- --config healthchecks.json
```

单次检查（任一端点失败时退出码为 `1`）：

```bash
npm run health-monitor -- --config healthchecks.json --once
```

按 `Ctrl+C` 停止持续监控。检查失败会显示为 `DOWN`，并注明 HTTP 状态、网络错误或超时；重定向不会被自动跟随。需要进程级状态时，可同时使用 PM2 的 `pm2 status` 或 `pm2 monit`。
