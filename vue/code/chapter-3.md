组件化

render 函数：createElement 传的参数是一个组件，而不是原生标签

## createComponent
createElement 会对参数 tag 做判断，如果是一个普通的 html 标签，实例化一个普通的 VNode 节点，否则通过 createComponent 创建一个组件 VNode

createComponent 关键步骤
* 构造子类构造函数
* 安装组件钩子函数
* 实例化 vnode

Vue.extend 的作用就是这个对象转换成一个继承于 Vue 的构造函数

## patch
patch 整体流程：createComponent -> 子组件初始化 -> 子组件 render -> 子组件 patch

activeInstance 为当前激活的 vm 实例，方便建立 父子关系

vm.$vnode 为组件的占位 vnode，vm._vnode 为组件的渲染 vnode，vm._vnode.parent === vm.$vnode

嵌套组件的插入顺序是先子后父

## 合并配置
new Vue 的过程通常有 2 种场景
* 一种是外部我们的代码主动调用 new Vue(options) 的方式实例化一个 Vue 对象；
* 另一种是我们上一节分析的组件过程中内部通过 new Vue(options) 实例化子组件。

外部调用场景
* 把 Vue.options 和传入的 options 做合并
* Vue.options 在 initGlobalAPI 有定义，首先通过 Object.create(null) 创建空对象，然后遍历 ASSET_TYPES 对 Vue.options 赋值
* 通过 extend(Vue.options.components, builtInComponents) 把一些内置组件扩展到 Vue.options.components 上。Vue 的内置组件目前有 `<keep-alive>`、`<transition>` 和 `<transition-group>` 组件，这也就是为什么我们在其它组件中使用 `<keep-alive>` 组件不需要注册的原因


外部调用场景是通过 mergeOption，并遵循一定的合并策略。组件合并通过 initInternalComponent 合并。

框架、库的设计都是类似的，自身定义了默认配置，同时可以在初始化阶段传入配置，然后 merge 配置，来达到定制化不同需求的目的

## 生命周期
生命周期就是在初始化以及数据更新过程中各个阶段执行不同的钩子函数
* created 中可以访问到数据
* mounted 中可以访问到 DOM
* destroyed 中可以做一些定时器销毁工作

beforeCreate 和 created 的主要区别在于 initState 前后，initState 的作用是初始化 props、data、methods、watch、computed 等属性。vue-router 和 vuex 的时候会发现它们都混合了 beforeCreate 钩子函数。

beforeMounted、beforeDestroy 先父后子

mounted、destroyed 先子后父

activated 和 deactivated 钩子函数是专门为 keep-alive 组件定制的钩子

## 组件注册
由于我们每个组件的创建都是通过 Vue.extend 继承而来，在 mergeOptions 中，会把 Vue.options 合并到 Sub.options，也就是组件的 options 上， 然后在组件的实例化阶段，会执行 merge options 逻辑，把 Sub.options.components 合并到 vm.$options.components 上。

有全局注册和局部注册两种方式，具体区别在 mergeOptions
* 全局注册的 option 位于全局 Vue.options 上，因此最终所有组件都会拥有这个 option
* 局部注册的 option 位于自身 options 上，因此局部注册只能在当前组件内使用

局部注册和全局注册不同的是，只有该类型的组件才可以访问局部注册的子组件，而全局注册是扩展到 Vue.options 下，所以在所有组件创建的过程中，都会从全局的 Vue.options.components 扩展到当前组件的 vm.$options.components 下，这就是全局注册的组件能被任意使用的原因。

基础组件建议全局注册，而业务组件建议局部注册

## 异步组件
异步组件：性能优化，减少水平的包体积

在我们平时的开发工作中，为了减少首屏代码体积，往往会把一些非首屏的组件设计成异步组件，按需加载。Vue 也原生支持了异步组件的能力

异步组件实现原理：配合 webpack 语法糖

异步组件本身是两次渲染，先渲染成一个注释节点，然后当组件加载成功后，再通过 forceUpdate 重新渲染

异步组件的三种实现方式

工厂函数方式
```js
Vue.component('async-example', function (resolve, reject) {
   // 这个特殊的 require 语法告诉 webpack，自动将编译后的代码分割成不同的块，这些块将通过 Ajax 请求自动下载。
   require(['./my-async-component'], resolve)
})
```

Promise 方式
```js
Vue.component('async-example',
    // import 函数返回一个 Promise 对象
    () => import('./my-async-component')
)
```

高级异步组件：由于异步加载组件需要动态加载 JS，有一定网络延时，而且有加载失败的情况，所以通常我们在开发异步组件相关逻辑的时候需要设计 loading 组件和 error 组件，并在适当的时机渲染它们。Vue.js 2.3+ 支持了一种高级异步组件的方式，它通过一个简单的对象配置，帮你搞定 loading 组件和 error 组件的渲染时机，你完全不用关心细节，非常方便。
```js
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./MyComp.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})
Vue.component('async-example', AsyncComp)
```

扩展：保证一个方法只执行一次
```js
export function one(fn) {
    let called = false
    return function() {
        if(!called) {
            called = true
            fn.apply(this, arguments)
        }
    }
}
```