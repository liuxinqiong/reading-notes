## 基础
react-router 在 6.4 版本后引入 Data APIs 新特性
* 需要通过 RouterProvider + createBrowserRouter 进行声明
* 核心 api：loaders、actions、fetchers

## 数据请求
获取数据的几种方式
* Fetch-on-render：先开始渲染组件，每个完成渲染的组件都可能在它们的 effects 或者生命周期中获取数据。这种方式经常导致“瀑布”问题（本该并行发出的请求无意中被串行发送出去）。
* Fetch-then-render：先尽早获取下一屏需要的所有数据，数据准备好后，渲染新的屏幕。但在数据拿到之前，我们什么事也做不了。
* Render-as-you-fetch：先尽早获取下一屏需要的所有数据，然后立刻渲染新的屏幕（在网络响应可用之前就开始）。在接收到数据的过程中，React 迭代地渲染需要数据的组件，直到渲染完所有内容为止。

> 可以想一下传统服务端渲染是怎么干这件事的。

思考如下代码
```js
const Child = () => {
  useEffect(() => {
    // do something here, like fetching data for the Child
  }, []);

  return <div>Some child</div>
};

const Parent = () => {
  // set loading to true initially
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) return 'loading';

  return <Child />;
}
```

## loader 机制
用于在导航期间获取数据，结合嵌套路由，在特定 URL 上的多个布局的所有数据都可以**并行**加载。
```js
<Route
    path="plans/:planId/design"
    element={<Design />}
    // 当渲染、加载数据以及更新数据时，如果发生错误，则会渲染通过 errorElement 指定的组件
    errorElement={<ErrorElement />}
    loader={designLoader}
    // 避免一些重复请求
    shouldRevalidate={(args) => {
        const { currentParams, nextParams } = args;
        return (
            currentParams.projectId !== nextParams.projectId ||
            currentParams.planId !== nextParams.planId
        );
    }}
/>
```

loader 函数中能做什么？
* 返回一个 Promise
* 抛出一个 Error
* redirect 到其他路由（鉴权不通过）

> 可以在 loader 和 action 中抛出任何你想要的东西，如 response、errors 或 objects，这时候将会渲染 errorElement，可以通过 useRouteError 获取

通过 useLoaderData 可以在组件内部获取相关数据。
```js
export function designLoader({ params, request }) {
    return fetch()
}
function Design() {
    const plan = useLoaderData();
    return <div>{plan.name}</div>
}
```

当导航触发时，Design 组件会处于挂起状态，直到 loader 处理完后，才会离开旧的页面，开始渲染 Design 组件，此时 useLoaderData 返回的就是 promise 的 resolve 后的数据。这带来很多好处，组件只需要处理正常的情形即可，不需要管理加载态，不需要管理错误，代码上也会更舒适点，因为不需要判空逻辑。

带来的的影响是，异步逻辑毕竟是耗时的，用户触发跳转后，当前页面就好像失去响应性一般，此时可以通过 useNavigation 进行优化，如添加一个全局 pending ui 提示用户正在加载。相关属性如下
* state
  * idle 空闲
  * loading 表示下一个路由的 loader 正在处理
  * submitting 表示一个路由的 action 正在处理，由 form 通过 post/put/patch/delete 触发
* location：将要前往哪个页面，当导航正在前往新的 URL 且正在加载数据时会有该属性，当导航完成后，该值则为 null
* formData/formAction/formMethod：当前导航正在处理 action 时，会有对应值，完成后则为 null

如果接口十分耗时，如果一直停留在当前页面，则会导致页面假死一般，此时提供了另一个 defer api 让你在加载数据时立即切换到带有占位符的下一个屏幕。
```js
async function loader() {
  let product = await getProduct();
  let reviews = getProductReviews();
  return defer({ product, reviews });
}
```

组件内依旧通过 useLoaderData 获取数据，但如果 defer 的是 promise，则拿到的也是对应的 promise。此时通常会配合 Suspense 实现 fallback ui 提示，已经 Await 组件用于获取 resolve 后数据。
```js
function App() {
    const data = useLoaderData();
    return (
        <Suspense>
            <Await resolve={data.reviews}>
                {(reviews) => <Compo reviews={reviews} />}
            </Await>
        </Suspense>
    )
}
```

> 在 Await 组件内部，如果不使用 render props，也可以在组件内直接使用 useAsyncValue 和 useAsyncError。

## action 机制
它们为应用程序提供了一种通过简单的 HTML 和 HTTP 语义执行数据更新的方法，而 React Router抽 象了异步 UI 和重新验证的复杂性。
```js
async function action({ params, request }) {
    const data = await request.formData();
    return update(params.id, data);
}
```

> action 中可以抛错、redirect、返回 object，通过 useActionData 在组件内获取。action 完成后会再次调用页面上所有的 loader 以确保数据新鲜。

触发方式
* 指令式：Form 组件 or fetcher.Form
* 命令式：useSubmit or fetcher.submit

代码示例
```js
// forms
<Form method="post" action="/songs" />;
<fetcher.Form method="put" action="/songs/123/edit" />;

// imperative submissions
let submit = useSubmit();
submit(data, {
  method: "delete",
  action: "/songs/123",
});
fetcher.submit(data, {
  method: "patch",
  action: "/songs/123/edit",
});
```

当你需要 fetch 数据和路由无关数据时，或是提交数据，但不会触发导航，可以使用 useFetcher。相关属性
* state
  * idle 空闲
  * submitting：fetcher.submit() 使正在执行 action
  * loading：fetcher.load() 调用或是 revalidate
* Form：和 Form 组件类型，但不会触发导航
* load：从 router loader 加载数据
* data：loader 或 action 返回的数据
* formData：当正在处理时，formData 为提交的值，否则为空，可用于实现乐观更新

## 其他
其他 api
* useRouteLoaderData：用于在树中任意节点访问 loader 中数据，需要给 Route 设置 id 属性
* useBeforeUnload：window.onbeforeunload 事件封装，保存重要应用状态时十分有效
* NavLink 组件 style/className/children 均为 render props，可访问到 isActive 和 isPending 属性，用于 ui 高亮显示。内部集成了对于 useMatch 的使用

一些建议
* 推荐始终至少提供一个根级别的 errorElement，因为默认的 errorElement 的 UI 很难看，不适合最终用户使用
* ScrollRestoration 组件会模拟浏览器导航时的滚动恢复，在加载完成后，确保滚动位置恢复到正确的位置，你也可自定义该行为。**推荐仅在根路由使用一次**

与 react-query 等 Data Library 集成
```js
export default function SomeRouteComponent() {
- const data = useLoaderData();
+ const { data } = useQuery(someQueryKey);
}
```
