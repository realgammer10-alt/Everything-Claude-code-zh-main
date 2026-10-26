# 编码风格 (Coding Style)

## 不变性 (Immutability)（重要）

始终创建新对象，不要修改现有对象：

```
// 伪代码 (Pseudo-code)
错误:  modify(original, field, value) → 原地修改 original
正确: update(original, field, value) → 返回应用了更改的新副本
```

理由：不可变数据可以防止隐式副作用，简化调试，并支持安全的并发处理。

## 文件结构 (File Structure)

大量的小文件 > 少量的大文件：
- 高内聚 (High Cohesion)，低耦合 (Low Coupling)
- 通常 200-400 行，最大 800 行
- 从大型模块中提取工具函数 (Utilities)
- 按功能/领域 (Function/Domain) 而非类型进行组织

## 错误处理 (Error Handling)

始终进行全面的错误处理：
- 在所有层级显式处理错误
- 在 UI 代码中提供用户友好的错误信息
- 在服务端记录详细的错误上下文日志
- 不要静默忽略错误

## 输入验证 (Input Validation)

始终在系统边界进行验证：
- 处理前验证所有用户输入
- 尽可能使用基于 Schema 的验证
- 通过清晰的错误信息尽早失败 (Fail Fast)
- 绝不信任外部数据（API 响应、用户输入、文件内容）

## 代码质量自检表 (Code Quality Checklist)

在标记任务完成之前：
- [ ] 代码易读且命名得当
- [ ] 函数简短（少于 50 行）
- [ ] 文件职责明确（少于 800 行）
- [ ] 无深度嵌套（4 层或以下）
- [ ] 适当的错误处理
- [ ] 无硬编码值（使用常量或配置）
- [ ] 无原地修改（使用不可变模式）
