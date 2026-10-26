# 更新代码映射（Code Maps）

分析代码库（Codebase）结构并更新架构文档。

1. 扫描所有源文件的导入（Import）、导出（Export）及依赖关系
2. 生成以下格式的高令牌效率（Token-efficient）代码映射：
   - `codemaps/architecture.md` - 整体架构
   - `codemaps/backend.md` - 后端结构
   - `codemaps/frontend.md` - 前端结构
   - `codemaps/data.md` - 数据模型与模式（Schema）

3. 计算与前一版本的差异百分比
4. 当变更超过 30% 时，在更新前请求用户确认
5. 为每个代码映射添加更新时间戳
6. 将报告保存至 `.reports/codemap-diff.txt`

使用 TypeScript/Node.js 进行分析。请专注于高层级（High-level）结构，而非具体实现细节。
