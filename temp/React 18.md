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

自动批量更新（automatic batching）
* 在 React 17 和更早版本中，封装了事件响应的批量更新，但这在异步中是不生效的
* 在 React 18 中，如果你使用的是新版 Root API，所有的更新都会被自动批量更新
* 如果在一些挑剔的情况，你不希望批量更新，你可以使用 ReactDOM.flushSync()

startTransition API
* 区分紧急更新和非紧急但重更新，有助于保持当前网页的响应性，并能够在同一时间做大量非阻塞的 UI 更新。
* 紧急更新：直观的交互，如输入、悬停、点击
* 非紧急更新，可以使用 startTransition 包裹，ui 状态从 A 状态切换到 B 状态。被 startTransition 回调包裹的 setState 触发的渲染被标记为不紧急的渲染，这些渲染可能被其他紧急渲染所抢占

新增 hooks
* useId：调用组件内返回唯一的 id
* useTransition：允许你非阻塞式的更新状态，通过 isPending 可判断 transition 是否在进行中。搭配 Suspense 使用，还可以避免 fallback 的显示
* useDeferredValue 返回一个延迟响应的值。例如一个过滤列表的场景，可以针对列表使用 useDeferredValue 传入输入框对应的值，在与 Suspense 集成时，如果值的更新挂起了 UI，则不会看见 fallback，而是看见旧值。也可用于做性能优化，由于是延迟响应的值，通过 memo 配合，可以延迟一部分 UI 的渲染
* useSyncExternalStore：用于订阅外部存储，用于将外部状态同步到组件内，大部分情况下推荐下 useState、useReducer 实现，该 api 在集成已存在的非 React code 时十分有用
* useInsertionEffect：useEffect 另一个版本，为 CSS-in-JS 库提供的钩子，发生在 DOM 修改之前
* 新的 startTransition 与 useDeferredValue API，本质上都是允许你将 UI 的一部分标记为较低的更新优先级。

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