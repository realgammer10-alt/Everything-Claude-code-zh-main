---
description: 使用 Playwright 生成并运行端到端 (E2E) 测试
agent: e2e-runner
subtask: true
---

# E2E 命令 (E2E Command)

使用 Playwright 生成并运行端到端（End-to-End, E2E）测试：$ARGUMENTS

## 你的任务 (Your Task)

1. **分析用户流 (Analyze user flow)** 以进行测试
2. 使用 Playwright **创建测试旅程 (Create test journey)**
3. **运行测试 (Run tests)** 并捕获产物 (Artifacts)
4. **报告结果 (Report results)**，包括截图/视频

## 测试结构 (Test Structure)

```typescript
import { test, expect } from '@playwright/test'

test.describe('功能：[名称]', () => {
  test.beforeEach(async ({ page }) => {
    // 设置：导航、身份验证、准备状态
  })

  test('应该 [预期行为]', async ({ page }) => {
    // 安排 (Arrange)：设置测试数据

    // 执行 (Act)：执行用户操作
    await page.click('[data-testid="button"]')
    await page.fill('[data-testid="input"]', 'value')

    // 断言 (Assert)：验证结果
    await expect(page.locator('[data-testid="result"]')).toBeVisible()
  })

  test.afterEach(async ({ page }, testInfo) => {
    // 失败时捕获截图
    if (testInfo.status !== 'passed') {
      await page.screenshot({ path: `test-results/${testInfo.title}.png` })
    }
  })
})
```

## 最佳实践 (Best Practices)

### 选择器 (Selectors)
- 优先使用 `data-testid` 属性
- 避免使用 CSS 类（它们经常变动）
- 使用语义化选择器（角色 roles、标签 labels）

### 等待 (Waits)
- 使用 Playwright 的自动等待 (Auto-waiting)
- 避免使用 `page.waitForTimeout()`
- 使用 `expect().toBeVisible()` 进行断言

### 测试隔离 (Test Isolation)
- 每个测试都应保持独立
- 测试完成后清理测试数据
- 不要依赖测试执行顺序

## 需捕获的产物 (Artifacts to Capture)

- 失败时的截图
- 用于调试的视频
- 用于详细分析的追踪文件 (Trace files)
- 相关的网络日志 (Network logs)

## 测试类别 (Test Categories)

1. **关键用户流 (Critical User Flows)**
   - 身份验证（登录、注销、注册）
   - 核心功能的主路径 (Happy paths)
   - 支付/结账流程

2. **边界情况 (Edge Cases)**
   - 网络故障
   - 无效输入
   - 会话过期

3. **跨浏览器 (Cross-Browser)**
   - Chrome, Firefox, Safari
   - 移动端视口 (Mobile viewports)

## 报告格式 (Report Format)

```
E2E 测试结果
================
✅ 通过: X
❌ 失败: Y
⏭️ 跳过: Z

失败的测试：
- 测试名称: 错误消息
  截图: path/to/screenshot.png
  视频: path/to/video.webm
```

---

**提示 (TIP)**：运行调试时可使用 `--headed` 参数：`npx playwright test --headed`
