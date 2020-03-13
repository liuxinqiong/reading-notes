新版 CAD 问题
1. FP 风格的代码还是有点多，具体表现在散函数多
2. 缺少自己服务于 view 的 service 层，当初觉得 service 层可能没太多必要，跳过了 service 层直接将 api 层作用于 view 了
3. 类型定义
  * Object3D 的 userData 类型
  * axios 返回值类型定义
  * Redux Action payload 类型定义
4. 物件
  * 方案规则验证
  * push_commit

技术部茶会
1. 简单、反复重构、单侧、避免过度设计
2. 开发修复，给测试提供服务可能的影响范围
3. 20/80 时间分配
4. markdown 绘制流程图

TODO
* 数值输入框优化
  * 滚动操作
  * 空白重置
* 用户选择刷新不重置
* 物件优化
  * 减少重复代码
  * 架空层和女儿层不能自动被关闭