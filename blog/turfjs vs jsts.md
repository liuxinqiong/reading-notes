Turf.js vs JSTS 调研

Turf.js 是一个用于空间分析的开源 JavaScript 库，它包括传统的空间操作，用于创建 GeoJSON 数据的辅助函数，以及数据分类和统计工具。

Turf.js 特点
* 简单：基于 geojson 规范
* 模块化：良好的模块化设计，对按需加载友好
* 快速：使用最新的算法

JSTS 是一个强大的、复杂的图形处理库，早期的 Turf.js 甚至对它有所依赖，JSTS 相比 Turf.js 更复杂，学习曲线更陡峭
* JSTS 的 api 有着浓浓的 Java 风格，Turf.js 更偏向函数式风格
* JSTS 是利用原 JTS 源码，通过 AST 解析转换而成，Turf.js 对于按需加载支持度好

大家对于 JSTS 的吐槽
* 难以调试
* 体积大

Turf.js 期望 GeoJSON 中数据是标准的 WGS84 坐标，且顺序为 [longitude, latitude] 经纬度。