响应式原理

前端开发最重要的两个工作，一把数据渲染到页面，另一个就是处理用户交互

使用 jQuery 监听事件，修改数据，会遇到的问题
* 我需要修改哪块的 DOM？
* 我的修改效率和性能是不是最优的？
* 我需要对数据每一次的修改都去操作 DOM 吗？
* 我需要 case by case 去写修改 DOM 的逻辑吗？

## 响应式对象
proxy 把 vm.xxx.xx 代理到 vm.xxx 上

defineReactive 的功能就是定义一个响应式对象，给对象动态添加 getter 和 setter

defineReactive 核心原理：Object.defineProperty
* get 依赖收集
* set 派发更新

observe 与 Observer
* observe 方法的作用就是给非 VNode 的对象类型数据添加一个 Observer，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 Observer 对象实例
* Observer 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新

## 依赖收集
什么是依赖收集：订阅数据变化的 watcher 的收集

依赖收集的流程和目的：当响应式数据发生变化，触发他们的 setter 时，能知道应该通知哪些订阅者去做响应的逻辑处理

render 的时候收集依赖，数据更新导致 rerender 时，重新添加

cleanupDeps 函数：针对模板中 v-else 情况，之前模板中依赖该属性，但后面条件改变了，导致不依赖的，此时 watcher 会被移除，避免不必要的重复渲染

过程分析
1. 当对数据对象的访问会触发他们的 getter 方法，那么这些对象什么时候被访问呢？还记得之前我们介绍过 Vue 的 mount 过程是通过 mountComponent 函数，会实例化一个渲染 watcher
2. 渲染 watcher 构造函数逻辑中会执行 get 函数，get 函数中会执行 updateComponent 函数，updateComponent 会执行 vm_render 函数，这个方法会生成渲染 VNode，并且在这个过程中会对 vm 上的数据访问，这个时候就触发了数据对象的 getter。
3. 每个对象值的 getter 都持有一个 dep，在触发 getter 的时候会调用 dep.depend() 方法，也就会执行 Dep.target.addDep(this)。

渲染 watcher、用户 watcher

同时更新多个数据，但对应的是同一个渲染 watcher，这里就是派发更新的可优化地方啦

## 派发更新
什么是派发更新：当数据改变后，通知所有订阅了这个数据变化的 watcher 指定 update

setting 部分的逻辑有两个关键点
* 一个是 childOb = !shallow && observe(newVal)，如果 shallow 为 false 的情况，会对新设置的值变成一个响应式对象
* 一个是 dep.notify()，通知所有的订阅者

派发更新流程与优化：把所有要执行 update 的 watcher 推入到一个队列（queueWatcher）中，同一个 watcher 不会重复执行，在 nextTick 后执行 flushSchedulerQueue

flushSchedulerQueue 中有几个关键点
* 队列排序：queue.sort((a, b) => a.id - b.id) 对队列做了从小到大的排序，主要确保一下几点
  1. 组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的创建也是先父后子，执行顺序也应该保持先父后子。
  2. 用户的自定义 watcher 要优先于渲染 watcher 执行；因为用户自定义 watcher 是在渲染 watcher 之前创建的。
  3. 如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher 执行都可以被跳过，所以父组件的 watcher 应该先执行。
* 队列遍历：在对 queue 排序后，接着就是要对它做遍历，拿到对应的 watcher，执行 watcher.run()。这里需要注意一个细节，在遍历的时候每次都会对 queue.length 求值，因为在 watcher.run() 的时候，很可能用户会再次添加新的 watcher，这样会再次执行到 queueWatcher，这时候 flushing 为 true，就会执行到 else 的逻辑，然后就会从后往前找，找到第一个待插入 watcher 的 id 比当前队列中 watcher 的 id 大的位置。把 watcher 按照 id 的插入到队列中，因此 queue 的长度发送了变化。
* 状态恢复：控制流程状态的一些变量恢复到初始值，把 watcher 队列清空。

## nextTick
回顾运行机制：执行栈、任务队列、宏任务、微任务

在浏览器环境中，常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate；常见的 micro task 有 MutationObserver 和 Promise.then。

nextTick 暴露的接口有
* Vue 原型 $nextTick
* Vue 静态方法 nextTick

nextTick 实现原理
* 关于 macroTimerFunc 依次检查 setImmediate、MessageChannel 支持情况，setImmediate 比 MessageChannel 优先级高，都不支持就降级为 setTimeout
* 关于 microTimerFunc 检查是否支持 Promise，不支持直接降级为 macroTimerFunc
* 提供参数 useMacroTask 默认 false
* nextTick 支持 callback 传参方式和返回 Promise 两种方式

可以有一个可能会犯的理所当然的错误
```js
change() {
    this.$nextTick(() => {
        console.log(this.$refs.msg.innerHTML)
    })
    this.msg = 'Hello Vue'
    console.log(this.$refs.msg.innerHTML)
    this.$nextTick().then(() => {
        console.log(this.$refs.msg.innerHTML)
    })
}
```

这里 nextTick 回调函数中，打印的是修改之前的数据，不要理所当然认为是修改后的数据，因为修改数据也会推到下一个 nextTick 中执行，你手动声明的 $nextTick 比执行 watcher 的 nextTick 先 push 进入 callbacks 中，因此拿到的还是之前的数据

扩展：callBacks push 有点意思
```js
callbacks.push(() => {
    if(cb) {
        try {
            cb.call(ctx)
        } catch(e) {
            handleError(e, ctx, 'nextTick')
        }
    }
})
```

为何不直接 push(cb) 呢，而是要使用 try-catch 包装一下呢？避免单个回调执行失败，导致其他回调不执行的情况

nextTick 是把要执行的任务推到下一个队列中，在下一个 tick 同步执行

数据改变触发 watcher 的 update，但是 watchers 的 flush 是在 nextTick 之后，所以 Vue 中数据变化到 DOM 变化是异步过程。

## 检测变化的注意事项
限制：响应式数据中对于对象新增删除属性以及数组的下标访问修改和添加数据等的变化监测不到。

数组编译函数：push、pop、shift、splice、sort、reverse 为何能被监测到呢？因为 Vue 对函数进行了重写，会手动调用 dep.notify()

通过 Vue.set 以及数组的 API 可以解决这些问题，因为不论是数组 api 而言，或者调用 Vue.set 本质上都是手动调用 dep.notify() 做了依赖更新的派发

Vue.set：target 可能是数组或者是普通对象，key 代表的是数组的下标或者是对象的键值，val 代表添加的值。

## 计算属性和侦听属性
render watcher、user watcher、computed watcher

计算属性实现原理
* 新建 watcher 负责监听每一个计算属性，计算属性可以是一个函数，或者是对象（有 get 函数属性），将函数称为 getter 作为 watcher 参数
* 自身会收集渲染 watcher，内部依赖的响应式属性，自身又会被属性的 dep 收集，从而值改变会重新渲染页面，依赖的响应式数据改变会重新计算值
* computed 的实现其实就是通过 computed watcher 来实现的

侦听属性的几种配置
* 函数形式
* 对象形式
* immediate 参数：立即执行一次
* deep 参数：递归访问对象所有属性，用于触发 getter，从而收集依赖
* sync 参数

侦听属性实现原理：本质是一个 user watcher

计算属性适合用在模板渲染中，某个值是依赖的其他的响应式对象甚至是计算属性计算而来，而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。

## 组件更新
组件更新过程
* 核心就是新旧 diff，对新旧节点相同以及不同的情况分别做不同的处理
* 新旧节点不同的更新流程是：创建新节点 -> 更新父占位符节点 -> 删除旧节点
* 新旧节点相同的更新流程是获取他们的 children，根据不同的情况做不同的更新逻辑

更新过程中虚拟 DOM 的 diff 算法
* vm._vnode 保存上一次的 vnode 数据
* vm.__patch__(prevVnode, vnode)
  * sameVnode 为 true，使用 patchVnode
  * 否则创建新 DOM 节点、更新父占位符节点、删除旧节点
* 寻求最优解：尽可能复用已经生成的 DOM 元素，比如移动、插入

## 回顾
核心实现 Dep：连接数据和观察者
* depend 收集依赖，当前正在计算的 watcher，也就是 Dep.target
* notify 通知更新
* 每个属性、computed 均持有一个 Dep