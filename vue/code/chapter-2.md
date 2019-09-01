# 数据驱动
数据驱动章节

## new Vue
数据驱动：视图是由数据驱动生成的，对视图的修改，不会直接操作 DOM，而是通过修改数据，大大简化了代码量。只关心数据的修改会让代码的逻辑变得非常清晰，因为 DOM 变成了数据的映射，所有的逻辑都是对数据的修改，而不用触碰 DOM，这样的代码非常利于维护。

为什么 data、props、methods、computed 可以通过 vm 直接访问到呢，因为通过 Object.defineProperty 做了一层代理。

> 下划线在编程界默认是私有属性，不应该使用，因为可能在版本更新中被修改。

## $mounted
$mounted 做了什么事情
* 解析 el
* 判断是否有 render 函数，如果有直接执行 render 函数
* 如果没有 render 函数，判断是否有 template 属性，将 template 编译成 render 函数

解析 el 的过程中，我们可以发现 el 是不允许为 body 和 html 元素的，这是因为 render 函数是会将 el 元素替换掉。

> 在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法

## render
根据上述 $mounted 的逻辑，我们已经知道可以手写 render 函数，比如
```js
render(createElement) {
    return createElement('div', {
        attrs: {
            id: 'app'
        }
    }, this.message)
}
```

## Virtual DOM
Virtual DOM 产生的前提是浏览器中的 DOM 是很昂贵的，我们可以通过如下代码把一个简单的 div 元素的属性都打印出来
```js
var div = document.createElement('div')
var str = ''
for(var key in div) {
    str += key + ' '
}
```

Virtual DOM 就是用原生 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。实际上 Vue 中 Virtual DOM 是借鉴了开源库 snabbdom 的实现。

## createElement
createElement 方法实际上是对 _createElement 方法的封装，它允许传入的参数更加灵活，在处理这些参数后，调用真正创建 VNode 的函数 _createElement，_createElement 有 5 个参数
* context：VNode 的上下文环境，它是 Component 类型
* tag：表示标签，它可以是一个字符串，也可以是一个 Component
* data：VNode 的数据，它是一个 VNodeData 类型
* children：当前 VNode 的子节点，它是任意类型的
* normalizationType：子节点规范的类型，类型不同规范的方法也就不一样

对 tag 做判断，如果是 string 类型，则接着判断如果是内置的一些节点，则直接创建一个普通 VNode，如果是为已注册的组件名，则通过 createComponent 创建一个组件类型的 VNode，否则创建一个未知的标签的 VNode。 如果是 tag 一个 Component 类型，则直接调用 createComponent 创建一个组件类型的 VNode 节点。

## update
VNode 渲染成真实的 DOM，本质就是封装的原生操作 DOM 的 API，只是有许多情况需要考虑。

初始化 Vue 到最终渲染的整个过程：new Vue -> init -> $mount -> compile -> render -> vnode -> patch -> DOM