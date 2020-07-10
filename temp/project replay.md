项目结果方面问题
1. FP 风格的代码还是有点多，具体表现在散函数多
2. 缺少自己服务于 view 的 service 层，当初觉得 service 层可能没太多必要，跳过了 service 层直接将 api 层作用于 view 了
3. 类型定义
  * Object3D 的 userData 类型 - 由于 userData 本身在 Object3D 中本身是 any 类型，Three 的一些 getXXX api 返回的均是 Object3D，是不可能返回你想要的实现子类的。因此自己如果想要有类型，你可以封装自己的和业务对象相关的 getXXX 相关函数，
  * axios 返回值类型定义 - 只能在特定 action 中自行 as 成一个类型，而且这是必须的操作，否则你在使用的时候会导致类型是 any
  * Redux Action payload 类型定义
4. useSelector 性能相关 - reselect 库存在的意义
5. useEffect dep 中对象的局部选择
6. redux-saga 错误
7. dispatch 是同步的吗？怎么知道已经完成
8. 在 OOP 冲突吗