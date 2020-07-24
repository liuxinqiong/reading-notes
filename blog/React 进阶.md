# react

### render函数
返回值就是 JSX 语法，会把 JSX 转成 JS 执行，实际执行的 React.createElement

组件只能返回一个根标签，很多时候 return 需要添加 `()`，是因为针对结构复杂的组件时，为了代码结构清晰，需要显示层级结构，此时将HTML使用括号包裹，return 语句紧跟括号，如果 return 后为空，则会报错。基本原则：多行使用括号。

### 生命周期
* 初始化周期
* 重新渲染生命周期
* 组件卸载生命周期

### react 16
React16 是第一个核心代码重写的版本，整体 API 变化不大。

主要变更了错误处理、生命周期、打包，对开发影响不是特别大
* 新的核心算法 Fiber
* Render 可以数组，字符串
* 错误处理机制：componentDidCatch
* Portals 组件
* 更好更快的服务端渲染
* 体积更小，MIT协议

### 属性验证库
属性验证库 PropTypes
* 15以及15以前是内置在react中的，16被抽离了出来
* npm install prop-types --save
* 具体类型有
  * PropTypes.array
  * PropTypes.bool
  * PropTypes.func
  * PropTypes.number
  * PropTypes.object
  * PropTypes.string
  * PropTypes.symbol
* 追加isRequired声明他是必传的

### setState
拥抱数据不可变性，this.setState 修改 state，记得，返回新的 state 而不是修改值

### chrome扩展
react官方推荐插件：React Developer Tools

# Antd-mobile 的使用
* 蚂蚁金服 UI 组件库，专门针对 React
* npm install antd-mobile@next --save
* 兼容 Web 和 ReactNative
* 按需加载
  * 需要 babel-plugin-import 的支持
  * 在 package.json 中 babel 中添加
  ```
    "plugins":[
      ["import",{"libraryName":"antd-mobile","style":"css"}]
    ]
  ```
* 常用组件
  * Layout 布局组件
  * 表单组件，数据展示组件，选择器等
  * 操作组件

# redux
通过前面的学习，我们已经知道 React 是一个专注于 view 层的库，对于组件状态的处理，在大型项目中，Redux 是一个不错的选择，Redux 是官方状态管理库。

Redux核心概念
* store
* state
* action
* reducer
* dispatch

Redux 是什么
* 专注与状态管理的库，和 react 解耦，在 angular 和 vue 中同样可以使用
* 单一状态，单项数据流

大概理解：
* 有一个保险箱(store)，所有人的状态在那里都有记录(state)
* 需要改变的时候，需要告诉专员(dispatch)要干什么(action)
* 处理变化的人(reducer)拿到 state 和 action，生成新的 state

正确的使用方式
* 首先通过 reducer 新建 store，随时通过 store.getState 获取状态
* 需要状态变更，store.dispatch(action) 来修改状态
* reducer 函数接受 state 和 action，返回新的 state，可以用 store.subscribe 监听每次修改

Redux 如何和 React 一起使用
* 手动连接（比较痛苦）
  * 把 store.dispatch 方法传递给组件，内部可以调用修改状态
  * subscribe 订阅render 函数，每次修改都会重新渲染
  * redux 相关内容，移到单独文件 index.redux.js 单独管理
* 处理异步、调试工具、更优雅的和 react 结合
  * redux 处理异步，需要 redux-thunk 插件
    * npm install redux-thunk --save
    * 使用 applyMiddleware 开启 thunk 中间件
    * action 可以返回函数，使用 dispatch 提交 action
  * 调试工具
    * chrome 扩展 Redux DevTools
    * 新建 store 的时候判断 window.devToolsExtension
    * 使用 compose 结合 thunk 和 window.devToolsExtension
    * 调试窗 redux 选项卡，实时看到 state
  * npm install redux-devtools-extension 并且开启
  * 使用 react-redux 优雅的链接 react 和 redux
    * npm install react-redux --save
    * 忘记 subscribe，记住 reducer、action、dispatch 即可，也不需要从属性开始传递
    * react-redux 提供 provider 和 connect 两个接口链接

react-redux具体使用
* provider 组件在应用最外层，传入 store 即可，只用一次
* Connect 负责从外部获取组件需要的参数
* Connect 可以用装饰器的方式来写
  * 本质是一个高阶组件
  * 自定义配置 npm run eject
  * npm install babel-plugin-transform-decorators-legacy --save 支持注解
  * package.json 里 babel 加上 plugins 配置
* 复杂 redux 应用，多个 reducer，用 combineReducers 合并


# react-route
简单介绍
* 官方推荐路由库，4 是最新版本，和之前版本不兼容，浏览器和 RN 均兼容
* 开发单页应用必备，践行路由即组件的概念
* 核心概念：动态路由，router，link，switch
* npm install react-router-dom --save
* Router4 使用 react-router-dom 作为浏览器前端的路由
* 忘记 router2 的内容，拥抱最新 router4 吧

入门组件
* BrowserRouter 包裹整个应用
```js
<BrowserRouter>
    <App></App>
</BrowserRouter>
```
* Router 路由对应渲染的组件，可嵌套，`exact`属性表示严格匹配
```js
<Switch>
    <Route path='/login' component={Login}></Route>
    <Route path='/register' component={Register}></Route>
    <Route path='/chat/:user' component={Chat}></Route>
    <Route component={Dashboard}></Route>
</Switch>
```
* Link 跳转专用
```js
<Link to={`${match.url}`}>跳转</Link>
```

其他组件
* url 参数，Route 组件参数可用冒号标识参数，路由组件给自己的组件添加了很多属性，打印 props 可以看到，eg：this.props.match.params.paramName 读取值
* this.props.match
  * url 是实际的路由
  * path 是我们定义的路由，有可能有变量
* Redirect 组件跳转
```js
<Redirect to={this.props.redirectTo}></Redirect>
```
* Switch只渲染命中的第一个子Route组件
* 使用push方法进行跳转
```js
this.props.history.push('/register');
```

> 经观察 DOM，react-router 不同于 angular 路由，在 DOM 结构上，只要不是当前页面显示的内容，在DOM中直接被移除，不存在缓存的概念（可能有？还没学到？）

对于非路由组件，如果需要使用路由组件的相关功能，即将路由的相关函数和属性挂载到组件的props下， 使用withRouter，在配置了装饰器的情况下，在 class 前 `@withRouter` 即可。

# Socket.io
Socket.io 是什么
* 基于事件的实时双向通信库
* 基于websocket协议

Socket.io(websocket) 与 ajax 区别
* ajax 基于 http 协议，单向，实时获取数据只能轮询
* socket.io 基于 websocket 双向通信协议，后端可以主动推送数据
* 现代浏览器均支持 websocket
* npm install socket.io socket.io-client --save

Socket.io 后端API
* io = require('socket.io')(http)
* io.on
* io.emit

Socket.io 前端API
* import io from 'socket.io-client'
* io.on
* io.emit

# 项目架构
文件结构和规范
* src 前端源码
* server 后端 express 目录
* 根据功能文件夹
  * 通用组件 component
  * 业务组件 container
  * redux 文件 redux

前后端联调
* axios 发送异步请求
* npm install axios --save
* 不同域？使用 proxy 配置转发，package.json "proxy":"http://localhost:9093"
* 单独使用直接在组件中 componentDidMount 即可
* axios 拦截器，统一 loading 处理，axios.interceptors
* redux 使用异步数据，渲染页面

elint
* package.json 中默认继承 react-app，这是 create-react-app 默认的配置
* 保证团队代码风格的统一
* 自定义配置
```js
"eslintConfig": {
  "extends": "react-app",
  "rules":{
    "eqeqeq":["off"]
  }
}
```

# 性能优化
React 原理
* 虚拟 DOM
  * beforeTree 和 afterTree 平级对比，而不是递归对比
  * 避免跨 DOM 层级去操作数据，这样虚拟 DOM 无法优化
  * 如何做 diff，打 patch，updateChildren，需深入
* 组件初始化：constructor => componentWillMount => render => componentDidMount
* 生命周期，shouldComponentUpdate(nextProps,nextState)（可优化处，达到最少渲染次数）
* 组件更新三种策略
  * setState（异步队列更新）：依次调用shouldComponentUpdate => componentWillUpdate => render => componentDidUpdate
  * 父组件 renders：componentWillReceiveProps => shouldComponentUpdate => componentWillUpdate => render => componentDidUpdate
  * forceUpdate：用的较少，不会调用 shouldComponentUpdate

React 如何做性能检测
* 路径添加 ?react_perf
* 使用 chrome 自带的 performance
  * 点击 record 开启，做出我们想要检测的操作之后，点击 stop
  * 主要查看 User Timing

React 组件(间)性能优化
  * 属性传递优化
  * 多组件间优化
  * key
    * 删除、新增、移动
    * 如何确定是同一个元素呢，就是通过 key
    * 使用数组的 index，除了取消 warning，没有其他作用，因为 index 是变化的
Redux 性能优化
  * Redux state 到组件显示数据转换，有性能优化空间，利用纯函数的特点，做缓存。
  * reselect 库优化 redux
    * npm install reselect --save
    * 函数记忆，减少重计算
React 同构
  * 首屏服务端渲染 SSR
  * 路由懒加载

> 纯函数的特点；稳定输入，稳定输出，因此可以做缓存

React 15 以后，新增 PureComponent，帮你解决了手写 shouldComponentUpdate 的烦恼。
* 此时性能检测：直接没有渲染，比我们定制的更棒
* 如果你的组件只是根据你传进来的值进行渲染，并没有内部的状态，可以直接继承 PureComponent 即可

## immutable.js
immutable.js 存在的意义和使用
* 递归对比，复杂度太高，不可接受
* React妥协，只做浅对比，这也是为什么我们在做 redux 和 state 的时候，建议不要那么深层次嵌套
* facebook 官方库，在 JS 里引出一个不可变的数据结构
  * 数据结构一旦创立不能修改，只能生成新的数据结构
  * 我们直接用等号就可以判断两个数据结构是不是相等，这对shouldComponentUpdate而言，简直就是利器
* npm install immutable --save
* Map
* 优点：
  * 节省内存，数据不需要修改
  * 并发安全
  * 降低了可变带来的复杂度，共享可变状态是万恶之源
  * 便于比较复杂数据，定制shouldComponentUpdate方便
  * 时间旅行功能
  * 拥抱函数式编程，纯函数
* 缺点
  * 学习成本
  * 库的大小（替代方案：seamless-immutable）
  * 对现有项目入侵太严重（新项目使用，老项目值得好好评估）

## SSR
SSR的发展：
* 全称：server side render
* 传统服务端渲染，JSP、smaty、jinja2
  * 前后端一体
  * 后端模板+数据 =>html 给浏览器
  * 首屏块，每次获取数据都会刷新页面
* 浏览器渲染，ajax 获取数据，前端拼接页面
  * 后端仅提供静态资源和接口
  * 前端写模板，渲染，MVVM 大行其道
  * 异步获取数据，无刷新
  * 单页应用，页面跳转也不刷新，体验好
  * 首屏较慢，没办法做 SEO，对搜索引擎不友好
  * jQuery 时代 underscore
* 前后同构，首屏服务端渲染
  * node 在服务端解析首屏模板
  * 页面渲染逻辑就不需要了，只需要做注水操作（事件响应等）
  * React 支持 SSR

React同构API
* RenderToString 和 RenderToStaticMarkUp
* React16 新出的 RenderToNodeStream，性能更好
  * RenderToString 解析为字符串
  * RenderToNodeStream 解析为可读的字节流对象
  * 官方说速度会快3倍左右
* React16 里，客户端 ReactDom.hydrate 取代 ReactDom.render

项目SSR具体步骤
* node 使用 babel-node 配置 node 里的 react 环境
* 修改客户端代码，抽离 App 组件，前后端共享
* 服务端生成 DOM 结构，渲染，加载 build 后的 css 和 js
  * 解决 CSS 问题：npm install css-modules-require-hook --save
  * 解决静态资源问题：npm install asset-require-hook --save
* node 使用 babel-node 支持 jsx
* npm install babel-cli --save
* SEO，加快首屏加载
* 更多
  * [教你如何搭建一个超完美的服务端渲染开发环境](http://blog.csdn.net/wulixiaoxiao1/article/details/57085751)
  * [彻底理解React 之React SSR、React服务端渲染，教你从零搭建配置](https://www.jianshu.com/p/47c8e364d0bc)

# 进阶

## mini-redux
核心内容，具体看源码看 github
* createStore(reducer, enhancer)
  * 返回 getState, subscribe, dispatch 函数
  * 中间件的处理
* applyMiddleware(...middlewares)
  1. 执行 createStore，得到初始的 store
  2. 创建 midApi，在redux中间件中需要 dispatch 和 getState，依次执行中间件的得到 middlewareChain
  3. compose 多个中间件，传入 dispatch 执行，得到新的 dispatch
  4. 返回新的 store，主要是包装了 dispatch
* bindActionCreators(creators, dispatch)
  * 主要给 mini-react-redux 使用，目的使 mapDispatchToProps 具备自动 dispatch 功能

## mini-react-redux

### React Context API
Context API 在这里是我们实现 mini-react 的关键，因此我们先熟悉 Context API 的基本使用。
* 严格类型要求，否则无法获取数据
* 通过将 childContextTypes 和 getChildContext 添加到父组件(context 提供者)，React 自动地向下传递信息，并且子树中的任何组件都可以通过定义 contextTypes 去访问它。如果 contextTypes 没有定义， context 将是一个空对象。

> propTypes：定义组件内部属性的数据格式要求，引入 Context API 之后，可千万不要弄混了哟。

Demo
```js
class NavBar extends React.Component {
    static contextTypes = {
        user: PropTypes.string
    }
    render() {
        console.log(this.context);
        return (
            <div>{this.context.user}的导航栏</div>
        )
    }
}

class Page extends React.Component {
    static childContextTypes = {
        user: PropTypes.string
    }
    constructor(props) {
        super(props);
        this.state = { user: 'sky' }
    }
    getChildContext() {
        return this.state;
    }
    render() {
        return (
            <div>
                <p>我是{this.state.user}</p>
                <SideBar></SideBar>
            </div>
        )
    }
}
export default Page;
```

如果 contextTypes 在组件中定义，下列的生命周期方法将接受一个额外的参数， context 对象：
* constructor(props, context)
* componentWillReceiveProps(nextProps, nextContext)
* shouldComponentUpdate(nextProps, nextState, nextContext)
* componentWillUpdate(nextProps, nextState, nextContext)
* componentDidUpdate(prevProps, prevState, prevContext)

> 从 React 16 开始， componentDidUpdate 不再接收 prevContext 。

在无状态的函数式组件中引用 Context

无状态的函数式组件也可以引用 context, 如果 contextTypes 作为函数的属性被定义。

```js
const PropTypes = require('prop-types');

const Button = ({children}, context) =>
  <button style={{'{{'}}background: context.color}}>
    {children}
  </button>;

Button.contextTypes = {color: PropTypes.string};
```

### 核心实现
我们需要一个 Provider 组件用来包裹整个应用，然后就是实现 connect 高阶组件。

Provider组件
1. 通过 props 得到 store，实现 childContextTypes 属性和 getChildContext方法，将 store 放入 context 中
2. render 返回 this.props.children 即可

connect高阶组件
1. 实现 contextTypes 属性，使得可以通过 this.context 得到 store
2. 在 state 上注册 props，用来存储最终的 props
3. 在 componentDidMount 中，通过 store.subscribe 方法注册 update 方法
4. 主要处理 mapStateToProps 函数和 mapDispatchToProps 对象(redux 的 bindActionCreators)
5. 构建新的 props
6. render 返回组件，将会 state.props 统统交给组件

## 中间件

### mini-redux-thunk
典型的高阶函数，我们依次需要初始的dispatch，next，action参数，源代码为：
```js
const thunk = ({ dispatch, getState }) => next => action => {
    // 如果不符合我们的要求，直接调用下一个中间件，使用 next
    // 如果符合我们的要求，需要重新 dispatch，调用 dispatch 即可
    if (typeof action === 'function') {
        return action(dispatch, getState)
    }
    // 默认什么都没干
    return next(action)
}

export default thunk;
```

### compose 函数
compose 函数组合，是实现redux中间件的关键，因此我们先讲讲compose的简单实现和一个例子

```js
function compose(...funcs){
	if(funcs.length === 0 ){
		return arg => arg
	}
	if(funcs.length === 1){
		return funcs[0];
	}
	return funcs.reduce((ret,item)=> (...args) => ret(item(...args)))
}

// 仅支持打印原本数据
function originFun(target){
	console.log(target);
	return target;
}

// 我们增强它，如果是数组，大声说出来
function middlewareArray(origin){
	return function(next){
    console.log(next);
		return function(target){
			console.log('middlewareArray');
			if(Array.isArray(target)){
				console.log('I am a Array');
				return origin(target);
			}
			return next(target);
		}
	}
}

// 我们增强它，如果是数字，大声说出来
function middlewareNumber(origin){
	return function(next){
    console.log(next);
		return function(target){
			console.log('middlewareNumber');
			if(typeof target === 'number'){
				console.log('I am a Number');
				return origin(target);
			}
			return next(target);
		}
	}
}

// origin表示最原始的，next一开始也是原始的，然后就是被处理过的啦
var newOrigin = compose(middlewareNumber(originFun),middlewareArray(originFun))(originFun);
newOrigin(123);
```

# 其他

### vscode
react 开发环境搭建
1. 格式化问题
  * vscode shift+option+f(mac)
  * editor.formatOnSave为true启用保存格式化
2. JSX 标签自动补齐
  * emmet.triggerExpansionOnTab为true
  * 有时候会失效，继续设置 "emmet.includeLanguages": {"javascript": "javascriptreact"}
3. 启用 ESLint 校验
  * 安装 ESLint 插件
  * 修改配置 eslint.autoFixOnSave 为 true

### React 动画
* CSS 动画
  * 官方解决方案：ReactCSSTransitionGroup
* JS 动画
* Ant Motion
  * 进出场动画：npm install rc-queue-anim --save

### 打包编译
* npm run build
* 编译打包后，生成 build 目录
* express 中间件，拦截路由，手动渲染 index.html
* build 设置为静态资源地址

### npm scripts
* 有没有觉得奇怪，为什么命令中，可以直接npm start，其余命令却需要使用 npm run xxx 呢
* 四个常用的 npm 脚本有简写形式
  * npm start 是 npm run start
  * npm stop 是 npm run stop的简写
  * npm test 是 npm run test的简写
  * npm restart 是 npm run stop && npm run restart && npm run start的简写
* 更多[npm scripts 使用指南](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

### 图片路径
组件内引用图片资源
1. 直接 import
2. 使用 require：webpack 就会识别到，打包上线的时候就会修正路径
3. 图片会经过 webpack 处理

> 引入 asset-require-hook 识别图片资源时候，默认对小于 8K 的图片转换成 base64 字符串，大于 8k 的图片转换成路径引用

### 线上发布：
* 使用 git 部署到服务器 npm install 一直报错 killed 导致无法完成
  * 有可能是内存太小的问题，设置[swap交换分区](http://man.linuxde.net/mkswap)，但我并没有解决
    * [阿里云服务器Linux环境下执行npm install和webpack打包导致killed问题解决](https://www.imooc.com/article/19208)
  * 切换到 cnpm install，问题解决
* 路径问题，mongodb 路径和 websocket 服务路径
  * 设置[mongo用户访问权限](http://www.jb51.net/article/104249.htm)相关时，导致我博客挂了，找不到原因，奇怪的事，我重启一下服务就好了，好像是因为中途数据库断开连接的问题
* forever 如何运行 npm 命令
  * 安装 npm install babel-register --save
  * 添加 server-wrapper.js
  * babel-preset-react-app 必须添加 NODE_ENV 等于 development、test、production 否则报错
  * 运行 NODE_ENV=test forever start server/server-wrapper.js
* 端口被占用
  * netstat -tunlp | grep port
  * kill pid