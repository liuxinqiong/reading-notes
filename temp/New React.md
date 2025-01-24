new React

<!-- more -->

## React 18
React 18 的主要特性
* automatic batching：这是一个破坏性更新，如果需要强制同步更新，需要使用 flushSync 包裹
* startTransition：用于区分紧急更新和非紧急更新
* new streaming server render：完整支持服务端 Suspense 和 Streaming SSR，抛弃了过时的 Node streaming API，因为其不支持增量式 Suspense streaming

上述特性主要得益于新引入的内置：concurrent rendering，采用渐进增强策略，只有在你使用新特性时才会采用并发渲染，意味着您将能够采用 React 18 而无需重写，并按照自己的节奏尝试新功能。

新引入的 API
* useSyncExternalStore：通过强制对存储的更新是同步的，允许外部存储支持并发读取。它在实现对外部数据源的订阅时不需要使用 useEffect，并且推荐用于任何与 React 外部的状态集成的库
* useInsertionEffect：主要用于允许 CSS-in-JS 库解决在渲染中注入样式的性能问题，其他场景并不比推荐使用，这个 hook 会在 DOM 发生变化之后运行，但在 layout effects 之前
* startTransition and useTransition：用于标记非紧急更新
* useDeferredValue：推迟重新渲染树的非紧急部分
* useId：用于在客户端和服务器上生成唯一的 id

Strict Mode 在 React 18 中变得更严格了。React 希望添加一个特性，允许 React 在保留状态的同时添加和删除 UI 的部分，比如当用户从一个屏幕切换到另一个屏幕时，React 应该能够立即显示上一个屏幕。要做到这一点，React 将使用与以前相同的组件状态卸载和重新安装树。这个特性将为React 提供更好的性能，但要求组件对多次安装和破坏的影响具有弹性。大多 effect 无需更改即可工作，但部分 effect 假设它们只会挂载和销毁一次。

为了发现这个问题，React 18 为严格模式引入了一个新的仅限开发的检查。每当组件第一次挂载时，这个新的检查将自动卸载和重新挂载每个组件，并在第二次挂载时恢复以前的状态，简称 double effect。同时为了避免困惑，移除了 React 17 中为 double render 添加的 console log 抑制，如果你安装了 DevTools，则第二次 log 会是灰色。

React 18 后不在支持 IE，原因是 React 18 使用到了现在浏览器特性，如 microtasks，如果你需要支持 IE，请使用 React 17。

在之前的版本中，Suspense 仅用于和 React.lazy 实现代码分割，设计 Suspense 的目标是可以处理任何异步操作，在新版本中 Suspense 在数据获取上扮演更加重要的角色，在未来会可能会暴露更多的底层能力帮助你更容易访问数据，但 Suspense 深度集成到应用架构中会工作的更好（router、data layer and server rendering env）

### useSyncExternalStore
引入 useSyncExternalStore 的原因？为什么基于订阅会存在问题呢？

目标基于订阅机制的库，将他们的实现切换到该 api 以支持 concurrent 模式。这是因为这些库将自己的状态存储在 React 之外。通过并发渲染，这些数据存储可以在渲染过程中被更新，而不需要 React 知道，在某些情况下可能导致不一致的 UI 甚至错误。

基于 React State 机制：当你改变 React 状态时，React 不会立即改变状态，相反，React 对更新进行排队并安排渲染。当 React 开始渲染时，它会查看整个更新队列，并使用不同的启发式和算法来确定下一个要处理的更新。此过程具有适当的保护措施和语义，以确保呈现始终一致。

假设 React 正在呈现并发更新，并让位于其他工作。在其他工作中，假设 timer 更新了一些其他状态，而不是正在呈现的状态。当发生这种情况时，React 将为稍后的更新排队。一旦 React 开始渲染，它会将更新视为是不相关的，并完成当前的渲染。一旦渲染完成，如果没有其他更新计划，React 将处理第二个更新。相同的场景，但这次我们假设计时器更新已经呈现的相同状态。React 仍然会像以前一样排队，但是现在当 React 开始呈现时，它会看到相同状态有一个更新。所以 React 可以抛弃它已经渲染的内容（已经过时了），并开始进行新的更新。这是性能和用户体验的胜利，因为我们没有浪费时间在过时的更新上，我们也没有向用户显示过时的状态。

React 致力于确保所有状态更新组合的一致性。在 React 内部对状态进行管理，以保持一致的树，同时仍然能够执行复杂的并发和异步行为，这是 React 的关键特性。React 本质上是一个库，用于处理状态更新队列以生成一致的 UI。

但当一个库使用外部状态时，它失去了 React 为保证 React 状态一致性所做的所有努力。使用外部状态，而不是将更新调度到可以按正确顺序处理的队列，状态可以在渲染过程中直接改变。因此，为了支持外部存储，您需要某种方法，1）告诉 React 在渲染期间更新了存储，以便 React 可以再次重新渲染，2）当外部状态改变时，强制 React 中断并重新渲染，3）实现一些其他的解决方案，允许 React 在渲染过程中不改变状态。

### Imperative API
对于大部分应用而言，声明式 API 就足够了，但对于一些设计软件，如图形编辑、音乐编辑等复杂度较高的软件，我们会更需要用到 Imperative API 的方式，于是如何与 React 的声明式结合起来，通常就是一个令人困惑的部分，通常我们需要 refs 和 effects 的结合使用，但这在 double effect 中可能会让这个问题更复杂一点，需要知道的是 effect 可能会运行多次，但 ref 依旧只会初始化一次。

比如如下方式你会得到一个 broken 实例。
```js
// A Ref (or Memo) is used to init and cache some imperative API.
const ref = useRef(null);
  if (ref.current === null) {
  ref.current = new SomeImperativeThing();
}

// Note this could be useLayoutEffect too; same pattern.
useEffect(() => {
  const someImperativeThing = ref.current;
  return () => {
    // And an unmount effect (or layout effect) is used to destroy it.
    someImperativeThing.destroy();
  };
}, []);
```

因此你可能需要这么干
```js
// Don't use a Ref to initialize SomeImperativeThing!

useEffect(() => {
  // Initialize an imperative API inside of the same effect that destroys it.
  // This way it will be recreated if the component gets remounted.
  const someImperativeThing = new SomeImperativeThing();

  return () => {
    someImperativeThing.destroy();
  };
}, []);
```

但上述方式有个严重弊端，因为该实例你很可能需要在其他 fn 中使用（如 event handlers），此时你可以配合 ref 进行实例存储。
```js
// Use a Ref to hold the value, but initialize it in an effect.
const ref = useRef(null);

useEffect(() => {
  // Initialize an imperative API inside of the same effect that destroys it.
  // This way it will be recreated if the component gets remounted.
  const someImperativeThing = ref.current = new SomeImperativeThing();

  return () => {
    someImperativeThing.destroy();
  };
}, []);

const handleThing = (event) => {
  const someImperativeThing = ref.current;
  // Now we can call methods on the imperative API...
};
```

> 有些 react hooks 库会提供类似 useCreation 的 hook，本质原理就是如此。

## React 19
React Compiler：通过自动 memo 优化你 React 应用的 build-time 工具，帮助开发者无需使用 useMemo、useCallback、React.memo 等。严格来说并不属于 React 19，而是一个 babel 插件的形式。

React 19 新特性
* useTransition 支持异步函数，从而自动处理加载状态
* form 组件支持 action 和 formAction 属性传递函数
* 新增 useActionState hook：接受一个 action 函数，返回一个 wrapped action 函数，当 wrapped 函数被调用时，将返回动作的最后一个结果作为 data
* 新增 useFormStatus hook：方便访问 form 的状态（Context 机制）
* 新增 useOptimistic hook：方便实现乐观更新，会在错误时自动回退值
* 新增 use API：渲染期间读取资源，如读取 promise、context
* 新增 react-dom static API 用于静态站点生成
* React Server Components

React Server Components
* Server Components
* Server Actions：实现客户端组件调用服务端异步函数，但你通过 `use server` 指令定义一个 Server Action 时，你的框架将自动创建一个对服务器函数的引用，并将该引用传递给客户端组件

其他一些改进
* ref as a prop，你不再需要 forwardRef
* Diffs for hydration errors
* Context 直接作为 Provider
* Cleanup functions for refs
* useDeferredValue 支持初始值
* 支持任意位置渲染 document metadata 信息（title/meta/link）
* 支持预加载资源（prefetchDMS/preconnect/preload/preinit）
* ……

## BEFORE
React18 新的 api 都是建立在新的并发渲染器上，并发模式是可选的，只有当你使用并发特性时才会启用，但我们认为它将对人们构建应用程序的方式产生重大影响。

新的 Root API
* 旧 API 默认使用 legacy 传统模式
* 新 API 使用 concurrent 并发模式

Suspense 完整支持
* 声明性地指定组件树的某个部分的加载状态，React 18 支持了服务端渲染，对于 SSR 非常友好
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



## React
React 值得关注的新特性
* Server Components：React Server Components 是在服务器上获取数据并在传送到客户端之前渲染的组件，这样可以将渲染工作移至服务端，并减少需要传送到客户端的代码量。
* React Compiler：React Compiler 是一个可以自动进行组件 memoize 的编译器。可以通过减少不必要的重新渲染来提高性能。React 团队表示开发人员可以在不进行任何代码更改的情况下采用 React Compiler。
* Server Actions：Server Actions 实现了客户端到服务器端的通信。借助 Server Actions，我们可以定义可以直接从 React 组件中调用的服务端功能，消除了手动 API 调用和复杂状态管理的需要，这在数据变更和表单提交等方面特别有用。

React 18 新特性
* Concurrent Mode
  * 在执行过程中，每执行一个 Fiber，都会看看有没有更高优先级的更新，如果有，则当前低优先级的的更新会被暂停，待高优先级任务执行完之后，再继续执行或重新执行。React 会在高优先级更新渲染完成之后，才会启动低优先级更新渲染，并且低优先级渲染随时可被其它高优先级更新中断。
  * 对于普通开发者来说，我们一般是不会感知到 CM 的存在的，在升级到 React 18 之后，我们的项目不会有任何变化。需要关注的是基于 CM 实现的上层功能，比如 Suspense、Transitions、streaming server rendering（流式服务端渲染） 等
  * 新的 api：startTransition 和 useDeferredValue
* 自动批处理：Automatic Batching，这是一个破坏性更新，可能会导致已有代码出现 bug，如果还需要同步更新，使用 flushSync api
* 三方库 api 支持
  * useId：在客户端和服务端生成唯一的 ID，同时避免 hydration 的不兼容。
  * useSyncExternalStore：让组件在并发下安全地有效地读取外接数据源。在 Concurrent Mode 下，React 一次渲染会分片执行（以 fiber 为单位），中间可能穿插优先级更高的更新。假如在高优先级的更新中改变了公共数据（比如 redux 中的数据），那之前低优先的渲染必须要重新开始执行，否则就会出现前后状态不一致的情况。
  * useInsertionEffect：解决 CSS-in-JS 库在渲染中动态注入样式的性能问题。除非你已经构建了一个 CSS-in-JS 库，否则我们不希望你使用它。这个 Hook 执行时机在 DOM 生成之后，Layout Effect 执行之前。
* 严格模式 double effect：开发模式渲染组件时，会自动执行一次卸载，再重新加载的行为，以便检查组件是否支持 state 不变，组件卸载重载的场景。
* 流式 SSR
* Server Component
  * 零客户端体积
  * 组件拥有完整的服务端能力
  * 组件支持实时更新
* OffScreen

React 19 新特性
* useMemo, useCallback, memo => React compiler
* 在 18 中，useTransition 返回的 startTransition 只支持传递同步函数，而在 19 中，增加了对异步函数的支持。通过这个特性，我们可以用来自动维护异步请求的 isPending 状态
* forwardRef => ref：在之前，父组件传递 ref 给子组件，子组件如果要消费，则必须通过 forwardRef 来消费。React 19 开始，不需要使用 forwardRef 了，ref 可以作为一个普通的 props 了。
* Context：在 React 19 中，我们可以使用 Context来代替 Context.Provider 了
* ref 支持返回 cleanup 函数
* useDeferredValue 增加了 initialValue 参数
* 支持 Document Metadata
* Server Components 和 Server Actions 将成为稳定特性
* new hooks
  * useActionState 管理异步函数状态
  * useOptimistic 乐观更新
  * useFormStatus 获取表单状态：用来快捷读取到最近的父级 form 表单的数据，其实就是类似 Context 的封装
  * use：use 是 React 19 新增的一个特性，支持处理 Promise 和 Context
    * use 接收一个 Promise，会阻塞 render 继续渲染，通常需要配套 Suspense 处理 loading 状态，需要配套 ErrorBoundary 来处理异常状态。
    * use 也支持接收 Context，类似之前的 useContext，但比 useContext 更灵活，可以在条件语句和循环中使用。

[New Features in React 19 – Updates with Code Examples](https://www.freecodecamp.org/news/new-react-19-features/)


## 其他
另一个重要的新并发特性是 Suspense。虽然 Suspense 在 React 16 中引入，主要用于代码拆分，并且与 React.lazy 已经存在了一段时间，但 React 18 引入了新的能力，使得 Suspense 能够处理数据获取。

Suspense 真正的威力来自于它与 React 并发特性的深度集成。当一个组件被暂停（例如因为它仍在等待数据加载），React 不会空闲地等待组件接收数据。相反，它暂停了被挂起组件的渲染，并将重点转向其他任务。

除了渲染更新之外，React 18 还引入了一种有效地获取数据并进行结果记忆的新 API。React 18 现在具有一个缓存函数，它可以记住包装函数调用的结果。如果在同一次渲染过程中使用相同的参数再次调用相同的函数，它将使用记忆化的值，无需再次执行该函数。

在 React 18 中，默认情况下，fetch 调用现在包含了类似的缓存机制，无需使用 cache。这有助于减少单次渲染过程中的网络请求次数，提高应用程序性能并降低 API 成本。这些功能在使用 React Server Components 时非常有用，因为它们无法访问上下文 API。cache 和 fetch 的自动缓存行为允许将单个函数从全局模块导出，并在整个应用程序中重复使用它。

React Server Components 允许开发人员构建适用于服务器和客户端的组件，将客户端应用程序的交互性与传统服务器渲染的性能结合起来，同时避免 hydration 的成本。

扩展的 Suspense 功能通过允许部分应用程序在其他可能需要更长时间来获取数据的部分之前渲染，提高了加载性能。