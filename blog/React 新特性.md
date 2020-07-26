React 新特性与周边

## 新Context API
新旧 Context 想解决的问题依旧是相同的："prop drilling"，为跨层级的组件搭建一座桥梁。

旧 Context API 存在的问题
1. 在子组件中使用 Context 会破坏 React 应用的分形架构，但如果根组件树中有任意一个组件使用了支持 props 透传的 Context API，那么如果把包含了这个组件的子组件树单独拿出来，因为缺少了提供 Context 值的根组件树，这时的这个子组件树是无法直接运行的。
大部分对于旧 Context 的使用也采用了订阅监听的形式来规避，例如我们熟知的 Redux，尽管在 React 核心开发者们看来这样做是有缺陷的。
2. 现有的原生 Context API 存在着一个致命的问题，那就是在 Context 值更新后，顶层组件向目标组件 props  透传的过程中，如果中间某个组件的 shouldComponentUpdate  函数返回了 false，因为无法再继续触发底层组件的 reRender，新的 Context 值将无法到达目标组件。这样的不确定性对于目标组件来说是完全不可控的，也就是说目标组件无法保证自己每一次都可以接收到更新后的 Context 值。

> 这里的分形架构指的是从理想的 React 应用的根组件树中抽取的任意一部分都仍是一个可以直接运行的子组件树。在这个子组件树之上再包一层，就可以将它无缝地移植到任意一个其他的根组件树中。

新 Context 除了解决旧 Context 挖的坑，同时期望降低 Context 在用户层面上的复杂度。
1. 祖先被称为 Provider，而孩子被称为 Consumer
2. 通过 React.createContext 来创建，还能初始化 Provider 提供给 Consumer 的 value，可以接收任意需要被放入 Context 中的字符串，数字，甚至是函数。
3. Consumer 必须嵌套在 Provider 中使用，Consumer 的 children 是必须为一个函数
4. 每个 Consumer 只能获取一个 Provider 的值，这看起来确实很不方便，一旦 context 过多就会出现多层嵌套的问题，当然社区已经开始涌现一些解决方案了
5. 新的 Context API 不受单一 store 的限制，每一个 Context 都相当于 store 中的一个分支，我们可以创建多个 Context 来管理不同类型的数据，相应的在使用时也可以只为目标组件上包上需要的 Context Provider。
6. 受益于新的 Context API 的声明式写法，我们终于可以抛开 Connect 轻松地写符合分形要求的业务组件了

使用DEMO
```js
const ThemeContext = React.createContext();

class ThemeProvider extends React.Component{
    render(){
        return (
            <ThemeContext.Provider
                value = {{
                    theme:this.state.theme
                }}
            >
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}

class App extends React.Component{
    render(){
        return (
            <ThemeProvider>
                <ThemeContext.Consumer>
                {context =>(
                    <SubComponent
                        theme={context.theme}
                    >
                    </SubComponent>
                )}
                </ThemeContext.Consumer>
            </ThemeProvider>
        )
    }
}
```

新Context带来的影响
1. 新老 Context 会在下一个 minor 版本中共存，他俩基本不同，不会带来冲突。
2. 对于使用 Context 的类库而言，依然可以在新 Context 下使用现有的监听订阅模式。

## 异常处理机制
在过去，组件内部的 JavaScript 错误会破坏 React 的内部状态，并导致它在下一步的渲染中触发神秘错误 。

UI 部分的一个 JavaScript 错误不应该破坏整个程序。为了给 React 用户解决这个问题，React16 引入了“错误边界”的新概念。

错误边界是在他们的子组件树中 `捕捉JavaScript错误，记录这些错误，并显示一个回退UI的React组件`，而不是崩溃的组件树。

> 注意，错误边界只能捕获树结构中它下面组件中的错误。一个错误边界不能捕获它本身的错误。如果错误边界捕获错误失败，则错误将传播到上面最接近的错误边界。

未被任何异常边界捕获的异常可能会导致整个 React 组件树被卸载。所谓的异常边界即指某个能够捕获它的子元素（包括嵌套子元素等）抛出的异常，并且根据用户配置进行优雅降级地显示而不是导致整个组件树崩溃。异常边界能够捕获渲染函数、生命周期回调以及整个组件树的构造函数中抛出的异常。

componentDidCatch() 方法就好像针对组件的 catch {} 代码块；不过 JavaScript 中的 try/catch 模式更多的是面向命令式代码，而 React 组件本身是声明式模式，因此更适合采用指定渲染对象的模式。

### 在哪里放置错误边界
错误边界的粒度取决于您。您可以包装顶层路由组件来向用户显示“出错”消息，就像服务器端框架经常处理崩溃一样。您还可以将单个小组件封装在错误边界中，以保护它们不致破坏应用程序的其余部分。

## React fiber 算法

## Time Slice 和 Suspense

## Mobox
目的对比 Redux 和 Mobox，Mobox 有哪些不同与改进呢，末尾有资料

## immer
JS 里面的变量类型可以大致分为基本类型和引用类型。在使用过程中，引用类型经常会产生一些无法意识到的副作用，所以在现代 JS 开发过程中，大家都有意识的写下断开引用的不可变数据类型。
```js
var a = [{ val: 1 }]
var b = a.map(item => item.val = 2)
console.log(a[0].val) // 2
```

上面的代码就很危险，我们本意是通过a创造新数组b，却无意中将a的值进行了修改。如果接下来我们需要用到a，很容易发生一些我们难以预料并且难以 debug 的 bug。

一般来说当需要传递一个对象进一个函数时，我们可以使用 Object.assign 或者 ... 对对象进行解构，成功断掉一层的引用。但这里必须有一个清晰的认识，**无论是 Object.assign 还是 ... 的解构操作，断掉的引用也只是一层**，如果对象嵌套超过一层，这样做还是有一定的风险。

可怜的程序员吃了亏之后，多数情况下我们会考虑 深拷贝 这样的操作来完全避免上面遇到的所有问题。深拷贝，顾名思义就是在遍历过程中，如果遇到了可能出现引用的数据类型，就会递归的完全创建一个新的类型。

如果自己书写 `deepClone` 函数往往只能满足简单的应用场景，但是真正在生产工作中，我们需要考虑非常多的因素。因为有太多不确定因素，推荐使用大型开源项目里面的工具函数，比较常用的为大家所熟知的就是 `lodash.cloneDeep`，无论是安全性还是效果都有所保障。

这样的概念我们常称作 immutable ，意为不可变的数据，每当我们创建一个被 deepClone 过的数据，新的数据进行有副作用 (side effect) 的操作都不会影响到之前的数据，这也就是 immutable 的精髓和本质。

然而 deepClone 这种函数虽然断绝了引用关系实现了 immutable，但是开销实在太大。所以在 2014 年，facebook 的 immutable-js 横空出世，即保证了 immutable ，又兼顾了性能。

这里谈谈 immutable 实现的 immer 库。immer 的作者同时也是 mobx 的作者。

与 immutable-js 最大的不同，immer 是使用原生数据结构的 API 而不是内置的 API。

原理：Proxy，更多介绍看末尾资料。

## 动画
所有动画的本质都是连续修改 DOM 元素的一个或者多个属性，使其产生连贯的变化效果，从而形成动画。在 React 中实现动画本质上与传统 web 动画一样，仍然是两种方式： 通过 css3 动画实现和通过 js 修改元素属性。只不过在具体实现时，要更为符合 React 的框架特性，可以概括为几类：
* 基于定时器或 requestAnimationFrame(RAF) 的间隔动画；
* 基于 css3 的简单动画；
* React 动画插件 CssTransitionGroup；
* 结合 hook 实现复杂动画；
* 其他第三方动画库。

更多直接看末尾资料，介绍的很棒。

## 资料
* 感受一下牛人的定义：[基于 React 的高质量坦克大战复刻版](https://qianduan.group/posts/5ace13b39fd64d5a7458a8c7)
* [React 中常见的动画实现方式](https://tech.youzan.com/react-animations/)
* [从新的 Context API 看 React 应用设计模式](https://zhuanlan.zhihu.com/p/33925435)
* [你需要 Mobx 还是Redux？](http://blog.codingplayboy.com/2018/02/11/mobx-vs-redux/)
* [下一代状态管理工具 immer 简介及源码解析](https://zhangzhao.name/2018/02/01/immer%20-%20immutable/)