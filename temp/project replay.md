项目结果方面问题
1. FP 风格的代码还是有点多，具体表现在散函数多
2. 缺少自己服务于 view 的 service 层，当初觉得 service 层可能没太多必要，跳过了 service 层直接将 api 层作用于 view 了
3. 类型定义
  * Object3D 的 userData 类型
  * axios 返回值类型定义
  * Redux Action payload 类型定义

CAD TODO
* 数值输入框优化
  * 滚动操作
  * 空白重置
* 方案信息面板用户选择刷新不重置
* 物件优化
  * 能否更优雅一点
  * 架空层和女儿层不能自动被关闭
* ant design 主题定制与变量修改问题
* MaterialHelper 内存释放问题