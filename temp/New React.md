new features and metaframeworks about React

了解 React 18/19 引入的新特性，以及元框架的发展。

<!-- more -->

## React 18
React 18 的主要特性
* automatic batching：这是一个破坏性更新，如果需要强制同步更新，需要使用 flushSync 包裹
* startTransition：用于区分紧急更新和非紧急更新
* new streaming server render：完整支持服务端 Suspense 和 Streaming SSR，抛弃了过时的 Node streaming API（不支持增量式 Suspense streaming）

在传统的 SSR 模式中，上述流程是串行执行的，如果其中有一步比较慢，都会影响整体的渲染速度。而在 React 18 中，基于全新的 Suspense，支持了流式 SSR，也就是允许服务端一点一点的返回页面。

关于 renderToReadableStream 和 renderToPipeableStream 选择
* 如果你使用 Node.js，则用 renderToPipeableStream
* 如果你用 Deno 或支持 Web Streams 的 modern edge runtime，则用 renderToReadableStream

上述特性主要得益于新引入的内置：concurrent rendering，采用渐进增强策略，只有在你使用新特性时才会采用并发渲染，意味着您将能够采用 React 18 而无需重写，并按照自己的节奏尝试新功能。

并发模式是一种新的幕后机制，使 React 能够同时准备多个版本的 UI。你可以把并发看作是一个实现细节，它很有价值，因为它可以解锁一些特性。React 在其内部实现中使用了复杂的技术，如优先队列和多个缓冲。

并发模式是什么？
* 并发渲染是可中断的，在添加任何并发特性之前，更新会在一个单一的、不间断的、同步的事务中呈现。使用同步呈现，一旦更新开始呈现，没有任何东西可以中断它，直到用户可以在屏幕上看到结果。
* 在并发模式中，React 可能会开始渲染一个更新，在中间暂停，然后继续。它甚至可能完全放弃正在进行的渲染。React 保证即使渲染中断，UI 也会显示一致。意味着 UI 可以立即响应用户输入，即使它是在一个大的渲染任务中，从而创建一个流畅的用户体验。

从长远来看，我们希望你添加并发到你的应用程序的主要方式是使用一个支持并发的库或框架。在大多数情况下，您不会直接与并发 api 交互。

> 并发模式在执行过程中，每执行一个 Fiber，都会看看有没有更高优先级的更新，如果有，则当前低优先级的的更新会被暂停，待高优先级任务执行完之后，再继续执行或重新执行。React 会在高优先级更新渲染完成之后，才会启动低优先级更新渲染，并且低优先级渲染随时可被其它高优先级更新中断。对于普通开发者来说，我们一般是不会感知到 CM 的存在的，在升级到 React 18 之后，我们的项目不会有任何变化。需要关注的是基于 CM 实现的上层功能，比如 Suspense、Transitions、streaming server rendering（流式服务端渲染）等

除了渲染更新之外，React 18 还引入了一种有效地获取数据并进行结果记忆的新 API。React 18 现在具有一个缓存函数，它可以记住包装函数调用的结果。如果在同一次渲染过程中使用相同的参数再次调用相同的函数，它将使用记忆化的值，无需再次执行该函数。

在 React 18 中，默认情况下，fetch 调用现在包含了类似的缓存机制，无需使用 cache。这有助于减少单次渲染过程中的网络请求次数，提高应用程序性能并降低 API 成本。这些功能在使用 React Server Components 时非常有用，因为它们无法访问上下文 API。cache 和 fetch 的自动缓存行为允许将单个函数从全局模块导出，并在整个应用程序中重复使用它。

新引入的 API
* useSyncExternalStore：通过强制对存储的更新是同步的，允许外部存储支持并发读取。它在实现对外部数据源的订阅时不需要使用 useEffect，并且推荐用于任何与 React 外部的状态集成的库
* useInsertionEffect：主要用于允许 CSS-in-JS 库解决在渲染中注入样式的性能问题，其他场景并不比推荐使用，这个 hook 会在 DOM 发生变化之后运行，但在 layout effects 之前
* startTransition and useTransition：用于标记非紧急更新
* useDeferredValue：推迟重新渲染树的非紧急部分，返回一个延迟响应的值。例如一个过滤列表的场景，可以针对列表使用 useDeferredValue 传入输入框对应的值，在与 Suspense 集成时，如果值的更新挂起了 UI，则不会看见 fallback，而是看见旧值。也可用于做性能优化，由于是延迟响应的值，通过 memo 配合，可以延迟一部分 UI 的渲染
* useId：用于在客户端和服务器上生成唯一的 id

Strict Mode 在 React 18 中变得更严格了。React 希望添加一个特性，允许 React 在保留状态的同时添加和删除 UI 的部分，比如当用户从一个屏幕切换到另一个屏幕时，React 应该能够立即显示上一个屏幕。要做到这一点，React 将使用与以前相同的组件状态卸载和重新安装树。这个特性将为React 提供更好的性能，但要求组件对多次安装和破坏的影响具有弹性。大多 effect 无需更改即可工作，但部分 effect 假设它们只会挂载和销毁一次。

为了发现这个问题，React 18 为严格模式引入了一个新的仅限开发的检查。**每当组件第一次挂载时，这个新的检查将自动卸载和重新挂载每个组件**，并在第二次挂载时恢复以前的状态，简称 double effect。同时为了避免困惑，移除了 React 17 中为 double render 添加的 console log 抑制，如果你安装了 DevTools，则第二次 log 会是灰色。

React 18 后不在支持 IE，原因是 React 18 使用到了现在浏览器特性，如 microtasks，如果你需要支持 IE，请使用 React 17。

关于 SSR 模式选择
* 在某些情况下，CSR 是页面的正确选择，但很多时候并非如此。即使你的大部分应用是客户端渲染的，通常也会有个别页面可以从服务端渲染功能（如静态站点生成 (SSG) 或服务端渲染 (SSR)）中受益，例如服务条款页面或文档页面。
* 服务端渲染通常会向客户端发送更少的 JavaScript，并生成完整的 HTML，从而通过减少总阻塞时间 (TBD) 来加快首次内容绘制 (FCP)，这也可以降低交互到下一次绘制 (INP)。这就是为什么 Chrome 团队鼓励开发者考虑静态或服务端渲染而非完全客户端渲染的方法，以实现最佳性能。
* 使用服务器渲染也有权衡，并不是每个页面的最佳选择。在服务器上生成页面会产生额外成本并需要时间，这可能会增加首字节时间（TTFB）。性能最佳的应用能够根据每种策略的权衡，为每个页面选择合适的渲染策略。如果您愿意，框架提供了在任何页面上使用服务器渲染的选项，但不会强迫你使用服务器渲染。这允许你为应用中的每个页面选择正确的渲染策略。

### Suspense
虽然 Suspense 在 React 16 中引入，之前 Suspense 仅用于和 React.lazy 实现代码分割，但设计 Suspense 的目标是可以处理任何异步操作，在新版本中 Suspense 在数据获取上扮演更加重要的角色，在未来会可能会暴露更多的底层能力帮助你更容易访问数据，但 Suspense 深度集成到应用架构中会工作的更好（router、data layer and server rendering env）。

Suspense 完整支持
* 声明性地指定组件树的某个部分的加载状态，React 18 支持了服务端渲染，对于 SSR 非常友好
* 适合与 transition API 结合使用，如果你在 transition 过程中挂起（suspend）了，React 将会阻止已经可见的内容被 fallback 替换，React 会延迟渲染直到数据加载完毕，避免糟糕的加载状态

Suspense 包裹的 children 组件是否挂起的几种情形
* 使用 Suspense 支持的框架（如 Relay 和 Next.js）获取数据
* 使用 lazy 进行懒加载的组件
* 使用 use 从 cached Promise 中读取数据

> 用于将数据源与 Suspense 集成的官方 API 将在 React 的未来版本中发布。

### useSyncExternalStore
引入 useSyncExternalStore 的原因？为什么基于订阅会存在问题呢？

目标基于订阅机制的库，将他们的实现切换到该 api 以支持 concurrent 模式。这是因为这些库将自己的状态存储在 React 之外。通过并发渲染，这些数据存储可以在渲染过程中被更新，而不需要 React 知道，在某些情况下可能导致不一致的 UI 甚至错误。

基于 React State 机制：当你改变 React 状态时，React 不会立即改变状态，相反 React 对更新进行排队并安排渲染。当 React 开始渲染时，它会查看整个更新队列，并使用不同的启发式和算法来确定下一个要处理的更新。此过程具有适当的保护措施和语义，以确保呈现始终一致。

假设 React 正在呈现并发更新，并让位于其他工作。在其他工作中，假设 timer 更新了一些其他状态，而不是正在呈现的状态。当发生这种情况时，React 将为稍后的更新排队。一旦 React 开始渲染，它会将更新视为是不相关的，并完成当前的渲染。一旦渲染完成，如果没有其他更新计划，React 将处理第二个更新。相同的场景，但这次我们假设计时器更新已经呈现的相同状态。React 仍然会像以前一样排队，但是现在当 React 开始呈现时，它会看到相同状态有一个更新。所以 React 可以抛弃它已经渲染的内容（已经过时了），并开始进行新的更新。这是性能和用户体验的胜利，因为我们没有浪费时间在过时的更新上，我们也没有向用户显示过时的状态。

React 致力于确保所有状态更新组合的一致性。在 React 内部对状态进行管理，以保持一致的树，同时仍然能够执行复杂的并发和异步行为，这是 React 的关键特性。React 本质上是一个库，用于处理状态更新队列以生成一致的 UI。

但当一个库使用外部状态时，它失去了 React 为保证 React 状态一致性所做的所有努力。使用外部状态，而不是将更新调度到可以按正确顺序处理的队列，状态可以在渲染过程中直接改变。因此，为了支持外部存储，您需要某种方法，1）告诉 React 在渲染期间更新了存储，以便 React 可以再次重新渲染，2）当外部状态改变时，强制 React 中断并重新渲染，3）实现一些其他的解决方案，允许 React 在渲染过程中不改变状态。

### Imperative API
对于大部分应用而言，声明式 API 就足够了，但对于一些设计软件，如图形编辑、音乐编辑等复杂度较高的软件，我们会更需要用到 Imperative API 的方式，于是如何与 React 的声明式结合起来，通常就是一个令人困惑的部分，通常我们**需要 refs 和 effects 的结合使用**，但这在 double effect 中可能会让这个问题更复杂一点，需要知道的是 effect 可能会运行多次，但 ref 依旧只会初始化一次。

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
* 新增 action 和 formAction 属性支持传递函数
* 新增 useActionState hook：接受一个 action 函数，返回一个 wrapped action 函数，当 wrapped 函数被调用时，将返回动作的最后一个结果作为 data
* 新增 useFormStatus hook：方便访问 form 的状态（Context 机制）
* 新增 useOptimistic hook：方便实现乐观更新，会在错误时自动回退值
* 新增 use API：渲染期间读取资源，如读取 promise、context
* 新增 react-dom static API 用于静态站点生成
* React Server Components

React Server Components
* Server Components：在服务器上获取数据并在传送到客户端之前渲染的组件，这样可以将渲染工作移至服务端，并减少需要传送到客户端的代码量
* Server Functions：实现客户端组件调用服务端异步函数，通过 `use server` 指令定义一个 Server Action 时，你的框架将自动创建一个对服务器函数的引用，并将该引用传递给客户端组件。消除了手动 API 调用和复杂状态管理的需要，这在数据变更和表单提交等方面特别有用。

Server Component 的本质就是由服务端生成 React 组件，返回一个 DSL 给客户端，客户端解析 DSL 并渲染该组件。

Server Component 带来的优势有
* 零客户端体积，运行在服务端的组件只会返回最终的 DSL 信息，而不包含其他任何依赖。
* 组件拥有完整的服务端能力，可以访问任何服务端 API
* 组件支持实时更新

Server Component 的局限性
* 不能有状态，更适合用在纯展示的组件
* 不能访问浏览器的 API
* props 必须能被反序列化

> Server Components 通过将路由和数据获取转移到服务器上，并根据渲染的数据（而不仅仅是渲染的路由）对客户端组件进行代码拆分，减少了发送到客户端的 JavaScript 数量，从而帮助解决这些问题，实现最佳的加载顺序。Server Components 不需要服务器。它们可以在 CI 服务器上构建时运行，以创建静态站点生成 (SSG) 应用，或者在 Web 服务器上运行以创建服务端渲染 (SSR) 应用。

更多细节改进
* ref as a prop，你不再需要 forwardRef
* diffs for hydration errors
* context 直接作为 Provider
* cleanup functions for refs
* useDeferredValue 支持初始值
* 支持任意位置渲染 document metadata 信息（title/meta/link）
* 支持预加载资源（prefetchDNS/preconnect/preload/preinit/preinitModule/preloadModule）
* ……

关于资源预加载
* prefetchDNS/preconnect 针对的是域名
* preinit 针对 script 和 style
* preinitModule 针对 ESM 模块
* preload 针对 script、style、font、image 等，但仅下载
* preloadModule 针对 ESM 模块，但仅下载

## 其他
实验性特性 useEffectEvent，是 effect 逻辑的一部分，但表现像是一个 event handler，它内部的逻辑不是响应式的，它总是看到你的 props 和 state 的最新值。主要是解决之前 useEffect 使用中的确存在的问题，之前不得已的解决方式是：禁用 lint 规则或是使用魔法创建一个不可变函数（函数内部总是调用最新的 fn）。

useEffectEvent 的使用限制
* 只能在 effect 内部被调用
* 不允许将其传递给其他组件或 hook

## metaframeworks
在 Next.js 和 Remix 等元框架出现之前，客户端渲染（主要使用 create-react-app 或其他类似的脚手架）是构建 React 应用程序的默认方式。目前 React 已经宣布 create-react-app 不再维护。

大多数生产应用都需要解决诸如路由、数据获取和代码分割等问题。这类集成**构建工具、渲染、路由、数据获取和代码拆分**的工具被称为 “框架”—— 或者如果您更喜欢将 React 本身称为框架，你可以称它们为 “元框架（metaframeworks）”。不仅如此，更是进一步和 React 结合，使得项目更容易使用到诸如 **SSR/RSC/Actions/Optimistic UI/Static pre-rendering** 等特性。

当下 React 元框架的选型很多，主要有 next.js、remix、gatsby、astro。

> 注意：remix 直接合并进 react-router v7 版本中，因此之后的 react-router 将直接作为 metaframework 存在

其中 Gatsby、Astro 和 Next.js、Remix 不是⼀个赛道的，Gatsby 和 Astro 感觉是同类，丰富的⽣态都⽤于⽀持从内容系统中拉取数据，然后⽣成静态⻚⾯站点，本⾝定位是⽤来做“内容驱动⽹站（content-driven websites）” ，不⽤或很少⽤ JavaScript 就可以快速交付⾼性能站点，更适合像营销站点、⽂档站点、blog 、Landing Page 这种场景，不太不适合功能⽐较复杂的应⽤类⽹站。Astro 和 Gatsby 区别是 Astro 并不和 React 进⾏绑定，但你可以轻松集成 React、Vue 等，因此更加⾃由灵活，⽽ Gatsby 则是围绕 React 进⾏构建，⽬前⽽⾔⽣态⽐ Astro 更丰富。

网上讨论比较激烈的是 next.js 和 remix 之间该如何选择，关键特性如 SSR、前后端同构、路由、数据获取等都有提供，构建⼯具 next.js 使⽤⾃研的 turbopack，remix 则使⽤好伙伴 vite，底层都是基于 swc 做代码转译，那么我们该如何做选择评判呢？

关于这两个框架的基础学习，主要关注路由模式、数据加载、数据更改、流式渲染、SSR/RSC，其中路由模式均基于文件系统自动生成路由，只是规则有所不同，不做展开，
* 数据加载：在最初的绝⼤部分 React 应⽤使⽤ CSR 模式，当 JS 代码下载执⾏后，由 React 初始化并开始获取呈现组件所需的数据，这将严重影响低性能设备或互联⽹弱连接的设备的性能。通过支持在服务端执行数据获取，可以提高首屏显示速度
* 数据更改：当涉及到变化时，我们可能都习惯于通过向后端服务器发出 API 请求，然后更新本地状态以反映变化来⾃⼰处理它。通过 form action 机制有利于提高页面的交互性
* 流式渲染：通过延迟非关键数据来加速初始页面生成，结合 Suspense 实现更好的用户体验

### react-router
react-router 支持多种路由策略，分别是框架模式、数据模式和声明模式，声明模式仅提供最基础的路由功能，数据模式通过 loader，action 和 useFetcher api 提供了数据加载（loader 机制）和更改能力（action 机制），框架模式将数据模式与 Vite 插件捆绑在一起，以提供完整的 React Router 体验，如智能代码分割、多种渲染策略（SPA，SSR 和静态渲染）等

react-router 看起来 api 很多，但只需要掌握如下最关键的 api 即可，其余需要时查阅即可
* 基于 loader 机制实现服务端数据加载，如果应用无需 SSR，可通过 clientLoader 加载数据，从而可以轻松部署在静态站点，这一点在 next.js 中好像没有类似方案，注意这种方式要求有合适的鉴权和没有 CORS 限制
* 基于 action + Form 机制实现数据更改，支持 Form 标签声明式调用或 useSubmit 命令式调用，如不想导致导航发生，则直接使用 useFetcher，且使用 Form 标签、useFetcher、useSubmit 时会自动进行 loader 数据重验证
* Steaming with Suspense：使用流式渲染搭配 Suspense 使用，通过延迟非关键数据来加速初始页面生成，在 React 19 可以直接通过 use api 实现组件挂起从而渲染 suspense fallback，当数据完成时开始进行内容绘制，在之前的版本，则需要使用框架自身提供的 Await, useAsyncValue api。

框架约定的特殊文件：react-router.config.ts/routes.ts/root.tsx/.server modules/.client modules

remix 在迁移到 react-router 后，不自动开启基于文件的路由配置，如果需要该特性，需要使用 @react-router/fs-routers 包在特殊文件 routes.ts 中稍加配置。

resource route: 当使用服务端渲染时，routes 也可以做为 resource 而不是渲染组件，如图片、pdf 文件、JSON 数据等，和定义组件没有区别，只是说不会导出默认组件，仅导出 loader 或者 action 即可。

> Without client side routing, the browser will serialize the form's data automatically and send it to the server as the request body for POST, and as URLSearchParams for GET. React Router does the same thing, except instead of sending the request to the server, it uses client side routing and sends it to the route's action function.

在 react-router 中实现 Streaming with Suspense 示例

第一步：loader 中对非关键数据，无需 await。
```js
import type { Route } from "./+types/my-route";

export async function loader({}: Route.LoaderArgs) {
  // note this is NOT awaited
  let nonCriticalData = new Promise((res) =>
    setTimeout(() => res("non-critical"), 5000)
  );

  let criticalData = await new Promise((res) =>
    setTimeout(() => res("critical"), 300)
  );

  return { nonCriticalData, criticalData };
}
```

第二步：使用 Suspense 组件包裹非关键组件，组件内容使用 use hook 进行数据读取
```js
import * as React from "react";
import { Await } from "react-router";

// [previous code]

export default function MyComponent({
  loaderData,
}: Route.ComponentProps) {
  let { criticalData, nonCriticalData } = loaderData;

  return (
    <div>
      <h1>Streaming example</h1>
      <h2>Critical data value: {criticalData}</h2>

      <React.Suspense fallback={<div>Loading...</div>}>
        <NonCriticalUI p={nonCriticalData} />
      </React.Suspense>
    </div>
  );
}

function NonCriticalUI({ p }: { p: Promise<string> }) {
  let value = React.use(p);
  return <h3>Non critical value {value}</h3>;
}
```

### next.js
next.js 核心 api 如下
* 基于 Server Components 实现数据加载
* 基于 Server Actions 实现数据更改，支持通过 Form action 属性调用或事件处理函数中直接调用

next.js 没有类似 react-router clientLoader 机制，但使用 react use hook 配合 use client 同样可以实现类似效果，或直接使用三方库，如 SWR 或 React Query。
```js
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

然后 Client Component 中使用 use hook 读取 promise。
```js
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

由于 next.js 使用 Server Components 加载数据，相比而言 react-router 而言，加载数据的部分本身就聚合在组件内部，实现流式渲染则更为简单，只需要简单对非关键数据直接 Suspense 包裹即可。
```js
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      {/* This content will be sent to the client immediately */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* Any content wrapped in a <Suspense> boundary will be streamed */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

增强版 Form 组件，action 属性支持传递 string 或 function，从而有不同的表现
* 当 action 为 string 时，表现如原生 HTML form 控件，不同的是 next.js 会预加载 URL，且在提交表单时执行客户端导航，而不是重新加载整个页面。这保留了共享的 UI 和客户端状态。
* 当 action 为 function 时，表现则和 React form 组件一样

其他细节优化
* 内置对于 Image、Font 和 Script 自动优化
* 支持 Route Handlers 实现服务端同构 API 设计
* 支持 Middleware 机制实现请求控制

### 对比总结
Next.js 自定了很多的规则，学习成本更高一些，相对⽽⾔，remix 的设计思路是尽可能使⽤标准 Web APIs，如 Request、Response、FormData 等。

## 踩的坑

### 水合错误
在服务器发送 HTML 到 React 开始运⾏之间，任何改变 HTML 的事情都可能导致⽔合错误。

最常见的原因是：在初始化代码中，⽤到了仅 browser 环境才⽀持的 api，就会导致报错，如 window、document、localStorage 等对象。

常见于已有代码中或者第三方库中，并不支持在 SSR 模式中运行，比如常用的 iconfont 图标导入，因为 createFromIconfontCN 会在浏览器环境中创建⼀个带有你指定 url 的 script 标签，如果是浏览器环境就插⼊ body 中。且对应的源码中会修改 dom。

### 导包错误
在使用 remix 的过程中，发现一个奇怪的问题。由于 remix-utils 包采用不同于以往的 exports 到处方式，要正确理解上述导出，tsc 的 moduleResolution 必须设置为 bundler 或 nodenext 才可以，否则会由
于找不到正确模块导致 import resolve 报错。

但将 moduleResolution 设置为 bundler 后，出现了⼀些其他的 tsc 错误，具体如下：
* 错误⼀：从 three pkg 的⼦⽬录导⼊会报错。
* 错误⼆：继承某⽗类的⼦类实例⽆妨访问从⽗类继承过来的⽅法和属性。

经过仔细分析后，上述第⼆个问题本质上还是第⼀个问题，因为我继承的⽗类也是从 three pkg 的⼦⽬录导⼊的。原因是因为 bundler ⽅式⽆法理解这种⽅式，更⽆法理解 node_modules 层级结构（monorepo 中），针对 three 这种情况我们可以通过定义 paths 解决。
```json
{
  "paths": {
    "@/*": ["src/*"],
    "three/*": ["../../node_modules/@types/three/*"]
  },
}
```

### react-responsive ssr
通过 Context 为 node 环境注⼊⼀个默认的宽度供 SSR 使⽤。
```js
import { Context as ResponsiveContext } from 'react-responsive';

<ResponsiveContext.Provider value={{ width: window.innerWidth || 1440 }}>
  <Component {...pageProps} />
</ResponsiveContext.Provider>
```

## 推荐阅读
* [理解 React 服务器组件](https://mp.weixin.qq.com/s/QHKXT1aAtAlNtVt0gec3KQ)
* [React 渲染的未来](https://mp.weixin.qq.com/s/d0Sh0tanTJ6x0jsXcA4PFQ)
* [Merging Remix and React Router](https://remix.run/blog/merging-remix-and-react-router)
