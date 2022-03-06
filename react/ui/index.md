React.FunctionComponent<Props> 的作用
* **扩展 props 的 children 属性**
* **提供静态属性 defaultProps 为 props 提供默认值**
* 额外提供简写别名 React.FC

React 提供了**用于处理 props.children 不透明数据结构的方法**
* React.Children.map
* React.Children.foreach
* React.cloneElement
* TS 支持：React.FunctionComponentElement 用于类型断言

图标动画
* CSS Transition + Transform：永远是首选方案，但有些问题解决不了
  * CSS 方案会存在 display:none 动画失效的问题
* **React Transition Group**
  * 提供 3 个核心组件
    * Transition
    * CSSTransition
    * TransitionGroup
  * 本身并没有提供 CSS 动画，而是添加一系列 CSS 类名的变化。通过 **force reflow** 的方式解决 display:none 问题
  * animation.css 可以用来参考哦