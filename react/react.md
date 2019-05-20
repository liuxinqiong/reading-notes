核心内容
• 一个概念 组件
• 四个核心Api
• 单向数据流
• 完善的错误提示

组件方式考虑UI
• props + state = view
• 考虑静态UI
• 思考组件的状态组成
• 考虑组件的交互方式

受控组件与非受控组件
• 受控组件：表单元素状态由使用者维护
• 非受控组件：表单元素状态由DOM自身维护

创建组件原则
• 单一职责原则
• 如果组件变得复杂，应该拆分成小组件，出于拆分复杂度和性能的角度考虑

数据状态管理原则
• 能计算得到的状态就不要单独存储
• 组件尽量无状态，所需数据通过props获取

JSX 本质
• 动态创建组件的语法糖
• 属性中使用表达式
• 延展属性
• 表达式作为子元素
• 约定：自定义组件以大写字母开头

生命周期
* 具体图：http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
* 三个阶段
  * render 阶段
  * Pre-commit 阶段：可以读取 DOM
  * commit 阶段：可以使用 DOM，运行副作用
* 三个时刻
  * 创建时
  * 更新时（new props、setState、forceUpdate）
  * 卸载时
* constructor
  * 用于初始化内部状态
  * 唯一可以直接修改 state 的地方
* getDerivedStateFromProps（取代 componentsWillReceiveProps）
  * 当 state 需要冲 props 初始化时使用
  * 尽量不要使用：维护两者状态一致性会增加复杂度
  * 每次 render 都会调用
  * 典型场景：表单控件获取默认值
* componentDidMounted
  * UI 渲染完成后调用
  * 只执行一次
  * 典型场景：获取外部资源
* componentWillUnmount
  * 组件移除时被调用
  * 典型场景：释放资源
* getSnapshotBeforeUpdate
  * 页面 render 之前调用，state 已更新
  * 典型场景：获取 render 之前的 DOM 状态，比如保存之前的 DOM 状态（滚动位置等）
* componentDitUpdate
  * 每次 UI 更新时被调用
  * 典型场景：页面需要根据 props 变化重新获取数据
* shouldComponentUpdate
  * 决定 Virtual DOM 是否要重绘
  * 一般可以由 PureComponent 自动实现
  * 典型场景：性能优化

Virtual DOM 与 key
* 广度优先分层比较
* 算法复杂度 O(n)
* 基于两个假设
  * 组件的 DOM 结构是相对稳定的
  * 类型相同的兄弟节点可以被唯一标识

高阶组件和函数作为子组件
* 高阶组件接受组件作为参数，返回新的组件。实现通用的逻辑被不同组件使用，但本身并不包含任何UI的展现。有点像 Vue 的 mixin
* 函数作为子组件，也可以函数作为 props，此时又叫做 render props。有点像 Vue 的插槽系统

Context API
* 解决组件间通信问题，Redux 和 React-router 重度依赖
* React.createContext(value)
* Provider Consumer

为什么需要打包
* 编译 ES6 语法特性，编译 JSX
* 整个资源，例如图片，less/sass
* 优化代码体积
