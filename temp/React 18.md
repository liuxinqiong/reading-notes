React 18 新特性

<!-- more -->

React18 新的 api 都是建立在新的并发渲染器上，并发模式是可选的，只有当你使用并发特性时才会启用，但我们认为它将对人们构建应用程序的方式产生重大影响。

新的 Root API
* 旧 API 默认使用 legacy 传统模式
* 新 API 使用 concurrent 并发模式

Suspense 完整支持
* 声明性地指定组件树的某个部分的加载状态，React18 支持了服务端渲染，对于 SSR 非常友好
* 适合与 transition API 结合使用，如果你在 transition 过程中挂起（suspend）了，React 将会阻止已经可见的内容被 fallback 替换，React 会延迟渲染直到数据加载完毕，避免糟糕的加载状态
* SuspenseList
  * 用于控制多个 Suspense 同时存在时的展示顺序和展示方式
  * 通过 revealOrder prop 为 forwards、backwards、together 控制内部 Suspense 加载顺序

深入 Suspense 组件
* 内置的 lazy 函数实现当相关代码还没有被加载完成时，挂起一个组件，告诉 React 当代码加载完成时进行重新渲染
* 期望添加一个 api 可以对任意组件实现挂起，且给 React 提供一个 Promise，React 不会使用 Promise 的结果，但会重新渲染
* Suspense 是一个让 React 意识到加载状态的机制，没有规定如何获取数据或代码的任何特定选择。
* 使用 useTransition 避免隐藏已经存在的内容，但通过提供 isPending 用于即使反馈
* 通过嵌套 Suspense 避免某个部分特别耗时的部分造成全局等待
* 当内容重新出现时，会重新执行 Layout effects

startTransition API
* 区分紧急更新和非紧急但重更新，有助于保持当前网页的响应性，并能够在同一时间做大量非阻塞的 UI 更新。
* 紧急更新：直观的交互，如输入、悬停、点击
* 非紧急更新，可以使用 startTransition 包裹，ui 状态从 A 状态切换到 B 状态。被 startTransition 回调包裹的 setState 触发的渲染被标记为不紧急的渲染，这些渲染可能被其他紧急渲染所抢占

自动批量更新（automatic batching）
* 在 React 17 和更早版本中，封装了事件响应的批量更新，但这在异步中是不生效的
* 在 React 18 中，如果你使用的是新版 Root API，所有的更新都会被自动批量更新
* 如果在一些挑剔的情况，你不希望批量更新，你可以使用 ReactDOM.flushSync()

新增 hooks
* useId：支持同一个组件在客户端和服务端生成相同的唯一的 ID，避免 hydration 的不兼容。
* useTransition：允许你非阻塞式的更新状态，通过 isPending 可判断 transition 是否在进行中。搭配 Suspense 使用，还可以避免 fallback 的显示
* useDeferredValue 返回一个延迟响应的值。例如一个过滤列表的场景，可以针对列表使用 useDeferredValue 传入输入框对应的值，在与 Suspense 集成时，如果值的更新挂起了 UI，则不会看见 fallback，而是看见旧值。也可用于做性能优化，由于是延迟响应的值，通过 memo 配合，可以延迟一部分 UI 的渲染。是 startTransition 一个使用场景的封装而已
* useSyncExternalStore：用于订阅外部存储，用于将外部状态同步到组件内，大部分情况下推荐下 useState、useReducer 实现，该 api 在集成已存在的非 React code 时十分有用
* useInsertionEffect：useEffect 另一个版本，为 CSS-in-JS 库提供的钩子，这个 Hook 执行时机在 DOM 生成之后，Layout Effect 执行之前
* 新的 startTransition 与 useDeferredValue API，本质上都是允许你将 UI 的一部分标记为较低的更新优先级。

Strict Mode 在开发环境下表现
* 组件将额外渲染一次，以发现由于不纯渲染导致的问题
* 组件将额外执行一次 effects，以发现由于没有 cleanup 导致的问题
* 检查过期 api 的使用

React18 在严格模式中又新增一个行为，以确保它与可重用状态兼容，每当组件**第一次挂载**时，这个新的检查将自动卸载和重新挂载每个组件，在第二次挂载时恢复以前的状态。为什么 React 需要可重用状态
* 帮助你发现一些 effect 需要进行 cleanup 工作。总结就是：如果重新挂载破坏了应用程序的逻辑，这通常会发现现有的错误
* 想要添加的多个特性都有一个约束，需要组件具有弹性，可以多次“安装”和“卸载”。这在 Fast Refresh 中也有所体现，如果你的组件因为偶尔的重新运行 effects 而奔溃，则导致它不能和 Fast Refresh 工作的很好
* 如果你有一个组件会被条件渲染，但组件自身有自己的状态，当组件被卸载时，状态就会丢失，到目前为止，解决办法就是做状态提升。新的 Offscreen API 的主要动机是允许 React 通过隐藏组件而不是卸载它们来保持这样的状态。为了做到这一点，React 将调用与卸载时相同的生命周期钩子，但它也将保留 React 组件和 DOM 元素的状态。

> 在开发过程中，严格模式它将记录额外的警告，双重调用那些它期望幂等的函数，以帮助你将问题提前暴露出来

并发模式是一种新的幕后机制，使 React 能够同时准备多个版本的 UI。你可以把并发看作是一个实现细节，它很有价值，因为它可以解锁一些特性。React 在其内部实现中使用了复杂的技术，如优先队列和多个缓冲。

并发模式是什么？
* 并发渲染是可中断的，在添加任何并发特性之前，更新会在一个单一的、不间断的、同步的事务中呈现。使用同步呈现，一旦更新开始呈现，没有任何东西可以中断它，直到用户可以在屏幕上看到结果。
* 在并发模式中，React 可能会开始渲染一个更新，在中间暂停，然后继续。它甚至可能完全放弃正在进行的渲染。React 保证即使渲染中断，UI 也会显示一致。意味着 UI 可以立即响应用户输入，即使它是在一个大的渲染任务中，从而创建一个流畅的用户体验。

从长远来看，我们希望你添加并发到你的应用程序的主要方式是使用一个支持并发的库或框架。在大多数情况下，您不会直接与并发 api 交互。

## 流式 SSR
在传统的 SSR 模式中，上述流程是串行执行的，如果其中有一步比较慢，都会影响整体的渲染速度。

而在 React 18 中，基于全新的 Suspense，支持了流式 SSR，也就是允许服务端一点一点的返回页面。

## Server Component
Server Component 的本质就是由服务端生成 React 组件，返回一个 DSL 给客户端，客户端解析 DSL 并渲染该组件。

Server Component 带来的优势有
* 零客户端体积，运行在服务端的组件只会返回最终的 DSL 信息，而不包含其他任何依赖。
* 组件拥有完整的服务端能力，可以访问任何服务端 API
* 组件支持实时更新

局限性
* 不能有状态，更适合用在纯展示的组件
* 不能访问浏览器的 API
* props 必须能被反序列化

## OffScreen
OffScreen 支持只保存组件的状态，而删除组件的 UI 部分。可以很方便的实现预渲染，或者 Keep Alive。

为了支持这个能力，React 要求我们的组件对多次安装和销毁具有弹性，要求组件支持 state 不变的情况下，组件多次卸载和重载。

为了方便排查这类问题，在 React 18 的 Strict Mode 中，新增了 double effect，在开发模式下，每次组件初始化时，会自动执行一次卸载，重载。

## 说明
### 移除了 IE 支持
在此版本中，React 将放弃对 Internet Explorer 的支持。我们进行此更改是因为 React 18 中引入的新功能是基于现代浏览器开发的，部分能力在 IE 上是不支持的，比如 microtasks。

如果您需要支持 Internet Explorer，我们建议您继续使用 React 17。

## draft
React 18 新特性
* createRoot
  * render
  * unmount
* 自动批处理
* Concurrent
  * 并发是指具备同时处理多个任务的能力，但不是在同时处理多个，而是有可能交替的进行处理，按照任何的优先级，每次处理一个任务
* Transition Api
  * startTransition 标记非紧急更新
  * useTransition isPending 获取状态
* Suspense
  * 两个用途：动态加载组件、等待异步数据加载
  * 让你组件在渲染之前进入一个特殊的等待状态

wrapPromise 工作机制
* 接受 promise 作为参数
* 当 promise resolved 时，返回 resolved value
* 当 promise rejected 时，throw 对应的 reject value
* 当 promise pending 时，promise 对应 promise 对象
* 提供 read 方法，读取 promise 状态