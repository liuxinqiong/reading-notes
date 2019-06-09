React for Vue developers

这是 JavaScript Weekly 推送的一篇给 Vue 开发者学习 React 的教程，个人觉得写的很精彩，因此这是一篇笔记译文。

<!-- more -->

## React vs Vue
在学习具体内容之前，我们来看看作者的另一篇博客，Why I prefer React over Vue，讲述的是作者为什么更喜欢 React 的几个观点。

作者使用 React 的背景
* 使用 TypeScript
* 从不使用类组件，只使用函数式组件
* 如果需要使用状态管理工具，则使用 Redux + Immer，但总体上尽可能使用 context api + local state

### 喜爱 React 几个观点
更少的 api
* 在 React 最长 import 的
  * Fragment
  * createContext
  * Hooks (useState, useEffect, useContext,…)
* Vue 中有丰富的
  * 组件配置
  * 实例属性
  * 模板指令
* Vue 中有特定的事件监听和自定义事件语法，而 React 中通过 props 完成一切
* slot 插槽，React 中没有插槽，但是 props 已经解决了这个问题

函数式组件
* React 推荐使用函数式组件，这样避免了类和对象开销
* 没有 this 关键字困扰
* props => view

JSX
* 极大的提高了模板的灵活性，不需要 v-for 和 v-if 等指令
* vue 中也可以使用 JSX，但存在一些问题

Fragments
* React 组件并没有返回特定 Dom 节点的限制，你可以返回一个节点列表，同时 `return <>test</>` 是合法的
* 看起来微不足道，但是对于 DOM 节点和 CSS 来说是非常友好的

TypeScript 支持友好
* 函数式组件以及 hooks 等均对 TypeScript 支持友好
* Vue 中也可以使用 TypeScript，但是写法和标准 Vue 组件有很大的差别

总结思考，React 核心观点
* Api 保持简单，声明使，可组合性
* bottom up 的思考方式

接下来步入具体内容吧

## Templates
Vue 使用 HTML 字符 + 指令 的方式提供模板，React 使用 JSX

条件渲染
* React 条件渲染：短路运算符 &&、三目运算符、early return
* Vue 条件渲染：v-if, v-else and v-else-if

列表渲染
* React Array.map 遍历数组 Object.entries 遍历对象
* Vue v-for：可同时遍历对象和数组

class 和 style 绑定
* React 需要手动传递且绑定 className 属性和 style 属性，style 必须是对象，不能是字符串
* Vue 自动绑定到组件的外层 HTML 元素

如果你想传递所有剩余的属性，剩余扩展符很方便
```js
export default function Post({ title, ...props }) {
  return (
    <article {...props}>
      {title}
    </article>
  );
}
```

## Props
关于 Props，两者表现基本类型，唯一的区别就是：React 不会继承不认识的属性
* Vue 使用 v-bind 指令，可简写为 `:`
* React 对于动态值使用大括号即可

## Data
在 Vue 中使用 data 属性存储组件内部状态，在 React 中可以使用 useState Hook。

useState 返回一个两个元素的数组，分别包含当前状态的值和改值的 setter 函数。

v-model 是 Vue 中一个特别方便的指令，用于向下传递一个 value 属性，同时监听 input 事件。看起来像是 Vue 的双向绑定，但仅仅是 `props down, events up` 的语法糖。

在 React 中不存在指令，因此你在懂的 `props down, events up` 的原理后，手动实现即可。

## Computed properties
Vue 中 Computed 属性两大作用
* 避免复杂的逻辑，避免模板中复杂的标记
* cache 功能较少计算

在 React 中
* 如果是为了避免模板中复杂的逻辑，直接通过新建一个变量即可
* 如果需要缓存功能，则需要 useMemo Hook，第一个参数为回调函数用来返回计算后的结果，第二个参数是数组，用来声明依赖

```js
export default function ReversedMessage({ message }) {
  const reversedMessage = useMemo(() => {
    return message.split('').reverse().join('');
  }, [message]);

  return <p>{reversedMessage}</p>;
}
```

## Methods
Vue 通过 methods 属性来声明组件需要用到的函数，React 中直接在组件内部定义函数即可。

## Events
Vue 中通过 `@` 或 `v-on` 监听事件，通过 $emit 触发事件。在 React 中事件没有特殊含义，仅仅表现为一个 callback props。

事件描述符
* 在 Vue 中提供了 prevent、stop 等事件描述符
* React 中不存在这些，你只能手动在事件处理函数中处理或者使用高阶函数

高阶函数阻止默认行为例子
```js
function prevent(callback) {
  return (event) => {
      event.preventDefault();
      callback(event);
  };
}

export default function AjaxForm() {
  function submitWithAjax(event) {
    // ...
  }

  return (
    <form onSubmit={prevent(submitWithAjax)}>
      {/* ... */}
    </form>
  );
}
```

## Lifecycle methods
React 的类组件提供了和 Vue 类似的声明周期，在函数式组件中，绝大多数生命周期相关的问题可以通过 useEffect 生命周期解决。

一个典型的生命周期就是装载的卸载第三方库。在 Vue 中通常在 mounted 中装载，beforeDestroy 中卸载。

使用 useEffect，可以声明一个需要在 render 后执行的副作用，当你从 useEffect 返回一个函数时，当 effect 被清除时，函数会执行。下面的例子就表现为在组件销毁时。
```js
import { useEffect, useRef } from 'react';
import DateTimePicker from 'awesome-date-time-picker';

export default function Component() {
  const dateTimePickerRef = useRef();

  useEffect(() => {
    const dateTimePickerInstance =
      new DateTimePicker(dateTimePickerRef.current);

    return () => {
      dateTimePickerInstance.destroy();
    };
  }, []);

  return <input type="text" ref={dateTimePickerRef} />;
}
```

和 useMemo 类似，useEffect 同样接收一个依赖数组作为第二个参数。

如果没有声明任何依赖，effect 会在每一次 render 后执行，且在下一次 render 之前 clean up，也就是运行 callback。有点像整合了 mounted，updated、beforeUpdated 和 beforeDestroy 生命周期。
```js
useEffect(() => {
    // Happens after every render

    return () => {
        // Optional; clean up before next render
    };
});
```

如果声明了依赖，则只会在依赖改变时执行 effect，举个例子
```js
const [count, setCount] = useState(0);

useEffect(() => {
    // Happens when `count` changes

    return () => {
        // Optional; clean up when `count` changed
    };
}, [count]);
```

总结如下
```js
useEffect(fn) // all state
useEffect(fn, []) // no state
useEffect(fn, [these, states])
```

## Watchers
React 中没有 watchers，但同样可以通过 useEffect hooks 进行实现。

需要注意的是，useEffect 在首次 render 的时候也会执行，如果在 Vue watcher 中配置 immediate 参数一样。如果你不希望在首次 render 的时候也执行，你需要创建一个 ref 去存储首次 render 是否已经执行。
```js
import { useEffect, useRef, useState } from 'react';

export default function AjaxToggle() {
  const [checked, setChecked] = useState(false);
  const firstRender = useRef(true);

  function syncWithServer(checked) {
    // ...
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    syncWithServer(checked);
  }, [checked]);

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => setChecked(!checked)}
    />
  );
}
```

## Slots & scoped slots
在 React 中完成不需要这个概念，直接通过 JSX props 和 render props 可以实现类似的功能。

如果你在组件内部渲染了子模板，React 会将其作为 children props 传入

你可能会玩，如果要实现具名插槽的效果呢？如果只有 children props，你只能实现一个模板的渲染。此时 render props 就可以发挥效果了，你可以实现任意多个。
```js
export default function RedParagraph({ sidebar, children }) {
  return (
    <div className="flex">
      <section className="w-1/3">
        {sidebar}
      </section>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// In use:

return (
  <Layout sidebar={<nav>...</nav>}>
    <Post>...</Post>
  </Layout>
);
```

在 Vue 中，作用域插槽可以为操作传递数据。普通插槽在从父组件得到内容的时候就已经渲染完毕了，父组件决定这个 render fragment 做什么。

而作用域插槽不一样，不能在父组件之前就被渲染，因为它依赖从父组件接受的数据，因此作用域插槽是懒计算的 slot。

懒计算在 JavaScript 中就表现为一个函数，因此在 React 中需要作用域插槽时，依旧可以使用 children 或者 render props，传递一个渲染模板的函数，而不是直接声明模板，此时你需要传递什么数组，就可以通过函数传参的方式实现。

## Provide / inject
在 React 中通过 createContext api 和 useContext hook 实现。
```js
import { createContext, useContext } from 'react';

const fooContext = createContext('foo');

function MyProvider({ children }) {
  return (
    <FooContext.Provider value="foo">
      {children}
    </FooContext.Provider>
  );
}

// Must be rendered inside a MyProvider instance:

function MyConsumer() {
  const foo = useContext(FooContext);

  return <p>{foo}</p>;
}
```

## Custom directives
React 中不存在指令，但绝大多数指令可以解决的问题，使用组件同样可以解决
```js
return (
  <Tooltip text="Hello">
    <div>
      <p>...</p>
    </div>
  </Tooltip>
);
```

## Transitions
React 没有内置任何过渡工具

## 来源
* [react-for-vue-developers](https://sebastiandedeyne.com/react-for-vue-developers)
* [Why I prefer React over Vue](https://sebastiandedeyne.com/why-i-prefer-react-over-vue/)