turf vs JSTS 调研

JSTS 是一个强大的，复杂的图形处理库，turf 甚至都会对它有所依赖，JSTS 比 turf 更复杂，学习曲线更陡峭。那他们有哪些区别呢
* api 使用方式：JSTS 的 api 有着浓浓的 Java 风格，turf 更偏向函数式风格
* 对 geojson 的支持度：turf 的 api 支持直接传递 geojson 且直接在地图上呈现，没有复杂的数据结构和解析工作
* 模块化：turf 对于按需加载支持度好

大家对于 jsts 的吐槽
* 难以调试
* 体积大

> 其实在早期的 turf 中是对 jsts 有依赖的，然后热心网友想要移除对于 jsts 的依赖，还总结了对于目前对于 jsts 的依赖情况，有趣有趣

github 活跃度
* watch、fork、star、issue turf 遥遥领先
* turf 通过 npm 包进行管理，有良好的模块化设计，对于按需加载支持度很好
* jsts 是利用原 JTS 源码，通过 AST 解析转换而成