React 之 redux、react-redux 深入理解与性能优化项

## compose 函数

## 实现 redux
redux 的主要内容有
* createStore api
* applyMiddleware api
* compose api
* 工具函数：combineReducers
* 工具函数 bindActionCreators

## 实现 react-redux
react-redux 的主要内容为
* 提供 `Provider` 组件
* 提供 `connect` 函数

有了 Redux 设计后，接下来的工作就是如何在 React 中正确工作，react-redux 这一部分我们可以基于 React Context api 轻松实现，以下是基于 React 的旧 Context api 实现，注意在 React 16 中该部分 api 已被重新设计。

`Provider` 组件的功能具体为
* 接收 store props，实现全局数据管理
* 使用 Context api 进行数据共享

具体代码如下
```js
export class Provider extends React.Component {
    static childContextTypes = {
        store: PropTypes.object
    }
    getChildContext() {
        return { store: this.store }
    }
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
    }

    render() {
        return this.props.children
    }
}
```

接下来就是 `connect` 实现了，其是一个典型的高阶函数设计，接受 `mapStateToProps` 和 `mapDispatchToProps` 用来得知需要从 store 中获取哪些数据，返回一个函数用来接受组件，最终返回组件，因此我们可以轻松得到一下原型设计
```js
export function connect(mapStateToProps = state => state, mapDispatchToProps = {}) {
    return function(WrapComponent) {
        return class ConnectComponent extends React.Component {

        }
    }
}
```

接下来思考功能
* 使用 Context api 获取 store 数据
* 执行 `mapStateToProps` 和 `mapDispatchToProps` 只传递需要的数据
* 订阅数据变化，实现组件重新更新

代码如下
```js
export function connect(mapStateToProps = state => state, mapDispatchToProps = {}) {
    return function(WrapComponent) {
        return class ConnectComponent extends React.Component {
            static contextTypes = {
                store: PropTypes.object
            }
            constructor(props, context) {
                super(props);
                this.state = {
                    props: {}
                };
            }
            componentDidMount() {
                const { store } = this.context;
                store.subscribe(() => this.update());
                this.update();
            }
            update() {
                const { store } = this.context;
                const stateProps = mapStateToProps(store.getState());
                // action 执行执行没有意义，需要 dispatch 才能更新 reducer 数据
                const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch);
                this.setState({
                    props: {
                        ...this.state.props,//本身的props
                        ...stateProps,
                        ...dispatchProps
                    }
                })
            }

            render() {
                // 将所有数据作为 props 透传
                return <WrapComponent {...this.state.props}></WrapComponent>
            }
        }
    }
}
```

## 性能优化
本次带来的优化考虑方向，基于 React 的设计原则，具体如下
* reselect 避免重复计算
* immutable.js 或 immer 创建不可变数据类型

其中 reselect 避免重复计算 - React 作者开发
* 创建自动缓存的数据
* createSelector Api
* 应对 React 开发原则：所有能计算得到的数据一定是通过计算得到的，Store 中只存储最原始的数据