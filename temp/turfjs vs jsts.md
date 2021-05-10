turfjs vs jsts 调研

大家对于 jsts 的吐槽
* 难以调试
* 体积大

> 其实在早期的 turf 中是对 jsts 有依赖的，然后热心网友想要移除对于 jsts 的依赖，还总结了对于目前对于 jsts 的依赖情况，有趣有趣

github 活跃度
* watch、fork、star、issue turf 遥遥领先
* turf 通过 npm 包进行管理，有良好的模块化设计，对于按需加载支持度很好
* jsts 是利用原 JTS 源码，通过 AST 解析转换而成