面试官自身的自我介绍

时间控制：40min

大致内容
* 基础
* 框架
* 项目
* 向我提问

实践题
* 实现一个九宫格布局
* 实现两个 DOM 元素的拖动，当相交时改变背景色
* 实现 React 组件
  * LayoutResize
  * DragableList
* 设计模式：观察者模式
* 绘制矩形的例子：https://app.giraffe.build/v2/scratchpad
* CSS inline-block：https://codesandbox.io/s/css-inline-block-qqjd1

面试大致分类
* CSS 问题
  * flex 常见属性
  * 定位属性的差别
  * 响应式设计
  * 选择器：+ vs ~
  * 理解 margin: auto
  * BFC -- 自己也要加深一下了
  * 层叠规则：层叠上下文和层叠水平
  * 垂直居中的几种实现
  * 重排与重绘，如何手动触发重排
  * line-height 属性值 1.5 和 150% 的区别
  * 内联合模型：line-height、vertical-align
  * 多行文本上下垂直居中
  * 清除浮动 -- 自己也要加深一下了
* OOP 问题
  * 怎么理解封装
  * 怎么提高代码的复用性
  * 怎么理解高内聚，低耦合
  * 面向对象和面向过程的区别和联系
  * 封装、抽象、继承、多态的具体表现
* JavaScript
  * 原型链
  * 闭包
  * Event Loop
  * 宏任务与微任务
  * this
  * 递归
  * 内存自动释放
  * 浮点数溢出
  * async/await 实现原理
  * 事件捕获与冒泡
  * 作用域
* webpack
  * 常用配置
  * 打包优化
* React
  * Diff 算法：比如谈谈三个要点
  * Virtual Dom 的本质是什么？在挂载阶段和更新阶段发挥了什么作用，价值是什么
  * 使用 Redux 场景以及 react-redux 原理
  * 通用组件设计过程中需要考虑到哪些点？举个实际例子
  * React 性能优化思路
  * 聊聊 React 生命周期，以及 React 15 到 16 后，生命周期的改变内容、原因、目的
  * 组件逻辑的复用：HOC、Render Props、Hooks 以及 React Hooks 的设计动机，使用 Hooks 的一些感想
  * setState 到底是同步还是异步的
    * 异步的动机是避免频繁的重渲染
    * 为什么 setTimeout 可以将 setState 的执行顺序从异步变为同步
    * 在 React 钩子函数及合成事件中，它表现为异步；而在 setTimeout、setInterval 等函数中，包括在 DOM 原生事件中，它都表现为同步。这种差异，本质上是由 React 事务机制和批量更新机制的工作方式来决定的。
  * Fiber 双缓存机制
  * React 实现组件通信的几种方式
  * Redux 中间件原理
  * Redux 的设计思想
* nodejs
  * Koa 中间件原理
* Git
  * 分支相关
  * 代码还原
* HTTP
  * 常见状态码
  * JWT 与传统 Session 的区别
  * 常见请求头（浏览器缓存）
  * Cookie
* 算法题
  * 求阶乘
  * 实现四则运算的解释器
  * 判断给定字符是否是有效的括号搭配
  * 动态规划：爬楼梯问题
* 常见 Web 安全问题
  * CSRF
  * XSS
* TypeScript
  * 泛型约束
  * type 与 interface 区别：声明合并
  * 谈谈你工作中常用到的 TS 特性
* Three.js
  * 点到线的距离
  * 线垂直、平行
  * 点在图形内
  * 坐标变换
  * 说说你觉得图形学中最重要的几点
* 其他
  * SSR 原理和场景，你是怎么实现的
  * 跨域问题出现的原因，为什么通过 Node 可以解决
  * 对于前端三大框架的看法和优缺点
  * MVC 和 MVVM 的区别
  * 你觉得 webpack 最大的作用是什么
  * 链表和数组的区别
* 开放性
  * 看过什么书
  * 你简历上的项目，有线上地址和开源仓库吗
  * 你项目中碰到的最大的难题是什么，怎么解决的
