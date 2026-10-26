# 更新文档 (Update Documentation)

从可信的信息源同步文档：

1. 读取 `package.json` 的 `scripts` 部分
   - 生成脚本引用表
   - 包含来自注释的说明

2. 读取 `.env.example`
   - 提取所有环境变量
   - 记录其用途与格式

3. 生成 `docs/CONTRIB.md`：
   - 开发工作流（Development Workflow）
   - 可用脚本
   - 环境搭建
   - 测试步骤

4. 生成 `docs/RUNBOOK.md`：
   - 部署步骤
   - 监控与告警
   - 常见问题与修复
   - 回滚步骤

5. 识别过时文档：
   - 检测超过 90 天未变更的文档
   - 列出清单以供人工审核

6. 显示差异摘要 (Diff Summary)

可信的唯一事实来源 (Source of Truth)：`package.json` 与 `.env.example`
