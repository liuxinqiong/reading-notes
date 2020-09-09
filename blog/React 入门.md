主要掌握 React 的基础语法和官方脚手架的使用。主要内容有 create-react-app、react-starter-kit 和 The road to learn React。

<!-- more -->
# 简介

### React 特点
* 第一代 SPA：Angular、Ember 以及 Backbone。
* React 并不是一个 SPA 框架，而是一个视图库，但围绕 React 周边的整个生态系统让构建单页面应用成为可能。
* 第一代框架尝试一次性解决很多问题，而 React 仅仅帮助你构建视图层。它更多的是一个库而非框架。其背后的思路是：应用的视图应该是一系列层次分明的可组合的组件。
* 重点关注视图层的两个优点
  * 你可以按部就班地学习 SPA 的每一部分。你不用担心要一次性理解全部。
  * SPA 的各部分都是可替换的。这样就使得 React 的周边生态圈充满新的创意。
* 第一代 SPA 框架更贴近企业级。它们缺乏足够的灵活性。
* React 生态圈组成了一个整体的灵活且可替换的框架，React 拥有简单整洁的 API、神奇的生态圈以及很棒的社区。
* 一切皆组件
* ES6 语法，最新版本 16

### node 和 npm
全局 node 包只需要一次性地安装在全局目录，可以在终端的任何地方使用。

Node 包安装完成后将会保存在 node_modules/ 文件夹里面，并且附加在会在 package.json 的依赖列表之后。

关于 package.json 额外多说一句。通过这个文件你可以在不共享本地包的情况下把项目共享给其他的开发人员。因为这个文件中已经有了所有 node 包的引用，这些包又被叫做依赖（dependency），每个人都可以在不包含所有依赖的情况下拷贝你的项目，因为 package.json 中列出了所有的依赖。只需要通过一个简单的 npm install 命令就可以获取所有依赖然后安装到 node_modules/ 文件夹下面。

基本命令
```
npm install -g <package>
npm install <package>
npm init -y
npm install --save-dev <package> # 标记表示该 node 包只是用作开发环境的一部分，并不会被作为你产品代码的一部分发布。
```

### 安装 React
1. CDN
2. NPM 包管理项目

那么我们需要使用 NPM 安装哪些包呢？
1. react
2. react-dom
3. babel：使项目支持 JSX 语法和 ES6
4. ...

这一步设置包含一堆的配置和工具，对于一个新手来说可能会感觉到不小的压力。由于这个原因，Facebook 引入了 `create-react-app` 作为零配置的 React 解决方案。

# create-react-app
Facebook 在 2016 年创建了这样一个零配置的 React 初始化套件。使用 create-react-app，我们不需要在手动配置 webpack 和 eslint 等，各种工具和配置都会在后台集成，而开发人员只需要专注于实现就好。

安装和使用脚手架创建 myapp 应用
```
npm install -g create-react-app
create-react-app myapp
```

create-react-app 创建的是一个 npm 项目。你可以通过 npm 来给你的项目安装和卸载 node 包。另外它还附带了下面几个 npm 脚本（在 package.json 下的scripts 中配置）：
```shell
# 启动应用，开启调试页面(开发环境)
npm start
# 运行测试用例
npm run test
# 弹出配置，默认脚手架帮我们把配置隐藏了，只能使用一次
npm run eject
# 打包
npm run build
```

现在这样一个 React 样板项目就创建完成了。

### 自动刷新
create-react-app 的开发环境也有类似 webpack-dev-server 的--inline --hot 自动刷新的功能。

根据 npm start，找到 package.json 文件，内容是 react-scripts start，可见 react-scripts 一定大有文章。查找 node-modules，它果然依赖 webpack。

### 模块热替换
用 create-react-app 创建的项目有一个优点，那就是可以让你在更改源代码的时候浏览器自动刷新页面。

模块热替换（HMR）是一个帮助你在浏览器中重新加载应用的工具，并且无需再让浏览器刷新页面。你可以在 create-react-app 中很容易地开启这个工具：在你 React 的入口文件 src/index.js 中，添加一些配置代码。

```js
if (module.hot) {
  module.hot.accept();
}
```

优势：
1. 无须刷新，重新加载
2. 保持应用的状态

### 线上编译命令
create-react-app 的一个大亮点，它能让你的应用骗译出在线上生产环境运行的代码，编译出来的文件很小，且文件名还带 hash 值，方便我们做 cache，而且它还提供一个服务器，让我们在本地也能看到线上生产环境类似的效果，真的超级方便。

运行如下命令进行编译，编译好的文件都会放到 build 目录中。
```
npm run build
```

查看线上运行效果
```
npm install -g pushstate-server
pushstate-server build
```

### 弹出
`create-react-app` 提供了一个特性，既可以保持应用的可扩展性，又可以避免被第三方依赖绑架。被第三方依赖绑架通常意味着一旦我们采取了某项技术就没有退出机制的情况。

在 package.json 中，你可以找到 “start”、“test” 和 “build” 这些命令，用来启动、测试和构建应用。最后的命令就是 eject。你可以试着去执行它，但是这个命令只能被执行一次并且不能撤回。这是一个破坏性的命令，一旦执行就不能反悔，如果你只是学习 React，那就没有理由离开 create-react-app 提供给你的便利环境。。

假设你运行了 npm run eject，它会复制所有的配置和依赖到 package.json 中，同时创建一个新的 config/ 文件夹。你会将整个项目完全转换成带有 Babel 和 Webpack 等工具的自定义配置。最终，你将可以完全控制所有这些工具。

npm run eject 弹出配置文件，可以自定义 webpack（Jest、Babel、ESLint），发现多了 config 和 script 文件夹，同时 package.json 多了很多的依赖项，之前都是封装在 react script 内部的，之后我们便可以自定义配置了。

> 官方文档也说了 create-react-app 更适合中小型项目，所以你不用感到愧疚运行 “eject” 命令来移除掉 create-react-app 并拿回控制权。

### yarn
Yarn 是 Facebook, Google, Exponent 和 Tilde 开发的一款新的 JavaScript 包管理工具。它的目的是解决这些团队使用 npm 面临的少数问题，即：
* 安装的时候无法保证速度/一致性
* 安全问题，因为 npm 安装时允许运行代码

Yarn 同样是一个从 npm 注册源获取模块的新的 CLI 客户端。注册的方式不会有任何变化 —— 你同样可以正常获取与发布包。

与 npm 区别
* yarn.lock
  * npm 和 Yarn 都使用 package.json 来跟踪项目的依赖，版本号并非一直准确，npm 的这种策略可能导致两台拥有相同 package.json 文件的机子安装了不同版本的包，这可能导致一些错误。
  * 为了避免包版本的错误匹配，一个确定的安装版本被固定在一个锁文件中。每次模块被添加时，Yarn 就会创建（或更新）yarn.lock 文件，这样你就可以保证其它机子也安装相同版本的包，同时包含了 package.json 中定义的一系列允许的版本。
  * 在 npm 中同样可以使用 npm shrinkwrap 命令来生成一个锁文件，这样在使用 npm install 时会在读取 package.json 前先读取这个文件，就像 Yarn 会先读取 yarn.lock 一样。这里的区别是 Yarn 总会自动更新 yarn.lock，而 npm 需要你重新操作。
* 并行安装
  * 每当 npm 或 Yarn 需要安装一个包时，它会进行一系列的任务。在 npm 中这些任务是按包的顺序一个个执行，这意味着必须等待上一个包被完整安装才会进入下一个；Yarn 则并行的执行这些任务，提高了性能。
* 清晰的输出
  * npm 默认情况下非常冗余，例如使用 npm install 时它会递归列出所有安装的信息；而 Yarn 则一点也不冗余，当可以使用其它命令时，它适当的使用 emojis 表情来减少信息
* CLI 的差异
* [Yarn vs npm](http://web.jobbole.com/88459/)

# JSX

### JSX 简介
* 这是 React 特有的语法。
* 区分组件、实例和元素
* JSX 允许你在 JavaScript 中混入 HTML 结构。

### JSX 语法
大小写敏感
* 组件：首字母大写表示 react 自定义组件，小写表示 DOM 组件，因此自己开发的必须大写。
* 属性 & 方法命名：骆驼命名法规范(非强制)

组件可以嵌套，但是只能返回一个根节点，组件必须闭合

特殊属性名：
* htmlFor：label for 属性
* className：class 属性
* style：React 组件样式是一个对象

求值表达式：{}

语法规则
* 允许 HTML 与 JavaScript 的混写
* 遇到 HTML 标签（以 < 开头），就用 HTML 规则解析，遇到代码块（以 { 开头），就用 JavaScript 规则解析。
* 允许直接在模板插入 JavaScript 变量。如果这个变量是一个数组，则会展开这个数组的所有成员

非标准 DOM 属性
* dangerousSetInnerHTML：在 jsx 中直接插入 html 代码
* ref：方便父组件调用子组件
* key：提高页面渲染性能，体现在节点的比较，给每个节点添加一个唯一标识。在组件内部中，key 必须不一样。Diff 算法基于一个假设，如果节点不同，那么内容很大可能不同，因此在节点不同时，直接生成新的节点。

# React 基本语法
提示：在最新的 React 中，可能看不到咯。
* ReactDOM.render(template,element)
  * ReactDOM.render() 会使用你的 JSX 来替换你的 HTML 中的一个 DOM 节点。这样你就可以很容易地把 React 集成到每一个其他的应用中。
  * ReactDOM.render() 总会很好地渲染你的 App 组件。你可以将一个简单的 JSX 直接用 JSX 的方式传入，而不用必须传入一个组件的实例。
* React.createClass(props)
  * 声明：ES5写法，在ES6中直接基础Component即可
  * 组件类的 render 属性是必须的，用来输出组件
* this.props 读取属性
  * 属性不可以由组件自身修改，由父组件传递进来
* this.props.children 可以读取所有子组件
  * 值有三种可能，没有子节点为 undefined，一个子节点 object，多个子节点为 array
* React.Children.map
  * 常用来遍历 this.props.children，为什么不用普通数组的 map 方法呢，看上述特性便知，他会处理 Object 和 undefined 情况
* this.state | this.setState
  * 组件免不了要与用户互动，React 的一大创新，就是将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI。
  * ES6 中，this.state 必须在构造函数中进行声明
  * this.setState(state)：更新状态
* 组件配置对象属性和方法
  * ES5写法，PropTypes 属性：用来验证组件实例的属性是否符合要求
  * ES5写法，getDefaultProps 方法：用来设置组件属性的默认值
  * ES5写法，getInitialState 方法：初始状态

> React 的 this.setState() 是一个浅合并，在更新一个唯一的属性时，他会保留状态对象中的其他属性

> React拥护不可变数据结构。因此你不应该改变一个对象，更好的做法是基于现在拥有的资源来创建一个新的对象。这样就没有任何对象被改变了。这样做的好处是数据结构将保持不变，因为你总是返回一个新对象，而之前的对象保持不变。

### this 问题
当使用 ES6 编写的 React 组件时，了解在 JavaScript 类的绑定会非常重要。

绑定的步骤是非常重要的，因为类方法不会自动绑定 this 到实例上。是使用 React 主要的 bug 来源。其中一种方式就是类方法在构造函数中正确绑定。

在写 React 代码的时候，Render 函数中，往往需要调用当前组件实例中定义的函数，这个时候我们需要解决被调函数中 this 的指向问题，一般我们都会采取三个方案，更多请看[这里](https://zhuanlan.zhihu.com/p/32831853)：
* 用类属性
```js
handler = () => {
  this.setState(({ clicks }) => ({ clicks: clicks + 1 }));
};
```
* 用 bind
```js
constructor() {
  super();
  this.state = { clicks: 0 };
  this.handler = this.handler.bind(this);
}
```
* 用 inline function
```js
onClick={() => this.props.onAlert(msg)} // 适合传参的情况
```

这里有个细节需要注意，内联箭头函数自动绑定当前环境的 this，但是在拆分组件时，组件间的函数调用会出现问题，解决办法是使用上面两种方式。

类方法的绑定也可以写起其他地方，比如写在 render() 函数中。但是你应该避免这么做，因为它会在每次 render 的时候绑定类方法，总结来说组件每次运行更新时都会导致性能消耗。当在构造函数中绑定时，绑定只会在组件实例化时运行一次，这样做是一个更好的方式。就比如如下的方式，是不推荐的！
```js
render() {
    return (
      <button
        onClick={this.onClickMe.bind(this)}
        type="button"
      >
        Click Me
      </button>
    );
  }
```

有人提出在构造函数中直接定义业务逻辑类方法，但你同样也应该避免这样，因为随着时间的推移它会让你的构造函数变得混乱。构造函数目的只是实例化你的类以及所有的属性。这就是为什么我们应该把业务逻辑应该定义在构造函数之外。

最后值得一提的是类方法可以通过 ES6 的箭头函数做到自动地绑定（上述第一种情况）。定义方法时候使用箭头函数，如果在构造函数中的重复绑定对你有所困扰，你可以使用这种方式代替。React 的官方文档中坚持在构造函数中绑定类方法，所以这里也会采用同样的方式。

### 虚拟 DOM
组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，然后再将实际发生变动的部分，反映在真实 DOM 上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。

有时需要从组件获取真实 DOM 的节点，这时就要用到 refs 属性。 例如组件 MyComponent 的子节点有一个文本输入框，用于获取用户的输入。这时就必须获取真实的 DOM 节点，虚拟 DOM 是拿不到用户输入的。为了做到这一点，文本输入框必须有一个 ref 属性，然后 this.refs.[refName] 就会返回这个真实的 DOM 节点。

需要注意的是，由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，才能使用这个属性，否则会报错。

### 引用 DOM 元素
有时我们需要在 React 中与 DOM 节点进行交互。ref 属性可以让我们访问元素中的一个节点。通常，访问 DOM 节点是 React 中的一种反模式，因为我们应该遵循它的声明式编程和单向数据流。但是在某些情况下，我们仍然需要访问 DOM 节点。官方文档提到了三种情况：
* 使用 DOM API（focus 事件，媒体播放等）
* 调用命令式 DOM 节点动画
* 与需要 DOM 节点的第三方库集成

通常，无状态组件和 ES6 类组件中都可以使用 ref 属性。简单例子如下
```js
<input
  type="text"
  value={value}
  onChange={onChange}
  ref={node => {
    this.input = node;
  }}
/>
```

### 内部状态
* 使用 ES6 类组件可以在构造函数中初始化组件的状态。 构造函数只会在组件初始化时调用一次。
* 当你使用 ES6 编写的组件有一个构造函数时，它需要强制地调用 super(); 方法
* 你也可以调用 super(props)，它会在你的构造函数中设置 this.props 以供在构造函数中访问它们。 否则当在构造函数中访问 this.props ，会得到 undefined。
* 不要直接修改 state。你必须使用 setState() 方法来修改它，每次你修改组件的内部状态，组件的 render 方法会再次运行。

### 单项数据流
触发一个动作，再通过函数或类方法修改组件的 state，最后组件的 render() 方法再次运行并更新界面。
![单项数据流](/docs/one-way.png)

# 事件处理
如果事件处理器需要参数该如何处理呢？通常来说有两种方式
1. 高阶函数
2. 在外部(render 内部)定义一个包装函数，并且只将定义的函数传递给处理程序

在事件处理程序中使用箭头函数的影响会不会有性能影响呢，每次 render() 执行时，事件处理程序就会实例化一个高阶箭头函数，它可能会对你的程序性能产生影响，但在大多数情况下你都不会注意到这个问题。假设你有一个包含 1000 个项目的巨大数据表，每一行或者列在事件处理程序中都有这样一个箭头函数，这个时候就需要考虑性能影响。

合成事件：event.target || event.currentTarget

React 的生态使用了大量的函数式编程概念。通常情况下，你会使用一个函数返回另一个函数（高阶函数）。在 JavaScript ES6 中，可以使用箭头函数更简洁的表达这些。

> 在 React 中了解高阶函数是有意义的，因为在 React 中有一个高阶组件的概念

# 状态进阶
你将学习到状态管理的最佳实践，如何去应用它们以及为什么可以考虑使用第三方的状态管理库。

### 状态提取

将子状态（subState）从一个组件移动到其他组件中的重构过程被称为状态提取。

随着项目的推进，一个组件的状态可能越来越多，无疑使得代码不够简洁，这时候就需要思考，是不是有那么一些状态，只和某个组件有关，和其他组件都无关，这时候就可以把状态提取出来，交给子组件单独管理。状态提取可以使组件更加轻量，同时父子组件间协调更加简洁。

状态提取的过程也可以反过来：从子组件到父组件，这种情形被称为状态提升。

有那么一种情形，新的需求来了，在其父组件中显示该组件的状态信息，你需要将状态提升到父组件中。但情况还不止这些，假如你需要在子组件的兄弟组件上显示该组件的状态，你还是需要将状态提升到父组件中。在父组件中处理内部状态，同时将状态信息暴露给相关的子组件。

### 再探：setState()
setState() 方法不仅可以接收对象。在它的第二种形式中，你还可以传入一个函数来更新状态信息。
```js
this.setState((prevState, props) => {
  ...
});
```

为什么你会需要第二种形式呢？使用函数作为参数而不是对象，有一个非常重要的应用场景，就是当更新状态需要取决于之前的 `状态或者属性` 的时候。如果不使用函数参数的形式，组件的内部状态管理可能会引起 bug。

当更新状态需要取决于之前的状态或者属性时，为什么使用对象而不是函数会引起 bug 呢？这是因为 React 的 setState() 方法是异步的。React 依次执行 setState() 方法，最终会全部执行完毕。如果你的 setState() 方法依赖于之前的状态或者属性的话，有可能在按批次执行的期间，状态或者属性的值就已经被改变了。

使用函数参数形式的话，传入 setState() 方法的参数是一个回调，该回调会在被执行时传入状态和属性。尽管 setState() 方法是异步的，但是通过回调函数，它使用的是执行那一刻的状态和属性。

setState() 中函数参数形式相比于对象参数来说，在预防潜在 bug 的同时，还可以提高代码的可读性和可维护性。此外，它可以在 App 组件之外进行测试。

总结
* setState 更新可能是异步的
* 你不能依赖 this.state 和 this.props 的值计算下一个 state
* 解决这个问题，使用 setState 的函数形式，该函数接收前一个状态作为第一个参数，应用更新时 props 作为第二个参数

### 驾驭 state
状态管理在大型的应用中是一个至关重要的话题。总体来说，不光是 React ，很多单页面应用（SPA）框架都面临这个问题。近些年来应用变得越来越复杂。当今的 web 应用面临的一个重大挑战就是如何驾驭和控制状态。

与其他的解决方案相比，React 已经向前迈进了一大步。单向数据流和简单的组件状态管理 API 非常必要 。这些概念使得推断状态和其改变更加容易，在组件级别以及一定程度上的应用级别的状态推断也更加容易。

在不断膨胀的应用中，推断状态的变化随之变得困难。setState() 方法使用对象形式而不是函数形式的话，如果在脏状态上进行操作，则可能会引入 bug。为了能够共享状态或者在兄弟组件之间隐藏不必要的状态，你需要将状态进行提升或者降低。有些状况下，组件需要将其状态提升，因为它的兄弟组件依赖于这些状态。也有可能你需要和相隔甚远的组件共享状态，所以你可能需要在其整个组件树中共享该状态。这样做的结果会使得在状态管理中涉及的组件范围很广。但是毕竟组件的主要职责只是描绘 UI，不是吗？

由于这些原因，存在一些独立的解决方案来解决状态管理问题。这些方案不仅仅可以在 React 中使用，但是却使得 React 的生态更加繁荣。你可以使用不同的解决方案来解决你的问题。为了解决规模化的状态管理问题，你可能已经听说过 Redux 或者 MobX。你可以在 React 应用中使用这两者其一。它们还有一些扩展，如 react-redux 和 mobx-react 来将其连接到 React 的视图层。

# React 组件相关

### 受控组件

表单元素比如 `<input>`, `<textarea>` 和 `<select>` 会以原生 HTML 的形式保存他们自己的状态。一旦有人从外部做了一些修改，它们就会修改内部的值，在 React 中这被称为 `不受控组件`，因为它们自己处理状态。在 React 中，你应该确保这些元素变为 `受控组件`。

你只需要设置输入框的值属性，这个值已经在 searchTerm 状态属性中保存了。

```js
<input type="text" value={searchTerm} onChange={this.onSearchChange} />
```

现在输入框的单项数据流循环是自包含的，组件内部状态是输入框的唯一数据来源。

### 拆分组件

当你的组件特别大时，它在不停地扩展，最终可能会变得混乱。你可以开始将它拆分成若干个更小的组件。

最直接需要解决的问题就是，组件间如何通信呢？答案就是使用 this.props，他可以传递 JavaScript 的任何对象。当你在 App 组件里面使用它时，它有你传递给这些组件的所有值。这样，组件可以沿着组件树向下传递属性。

从 App 组件中提取这些组件之后，你就可以在别的地方去重用它们了。因为组件是通过 props 对象来获取它们的值，所以当你在别的地方重用它时，你可以每一次都传递不同的 props，这些组件就变得可复用了。

### 可组合组件
在 props 对象中还有一个小小的属性可供使用: children 属性。通过它你可以将元素从上层传递到你的组件中，这些元素对你的组件来说是未知的，但是却为组件相互组合提供了可能性。

它不仅可以把文本作为子元素传递，还可以将一个元素或者元素树（它还可以再次封装成组件）作为子元素传递。children 属性让组件相互组合到一起成为可能。

### 可复用组件
让我们来考虑一下，我们构造一个 Button 组件如下：
```js
class Button extends Component {
  render() {
    const { onClick, className = "", children } = this.props;

    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }
}
```

请问这样的用处是什么呢，难道只是为了省略一个 type 属性的书写吗？答案是否定的！

必须要考虑到长期投资。想象在你的应用中有若干个 button，但是你想改变它们的一个属性、样式或者行为。如果没有这个组件的话，你就必须重构每个 button。相反，Button 组件拥有 `单一可信数据源`。一个 Button 组件可以立即重构所有 button。一个 Button 组件统治所有的 button。

默认参数：Button 组件期望在 props 里面有一个 className 属性. className 属性是 React 基于 HTML 属性 class 的另一个衍生物。但是当使用 Button 组件时，我们并没有传递任何 className 属性，所以在 Button 组件的代码中，我们更应该明确地标明 className 是可选的。

### 组件类型
* **函数式无状态组件**：类组件就是函数，它们接收一个输入并返回一个输出。输入是 props，输出就是一个普通的 JSX 组件实例。到这里，它和 ES6 类组件非常的相似。然而，函数式无状态组件是函数（函数式的），并且它们没有本地状态（无状态的）。你不能通过 this.state 或者 this.setState() 来访问或者更新状态，因为这里没有 this 对象。此外，它也没有生命周期方法。虽然你还没有学过生命周期方法，但是你已经用到了其中两个：constructor() and render()。constructor 在一个组件的生命周期中只执行一次，而 render() 方法会在最开始执行一次，并且每次组件更新时都会执行。
* **ES6 类组件**：在类的定义中，它们继承自 React 组件。extend 会注册所有的生命周期方法，只要在 React component API 中，都可以在你的组件中使用。通过这种方式你可以使用 render() 类方法。此外，通过使用 this.state 和 this.setState()，你可以在 ES6 类组件中储存和操控 state。
* **React.createClass**：这类组件声明曾经在老版本的 React 中使用，仍然存在于很多 ES5 React 应用中。但是为了支持 JavaScript ES6，Facebook 声明它已经不推荐使用了。他们还在 React 15.5 中加入了不推荐使用的警告。

> 什么时候更适合使用函数式无状态组件而非 ES6 类组件？一个经验法则就是当你不需要本地状态或者组件生命周期方法时，你就应该使用函数式无状态组件。最开始一般使用函数式无状态组件来实现你的组件，一旦你需要访问 state 或者生命周期方法时，你就必须要将它重构成一个 ES6 类组件。

例子：重构 Search 组件
```js
function Search(props) {
  const { value, onChange, children } = props;
  return (
    <form>
      {children} <input type="text" value={value} onChange={onChange} />
    </form>
  );
}
```

如果优化上面的代码呢？
1. 入参解构
2. 箭头函数

```js
const Search = ({ value, onChange, children }) => (
  <form>
    {children} <input type="text" value={value} onChange={onChange} />
  </form>
);
```

### 给组件声明样式
使用 React 的 className 即可，JSX 混合了 HTML 和 JavaScript，其实在 JSX 中还可以直接使用 CSS，直接实用元素的 style 属性即可。

```js
// way1
<div style={{width:200px}}></div>
// way2
const smallColumn = {
  width: '10%',
};
<div style={smallColumn}></div>
```

# 生命周期
这些方法是嵌入 React 组件生命周期中的一组挂钩。它们可以在 ES6 类组件中使用，但是不能在无状态组件中使用。

constructor（构造函数）只有在组件实例化并插入到 DOM 中的时候才会被调用。组件实例化的过程称作组件的挂载（mount）。

render() 方法也会在组件挂载的过程中被调用，同时当组件更新的时候也会被调用。每当组件的状态（state）或者属性（props）改变时，组件的 render() 方法都会被调用。

在组件挂载的过程中还有另外两个生命周期方法：componentWillMount() 和 componentDidMount()。

组件的生命周期分成三个状态：
1. Mounting：已插入真实 DOM
2. Updating：正在被重新渲染
3. Unmounting：已移出真实 DOM

React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数：
1. componentWillMount()
2. componentDidMount()
3. componentWillUpdate(object nextProps, object nextState)
4. componentDidUpdate(object prevProps, object prevState)
5. componentWillUnmount()

React 还提供两种特殊状态的处理函数：
1. componentWillReceiveProps(object nextProps)
2. shouldComponentUpdate(object nextProps, object nextState)

组件本质是状态机，输入确定，输出一定确定。状态转换会触发不同的钩子函数。

| 阶段 | 钩子函数，运行顺序由上至下 | 说明 |
| :------------------------: | :------------------------: |: ---------------------------------------------------------------: |
| 初始化 | getDefaultProps | 仅调用一次，实例之间共享引用，且在 createClass 的时候就已经调用，即使没有使用组件 |
| 初始化 | getInitialState | 初始化每个实例特有的状态，必须返回一个对象或 null |
| 初始化 | componentWillMount | Render 之前最后一次修改状态的机会 |
| 初始化 | render | 1.只能访问 this.props 和 this.state  2.只有一个顶层组件  3.不允许修改状态和 dom 输出，保证在服务端也能运行 |
| 初始化 | componentDidMount | 成功 render 并渲染，可以修改 dom |
| 运行中 | componentWillReceiveProps | 父组件修改属性触发，修改新属性、修改状态 |
| 运行中 | shouldComponentUpdate | 返回 false，不会调用 render 方法和 diff 算法更新，提升性能 |
| 运行中 | componentWillUpdate | 不能修改属性和状态 |
| 运行中 | render | 同初始化 |
| 运行中 | componentDidUpdate | 同初始化 |
| 销毁 | componentWillUnmount |  在删除组件之前进行清理操作，比如计时器和事件监听器 |

在挂载过程中有四个生命周期方法，它们的调用顺序是这样的：
* constructor()
* componentWillMount()
* render()
* componentDidMount()

但是当组件的状态或者属性改变的时候用来更新组件的生命周期是什么样的呢？总的来说，它一共有 5 个生命周期方法用于组件更新，调用顺序如下：
* componentWillReceiveProps()
* shouldComponentUpdate()
* componentWillUpdate()
* render()
* componentDidUpdate()

最后但同样重要的，组件卸载也有生命周期。它只有一个生命周期方法：componentWillUnmount()。

> 即使在一个很大的 React 应用当中，除了 constructor() 和 render() 比较常用外，你只会用到一小部分生命周期函数。

即使这样，了解每个生命周期方法的适用场景还是对你有帮助的：
* **constructor(props)** - 它在组件初始化时被调用。在这个方法中，你可以设置初始化状态以及绑定类方法。
* **componentWillMount()** - 它在 render() 方法之前被调用。这就是为什么它可以用作去设置组件内部的状态，因为它`不会触发组件的再次渲染`。但一般来说，还是`推荐在 constructor() 中去初始化状态`。
* **componentWillReceiveProps(nextProps)** - 这个方法在一个`更新生命周期`（update lifeCycle）中被调用。`新的属性会作为它的输入`。因此你可以利用 this.props 来对比之后的属性和之前的属性，`基于对比的结果去实现不同的行为`。此外，你可以基于新的属性来设置组件的状态。
* **shouldComponentUpdate(nextProps, nextState)** - `每次组件因为状态或者属性更改而更新时，它都会被调用`。你将在成熟的 React 应用中使用它来进行`性能优化`。在一个更新生命周期中，组件及其子组件将`根据该方法返回的布尔值来决定是否重新渲染`。这样你可以阻止组件的`渲染生命周期`（render lifeCycle）方法，避免`不必要的渲染`。
* **componentWillUpdate(nextProps, nextState)** - 这个方法是 render() 执行之前的`最后一个方法`。你已经拥有下一个属性和状态，它们可以在这个方法中任由你处置。你可以利用这个方法在渲染之前进行最后的准备。注意在这个生命周期方法中你`不能再触发 setState()`。如果你想基于新的属性计算状态，你必须利用 componentWillReceiveProps()。
* **render()** - 这个生命周期方法是必须有的，它返回作为组件输出的元素。这个方法应该是一个`纯函数`，因此不应该在这个方法中修改组件的状态。它把属性和状态作为输入并且返回（需要渲染的）元素
* **componentDidUpdate(prevProps, prevState)** - 这个方法在 render() 之后立即调用。你可以用它当成`操作 DOM 或者执行更多异步请求`的机会。
* **componentDidMount()** - 它仅在组件挂载后执行一次。这是发起`异步请求去 API 获取数据的绝佳时期`。获取到的数据将被保存在内部组件的状态中然后在 render() 生命周期方法中展示出来。
* **componentWillUnmount()** - 它会在组件销毁之前被调用。你可以利用这个生命周期方法去执行任何`清理任务`。

还有另一个生命周期方法：componentDidCatch(error, info)。它在 React 16 中引入，用来捕获组件的错误。举例来说，在你的应用中展示样本数据本来是没问题的。但是可能会有列表的本地状态被意外设置成 null 的情况发生（例如从外部 API 获取列表失败时，你把本地状态设置为空了）。然后它就不能像之前一样去过滤（filter）和映射（map）这个列表，因为它不是一个空列表（[]）而是 null。这时组件就会崩溃，然后整个应用就会挂掉。现在你可以用 componentDidCatch() 来捕获错误，将它存在本地的状态中，然后像用户展示一条信息，说明应用发生了错误。

### 重新渲染
React 怎么判断什么时候该重新渲染组件？

只有在组件的 state 变化时才会出发组件的重新渲染。状态的改变可以因为 props 的改变，或者直接通过 setState 方法改变。组件获得新的状态然后 React 决定是否应该重新渲染组件。不幸的是，React 难以置信简单地将默认行为设计为每次都重新渲染。

但实际开发中，有时候状态改变并不会导致视图改变，这时候我们就需要告诉可以跳过重新渲染，这样可以节省性能。这里我们需要重写 shouldComponentUpdate 方法。

shouldComponentUpdate 方法默认返回 true，这就是导致每次更新都重新渲染的原因。但是你可以在需要优化性能时重写这个方法来让 React 更智能。比起让 React 每次都重新渲染，你可以告诉 React 你什么时候不想触发重新渲染。

当你使用 shouldComponentUpdate 方法你需要考虑哪些数据对与重新渲染重要。

假设我们只关心 title 和 done 属性的改变，我们可以这么做

```js
shouldComponentUpdate(nextProps) {
    const differentTitle = this.props.title !== nextProps.title;
    const differentDone = this.props.done !== nextProps.done
    return differentTitle || differentDone;
}
```

> 当子组件的的 state 变化时, 返回 false 并不能阻止它们重渲染。

# 组件协同使用

### 组件嵌套
组件按照父子关系嵌套。

优缺点：逻辑清晰，代码模块化，封装细节，编写难度高，无法掌握所有细节。

父子通信：父元素与子元素通信通过属性，子属性与父元素通信通过委托的方式。父元素通过属性传递函数，子组件在自身函数调用传递过来的函数。

### Mixin 混入
本质：是 JS 对象，一组方法，在 ES6 中，使用高阶组件代替

目的：横向抽离出组件的相似代码

相似概念：面向切面编程，插件

使用：React.createClass({})传入 mixins 属性，一个数组，可以有多个 mixin，混入之后，我们的 class 也就有了 mixin 定义的方法。

优点：代码复用，即插即用，适应性强（改动一次，影响了多个组件），编写难度大，降低了代码的可读性。

# 高阶组件
高阶组件（HOC）是 React 中的一个高级概念。HOC 与高阶函数是等价的。它接受任何输入 - 多数时候是一个组件，也可以是可选参数 - 并返回一个组件作为输出。返回的组件是输入组件的增强版本，并且可以在 JSX 中使用。

HOC 可用于不同的情况，比如：准备属性，管理状态或更改组件的表示形式。其中一种情况是将 HOC 用于帮助实现条件渲染。

有一个惯例是用 “with” 前缀来命名 HOC。条件渲染是 HOC 的一种绝佳用例。

在高阶组件的实践中，犯了一个绝大多数初学者都会犯的问题，直接在传入的组件上绑定事件，事件处理函数位于高阶组件中，事件始终无法响应。

高阶组件是 react 应用中很重要的一部分，最大的特点就是重用组件逻辑。它并不是由 React API 定义出来的功能，而是由 React 的组合特性衍生出来的一种设计模式。

最基础语法
```js
render(){
    return <ComposeComponent {...this.props}/>
}
```
第一件事情，组件虽被你高阶组件加强过，但是基础的用法还是得维持不变，不然就徒增复杂度，所以 {...this.props} 的数据可以说是必不可少的。

常用场景
* 用来添加和增强功能
* 可以使用装饰器模式@简写
* 两种功能的高阶组件
  * 属性代理
    * 继承 React.Component
    * 添加额外属性和元素
    * 操作 props
    * refs 获取组件实例
    * 抽离 state
  * 反向继承
    * 不继承 React.Component，而是继承当前组件
    * 添加新函数，或者新生命周期，如果父组件同时存在对应生命周期，则均会执行
    * 渲染劫持
* 目的
  * 代码复用
  * 逻辑抽象
  * 反向继承

约束点
* 注意高阶组件不会修改子组件，也不拷贝子组件的行为。高阶组件只是通过组合的方式将子组件包装在容器组件中，是一个无副作用的纯函数
* 要给 hoc 添加 class 名，便于 debugger。
* 静态方法要复制
* refs 不会传递。 意思就是 HOC 里指定的 ref，并不会传递到子组件，如果你要使用最好写回调函数通过 props 传下去。
* 不要在 render 方法内部使用高阶组件。
* 使用 compose 组合 HOC
```js
const compose = (...funcs) => component => {
  if (funcs.lenght === 0) {
    return component;
  }
  const last = funcs[funcs.length - 1];
  return funcs.reduceRight((res, cur) => cur(res), last(component));
};
const WrappedComponent = compose(addFuncHOC, addStyleHOC)(Usual);
```

回到一开始的事件不会响应的问题，高阶组件应该是一个无副作用的纯函数。如果事件响应了的话，因为子组件中本身就定义了此事件和响应的 handle 处理器，是不是就代表我们引入了副作用呢？高阶组件的作用应该是增强了某种能力（一些通用的逻辑），最终是否使用这种能力取决于组件本身，通常通过 props 进行通信。

下面展示一个最常用的处理表单的高阶组件
```js
import React from 'react'

export default function WithForm(Comp) {
    return class WrapperComp extends React.Component {

        constructor(props) {
            super(props);
            this.state = {};
            this.handleChange = this.handleChange.bind(this);
        }

        handleChange(key, val) {
            this.setState({
                [key]: val
            });
        }

        render() {
            // 属性穿透
            return <Comp handleChange={this.handleChange} state={this.state} {...this.props}></Comp>
        }
    }
}
```

# Render Props
高阶组件的抽象方式是增强特定组件，在 JSX 中使用被装饰过的组件名称，有没有这样一种方式，创建一个可在 JSX 中使用的组件，达到此组件内部的组件进行增强呢？答案是可以的，这里演示一下，例如我们有 mouse 组件：
```js
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}
```

使用时如下，我们便增强了 Cats 组件，

```js
<Mouse render={mouse => <Cat mouse={mouse} />} />
// 当你使用 Render Props 时, 每次传入的 render 都是一个新的函数, 所以每次浅比较都会导致重新渲染。为了避免这个问题, 你可以将 prop 定义为一个实例方法
// <Mouse render={this.renderTheCat} />
```

此时 Cat 组件可以实现 Mouse 实现的功能啦

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img
        src="/cat.jpg"
        style={{ position: "absolute", left: mouse.x, top: mouse.y }}
      />
    );
  }
}
```

> 虽然这个技巧或者说模式（Pattern）叫 Render Props, 但是并不一定要使用 render 来传递渲染函数, 你甚至可以使用 children

# 数据获取

### Ajax
Axios 库是最广泛使用的 HTTP 客户端。它能同时在用户端（在用户端发起 Ajax 请求）与服务器端（在 Node.js 环境中）使用。

### Fetch API
fetch API：返回的响应需要被转化成 JSON 格式的数据结构。这是在处理 JSON 数据结构时，原生的 fetch API 中的 `强制步骤`。最后将处理后的响应赋值给组件内部状态中的结果。此外，我们用一段 catch 代码来处理出错的情况。如果在发起请求时出现错误，这个函数会进入到 catch 中而不是 then 中。此时我们需要进行错误处理。

你使用了大多数浏览器支持的原生 fetch API 来执行对 API 的异步请求。create-react-app 中的配置保证了 `它被所有浏览器支持`。你也可以使用第三方库来代替原生 fetch API，例如：`superagent` 和 `axios`。

HTML5 Fetch API，浏览器端直接隶属于 window 的属性，可以直接访问，有兼容性问题，polyfill 解决
* whatwg-fetch polyfill for browser
* node-fetch for server-side

# 其他

### 条件渲染
其实就是在 render 中使用逻辑判断代码而已。
1. 三目运算符 true ? JSX : null
2. 逻辑运算符 true && JSX

### 客户端缓存
其实思路比较简单，简单描述如下：
1. 状态存储结果值，为 K-V 键值对的格式
2. 如果结果中 K 存在，则直接返回上次的结果，否则发送请求

### 错误处理
在 React 中处理错误的基础知识，也就是本地状态和条件渲染。本质上来讲，错误只是 React 的另一种状态。当一个错误发生时，你先将它存在本地状态中，而后利用条件渲染在组件中显示错误信息。

### 组件接口和 PropTypes
你可能知道 TypeScript 或者 Flow 在 JavaScript 中引入了类型接口。一个类型语言更不容易出错，因为代码会根据它的程序文本进行验证。编辑器或者其他工具可以在程序运行之前就捕获这些错误，可以让你的应用更健壮。

本书中不会为你介绍 Flow 或者 Typescript，但是有另外一种简洁的方式可以在组件中检查类型。React 有一种内建的类型检查器来防止出现 Bug。你可以使用 PropTypes 来描述你的组件接口。所有从父组件传递给子组件的 props 都会基于子组件的 PropTypes 接口得到验证。

安装和导入 PropTypes
```
npm install prop-types
import PropTypes from 'prop-types';
```

使用
```js
Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};
```

基础的基本类型和复杂对象 PropTypes 有：
* PropTypes.array
* PropTypes.bool
* PropTypes.func
* PropTypes.number
* PropTypes.object
* PropTypes.string

有另外两个 PropTypes 用来定义一个可渲染的片段（节点）。比如一段字符串，或者一个 React 元素。
* PropTypes.node
* PropTypes.element

现在为 Button 定义的所有 PropTypes 都是可选的。参数可以为 null 或者 undefined。但是对于那么几个需要强制定义的 props，你可以标记这些 props 是必须传递给组件的。直接添加 .isRequired 即可。

我们可以给元素定义的更加明确
```js
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};
```

### 默认值
组件中定义默认 props 有两种方式
1. 通过 ES6 默认参数值
2. react 组件 defaultProps 属性

PropTypes 类型检查会在默认 props 生效后执行校验。

### 代码组织
一旦你的应用增长，你应该考虑将这些组件放到多个模块中去，只有这种方式你的应用才能扩展。在这里推荐一种模块。

* 抽象组件资源到特定文件夹
  * 文件名中的 index 名称表示他是这个文件夹的入口文件。这是一个命名共识，你也可以使用你习惯的命名。在这个模块结构中，一个组件被 JavaScript 文件中组件声明，样式文件，测试共同定义。
* 抽象 components 文件夹存放文件
* 抽象 constants 文件夹存放常量

当你使用 index.js 这个命名共识的时候，你可以在相对路径中省略文件名。

但是 index.js 文件名称后面发生了什么？这个约定是在 node.js 世界里面被引入的。index 文件是一个模块的入口。它描述了一个模块的公共 API。外部模块只允许通过 index.js 文件导入模块中的共享代码。

考虑用下面虚构的模块结构进行演示，假设你有 Buttons 文件夹，下面有文件 index.js，SubmitButton.js，SaveButton.js，CancelButton.js，这个 Buttons/ 文件夹有多个按钮组件定义在了不同的文件中。每个文件都 export default 特定的组件，使组件能够被 Buttons/index.js 导入。Buttons/index.js 文件导入所有不同的表现的按钮，并将他们导出作为模块的公共 API。

```js
// index.js
import SubmitButton from "./SubmitButton";
import SaveButton from "./SaveButton";
import CancelButton from "./CancelButton";

export { SubmitButton, SaveButton, CancelButton };

// 导入Button
import { SubmitButton, SaveButton, CancelButton } from "../Buttons";

// 在这些约束下，通过其他文件导入而不是通过 index.js 模块的话会是糟糕的实践。这会破坏封装的原则。

import SubmitButton from "../Buttons/SubmitButton"; // 糟糕的实践，不要这样做
```

# react-starter-kit

### Getting Started
项目下载与环境安装
1. git clone
2. yarn install
3. yarn start || yarn start -- --release
  * 仅编译，不开启服务 yarn run build || yarn run build -- --release
4. 检查语法错误和潜在问题：yarn run lint
5. 单元测试
  * yarn run test
  * yarn run test:watch
6. 发布（Git）：yarn run deploy

### React 风格向导
1. 单独的 UI 组件文件夹
  * 更容易找到特定组件的相关资源（CSS、image，unit test、files etc），且更利于重构
  * 避免多组件之间共享 css、image 和其他资源文件，将使你代码更利于维护和重构
  * 每个组件文件夹中添加 package.json 文件，将使你更容易在别的地方引入组件
2. 偏向于使用函数式组件
  * 任何时候偏向于使用无状态函数式组件
3. 使用 CSS 模块
  * 允许你使用短的 CSS 名称，且同时可以避免冲突
  * 保持 CSS 简单和可说明的
  * 在 CSS 中随意使用变量，通过 PostCSS 插件
  * 偏向于使用 class 类，而不是元素和 id 选择器
  * 避免嵌套的 CSS 选择器
  * 当有疑问时，使用.root 类代表根元素的组件
4. 使用高阶组件
  * 继承已有组件
  * 继承 React.Component

### 测试
测试库：
* Mocha：node 和浏览器测试
* Chai：断言库
* Enzyme：React 测试工具
* 其他
  * jsdom
  * react-addons-test-utils

yarn test
1. 寻找 src 目录下所.test.js 结尾的文件
2. mocha 执行找到的文件

约定
1. 测试文件必须以 test.js 结尾，否则 yarn test 检测不到他们
2. 测试文件命名应该和文件相关

# 测试
如何保证在一个规模增长的应用中代码的可维护性，我们需要去了解如何去组织代码，以便在构建你的工程目录和文件时时遵循最佳实践。了解如何通过测试提高代码的健壮性。

### 快照测试和 Jest

在编程中测试代码是基本，并应该被视为必不可少的。你应该想去保持高质量的代码并确保一切如预期般工作。

测试金字塔。其中有端到端测试，集成测试和单元测试。

* 单元测试用来测试一块独立的小块代码。它可以是被一个单元测试覆盖的一个函数。
* 集成测试可以覆盖验证是否这些单元组如预期般工作。
* 端到端测试是一个真实用户场景的模拟。可能是自动地启动一个浏览器，模拟一个用户在 Web 应用中的登录流程。单元测试相对来说快速而且易于书写和维护，端到端测试反之。

> 你需要很多的单元测试去覆盖代码中不同的函数。然后，你需要一些基础测试，去覆盖最重要的函数功能的联动，是否如预期一样工作。最后但也很重要的是，你可能需要一点点端到端测试去模拟你 Web 应用程序中的关键情境。

React 中测试的基础是组件测试，基本可以视作单元测试，还有部分的快照测试。在后面的章节中管理组件相关的测试需要用到一个叫 `Enzyme` 的库。本章中，你会主要关注另外一种测试：快照测试。这里正好引入 `Jest`。

> Jest 是一个在 Facebook 使用的测试框架。在 React 社区，它被用来做 React 的组件测试。幸好 create-react-app 已经包含了 Jest，所以你不需要担心启动配置的问题。

### Jest

Jest 赋予你写快照测试的能力。这些测试会生成一份渲染好的组件的快照，并在作和未来的快照的比对。当一个未来的测试改变了，测试会给出提示。你可以接受这个快照改变，因为你有意改变了组件实现，或者拒绝这个改变并要去调查错误的原因。快照测试可以非常好地和单元测试互补，因为这仅会比对渲染输出的差异。这并不会增加巨额的维护成本，因为只有在你有意改变组件中渲染输出的时候，才需要接受快照改变。

> it、describe、test

Jest 将快照保存在一个文件夹中。只有这样它才可以和未来的快照比对。此外这些快照也可以通过一个文件夹共享。

当你写快照之前，可能需要安装一个工具库。

```
npm install --save-dev react-test-renderer
```

一旦你改变了 App 组件中的 render 块的输出，这个测试应该会失败。然后你可以决定是否需要更新快照，或去调查 App 组件。

基本上 renderer.create() 函数会创建一份你的 App 组件的快照。它会模拟渲染，并将 DOM 存储在快照中。之后，会期望这个快照和上传测试运行的快照匹配。使用这种方式，可以确保你的 DOM 保持稳定而不会意外被改变。

> 快照测试常常就保持这样。只需要确保组件输出不会改变。一旦输出改变了，你必须决定是否接受这个改变。否则当输出和期望输出不符合时，你需要去修复组件。

### 单元测试和 Enzyme

Enzyme 是一个由 Airbnb 维护的测试工具，可以用来断言、操作、遍历 React 组件。你可以用它来管理单元测试，在 React 测试中与快照测试互补。

安装(create-react-app 不默认包含)

```
npm install --save-dev enzyme react-addons-test-utils enzyme-adapter-react-16
```

Enzyme API 中总共有三种渲染机制。你已经知道了 shallow()，这里还有 mount() 和 render() 方法。这两种方式都会初始化父组件和所有的子组件。此外 mount() 还给予你调用组件生命周期的方法。但是什时候该使用哪种渲染机制呢？这里有一些建议：

* 不论怎样都优先尝试使用浅渲染（shallow()）
* 如果需要测试 componentDidMount() 或 componentDidUpdate()， 使用 mount()
* 如果你想测试组件的生命周期和子组件的行为，使用 mount()
* 如果你想测试一个组件的子组件的渲染，并且不关心生命周期方法和减少些渲染的花销的话，使用 render()

# 结束了？
肯定没有，学习的过程中我发现 React 是在是太灵活，因此带来的问题就是新手入门的时候，不知道如下系统的学习。接下来如何扩展呢？
* 状态管理
  * React 组件内部 state 的局限性
  * 第三方的状态管理库（Redux 或 MobX）
* 连接到数据库和/或认证
  * Firebase
* 测试
* 异步请求
  * superagent
  * axios
  * 强大的灵活性
* 路由
  * react-router
* 类型检查
  * React PropTypes（局限性：只能在运行时执行检查）
  * Flow（静态检查）
* Webpack 和 Babel 相关工具
  * ESLint 统一代码风格
* React Native
  * 移动端解决方案
  * 两者都是相同的原则和理念。你只是会在移动设备上碰到一些跟 Web 应用有所不同的布局组件。

# 参考
* [create-react-app](https://github.com/facebookincubator/create-react-app)
* [react-starter-kit](https://github.com/kriasoft/react-starter-kit)
* [React 学习之道](https://leanpub.com/the-road-to-learn-react-chinese/read_full)