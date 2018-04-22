## 新旧Context API
新旧 Context 想解决的问题依旧是相同的："prop drilling"，为跨层级的组件搭建一座桥梁。

旧 Conetxt API 存在的问题
1. 在子组件中使用 Context 会破坏 React 应用的分形架构，但如果根组件树中有任意一个组件使用了支持 props 透传的 Context API，那么如果把包含了这个组件的子组件树单独拿出来，因为缺少了提供 Context 值的根组件树，这时的这个子组件树是无法直接运行的。
大部分对于旧 Context 的使用也采用了订阅监听的形式来规避，例如我们熟知的 Redux，尽管在 React 核心开发者们看来这样做是有缺陷的。
2. 现有的原生 Context API 存在着一个致命的问题，那就是在 Context 值更新后，顶层组件向目标组件 props  透传的过程中，如果中间某个组件的 shouldComponentUpdate  函数返回了 false，因为无法再继续触发底层组件的 rerender，新的 Context 值将无法到达目标组件。这样的不确定性对于目标组件来说是完全不可控的，也就是说目标组件无法保证自己每一次都可以接收到更新后的 Context 值。

> 这里的分形架构指的是从理想的 React 应用的根组件树中抽取的任意一部分都仍是一个可以直接运行的子组件树。在这个子组件树之上再包一层，就可以将它无缝地移植到任意一个其他的根组件树中。

新 Context 除了解决旧 Context 挖的坑，同时期望降低 Context 在用户层面上的复杂度。
1. 祖先被称为 Provider，而孩子被称为 Consumer
2. 通过 React.createContext 来创建，还能初始化 Provider 提供给 Comsumer 的 value，可以接收任意需要被放入 Context 中的字符串，数字，甚至是函数。
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
在过去，组件内部的JavaScript错误会破坏React的内部状态，并导致它在下一步的渲染中触发神秘错误 。

UI部分的一个JavaScript错误不应该破坏整个程序。为了给React用户解决这个问题，React16引入了“错误边界”的新概念。

错误边界是在他们的子组件树中`捕捉JavaScript错误，记录这些错误，并显示一个回退UI的React组件`，而不是崩溃的组件树。

> 注意，错误边界只能捕获树结构中它下面组件中的错误。一个错误边界不能捕获它本身的错误。如果错误边界捕获错误失败，则错误将传播到上面最接近的错误边界。

未被任何异常边界捕获的异常可能会导致整个 React 组件树被卸载。所谓的异常边界即指某个能够捕获它的子元素（包括嵌套子元素等）抛出的异常，并且根据用户配置进行优雅降级地显示而不是导致整个组件树崩溃。异常边界能够捕获渲染函数、生命周期回调以及整个组件树的构造函数中抛出的异常。

componentDidCatch() 方法就好像针对组件的 catch {} 代码块；不过 JavaScript 中的 try/catch 模式更多的是面向命令式代码，而 React 组件本身是声明式模式，因此更适合采用指定渲染对象的模式。

### 在哪里放置错误边界
错误边界的粒度取决于您。您可以包装顶层路由组件来向用户显示“出错”消息，就像服务器端框架经常处理崩溃一样。您还可以将单个小组件封装在错误边界中，以保护它们不致破坏应用程序的其余部分。

## React fiber 算法