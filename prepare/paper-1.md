怎么判断一个对象是不是可迭代对象
```js
const isIterable = obj => obj != null && typeof obj[Symbol.iterator] === 'function';
```

针对某位面试者
* css
  * BFC
  * Grid 布局
  * 选择器：+ vs ~
  * 怎么理解 margin: auto
  * line-height 属性值 1.5 和 150% 的区别
* js
  * 继承使用场景，对 OOP 编程的看法
  * 手写 EventEmitter
* ts：谈谈你工作中常用到的 ts 特性
* three.js
  * 矩阵
  * BufferGeometry
* http
  * 缓存相关
* react
  * 状态复用
  * 谈谈你理解的 vdom
  * 封装基础组件需要考虑的点大致有哪些
  * 开发中需要注意的性能优化点
  * React 15 到 16 后，生命周期的改变内容与原因
* 公共方法库和 UI 库的 - 管理工作 React Style Guide
* 制定代码规范
* 跨域问题出现的原因
* 对于前端三大框架的看法和优缺点
* 你还有什么想聊的吗