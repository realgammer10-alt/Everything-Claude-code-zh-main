---
description: 强制执行测试驱动开发（TDD）工作流。先搭建接口脚手架，首先编写测试，然后编写通过测试所需的最小化代码。确保 80% 以上的测试覆盖率。
---

# TDD 命令

此命令会调用 **tdd-guide** 智能体（Agent），强制执行测试驱动开发（TDD）方法论。

## 此命令的功能

1. **接口脚手架（Scaffolding）** - 首先定义类型/接口
2. **测试先行（Test-First）** - 编写失败的测试（RED）
3. **实现最小化代码** - 编写仅足以通过测试的代码（GREEN）
4. **重构（Refactoring）** - 在保持测试通过的前提下改进代码（REFACTOR）
5. **验证覆盖率** - 保证 80% 以上的测试覆盖率

## 使用场景

在以下情况下使用 `/tdd`：
- 实现新功能时
- 添加新的函数/组件时
- 修复 Bug 时（先编写重现该 Bug 的测试）
- 重构现有代码时
- 构建核心业务逻辑时

## 工作原理

tdd-guide 智能体会执行以下操作：

1. **定义接口**：确定输入/输出类型
2. **编写失败的测试**（因为代码尚不存在）
3. **运行测试**：确认其因预期的原因而失败
4. **编写最小化实现**：使测试通过
5. **运行测试**：确认其已通过
6. **重构**：在保持测试通过的前提下优化代码
7. **检查覆盖率**：若低于 80% 则补充测试

## TDD 循环

```
RED → GREEN → REFACTOR → REPEAT

RED:      编写失败的测试
GREEN:    编写通过测试所需的最小化代码
REFACTOR: 改进代码，并保持测试处于通过状态
REPEAT:   进入下一个功能/场景
```

## 使用示例

```
User: /tdd 我需要一个计算市场流动性评分的函数

Agent (tdd-guide):
# TDD 会话: 市场流动性评分计算器

## 步骤 1: 定义接口 (SCAFFOLD)

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: 实现逻辑
  throw new Error('Not implemented')
}
```

## 步骤 2: 编写失败的测试 (RED)

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 day ago
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

## 步骤 3: 运行测试 - 确认失败

```bash
npm test lib/liquidity.test.ts

FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market (2 ms)
    Error: Not implemented

1 test failed, 0 passed
```

✅ 测试如预期般失败。准备开始实现。

## 步骤 4: 实现最小化代码 (GREEN)

```typescript
// lib/liquidity.ts
export function calculateLiquidityScore(market: MarketData): number {
  // 处理交易量为零的边界情况
  if (market.totalVolume === 0) {
    return 0
  }

  // 计算各部分得分 (0-100 比例)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // 最近活跃度加成
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // 加权平均
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // 限制在 0-100 之间
}
```

## 步骤 5: 运行测试 - 确认通过

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ 所有测试均已通过！

## 步骤 6: 重构 (IMPROVE)

```typescript
// lib/liquidity.ts - 通过引入常量和提高可读性进行重构
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

## 步骤 7: 确认测试依然通过

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ 重构完成，测试依然通过！

## 步骤 8: 检查覆盖率

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (目标: 80%)
```

✅ TDD 会话完成！
```

## TDD 最佳实践

**应该做：**
- ✅ 在实现代码之前先编写测试
- ✅ 运行测试并确认其在实现前会失败
- ✅ 编写仅足以通过测试的最小化代码
- ✅ 仅在测试变为绿色（通过）后才进行重构
- ✅ 添加边界情况和错误场景的测试
- ✅ 目标是 80% 以上的覆盖率（关键代码应达到 100%）

**不该做：**
- ❌ 在编写测试之前编写实现代码
- ❌ 跳过每次更改后的测试运行
- ❌ 一次编写过多代码
- ❌ 忽略失败的测试
- ❌ 测试实现细节（应测试行为）
- ❌ 过度使用 Mock（优先考虑集成测试）

## 应包含的测试类型

**单元测试**（函数级别）：
- 正常路径（Happy Path）场景
- 边界情况（空值、null、最大值）
- 错误条件
- 临界值

**集成测试**（组件级别）：
- API 接口
- 数据库操作
- 外部服务调用
- 使用 Hook 的 React 组件

**E2E 测试**（使用 `/e2e` 命令）：
- 关键用户流
- 多步骤流程
- 全栈集成

## 覆盖率要求

- **所有代码 80% 以上**
- **以下内容必须 100% 覆盖**：
  - 财务计算
  - 身份验证逻辑
  - 安全关键代码
  - 核心业务逻辑

## 重要事项

**必须**：测试必须在实现之前编写。TDD 循环为：

1. **RED** - 编写失败的测试
2. **GREEN** - 编写通过测试的实现
3. **REFACTOR** - 优化代码

不得跳过 RED 阶段。不得在编写测试之前编写代码。

## 与其他命令的集成

- 首先使用 `/plan` 明确构建目标
- 使用 `/tdd` 进行带测试的实现
- 出现构建错误时使用 `/build-and-fix`
- 使用 `/code-review` 评审实现
- 使用 `/test-coverage` 验证覆盖率

## 相关智能体（Agents）

此命令会调用位于以下位置的 `tdd-guide` 智能体：
`~/.claude/agents/tdd-guide.md`

此外，可以参考位于以下位置的 `tdd-workflow` 技能（Skill）：
`~/.claude/skills/tdd-workflow/`
