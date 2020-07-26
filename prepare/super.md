## 知识点
分为如下几个部分
* 基础知识：ES6 常见用法、原型高级应用、异步全面讲解
* 框架原理：虚拟 DOM、MVVM vue、组件化 React
* 混合开发：hybrid、hybrid vs H5、前端客户端通讯
* 热爱编程：读书、博客、开源

## 基础知识

### 模块化
ES6 开发环境普遍使用，但浏览器环境却支持不好（需要开发环境编译）。

ES6 模块化如何使用，开发环境如何打包
* 安装 babel 依赖`npm install --save-dev babel-core babel-preset-es2015 babel-preset-latest`
* 创建 .babelrc 文件
```json
{
    "presets": ["es2015","latest"],
    "plugins": []
}
```
* 安装 babel-cli `npm install -g babel-cli`，然后 babel 命令手动进行转换

上述开发环境配置仅适用于单文件，对于文件模块化，文件之间互相引用，此时就无能为力了。此时需要 webpack 帮忙。
* npm install webpack babel-loader --save-dev
* 配置 webpack.config.js
```js
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: './build/bundle.js'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    }
}
```
* 配置 npm scripts

使用 rollup
* npm init
* npm install rollup rollup-plugin-node-resolve rollup-plugin-babel babel-plugin-external-helpers babel-core babel-preset-latest --save
* 配置 .babelrc
```json
{
    "presets": [
        ["latest", {
            "es2015": {
                "modules": false // 不编译引入的插件
            }
        }]
    ],
    "plugins": ["external-helpers"]
}
```
* 配置 rollup.config.js
```js
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
export default {
    entry: 'src/index.js',
    format: 'umd', // 通用规范
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    dest: 'build/bundle.js'
}
```
* 配置 scripts：rollup -c rollup.config.js

rollup 对比 webpack
* rollup 功能单一，webpack 功能强大
* 工具要尽可能单一，可集成，可扩展

模块化标准
* AMD（require.js） 成为标准（也有 CMD）
* commonJS 主要用在服务端 node 使用
* ES6 出现，先统一现在所有模块化标准（nodejs 积极支持，浏览器尚未统一）

### class
class 和构造函数有何区别
* 本质是一样的，typeof className 其实是个 function
* 语法糖的形式，看起来和实际原理不一样的东西，个人不太赞同，强行模仿 java C#，却失去了本性和个性

### Promise
回顾一下 Promise 实现。

### ES6其他常用功能
简单总结
* let/const
* 多行字符串/模版变量
* 解构赋值
* 块级作用域
* 函数默认参数
* 箭头函数

### 原型
说一个原型的实际应用，jQuery、zepto
```js
// zepto 实现
(function(window) {
    var zepto = {}
    zepto.init = function(selector) {
        var slice = Array.prototype.slice
        var dom = slice.call(document.querySelectorAll(selector))
        return zepto.Z(dom, selector)
    }

    var $ = function(selector) {
        return zepto.init(selector)
    }

    function Z(dom, selector) {
        var i, len = dom ? dom.length : 0
        for(i = 0; i < len; i++) {
            this[i] = dom[i]
        }
        this.length = len
        this.selector = selector
    }

    zepto.Z = function(dom, selector) {
        return new Z(dom, selector)
    }

    $.fn = {
        constructor: zepto.Z,
        css: function(key, value) {

        },
        html: function(value) {

        }
    }

    zepto.Z.prototype = Z.prototype = $.fn

    window.$ = $

})(window)

// jQuery 实现
(function(window) {
    var jQuery = function(selector) {
        return new jQuery.fn.init(selector)
    }

    var init = jQuery.fn.init = function(selector) {
        var slice = Array.prototype.slice
        var dom = slice.call(document.querySelectorAll(selector))
        var i, len = dom ? dom.length : 0
        for(i = 0; i < len; i++) {
            this[i] = dom[i]
        }
        this.length = len
        this.selector = selector
    }

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        css: function(key, value) {

        },
        html: function(value) {

        }
    }
    init.prototype = jQuery.fn
    window.$ = jQuery
})(window)
```

原型如何体现它的扩展性 - 插件机制，思考一下上述为什么将 z.prototype 赋值为 $.fn，而不是直接赋值为一个对象呢？因为要扩展插件，比如
```js
$.fn.getNodeName = function() {
    return this[0].nodeName
}
```

这样做的好处是
* 只有 $ 会暴露在 window 全局变量
* 将插件扩展同意到 $.fn.xxx 这个接口，方便调用

### 异步
什么是单线程，和异步有什么关系
* 只有一个线程，只能做一件事情
* 原因：避免 DOM 渲染冲突
* 解决方案：异步
* H5 中 webworker 支持多线程，但是不能访问 DOM

异步存在的问题
* 没有按照书写方式执行，可读性差
* callback 中不容易模块化

什么是 event-loop：JS 实现异步的解决方案
* 同步代码，直接执行
* 异步函数先放在异步队列中
* 待同步函数执行完毕，轮训执行异步队列函数

Promise 的基本使用和原理
* 开放封闭原则：对扩展开放，对修改封闭。代码解耦，利于扩展，降低测试回归成本。
* 异常捕获
  * then 只接受一个参数，最后统一用 catch 捕获异常（对于代码抛出异常 Error 和 reject 均可捕获），如果 then 有两个参数，则 catch 不会执行
* 多个串联，链式执行
* Promise.all 和 Promise.race
* Promise 标准
  * 状态变化：pending fulfilled rejected，状态不可逆
  * then 返回的必须是一个 Promise 实例

async/await（和 Promise 的区别和联系）
* then 只是将 callback 拆分了
* async/await 是最直接的同步写法
* 用法
  * 使用 await，函数必须用 async 标识
  * await 后面跟的是 Promise 实例

总结一下当前 JS 解决异步的方案

## 框架原理

### 虚拟 DOM
vdom 是 vue 和 React 的核心。

vdom 是什么？为何会存在 vdom？
* 用 JS 模拟 DOM 结构，DOM 变化的对比，放在 JS 层来做
  * tag 表示标签，attrs 表示标签属性，children 表示子元素。（class 属性由于在 JS 中是关键字，因此替换成 className）
* 提高重绘性能，DOM 操作是最昂贵的

vdom 如何应用，核心 API 是什么？
* snabbdom 库（vue 2.0 借用该库）
* h 函数返回一个 vnode 节点
  * h(tagName, attrsObj, childElements))
  * h(tagName, attrsObj, ''))
* patch 函数（初次渲染与 diff 渲染）
  * patch(container, vnode)
  * patch(vnode, newVnode)

介绍一下 diff 算法？对比异同

vdom 为何用 diff 算法？
* DOM 操作是昂贵的，因此尽量减少 DOM 操作
* 找出本次 DOM 必须更新的节点来更新，其他的不更新
* 如何找出的过程，就需要 diff 算法

diff 算法实现流程
```js
// 数据样本
var vnode = {
    tag: 'ul',
    attrs: {
        id: 'list'
    },
    children: [
        {
            tag: 'li',
            attrs: {
                className: 'item'
            },
            children: ['Item 1']
        },
        {
            tag: 'li',
            attrs: {
                className: 'item'
            },
            children: [{
                tag: 'span',
                attrs: {
                    className: 'text'
                },
                children: ['text']
            }]
        }
    ]
}
function createElement(vnode) {
    if(typeof vnode === 'string') {
        return document.createTextNode(vnode)
    }
    var tag = vnode.tag
    var attrs = vnode.attrs || {}
    var children = vnode.children || []
    if(!tag) {
        return null
    }
    var elem = document.createElement(tag)
    for(var attrName in attrs) {
        if(attrs.hasOwnProperty(attrName)) {
            var key = attrName
            if(attrName === 'className') {
                key = 'class'
            }
            elem.setAttribute(key, attrs[attrName])
        }
    }

    children.forEach(function(childVnode) {
        elem.appendChild(createElement(childVnode))
    })
    return elem
}

// patch(vnode, newVnode) vnode 要和真实的 dom 有对应关系，这样对比之后才知道要更新那些 dom
// 伪代码。没考虑太细节的东西
function updateChildren(vnode, newVnode) {
    var children = vnode.children || []
    var newChildren = newVnode.children || []
    children.forEach(function(childVnode, index) {
        var newChildVnode = newChildren[index]
        if(childVnode.tag === newChildVnode.tag) {
            updateChildren(childVnode, newChildVnode)
        } else {
            replaceNode(childVnode, newChildVnode)
        }
    })
}
function replaceNode(vnode, newVnode) {
    var ele= vnode.element
    var newEle = createElement(newVnode)
    // 替换
    ele.parentNode.replaceChild(ele, newEle)
}
```

更多细节
* 节点新增和删除
* 节点重新排序
* 节点属性、样式、事件绑定
* 如何极致压榨性能

> 看源码过程中一定不要陷入细节当中，二八原则

### MVVM
使用 jQuery 和使用框架的区别
* 数据和视图分离，解耦（开放封闭原则）
* 以数据驱动视图（只关心数据变化，DOM 操作被封装）

如何理解 MVVM
* MVC（Model-View-Controller）
  * 用户操作 view，view 调用 controller，controller 改变 model，model 反馈视图
  * 直接操作 controller，controller 改变 model，model 反馈视图
* Model-View-ViewModel，因为数据和视图是分离的，ViewModel 扮演着 Model 到 View 之间桥梁的角色

MVVM 框架的三大要素
* 响应式：如何监听到 data 每个属性变化
* 模版引擎：模版如何被解析，指令如何处理
* 渲染：模版如何被渲染成 html？以及渲染过程

vue 中如何实现响应式：核心原理 Object.defineProperty

vue 中如何实现解析模版
* 模版是什么
  * 本质 HTML 字符串
  * 有逻辑 v-for v-if
  * 嵌入 JS 变量
  * 模版必须转换成 JS 代码，第一有逻辑，第二需要转换为 HTML 渲染页面
* render 函数
  * with 用法（vue render 中用）
  * 模版中所有信息都包含在了 render 函数中
  * vue 2.0 开始支持预编译，开发环境写模版，经过编译后，生产环境就是 JS
* render 函数与 vdom
  * render 返回的就是 vdom
  * vm._update(vm._render())

vue 的整个实现流程
* 解析模版成 render 函数（词法分析）
* 响应式开始监听
* 首次渲染，显示页面，且绑定依赖
* data 属性变化，触发 rerender

为什么监听 get，直接监听 set 不行吗？data 中有很多属性，有些被用到，有些可能不被用到，被用到的会走 get，不被用到的不会走到 get，未走到 get 中的属性，set 的时候我们也无需关心，可以避免不必要的重复渲染

### 组件化
对组件化的理解
* 组件的封装（视图、封装、变化逻辑）
* 组件的复用（props 传递）

JSX 本质
* JSX 语法
  * HTML 语法
  * {} 引入 JS 变量、表达式、逻辑代码
  * style/className
* JSX 解析成 JS
  * JSX 其实是语法糖
  * 开发环境会将 JSX 编译成 JS 代码
* 独立标准
  * 虽然是 React 引入，但目前不是 React 独有
  * React 已经将它作为一个独立标准开放，其他项目也可用
  * babel-plugin-transform-react-jsx（配置 .babelrc 中 plugins 有 transform-react-jsx 即可单独使用）

思考编写组件时，我们根本没用到 React 变量，可是为何还要导入呢？这就是 JSX 转换为 JS 之后，需要使用 React（比如 React.createElement），否则找不到就会报错。

React.createElement 参数说明
* 参数一：tagName
* 参数二：attrsObj
* 参数三：子元素（数组、剩余参数的形式）

自定义组件解析
* div 直接渲染成 div 即可，vdom 可以做到
* 自定义组件，比如 List，直接传入 List 构造函数，vdom 默认不认识
* 因此自定义组件定义的时候必须声明 render 函数
* 根据 props 初始化实例，然后执行实例的 render 函数
* render 函数返回的还是 vnode 实例

为什么需要 vdom：JSX 需要渲染成 html，数据驱动视图，vdom 扮演一个中间角色。

何时 patch：ReactDOM.render 和 setState

setState 为何需要异步
* 你无法规定、限制用户如何使用 setState，可能会一次执行多次 setState
* 没必要每次 setState 都重新渲染，考虑性能。即便是每次重新渲染，用户也看不到中间的效果，因此只需要看到最终效果即可。

vue 修改属性也是异步，修改属性，被响应式的 set 监听到，set 中执行 updateComponent 是异步的，updateComponent 重新执行 vm._render()，生成的 vnode 和 prevVnode，通过 patch 进行对比。

setState 的过程
* 每个组件实例，都有 renderComponent 方法
* 执行 renderComponent 会重新执行实例的 render
* render 函数返回 newVnode，然后拿到 preVnode
* 执行 patch(preVnode, newVnode)

由于 setState 是异步的，因此如果想知道成功修改完成的时机，可以将回调函数作为第二个参数传入

React vs Vue
* 本质区别
  * vue 本质是 MVVM 框架，由 MVC 发展而来
  * React 本质是前端组件化框架，由后端组件化发展而来
* 模版和组件化区别
  * vue 使用模版（最初由 angular 提出）
  * React 使用 JSX，模版和 JS 混在一起，未分离
  * React 本身就是组件化，没有组件化就不是 React
  * vue 也支持组件化，不过是在 MVVM 上的扩展
* 共同点
  * 都支持组件化
  * 数据驱动视图
* 总结
  * 国内首推 vue，文档更易读、易学、社区够大
  * 如果团队水平较高，推荐使用React。组件化和 JSX

## 混合开发
hybrid 是什么？为何会用 hybrid？

hybrid 即混合，即前端和客户端的混合开发

hybrid 存在价值
* 可以快速迭代更新（无需 app 审核，因为 JS 权限不够）
* 体验流畅
* 减少开发和沟通成本，双端公用一套代码

webview 是 app 中一个组件，用于加载 h5 页面，即一个小型的浏览器内核。

file 协议：加载本地文件，速度快。http(s)协议：网络加载，速度慢

不是所有场景都适合使用 hybrid
* 使用 NA：体验要求机制，变化不频繁（如首页）
* 使用 hybrid：体验要求高，变化频繁（如详情页）
* 使用 h5：体验无要求，不常用（如举报、反馈页）

hybrid 具体实现
* 前端做好静态页面，将文件交给客户端
* 客户端拿到前端静态页面，以文件形式存储在 app 中
* 客户端在一个 webview 中
* 使用 file 协议加载静态页面

app 发布后，静态文件如何更新
* 目的：要替换每个客户端的静态文件
* 交给客户端来做，客户端去 server 下载最新的静态文件
* 我们维护 server 的静态文件
* 打包上传到 server 端，客户端下载解压
* 版本管理，避免不必要的下载

hybrid 对比 h5
* hybrid
  * 优点：体验更好，跟 NA 体验基本一致。可快速迭代
  * 缺点：开发成本高，联调、测试、查 bug 都比较麻烦。运维成本高
  * 场景：产品的稳定功能，体验要求高，迭代频繁。
* h5
  * 场景：单次的运营活动或不常用功能

JS 和客户端通讯
* JS 访问客户端能力，传递参数和回调函数
* 客户端通过回调函数返回内容

schema 协议 -- 前端和客户端通讯的约定
```js
(function(window, undefined) {
    function _invoke(action, data, callback) {
        var schema = 'myapp://utils/' + action
        schema += '?a=a'
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                schema += '&' + key + '=' + data[key]
            }
        }
        var callbackName = ''
        if(typeof callback === 'string') {
            callbackName = callback
        } else {
            callbackName = action + Date.now()
            window[callbackName] = callback
        }

        schema += 'callback=' + callbackName

        // 触发
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = schema
        document.body.appendChild(iframe)
        setTimeout(function() {
            document.body.removeChild(iframe)
            iframe = null
        })
    }
    window.invoke = {
        share: function(data, callback) {
            _invoke('share', data, callback)
        },
        scan: function(data, callback) {
            _invoke('scan', data, callback)
        },
        login: function(data, callback) {
            _invoke('login', data, callback)
        }
    }
})(window)
```

内置上线，比如上述封装的 invoke.js 可以内置到客户端
* 客户端每次启动 webview 都默认执行 invoke.js
* 本地加载，免去网络加载事件，更快
* 本地加载，没有网络请求，黑客看不到 schame 协议，更安全

## 热爱编程
看书
* 构建知识体系最好方式
* 自己买书，不要借书（因为你会留下自己的东西）

博客 - 合格程序员的必备
* 总结和别人交流的过程
* 如何让更多人看？公开的博客（github、公众号、知乎）
* 面对质疑和打击？心态放开咯

开源 - github 的 star 是硬通货
* 做什么？不小众的工具型，立刻开始写，不要思考太多
* 写好官网和文档
* 及时回复 issue，及时迭代发版
* 推广：博客