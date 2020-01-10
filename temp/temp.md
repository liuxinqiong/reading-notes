React Hook

## 背景
Hooks 出现之前，如果要复用组件代码，常用的解决方式有
* HOC：高阶组件
  * 属性代理：函数返回一个我们自己定义的组件，然后在 render 中返回要包裹的组件，这样我们就可以代理所有传入的 props，并且决定如何渲染
  * 反向继承：返回一个组件，继承原组件，在 render 中调用原组件的 render。由于继承了原组件，能通过 this 访问到原组件的生命周期、props、state、render 等，相比属性代理它能操作更多的属性。
* Render Props：属性是一个函数，这个函数接受一个对象并返回一个子组件，会将这个函数参数中的对象作为 props 传入给新生成的组件。

> HOC 与容器组件模式之间有相似之处。容器组件担任分离高层和低层关注的责任，由容器管理订阅和状态，并将 prop 传递给处理渲染 UI。HOC 使用容器作为其实现的一部分，你可以将 HOC 视为参数化容器组件。

HOC 和 Render Props 相同点
* 两者都能很好的帮助我们重用组件逻辑
* 造成组件嵌套层数过多

HOC 和 Render Props 不同点
* HOC 父组件有相同属性名属性传递过来，会造成属性丢失
* Render Props 你只需要实例化一个中间类，而 HOC 你每次调用的地方都需要额外实例化一个中间类

HOC 和 Render Props 总结
* HOC 有点像把通用代码抽离处理，然后插拔式的附加在特定组件上
* Render Props 像是把一个个组件抽离出来，如果该组件需要某组件提供的功能，则作为 render 函数返回值传入即可，render 参数用来传递数据

Render Props 有以下几个优点
* 不用担心 props 的命名问题
* 可以溯源，子组件的 props 一定是来自于直接父组件

哪为啥造一个 Hooks 呢
* 在组件之间复用状态逻辑很难：目前的复用方式 Render Props 和 HOC，无论是哪一种方法都会造成组件数量增多，组件树结构的修改。使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。Hook 使你在无需修改组件结构的情况下复用状态逻辑
* 生命周期钩子函数里的逻辑混乱
  * 通常希望一个函数只做一件事情，而生命周期钩子将完全不相关的代码却在同一个方法中组合在一起
  * 一些清除逻辑可能还会在另一个钩子中出现，相互关联且需要对照修改的代码被进行了拆分
* 难以理解的 class：主要表现在 this 指向问题和无状态组件到有状态组件的改造

> useState 和 useEffect 解决了函数式组件没有状态和生命周期的问题，但是如何才能把可以复用的逻辑抽离出来，变成一个个可以随意插拔的“插销”呢。其实很简单了，将相关 useState 和 useEffect 抽离出来到一个函数中（常取名为use*），返回 stateName 即可，在组件中就可以直接引用这个函数。

HOC 注意事项
* 不要在 render 方法中使用 HOC
  * 性能问题，导致 diff 失败，导致组件卸载，状态丢失
  * 在极少数情况下，你需要动态调用 HOC。你可以在组件的生命周期方法或其构造函数中进行调用。
* 务必复制静态方法：可以使用 `hoist-non-react-statics` 自动拷贝所有非 React 静态方法
* Refs 不会被传递

> 关于 render prop 一个有趣的事情是你可以使用带有 render prop 的常规组件来实现大多数高阶组件 (HOC)。

render props 注意事项
* 将 Render Props 与 React.PureComponent 一起使用时要小心，可能会导致比较失效，原因在于你写得 render props 可能每次渲染都会新建

## Hooks 基础
React 内置的基础 Hooks
* useState
  * 参数可以是初始值或者函数形式（惰性初始 state），后续重新渲染中，React 会确保 state 和 setState 的标识是稳定的，因此依赖列表中省略 setState
  * 把所有 state 都放在同一个 useState 调用中，或是每一个字段都对应一个 useState 调用，这两方式都能跑通。当你在这两个极端之间找到平衡，然后把相关 state 组合到几个独立的 state 变量时，组件就会更加的可读。如果 state 的逻辑开始变得复杂，我们推荐用 reducer 来管理它，或使用自定义 Hook。
  * 如果一个操作，你需要运行多个 setXXX，说明这些 state 的相关的，你可能会考虑放进一个自定义 hook 中，很多时候还可以考虑使用 useReducer hook
  * class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并
* useReducer
  * 通过这种方式可以对多个状态同时进行控制
  * 惰性初始化：将 init 函数作为 useReducer 的第三个参数传入
* useEffect
  * componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API 
  * 在函数组件主体内改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因此需要使用 useEffect 完成副作用操作。
  * 用于处理各种状态变化造成的副作用，也就是说只有在特定的时刻，才会执行的逻辑。
  * 回调函数中，我们可以返回一个常用用于清理工作，这是 effect 可选的清除机制，比如事件监听、取消订阅、计时器、中断 Ajax
  * 使用多个 Effect 实现关注点分离，解决面向生命周期编程的问题
  * 传递给 useEffect 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的值，而不用担心其过期的原因。每次我们重新渲染，都会生成新的 effect，替换掉之前的。
  * 按照 effect 声明的顺序依次调用组件中的每一个 effect。
* useCallback
  * 返回一个 memoized 函数，该回调函数仅在某个依赖项改变时才会更新。
  * 当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染的子组件时，它将非常有用。因为函数引用未发生改变。
* useMemo
  * 返回一个 memoized 值。当依赖的状态发生改变时，才会触发计算函数的执行。
  * 有助于避免在每次渲染时都进行高开销的计算。
  * 当你把引用对象传递给经过优化的并使用引用相等性去避免非必要渲染的子组件时，它将非常有用。因为对象引用未发生改变。
* useContext
  * 读取 context 的值以及订阅 context 的变化
  * context 是在外部 create，内部 use 的 state，它和全局变量的区别在于，数据的改变会触发依赖该数据组件的 reRender。而 useContext hooks 可以帮助我们简化 context 的使用。
* useRef
  * useRef 返回一个可变的 ref 对象，其 `.current` 属性初始化为传递的参数（ initialValue ）。返回的对象将持续整个组件的生命周期。
  * useRef 和 DOM refs 有点类似，但 useRef 是一个更通用的概念，它就是一个你可以放置一些东西的盒子。它可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。
  * useRef() 和自建一个 {current: ...} 对象的唯一区别是，useRef 会在每次渲染时返回同一个 ref 对象。
* useImperativeHandle
  * 在使用 ref 时自定义暴露给父组件的实例值，弥补不能引用函数组件的缺陷。
  * 需要配合 `forwardRef` 使用
* useLayoutEffect
  * 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。
  * 尽可能使用标准的 useEffect 以避免阻塞视觉更新。
* 自定义 hooks
  * 只需要定义一个函数，并且把相应需要的状态和 effect 封装进去
  * Hook 之间也是可以相互引用的。使用 use 开头命名自定义 Hook，这样可以方便 eslint 进行检查。

useEffect 注意事项
* 请确保数组中包含了所有外部作用域中会随时间变化并且在 effect 中使用的变量，否则你的代码会引用到先前渲染中的旧变量。
* 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。如果你传入了一个空数组（[]），effect 内部的 props 和 state 就会一直拥有其初始值。
* 推荐启用 eslint-plugin-react-hooks 中的 exhaustive-deps 规则。此规则会在添加错误依赖时发出警告并给出修复建议。
* 虽然 useEffect 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。React 将在组件更新前刷新上一轮渲染的 effect。

Hook 规则
* 只在组件最顶层使用 Hook，不要在循环，条件或嵌套函数中调用
* 只在函数组件和自定义 Hook 中使用

> hooks 目前暂时还没有对应不常用的 getSnapshotBeforeUpdate 和 componentDidCatch 生命周期的 Hook 等价写法

## 性能相关
在 React 中一切皆组件，因此优化也是面向组件优化，在 React 中引发组件 reRender 的时机很简单，就如下三种情况，第三种我们无需考虑
* props 更改
* state 更改
* forceUpdate

> UI 响应延迟低于 100ms 对于用户而言是无感知的，当延迟 100~300ms 时用户就会有所察觉

那么 render 的时候做了什么事情呢
* diff 比较
* DOM 卸载与挂载

简单而言，优化方向就是
* 使用 PureComponent 或 React.memo 减少不必要的更新
* 使用更好的 props
  * 尽量使用原始类型，这一点感觉很难做到哇
  * 不要直接传递箭头函数
* 使用 shouldComponentUpdate 控制更新
  * 解决尽量传递原始类型很难做到的问题
  * 对于函数式组件，可以传递一个比较函数作为 React.memo 的第二参数
  * 需要注意深比较本身的性能问题

既然 PureComponent 或 React.memo 可以减少更新，为什么不作为默认选项呢
* Problem with nested objects
* Problem with function props

在 Hooks 中怎么做呢

渲染中昂贵的计算，函数式组件不同于类组件，由于没有实例，函数运行完现场就销毁了，因此如果函数运行中有一些昂贵的计算，该如何处理呢
* 如果值需要在某些场景重新计算，则使用 useMemo，这里的值也可以是组件，因此可以用来优化子节点的重新渲染
* 如果初始化常见 state 很昂贵时，使用 setState 的函数形式，只会在首次渲染时调用这个函数
* 如果值从不被重新计算，可以惰性初始化一个 ref，ref 不会像 useState 可以接受一个特殊的函数重载，你需要编写自己的函数来创建并设置为惰性的

在 React 中使用内联函数对性能的影响，与每次渲染都传递新的回调会如何破坏子组件的 shouldComponentUpdate 优化有关。Hook 从三个方面解决了这个问题。
* useCallback Hook 允许你在重新渲染之间保持对相同的回调引用以使得 shouldComponentUpdate 继续工作
* useMemo Hook 使控制具体子节点何时更新变得更容易
* useReducer Hook 减少了对深层传递回调的需要，通过 context 用 useReducer 往下传一个 dispatch 函数，dispatch 永远是稳定的

> 你依然可以选择是要把应用的 state 作为 props 向下传递（更显明确）还是作为作为 context（对很深的更新而言更加方便）。如果你也使用 context 来向下传递 state，请使用两种不同的 context 类型 —— dispatch context 永远不会变，因此组件通过读取它就不需要重新渲染了，除非它们还需要应用的 state。

什么时候使用 memo 或 PureComponent 呢
* Pure functional component
* Renders often
* Re-renders with the same props
* Medium too big size

> 一个常见的导致组件使用相同 props 重新渲染的场景就是：父组件重新渲染导致子组件重新渲染

什么时候避免使用 memo 或 PureComponent 呢
* 不经常使用相同 props 重新渲染，会导致不必要的属性比较

## Context API 使用对比
Context API 使用例子，典型的 Render Props 应用哇
```js
// 1. 使用 createContext 创建上下文
const UserContext = new createContext();

// 2. 创建 Provider
const UserProvider = props => {
  let [username, handleChangeUsername] = useState('');
  return (
    <UserContext.Provider value={{ username, handleChangeUsername }}>
      {props.children}
    </UserContext.Provider>
  );
};

// 3. 创建 Consumer
const UserConsumer = UserContext.Consumer;

// 4. 使用 Consumer 包裹组件
const Panel = () => (
  <UserConsumer>
    {({ username, handleChangeUsername }) => (
      <div>
        <div>user: {username}</div>
        <input onChange={e => handleChangeUsername(e.target.value)} />
      </div>
    )}
  </UserConsumer>
);
```

使用 useContext hooks
```js
// 1. 使用 createContext 创建上下文
const UserContext = new createContext();

// 2. 创建 Provider
const UserProvider = props => {
  let [username, handleChangeUsername] = useState('');
  return (
    <UserContext.Provider value={{ username, handleChangeUsername }}>
      {props.children}
    </UserContext.Provider>
  );
};

const Panel = () => {
  const { username, handleChangeUsername } = useContext(UserContext); // 3. 使用 Context
  return (
    <div>
      <div>user: {username}</div>
      <input onChange={e => handleChangeUsername(e.target.value)} />
    </div>
  );
};
```

## 深入理解 ref
refs 能获取到 Component 或 DOM Element 实例，应该尽量避免使用它，因为它会导致代码可读性变差，而且打破了 top-to-bottom 数据流。如果有更好的方式去解决问题，就要轻易使用它，比如提升状态或函数至父组件。

有三种方式
* 使用字符串：避免使用，被淘汰
* 在 ref 属性中使用回调函数
* React.createRef()

## 其他
state 和 props 的更新是异步，所以不要依赖它们的值来更新下一个状态
* class 组件：setState 通过一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数
* functional 组件：useState 中的 setState 同样支持函数形式来接收先前的 state

事件处理：在 JSX 绑定事件每次创建事件处理函数，在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。

组合 vs 继承：推荐使用组合而非继承来实现组件间的代码重用

ref 属性是一个回调函数
* class 组件：可使用 createRef api 来创建回调函数来接收
* functional 组件：可使用 useRef  hook

自定义组件暴露内部元素给父组件：在子组件上设置一个特殊的 props 回调来对父组件暴露 DOM refs，来把父组件的 ref 传向子节点的 DOM 节点

> 对于 HOC，建议使用 React 的 forwardRef 函数来像被包裹的组件转发 ref

准确理解 forwardRef：并不是啥特殊的功能，就是 ref 通过 props 转发，其只是 React 封装的一个简单 api

> 记住 ref 不是 prop 属性。就像 key 一样，其被 React 进行了特殊处理

代码分割
* 动态 import
* React.lazy：目前只支持默认导出（default exports）
* 基于路由的代码分割

> React.lazy 和 Suspense 技术还不支持服务端渲染。如果你想要在使用服务端渲染的应用中使用，我们推荐 Loadable Components 这个库。

Context 基础
* 当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。
* 只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。这有助于在不使用 Provider 包装组件的情况下对组件进行测试。

Context 注意事项
* 如果 Provider 父组件进行重渲染时，会导致的 value 属性被赋值为新对象，则会导致 consumers 组件中触发意外的渲染

错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI，而不是渲染那些崩溃了的子组件树。错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。

错误边界无法捕获以下场景中产生的错误：
* 事件处理
* 异步代码
* 服务端渲染
* 它自身抛出来的错误（并非它的子组件）

如果一个 class 组件中定义了 static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用 static getDerivedStateFromError() 渲染备用 UI ，使用 componentDidCatch() 打印错误信息。

> 只有 class 组件才可以成为错误边界组件。大多数情况下, 你只需要声明一次错误边界组件, 并在整个应用中使用它。

React.Fragment 片段可以具有 key，key 也是目前唯一可以传递给 Fragment 的属性。

JSX 深入
* 运行时选择类型，由于你不能将通用表达式作为 React 元素类型。如果你想通过通用表达式来（动态）决定元素类型，你需要首先将它赋值给大写字母开头的变量。
* Props 默认值为 “True”
* 布尔类型、Null 以及 Undefined 将会忽略：助于依据特定条件来渲染其他的 React 元素

性能优化
* 虚拟化长列表：react-window 和 react-virtualized
* React.PureComponent 与 React.memo
* 不可变数据的力量

Portals
* 将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。
* 通过 Portal 进行事件冒泡：其行为和普通的 React 子节点行为一致。

Profiler 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”。 它的目的是识别出应用中渲染较慢的部分

TODO: 测试相关

项目文件结构
* 按功能或路由组织
* 按文件类型组织
* 避免多层嵌套：考虑将单个项目中的目录嵌套控制在最多三到四个层级内。
* 不要过度思考：通常，将经常一起变化的文件组织在一起是个好主意。这个原则被称为 “colocation”。

React 怎么知道 useState 对应的是哪个组件，因为我们并没有传递 this 给 React。
* React 保持对当先渲染中的组件的追踪。
* 与此同时，多亏了 Hook 规范，每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 useState() 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。

分离独立 state 变量的建议：这就很哲学了，一个通用的思考方向就是，如果一个操作会触发多个 setState 操作，就可以考虑它们是否可以归为一个组

调用了 useContext 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以 通过使用 memoization 来优化

函数中看到陈旧的 props 和 state
* 组件内部的任何函数，都是从它被创建的那次渲染中看到的，典型的闭包问题。如果你刻意地想要从某些异步回调中读取最新的 state，你可以用 一个 ref 来保存它，修改它，并从中读取。
* 使用了「依赖数组」优化但没有正确地指定所有的依赖

实现 getDerivedStateFromProps 等同于渲染期间的一次更新

callback ref 与 ref
* 使用 `[]` 作为 `useCallback` 的依赖列表。这确保了 `ref callback` 不会在再次渲染时改变，因此 React 不会在非必要的时候调用它。
* 不使用 useRef 的原因：当 ref 是一个对象时它并不会把当前 ref 的值的变化通知到我们。如果使用 useEffect 监听 `current` 会有如下问题

依赖列表中使用函数是否安全
* 不安全：要记住 effect 外部的函数使用了哪些 props 和 state 很难。这也是为什么通常你会想要在 effect 内部去声明它所需要的函数。这同时也允许你通过 effect 内部的局部变量来处理无序的响应。
* 如果出于某些原因你 无法把一个函数移动到 effect 内部
  * 把函数移动到你的组件之外，这样依赖，这个函数肯定不会依赖任何 props 和 state，通过传参即可知道其依赖那些状态
  * 如果你所调用的方法是一个纯计算，并且可以在渲染时调用，你可以转而在 effect 之外调用它， 并让 effect 依赖于它的返回值。
  * 万不得已的情况下，你可以把函数加入 effect 的依赖但 把它的定义包裹 进 useCallback Hook。这就确保了它不随渲染而改变，除非 它自身的依赖发生了改变

如何从 useCallback 读取一个经常变化的值
* 某些场景中，你需要使用 useCallback 记住一个回调，但由于闭包的原因，读取外部变化的值会读取到旧值
* 解决方案：使用 ref 当做实例变量，并手动保存值

 useContext 不同于 `react-redux` 提供的 `useSelector` 具有选择部分值功能，因此只要 context value 发生的改变，所有 consumer 都会触发重新渲染，大致解决办法如下，来源[issue](https://github.com/facebook/react/issues/15156)
 * 将不会同时变化的值拆分成多个 context
 * 将组件拆分成多个，将有复杂逻辑的组件使用 memo
 * 组件内部使用 useMemo

有趣的 ref 回调
* 不要在 ref 中使用内联函数，这会导致每次重新渲染 ref 都是新的回调函数
* 这会导致每次更新，都会触发两次回调，一次 null 值和一次 dom 值（如果你设计两个函数，会发现传 null 调用就函数，传 dom 调用新函数）
* 这是 react 做的 `clean up` 工作（清理旧的 ref，设置新的 ref），为避免内存泄露。针对的场景就是，previous callback 和 next callback 是两个完全不同的函数。清理工作是必须的，用于闲置引用

dependencies 注意事项
* dependencies 通常指包括参与 React top-down 数据流的数据，比如 props，state 或其他通过他们计算而来的数据
* 在 dependencies 中监听 mutable field 会存在问题，因为他们不能保证在渲染之前改变或者改变它会触发一次渲染。ref 就是一个例子，他在渲染完成之后改变，这会导致滞后，导致运行异常。

具体分析监听 ref.current 存在的问题
* 一开始 current 初始值为 undefined，组件初次渲染完成后，current 被设值为 dom element，但此时 React 无法知道更改成功通知
* 由于某些因素导致组件再次渲染时候，effect 会比较前后两次的值，此时 React 还是把 current 当初 undefined 对待，比较结果为 false，再次触发 effect，虽然其实值并没有发生变化