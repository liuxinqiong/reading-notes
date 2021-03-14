## Why Hooks
Mixins 存在的问题
* 命名空间耦合：如果多个对象同名参数，这些参数就会耦合在一起
* 无法静态检查
* 组件参数不清晰：不知道来源，且易被覆盖

HOC 存在的问题
* 命名空间解耦：每次调用高阶组件，都会生成一个新的组件，因此不会存在命名空间问题
* 支持静态检查
* 没有解决组件参数不清晰问题
* 组件实例增加

Hooks
* 命名空间解耦
* 支持静态检查
* 组件参数清晰
* 单组件实例

## 性能优化
有意识的使用这有两个 memo 的 API，全称 Memoization，分别是 memo 和 useMemo。

## Hooks 实现
Hooks 的限制一定程度上透露出了 Hooks 的实现原理
* Hooks 必须是一个按顺序执行的函数，也就是说，不管整个组件执行多少次，渲染多少次，组件中 Hooks 的顺序都是不会变的。
* Hooks 是 React 函数内部的函数

因此要实现 Hooks 最关键的问题在于两个:
* 找到正在执行的 React 函数
* 找到正在执行的 Hooks 的顺序

设置一个全局对象叫 CurrentOwner，拥有两个属性，第一个值是 current，表示正在执行的组件函数，可以在组件加载和更新时设置它的值，加载或更新完毕之后再设置为 null；第二个属性是 index，它就是 CurrentOwner.current 中 Hooks 的顺序，每次我们执行一个 Hook 函数就自增 1。
```js
const CurrentOwner: {
  current: null | Component<any, any>,
  index: number
} = {
  // 正在执行的组件函数,
  // 在组件加载和重新渲染前设置它的值
  current: null,
  // 组件中 hooks 的顺序
  // 每执行一个 Hook 自增
  index: 0
}
```

实现 getHook 函数，如果 CurrenOwner.current 是 null，那这就不是一个合法的 hook 函数，我们直接报错。如果满足条件，我们就把 hook 的 index + 1，接下来我们把组件的 Hooks 都保存在一个数组里，如果 index 大于 Hooks 的长度，说明 Hooks 没有被创造，我们就 push 一个空对象，避免之后取值发生 runtime error。然后我们直接返回我们的 Hook。
```js
function getHook (): Hook {
  if (CurrentOwner.current === null) {
    throw new Error(`invalid hooks call: hooks can only be called in a component.`)
  }
  const index = CurrentOwner.index++ // hook 在该组件函数中的 index
  const hooks: Hook[] = CurrentOwner.current.hooks // 所有的 hooks
  if (index >= hooks.length) { // 如果 hook 还没有创建
    hooks.push({} as Hook) // 对象就是 hook 的内部状态
  }
  return hooks[index] // 返回正在执行的 hook 状态
}
```

实现 useState 钩子，首先如果 initState 是函数，直接执行它。调用我们我们之前写好的 getHook 函数，它返回的就是 Hook 的状态。接下来就是 useState 的主逻辑，如果 hook 还没有状态的话，我们就先把正在执行的组件缓存起来，然后 useState 返回的就是我们的 hook.state, 其实就是一个数组，第一个值当然就是我们 initState，第一个参数是一个函数，它如果是一个函数，我们就执行它，否则就直接把参数赋值给我们的 hook.state 第一个值，赋值完毕之后我们把当前的组件加入到更新队列，等待更新。
```js

function useState<S> (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  if (isFunction(initialState)) {
    initialState = initialState() // 如果 initialState 是函数就直接执行
  }
  const hook = getHook() as HookState<S> // 找到该函数中对应的 hook
  if (isUndefined(hook.state)) { // 如果 hook 还没有状态
    hook.component = CurrentOwner.current // 正在执行的组件函数，缓存起来
    hook.state = [ // hook.state 就是我们要返回的元组
      initialState,
      (action) => {
        hook.state[0] = isFunction(action) ? action(hook.state[0]) : action
        enqueueRender(hook.component) // 加入更新队列
      }
    ]
  }
  return hook.state // 已经创建 hook 就直接返回
}
```