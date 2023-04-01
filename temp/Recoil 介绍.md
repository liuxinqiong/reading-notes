类 useState 的全局状态管理工具。

<!-- more -->

## 动机
简单、易用、对齐 React 设计思想的全局状态管理工具。状态可以彼此访问，派生新的状态，状态定义是分布式的，方便逻辑下沉与代码分割。

进阶能力：支持异步，支持 Concurrent 模式。

## 同步
核心概念：atom 和 selector
* 使用 atom 定义一个全局状态
* 使用 selector 定义派生状态，虽为 selector，但本质上也是状态，支持 set 操作，用于更新 atom 状态

状态读取（atom 和 selector 无区别）
* useRecoilState
* useRecoilValue/useSetRecoilState/useResetRecoilState

简单代码演示
```js
const fontSizeState = atom({
  key: 'fontSizeState',
  default: 14,
});
const fontSizeLabelState = selector({
  key: 'fontSizeLabelState',
  get: ({get}) => {
    const fontSize = get(fontSizeState);
    const unit = 'px';
    return `${fontSize}${unit}`;
  },
  set: ({set}, value) => {
    set(fontSizeState, value);
  }
});
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  const fontSizeLabel = useRecoilValue(fontSizeLabelState);

  return (
    <></>
  );
}
```

atomFamily 是什么？与简单的 atom 几乎相同，然而默认值也可以被参数化，意味着你可以提供一个函数，接受参数值并返回直接的默认值。

有些场景，selector 需要根据实际情况传递参数，这时候可以使用 selectorFamily helper。区别就是 get 定义为一个高阶函数
```js
const userState = selectorFamily({
    key: 'user',
    get: id => ({get}) => {
        return get(usersState).find(item => item.id === id);
    }
})
```

selector 返回回调函数，回调有助于访问 Recoil 的状态。
```js
const userState = selectorFamily({
    key: 'user',
    get: id => ({get, getCallback}) => {
        const user = get(usersState).find(item => item.id === id);
        const onClick = getCallback(({snapshot}) => () => {})
        return { user, onClick }
    }
})
```

useRecoilCallback：为你的回调提供一个 api，以便与 Recoil 状态一起工作，无需订阅 React 组件在原子或选择器更新时重新渲染。把昂贵的查询延迟到一个你不想在渲染时执行的异步操作。
```js
const logCartItems = useRecoilCallback(({snapshot}) => async () => {
    const numItemsInCart = await snapshot.getPromise(itemsInCart);
    console.log('购物车中内容：', numItemsInCart);
});
```

## 异步
Recoil 允许你在 selector 的数据流种无缝混合同步和异步函数。

selector get 回调中返回一个 promise，任何依赖关系发生变化，都将重新计算并执行新的查询。注意：结果会被缓存起来，所以查询将只对每个独特的输入执行一次。这意味着单一的选择器不应该被用于查询在应用程序的生命周期内会有变化的结果。

> 针对查询将只对每个独特的输入执行一次问题，如果需要处理易变数据，可以考虑添加请求 ID 作为依赖关系，或使用 atomFamily，具体见文档。

如果组件内通过 useRecoilState 访问某个异步 selector 时，组件会处于挂起状态，通常这时候通常会配合 React Suspense 使用，使用 Suspense 边界包裹你的组件，会捕捉到任何仍在 pending 中的后代，并渲染一个后备（fallback） UI。如果请求错误怎么办，推荐使用 React ErrorBoundary 来捕获。

> 关于这一块逻辑，和 Router Data API 设计类似。

有时候你想自己处理挂起状态，而不是使用 Suspense，只需要将 useRecoilState 改为 useRecoilValueLoadable 访问即可，相关属性如下
* state：当前状态，可能值由 hasValue、hasError、loading
* content：当前值，有可能是实际值、Error 对象，或 Promise 对象

## Atom Effects
实验性 API，感觉实验很久了。

