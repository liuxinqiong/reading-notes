React Hooks 深入与状态逻辑复用发展

最近在公司一个小应用上尝试使用了一下 React Hooks，当然还只是浅尝辄止，于是这个周末计划好好学习一下，无奈周末效率很一般呀，与此同时本文还引申到了 React 状态逻辑复用的发展，其实之前的博客也有谈到过，但回过头来学习，感觉还是有很多不一样的地方。

<!-- more -->

## 内置 hooks
React 内置的 hooks
* Basic Hooks
  * useState
  * useEffect
  * useContext
* Additional Hooks
  * useReducer
  * useCallback
  * useMemo
  * useRef
  * useImperativeHandle
  * useLayoutEffect
  * useDebugValue

### useState
最基本的 api，传入初始值，返回一个数组，得到存储该 state 的变量和修改函数，例子如下
```js
const [count, setCount] = useState(0)
```

### useReducer
useReducer 和 useState 几乎是一样的，需要外置外置 reducer (全局)，通过这种方式可以对多个状态同时进行控制。
```js
function reducer(state, action) {
  switch (action.type) {
    case 'up':
      return { count: state.count + 1 };
    case 'down':
      return { count: state.count - 1 };
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 1 })
  return (
    <div>
      {state.count}
      <button onClick={() => dispatch({ type: 'up' })}>+</button>
      <button onClick={() => dispatch({ type: 'down' })}>+</button>
    </div>
  );
}
```

### useEffect
用于处理各种状态变化造成的副作用，也就是说只有在特定的时刻，才会执行的逻辑。React 保证在 DOM 已经更新完成之后才会运行回调。
```js
const [count, setCount] = useState(0);
useEffect(() => {
    // update
    document.title = `You clicked ${count} times`;
    // => componentWillUnMount
    return function cleanup() {
        document.title = 'app';
    }
}, [count]);
```

其中第二个参数的不同形式，会导致不同的执行情况，具体如下
```js
useEffect(fn) // all state
useEffect(fn, []) // no state
useEffect(fn, [these, states])
```

由于默认情况下，每一次修改状态都会造成重新渲染，可以通过一个不使用的 set 函数来当成 forceUpdate。
```js
const forceUpdate = () => useState(0)[1];
```

### useCallback
一句话总结：useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).

这个有必要深入看看，今天有点晚了，后面补上。

### useImperativeHandle
需要配合 `forwardRef` 使用，用于将 ref 暴露给父组件

### useLayoutEffect
和 `useEffect` 是等价的，但是在 DOM 渲染完成后同步触发

### useDebugValue
为自定义 Hooks 在 React DevTools 展示一个标注。

### useMemo
主要用于渲染过程优化，两个参数依次是计算函数（通常是组件函数）和依赖状态列表，当依赖的状态发生改变时，才会触发计算函数的执行。如果没有指定依赖，则每一次渲染过程都会执行该计算函数。
```js
const [count, setCount] = useState(0);

const memorizedChildComponent = useMemo(() => {
    return <Time />;
}, [count]);
```

关于依赖状态列表为空数组或者 undefined 的不同表现如同 useEffect。

可以实现仅在某些数据变化时重新渲染组件，等同于自带了 shallowEqual 的 shouldComponentUpdate。

### useContext
context 是在外部 create，内部 use 的 state，它和全局变量的区别在于，数据的改变会触发依赖该数据组件的 rerender。而 useContext hooks 可以帮助我们简化 context 的使用。

如果不使用 useContext
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

### useRef
useRef 返回一个可变的 ref 对象，其 .current 属性初始化为传递的参数（ initialValue ）。返回的对象将持续整个组件的生命周期。

> A ref plays the same role as an instance field.

useRef 和 DOM refs 有点类似，但 useRef 是一个更通用的概念，它就是一个你可以放置一些东西的盒子。

获取 input 元素
```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

注意 useRef() 并不仅仅可以用来当作获取 ref 使用，使用 useRef 产生的 ref 的 current 属性是可变的，这意味着你可以用它来保存一个任意值。

## 自定义 Hook
可以通过自定义的 Hook 将组件中类似的状态逻辑抽取出来。

自定义 Hook 非常简单，我们只需要定义一个函数，并且把相应需要的状态和 `effect` 封装进去，同时，Hook 之间也是可以相互引用的。使用 `use` 开头命名自定义 Hook，这样可以方便 `eslint` 进行检查。

举几个常见的例子

日志打点
```js
const useLogger = (componentName, ...params) => {
  useDidMount(() => {
    console.log(`${componentName}初始化`, ...params);
  });
  useUnMount(() => {
    console.log(`${componentName}卸载`, ...params);
  })
  useDidUpdate(() => {
    console.log(`${componentName}更新`, ...params);
  });
};
```

修改 title：根据不同的页面名称修改页面title:
```js
function useTitle(title) {
  useEffect(
    () => {
      document.title = title;
      return () => (document.title = "主页");
    },
    [title]
  );
}
```

双向绑定
```js
function useBind(init) {
  let [value, setValue] = useState(init);
  let onChange = useCallback(function(event) {
    setValue(event.currentTarget.value);
  }, []);
  return {
    value,
    onChange
  };
}
```

生命周期 Hooks
```js
const useDidMount = fn => useEffect(() => fn && fn(), []);
const useDidUpdate = (fn, conditions) => {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMoutRef.current) {
      didMoutRef.current = true;
      return;
    }
    // Cleanup effects when fn returns a function
    return fn && fn();
  }, conditions);
};
const useWillUnmount = fn => useEffect(() => () => fn && fn(), []);
```

解锁更多高级使用
```js
// useHover
const useHover = () => {
  const [hovered, set] = useState(false);
  return {
    hovered,
    bind: {
      onMouseEnter: () => set(true),
      onMouseLeave: () => set(false),
    },
  };
};
function Hover() {
  const { hovered, bind } = useHover();
  return (
    <div>
      <div {...bind}>
        hovered:
        {String(hovered)}
      </div>
    </div>
  );
}
// useField
const useField = (initial) => {
  const [value, set] = useState(initial);

  return {
    value,
    set,
    reset: () => set(initial),
    bind: {
      value,
      onChange: e => set(e.target.value),
    },
  };
}
function Input {
  const { value, bind } = useField('Type Here...');

  return (
    <div>
      input text:
      {value}
      <input type="text" {...bind} />
    </div>
  );
}
```

## Hooks 注意事项与解决问题
使用范围：只能在 React 函数式组件或自定义 Hook 中使用 Hook。

声明约束：不要在循环，条件或嵌套函数中调用 Hook，这一点和 Hook 的工作原理有关。

设计 Hooks 主要是解决 ClassComponent 的几个问题：
* 很难复用逻辑（只能用 HOC，或者 render props），会导致组件树层级很深
* 会产生巨大的组件（指很多代码必须写在类里面）
* 类组件很难理解，比如方法需要 bind，this 指向不明确

## Hooks 原理
相信使用过 `useState` 之后对于 React 在一次重新渲染的时候如何获取之前更新过的 `state` 呢？

我们需要了解到一个 fiber 的概念，每个节点都会有一个对应的Fiber对象，他的数据解构如下：
```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;  // 就是ReactElement的`$$typeof`
  this.type = null;         // 就是ReactElement的type
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.firstContextDependency = null;

  // ...others
}
```

需要注意的是 `this.memoizedState`，这个 `key` 就是用来存储在上次渲染过程中最终获得的节点的 `state` 的，每次执行 `render` 方法之前，React 会计算出当前组件最新的 `state` 然后赋值给 `class` 的实例，再调用 `render`。

执行 `functionalComponent` 的时候，在第一次执行到 `useState` 的时候，他会对应 `Fiber` 对象上的`memoizedState`。

这个属性原来设计来是用来存储 `ClassComponent` 的 `state` 的，因为在 `ClassComponent` 中 `state` 是一整个对象，所以可以和 `memoizedState` 一一对应。

但在 Hooks 中，React 并不知道我们会调用几次 useState，所以在保存 `state` 这件事情上，React 想出了一个比较有意思的方案，那就是调用 `useState` 后设置在 `memoizedState` 上的对象还存在一个 `next` 属性，类似与链表结构，`next` 指向的是下一次 `useState` 对应的 `Hook` 对象。

> 就是因为是以这种方式进行 state 的存储，所以 useState（包括其他的Hooks）都必须在 FunctionalComponent 的根作用域中声明，也就是不能在 if 或者循环中声明


## 扩展：状态逻辑复用的发展
React 状态逻辑复用通常有三种方案：mixin、Hoc、Hook，一句话总结下来就是：`mixin` 已被抛弃，`HOC` 正当壮年，`Hook` 初露锋芒。

### mixin
Mixin（混入）是一种通过扩展收集功能的方式，它本质上是将一个对象的属性拷贝到另一个对象上面去，不过你可以拷贝任意多个对象的任意个方法到一个新对象上去，这是继承所不能实现的。它的出现主要就是为了解决代码复用问题。

很多开源库提供了 Mixin 的实现，如 Underscore 的 _.extend 方法、JQuery 的 extend 方法。

### HOC
高阶组件本质是高阶函数，只不过他场景特定了，该函数接受一个组件作为参数，并返回一个新的组件。

HOC 组件实现的两种方式：属性代理和反向继承

属性代理：函数返回一个我们自己定义的组件，然后在render中返回要包裹的组件，这样我们就可以代理所有传入的props，并且决定如何渲染，实际上 ，这种方式生成的高阶组件就是原组件的父组件
```js
function proxyHOC(WrappedComponent) {
  return class extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

反向继承：返回一个组件，继承原组件，在 render 中调用原组件的 render。由于继承了原组件，能通过this访问到原组件的生命周期、props、state、render等，相比属性代理它能操作更多的属性。
```js
function inheritHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      return super.render();
    }
  }
}
```

HOC 能实现的常见功能
* 组合渲染
* 条件渲染
* 操作 props
* 获取 refs
* 状态管理
* 操作 state（反向继承）

如果组件同时用到多个 HOC，会导致代码难以阅读，我们可以创建一个 compose helper 函数
```js
const compose = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
compose(logger,visible,style)(Input);
```

HOC 的实际应用
* 日志打点：使用高阶组件（HOC）解决横切关注点
* 可用、权限控制
* 双向绑定
* 表单校验

### Redux connect
connect 函数就是高阶函数的思想，通过用法，我们大致可以实现简单 `connect` 原型，但这里不多书，下次起个单独的文章讲述关于 `redux` 和 `react-redux` 的简单实现。
```js
function connect(mapStateToProps, mapDispatchToProps) {
    const stateProps = mapStateToProps(store);
    const dispatchProps = mapDispatchToProps(dispatch)
    return function(WrapperComponent) {
        return function(props) {
            return <WrapperComponent {...props} {...stateProps} {...dispatchProps}/>
        }
    }
}
```

### HOC 注意事项
使用高阶组件的注意事项
* 静态属性拷贝：`hoist-non-react-statics` 自动拷贝所有静态属性
* refs 传递
* 不要在 render 方法内创建高阶组件：作者从 diff 算法的角度说明为啥会有性能问题，在极少数情况下，你需要动态调用 HOC。你可以在组件的生命周期方法或其构造函数中进行调用。
* 不要改变原始组件
* 透传不相关的 props
* 约定-displayName：官方推荐使用 `HOCName(WrappedComponentName)`

关于 refs 传递需要多说两句，使用高阶组件后，获取到的 ref 实际上是最外层的容器组件，而非原组件，但是很多情况下我们需要用到原组件的 ref。我们需要用一个回调函数来完成 ref 的传递。
```js
function hoc(WrappedComponent) {
  return class extends Component {
    getWrappedRef = () => this.wrappedRef;
    render() {
      return <WrappedComponent ref={ref => { this.wrappedRef = ref }} {...this.props} />;
    }
  }
}
@hoc
class Input extends Component {
  render() { return <input></input> }
}
class App extends Component {
  render() {
    return (
      <Input ref={ref => { this.inputRef = ref.getWrappedRef() }} ></Input>
    );
  }
}
```

React 16.3 版本提供了一个 `forwardRef` API 来帮助我们进行 `refs` 传递，这样我们在高阶组件上获取的 `ref` 就是原组件的 `ref` 了，而不需要再手动传递
```js
function hoc(WrappedComponent) {
  class HOC extends Component {
    render() {
      const { forwardedRef, ...props } = this.props;
      return <WrappedComponent ref={forwardedRef} {...props} />;
    }
  }
  return React.forwardRef((props, ref) => {
    return <HOC forwardedRef={ref} {...props} />;
  });
}
```

> 您可能已经注意到 HOC 与容器组件模式之间有相似之处。容器组件担任分离将高层和低层关注的责任，由容器管理订阅和状态，并将 prop 传递给处理渲染 UI。HOC 使用容器作为其实现的一部分，你可以将 HOC 视为参数化容器组件。

### Render Props
renderProps 就是一种将 render 方法作为 props 传递到子组件的方案，相比 HOC 的方案，renderProps 可以保护原有的组件层次结构。在我看来，同时提供了花式渲染的更多可能。

最常见例子
```js
class Mouse extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  }

  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

function App() {
  return (
    <div style={{ height: '100%' }}>
      <Mouse render={({ x, y }) => (
          // render prop 给了我们所需要的 state 来渲染我们想要的
          <h1>The mouse position is ({x}, {y})</h1>
        )}/>
    </div>
  );
}
```

## 参考
* [深入浅出 React Hooks](https://www.v2ex.com/amp/t/570176)
* [从 Mixin 到 HOC 再到 Hook](https://juejin.im/post/5cad39b3f265da03502b1c0a)
* [阅读源码后，来讲讲React Hooks是怎么实现的](https://juejin.im/post/5bdfc1c4e51d4539f4178e1f)
* [useHooks~小窍门](https://mp.weixin.qq.com/s/fp-GNIcz5zwrikcM0648DQ) 很多使用的 hooks 实例