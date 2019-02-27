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
  * h(tagName,attrsObj,childElements))
  * h(tagName,attrsObj,；；))
* patch 函数（初次渲染与 diff 渲染）
  * patch(container, vnode)
  * patch(vnode, newVnode)

介绍一下 diff 算法？
