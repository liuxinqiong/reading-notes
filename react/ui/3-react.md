React 简介
* 声明式
  * 声明式强调结果
  * 命令式强调过程
* 组件化
* 一次学习，随处编写
  * Node
  * RN

npx 命令
* 避免全局安装
* 调用项目内部安装模块

React.FunctionComponent<Props> 的作用
* **扩展 props 的 children 属性**
* **提供静态属性 defaultProps 为 props 提供默认值**
* 额外提供简写别名 React.FC

why hooks
* 组件状态逻辑难以复用
* 组件复杂难以理解，尤其是生命周期函数
* 完全拥抱函数

useRef
* state 遇到的难题：闭包导致的旧数据问题
* 使用场景
  * 多次渲染之间的纽带
  * 访问 dom 节点
* 注意：修改 Ref 不会触发组件更新