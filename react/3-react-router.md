为什么需要路由
* 单页应用需要进行页面切换
* 通过 URL 定位到页面
* 更有语义的组织资源

主要部分
* 路由定义
* Router
  * BrowserRouter
  * HashRouter
* 组件容器：Route 组件 path + component 属性，还支持 render props，渲染特定组件
* 路径跳转：Link 组件 to 属性
* 非路由组件使用路由的方法，`withRouter` 高阶组件，位于 `react-router-dom`

React Router 特性
* 声明式路由定义
* 动态路由

三种路由实现方式
* URL 路径
* hash 路由
* 内存路由：不会反应在 URL 上，和 `react-router-dom` 没关系，从 `react-router` 导入

基于路由配置进行资源组织
* 实现业务逻辑的松耦合
* 易于扩展，重构和维护
* 路由层面实现 Lazy Load

核心 API
* Link：普通链接，不会触发浏览器刷新
* NavLink：类似 Link 但是会添加当前选中状态，activeClassName 属性
* Prompt：满足条件时提示用户是否离开当前页面，when 和 message 属性
* Redirect：重定向当前页面，例如登录判断
* Route：路由配置核心标记，路径匹配时显示对应组件，exact path component
* Switch：只显示第一个匹配的组件

参数定义与嵌套路由
* 参数传递
  * :paramsName 确定参数名称
  * this.props.match.params.paramsName 获取参数
* 何时需要 URL 参数
  * 页面状态尽量通过 URL 参数定义
* 嵌套路由
  * Route 下 还有 Route 即可
  * 注意：**嵌套路由的 path 必须是包含上一级 path 完整路径**

路由配置如何抽象集中管理