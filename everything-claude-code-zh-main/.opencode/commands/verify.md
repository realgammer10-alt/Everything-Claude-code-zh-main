---
description: 运行验证循环以校验实现结果
agent: build
---

# 验证（Verify）命令

运行验证循环（verification loop）以校验实现结果：$ARGUMENTS

## 你的任务

执行全面验证：

1. **类型检查（Type Check）**：`npx tsc --noEmit`
2. **Lint 检查**：`npm run lint`
3. **单元测试（Unit Tests）**：`npm test`
4. **集成测试（Integration Tests）**：`npm run test:integration`（如果可用）
5. **构建（Build）**：`npm run build`
6. **覆盖率检查（Coverage Check）**：验证 80% 以上的覆盖率

## 验证清单（Verification Checklist）

### 代码质量
- [ ] 无 TypeScript 错误
- [ ] 无 Lint 警告
- [ ] 无 console.log 语句
- [ ] 函数行数 < 50 行
- [ ] 文件行数 < 800 行

### 测试
- [ ] 所有测试通过
- [ ] 覆盖率 >= 80%
- [ ] 覆盖边缘用例
- [ ] 测试异常情况

### 安全
- [ ] 无硬编码密钥
- [ ] 已包含输入校验
- [ ] 无 SQL 注入风险
- [ ] 无 XSS 漏洞

### 构建
- [ ] 构建成功
- [ ] 无警告
- [ ] 包大小（Bundle size）在可接受范围内

## 验证报告（Verification Report）

### 总结
- 状态：✅ 通过（PASS） / ❌ 失败（FAIL）
- 分数：通过了 X/Y 项检查

### 详情
| 检查项 | 状态 | 备注 |
|-------|--------|-------|
| TypeScript | ✅/❌ | [详情] |
| Lint | ✅/❌ | [详情] |
| 测试 | ✅/❌ | [详情] |
| 覆盖率 | ✅/❌ | XX% (目标: 80%) |
| 构建 | ✅/❌ | [详情] |

### 待办事项（Action Items）
[如果失败，列出需要修复的内容]

---

**注意**：在每次提交（commit）和拉取请求（PR）之前都应运行验证循环。
