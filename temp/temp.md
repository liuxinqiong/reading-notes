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
* 复用有状态组件太麻烦了，目前的复用方式 Render Props 和 HOC，无论是哪一种方法都会造成组件数量增多，组件树结构的修改
* 生命周期钩子函数里的逻辑太乱了吧：我们通常希望一个函数只做一件事情
* class 让人困惑：主要表现在 this 指向问题和无状态组件到有状态组件的改造

> useState 和 useEffect 解决了函数式组件没有状态和生命周期的问题，但是如何才能把可以复用的逻辑抽离出来，变成一个个可以随意插拔的“插销”呢。其实很简单了，将相关 useState 和 useEffect 抽离出来到一个函数中（常取名为use*），返回 stateName 即可，在组件中就可以直接引用这个函数。

## Hooks 基础
React 内置的基础 Hooks
* useState
  * 参数可以是初始值或者函数形式
  * 把所有 state 都放在同一个 useState 调用中，或是每一个字段都对应一个 useState 调用，这两方式都能跑通。当你在这两个极端之间找到平衡，然后把相关 state 组合到几个独立的 state 变量时，组件就会更加的可读。如果 state 的逻辑开始变得复杂，我们推荐用 reducer 来管理它，或使用自定义 Hook。
  * 如果一个操作，你需要运行多个 setXXX，说明这些 state 的相关的，你可能会考虑放进一个自定义 hook 中，很多时候还可以考虑使用 useReducer hook
* useReducer
  * 通过这种方式可以对多个状态同时进行控制
* useEffect
  * 在函数组件主体内改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因此需要使用 useEffect 完成副作用操作。
  * 用于处理各种状态变化造成的副作用，也就是说只有在特定的时刻，才会执行的逻辑。
  * 回调函数中，我们可以返回一个常用用于清理工作，这是 effect 可选的清除机制，比如事件监听、取消订阅、计时器、中断 Ajax
  * 使用多个 Effect 实现关注点分离，解决面向生命周期编程的问题
* useCallback
  * 返回一个 memoized 函数，该回调函数仅在某个依赖项改变时才会更新。
  * 当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染的子组件时，它将非常有用。因为函数引用未发生改变。
* useMemo
  * 返回一个 memoized 值。当依赖的状态发生改变时，才会触发计算函数的执行。
  * 有助于避免在每次渲染时都进行高开销的计算。
  * 当你把引用对象传递给经过优化的并使用引用相等性去避免非必要渲染的子组件时，它将非常有用。因为对象引用未发生改变。
* useContext
  * context 是在外部 create，内部 use 的 state，它和全局变量的区别在于，数据的改变会触发依赖该数据组件的 reRender。而 useContext hooks 可以帮助我们简化 context 的使用。
* useRef
  * useRef 返回一个可变的 ref 对象，其 `.current` 属性初始化为传递的参数（ initialValue ）。返回的对象将持续整个组件的生命周期。
  * useRef 和 DOM refs 有点类似，但 useRef 是一个更通用的概念，它就是一个你可以放置一些东西的盒子。它可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。
* useImperativeHandle
  * 需要配合 `forwardRef` 使用，用于将 ref 暴露给父组件
* useLayoutEffect
  * 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。
  * 尽可能使用标准的 useEffect 以避免阻塞视觉更新。
* 自定义 hooks
  * 只需要定义一个函数，并且把相应需要的状态和 effect 封装进去
  * Hook 之间也是可以相互引用的。使用 use 开头命名自定义 Hook，这样可以方便 eslint 进行检查。

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
* useReducer Hook 减少了对深层传递回调的需要，通过 context 用 useReducer 往下传一个 dispatch 函数

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