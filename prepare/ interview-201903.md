## 自我介绍
你好，我叫刘新琼，毕业于长沙理工大学网络工程系，在校期间主要学习 Java Web 开发，毕业之后主要从事前端开发工作，工作期间经历了前端技术的多次迭代，技术选型从 jQuery 到 angularjs，再到最近项目中最多使用的 Vue，平时工作生活中注重原生 JS 的学习。最后想说的是，虽目前从事前端，但个人并不局限于前端，对常见 Node Web 框架和 Nginx 代理服务器也有所涉及

## Grid 布局
CSS Grid 是创建网格布局最强大和最简单的工具。

CSS Grid 布局由两个核心组成部分是 wrapper（父元素）和 items（子元素）。要把 wrapper 元素编程 grid 网格，直接 display: grid 即可，如果没有添加其他属性，则只是简单的将 div 堆叠在一起。

为了使其成为二维的网格容器，我们需要定义列和行。让我们创建3列和2行。我们将使用 grid-template-row 和 grid-template-column 属性。比如
```css
.wrapper {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 50px 50px;
}
```

这两个写入了几个值，就表示几行几列，数值分别表示列宽和行高。

与此同时，子元素可以设置占多少行或列，通过使用 grid-column 和 grid-row 属性来设置
```css
.item1 {
    grid-column-start: 1;
    grid-column-end: 4;
}
```

以上表示从第一条网格线开始到第四条网格线结束。如果数值超过网格线最大值，则以最大值做计算和布局，可以简写如下
```css
.item1 {
    grid-column-start: 1;
    grid-column-end: 4;
}
```

## Symbol 类型
ES6 引入的原因：防止属性名的冲突（ES5的对象属性名都是字符串，容易造成属性名的冲突）

ES6引入一种新的原始数据类型：Symbol，表示独一无二的值。它是javascript语言的第七种数据类型，前六种是：Undefined、Null、Boolean、String、Number、Object。

Symbol 的特点
* Symbol 函数不能使用 new 调用，否则会报错，因为生成的 Symbol 是一个原始类型的值，而不是对象，所以不能添加属性。它是一种类似于字符串的数据类型。
* Symbol函数可以接受一个字符串作为参数，表示对Symbol实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
* 由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。
* Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames() 返回。但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名。由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

注意事项
* Symbol 函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的 Symbol 函数的返回值是不相等的。
* Symbol 值作为对象属性名时，不能用点运算符。因为点运算符后面总是字符串
* 在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。

其他
* Symbol.for 方法：接受一个字符串作为参数，并且创建的 Symbol 值是全局的，如果我们已经有一个 Symbol 值了，并且想重新使用，那么就可以利用这个方法来获取。
* Symbol.keyFor 方法：返回一个已登记的 Symbol 值的key。

内置的 Symbol 值，ES6 提供了11个内置的Symbol值，它们都是对象的属性，指向语言内部使用的方法。这里主要了解一个常用的
* Symbol.iterator

## URL 编码
encodeURI 和 encodeURIComponent 区别
* 它们都是编码 URL，唯一区别就是编码的字符范围
* encodeURI 方法不会对下列字符编码  ASCII字母、数字、~!@#$&*()=:/,;?+'
* encodeURIComponent 方法不会对下列字符编码 ASCII字母、数字、~!*()'

> encodeURIComponent 比 encodeURI 编码的范围更大。

什么场合用什么
* 如果你需要编码整个URL，然后需要使用这个URL，那么用encodeURI，如果你使用 encodeURIComponent 编码，则连 "/" 都被编码了，整个URL已经没法用了。
* 当你需要编码URL中的参数的时候，那么 encodeURIComponent 是最好方法

为什么 URI 需要编码，主要原因是 URI 有规范。比如 = 和 & 符号，服务端认定这些字符为分隔符，从而得到参数 k-v 键值对，但是如果参数值中本身就包含 = 或 & 等特殊字符，就会导致解析出错。举个例子

比如说“name1=value1”,其中value1的值是“va&lu=e1”字符串，那么实际在传输过程中就会变成这样“name1=va&lu=e1”。我们的本意是就只有一个键值对，但是服务端会解析成两个键值对，这样就产生了奇异。

解决的办法就是对参数进行 URL 编码，URL 编码只是简单的在特殊字符的各个字节前加上%，例如，我们对上述会产生奇异的字符进行 URL 编码后结果：“name1=va%26lu%3D”，这样服务端会把紧跟在“%”后的字节当成普通的字节，就是不会把它当成各个参数或键值对的分隔符。

## call、apply、bind
call 模拟实现
```js
Function.prototype.call2 = function(context) {
    var context = context || window
    context.fn = this
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args + ')')
    delete context.fn
    return result
}
```

apply 的模拟实现
```js
Function.prototype.apply2 = function(context, arr) {
    var context = context || window
    var arr = arr || []
    context.fn = this
    var args = [];
    for(var i = 1, len = arr.length; i < len; i++) {
        args.push('arr[' + i + ']');
    }
    var result = eval('context.fn(' + args + ')')
    delete context.fn
    return result
}
```

bind 模拟实现
```js
Function.prototype.bind2 = function(context) {
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var self = this
    var args = Array.prototype.slice(arguments, 1)
    var fNOP = function() {}
    var fBound = function() {
        var bindArgs = Array.prototype.slice(arguments)
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs))
    }
    fNOP.prototype = this
    fBound.prototype = new fNOP()
    return fBound
}
```

new 模拟实现
```js
function objectFactory() {
  var obj = new Object(),
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === 'object' ? ret : obj;
}
```

Object.create
```js
Object.create = function(o) {
    function F() {}
    F.prototype = o
    return new F()
}
```

## Web 安全
首先我们要知道安全的定义，主要是两个方面
* 私密性：不被非法获取和利用
* 可靠性：不丢失不损坏不被篡改

XSS 危害
* 执行了非本站的脚本
* 获取页面数据（用户资料）
* 获取Cookies（登录态）
* 劫持前端逻辑（欺骗用户）
* 发送请求
* ...

XSS 攻击点（永远不要相信用户输入）
* HTML节点内容
* HTML属性（用户输入超出属性本身）
* JavaSript代码（变量提前关闭）
* 富文本（富文本得保留HTML）

XSS 防御
* 浏览器自带防御：X-XSS-Protection 的 header
* 内容转义
* cookie 设置为 http-only
* 终极解决方案：CSP，Content Security Policy 内容安全策略，用于指定哪些内容可执行

CSRF 跨站请求伪造：指其他网站对本网站产生了影响，其他网站对目标网站发起了请求，在用户不知情的情况下完成

CSRF 攻击原理
* 用户登录A网站
* A网站确认身份
* B网站通过表单、链接、图片等访问A网站后端（带A网站身份）

CSRF 攻击危害：拿到了用户的登录态

CSRF 防御从原理发现特征
* 会带上 A 网站 Cookie
* 不访问 A 网站前端
* HTTP头中 referer 会为 B 网站

因此CSRF 具体防御为
* 禁止第三方网站带 Cookies，same-site 属性，限制为同域名
* 验证 referer，禁止第三方请求
* 前端加入验证信息
  * 图形验证码
  * token 校验（表单，cookie，表单和 cookie 做对比）

Cookie 安全策略
* 签名防篡改
* httpOnly
* secure
* sameSite

点击劫持
* 通过用户的点击完成了一个操作，但是用户并不知情
* 原理：通过iframe访问目标网站，但是对于用户而言不可见，通过按钮等元素的重叠效果，触发指定操作
* 危害：盗取用户资金，获取用户敏感信息等

点击劫持防御
* JavaScript禁止内嵌（top对象）
* X-FRAME-OPTIONS 头禁止内嵌，兼容性很好，推荐解决点击劫持方案
  * DENY
  * SAME-ORIGIN
  * ALLOW-FROM + url

## HTTP 常见头
请求头：Accept、Accept-Encoding、Accept-Language、Cache-Control、Connection、Host、If-Modified-Since、If-None-Match、User-Agent、Cookie

响应头：Cache-Control、Content-Encoding、Content-Length、Content-Type、Date、Etag、Expires、Keep-Alive、Last-Modified、Set-Cookie

这里回顾下来 Cache-Control 基本忘记了，赶紧回忆一下
* 可缓存性
  * public：客户端与代理服务器都可以进行缓存
  * private：只有发起请求的浏览器可以进行缓存
  * no-cache：任何节点都不能缓存（本质其实可以缓存，但是每次都必须去服务器验证）
* 到期
  * max-age=`<seconds>`
  * s-maxage=`<seconds>`，只有代理服务器才会生效，如果代理服务器同时设置了两者，则忽略max-age
* 重新验证
  * must-revalidate：如果max-age到期了，则必须从源服务端重新获取数据
  * proxy-revalidate：用在缓存服务器中
* 其他
  * no-store：客户端和代理服务器彻底不能进行缓存
  * no-transform：主要用在代理服务器，告诉代理服务器不要去改变内容

## HTTP 2.0 & HTTPS
HTTP 2.0 最大的改进有两点：一是支持服务端推送，二是支持 TCP 连接复用
* 服务端推送能够在客户端发送第一个请求到服务端时，提前把一部分内容推送到客户端，放入缓存中
* TCP 连接复用，使用同一个 TCP 连接来传输多个 HTTP 请求，避免三次握手开销和初建 TCP 连接时传输窗口小的问题

连接复用的好处
* 在HTTP/1.1中如果需要加载很多资源，并发发送受限于浏览器最大的TCP连接数，因为在一个TCP连接上，比如客户端必须等第一个请求发送完成后才能发送第二个请求，同时服务端必须等前一个请求数据全部返回后才能返回第二个请求数据，实质还是串行
* 在HTTP/1.1中，创建6个(Chrome)TCP连接开销很大，同时服务器的最大TCP连接数也是有限制的
* 在HTTP/2.0后，一个用户永远只需要一个TCP连接，因为可以并发发送和返回

## mini Vue
Vue 的基本原理
* 通过 Object.prototype 将 data、methods、computed 等值代理到实例上
* 监听 data 变化
  * 通过 Object.prototype 监听数据变化
  * 收集依赖项（哪些变动依赖该数据，数据改变时，调用对应的函数），为避免对同一个依赖项多次收集且解耦，这里有个小技巧，在 getter 中收集对该数据的依赖项
* 模板编译
  * 具体依赖项收集（分析模板的相关指令、事件、{{}} 绑定等），new Watcher 时获取 value 值前，将自身赋值给 Dep.target，获取 value 后，重新赋值为 null，这样就保证了不重复收集同一个依赖项

Vue 中使用了典型的观察者模式，观察者模式解决了主体对象和观察者之间功能的耦合，主要内容：收集依赖（观察者） + 通知观察者

DocumentFragment
* DocumentFragments 是DOM节点。它们不是主DOM树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。在DOM树中，文档片段被其所有的子元素所代替。
* 因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。

## 垂直居中
table-cell 方法
```css
.table{
    display: table;
    width: 100%;
    height: 40px;
    background: yellow;
}
.table-cell{
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
```

flex 方法
```css
.flex{
    display: flex;
    height: 40px;
    background: yellow;
    justify-content: center;
    align-items: center;;
}
```

absolute 方法，这里使用 margin 负值居中需要知道子元素的大小，如果不知道，请换成 transform: translate(-50%, -50%, 0)
```css
.absolute{
    position: relative;
    background: yellow;
    height: 40px;
}
.absolute p{
    position: absolute;
    display: inline-block;
    width: 30px;
    top: 50%;
    left: 50%;
    height: 20px;
    margin-left: -15px;
    margin-top: -10px;
}
```

grid 方法

## async/await 执行顺序
首先我们需要知道的是 async 函数返回的是一个 promise 对象，如果在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象。

重点需要理解 await 做了什么？await 是一个让出线程的标志，await func() 表达式可以理解成从右到左执行，func() 执行完后，执行 await 便让出线程，然后就会跳出整个 async 函数来执行后面 js 栈的代码，本轮事件循环执行完了之后又会跳回到 async 函数中等待 await 后面表达式的返回值，如果返回值为非 promise 则继续执行 async 函数后面的代码，否则将返回的 promise 放入 promise 队列

请正确理解下列代码的输出结果
```js
async function async1(){
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2(){
  console.log('async2');
}
console.log('script start');
setTimeout(function(){
  console.log('setTimeout');
},0);
async1();
new Promise(function(resolve){
  console.log('promise 1');
  resolve();
}).then(function(){
  console.log('promise 2');
})
console.log('script end');
// script start
// async1 start
// async2
// promise 1
// script end
// promise 2
// async1 end
// setTimeout
```

## 函数节流与防抖
首先区分这两个概念

函数防抖，debounce。其概念其实是从机械开关和继电器的“去弹跳”（debounce）衍生出来的，基本思路就是把多个信号合并为一个信号。单反也有相似的概念，在拍照的时候手如果拿不稳晃的时候拍照一般手机是拍不出好照片的，因此智能手机是在你按一下时连续拍许多张，通过合成手段，生成一张。

函数防抖使用场景：比如input输入格式验证，如果需要进行远程验证，如果用户每键入一个字符就发送一个请求的话，无意会加大服务端开销。这时候就可以使用防抖。

函数节流，throttle。节流的概念可以想象一下水坝，你建了水坝在河道中，不能让水流动不了，你只能让水流慢些。换言之，你不能让用户的方法都不执行。如果这样干，就是debounce了。为了让用户的方法在某个时间段内只执行一次，我们需要保存上次执行的时间点与定时器。

函数节流会用在比input, keyup 更频繁触发的事件中，如resize, touchmove, mousemove, scroll。throttle 会强制函数以固定的速率执行。因此这个方法比较适合应用于动画相关的场景。

具体实现：运用闭包、定时器（节流还可以使用时间戳）

## 错误监控
前端错误的分类和错误的捕获方式
* 即时运行错误
  * try-catch
  * window.onerror
* 资源加载错误（不冒泡，因此 window.onerror 无法捕获）
  * object.onerror
  * performance.getEntries() 资源加载时长
  * Error 事件捕获阶段

跨域的 js 运行错误可以捕获吗？错误提示是什么，应该如何处理
* 可以捕获，但是错误信息均为 Script error，行号和列号均无法拿到
* 客户端工作：给 script 标签添加 crossorigin 属性，服务端设置 js 资源响应头 Access-Control-Allow-Origin:*

捕获 Promise 错误
* window.addEventListener('unhandledrejection', event => ···);
* window.addEventListener('rejectionhandled', event => ···);

上报错误的基本原理
* 采用 Ajax 通信方式（非常不推荐）
* 利用 Image 对象上报

## meta 标签
meta 标签是一组键值对，是一种通用的元信息表示标签。head 中可以出现任意多个 meta 标签，一般由 name 和 content 两个属性来定义，name 表示元信息的名，content 则用于表示元信息的值。这个 name 是一种比较自由的约定，http 标准规定了一些 name 作为大家使用的共识，也鼓励大家发明自己的 name 使用。除了基本用法，meta 标签还有一些变体，主要用于简化书写方式或者声明自动化行为。

charset 属性：添加了 charset 属性的 meta 标签无需再有 name 和 content。charset 型 meta 标签非常关键，它描述了 HTML 文档自身的编码形式，因此建议这个标签放在 head 的第一个，因为浏览器在读到这个标签之前，处理的所有字符都是 ASCII 字符，ASCII 字符是 UTF-8 和绝大多数字符编码的子集，所以在读到 meta 之前，浏览器把文档理解大多数编码格式都不会出错，这样可以最大程度保证不出现乱码。

http-equiv 属性：表示执行一个命令，这样的 meta 标签可以不需要 name 属性了。比如下面一段代码相当于添加了 content-type http 头，并且指定了 http 编码方式

meta 标签可以被自由定义，只要写入和读取的双方约定好 name 和 content 格式就可以了。接下来看一个 meta 类型，没有在 HTML 标准中定义，确实移动端开发的事实标准：viewport。这类 meta 的 name 为 viewport，它的 content 是一个复杂结构，是用逗号分隔的键值对，键值对的格式是 key=value

## 混合开发
file 协议：加载本地文件，速度快。http(s)协议：网络加载，速度慢

JS 和客户端通讯（schame 协议）
* JS 访问客户端能力，传递参数和回调函数
* 客户端通过回调函数返回内容

## 模块化发展
AMD(require.js) -> CMD(sea.js) -> commonJS -> ES6

## 异步方案发展
回调函数 -> Promise -> async/await

## 现代化框架
vdom 是什么？为何会存在 vdom？
* 用 JS 模拟 DOM 结构，DOM 变化的对比，放在 JS 层来做
  * tag 表示标签，attrs 表示标签属性，children 表示子元素。（class 属性由于在 JS 中是关键字，因此替换成 className）
* 提高重绘性能，DOM 操作是最昂贵的

vdom 为何用 diff 算法？
* DOM 操作是昂贵的，因此尽量减少 DOM 操作
* 找出本次 DOM 必须更新的节点来更新，其他的不更新
* 如何找出的过程，就需要 diff 算法

mvvm 特点
* 数据和视图分离，解耦（开放封闭原则）
* 以数据驱动视图（只关心数据变化，DOM 操作被封装）

MVVM 框架的三大要素
* 响应式：如何监听到 data 每个属性变化
* 模版引擎：模版如何被解析，指令如何处理
* 渲染：模版如何被渲染成 html？以及渲染过程

对组件化的理解
* 组件的封装（视图、封装、变化逻辑）
* 组件的复用（props 传递）

## 原生 ajax、jsonp
见 jsonp.js

## 小程序的坑
小程序 bug
* canvas 尺寸过大会导致秒退

mpvue bug
* v-else 配合事件，导致事件响应出现问题
* key 列表渲染优化，处理和 Vue 甚至是相反的

Vue 默认渲染优化为：当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。

这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出。

如果在项目中，有一个状态是由子组件管理的，删除一个元素后，他的内部状态被其他组件复用了。因此在 vue 中，我们是这么做的。为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 key 属性。理想的 key 值是每项都有的唯一 id。

## 类型隐式转换
数据类型：最新标准定义了7种数据类型
* 原始类型：Boolean，Null，Undefined，Number，String，Symbol
* 对象：Object

显式类型装换：显示调用 Number/String/Boolean 函数

隐式类型转换
* 四则运算
* 判断语句
* Native 调用（alert，console）

Number 函数
* 数值：还是原来的值
* 字符串：可以解析为数值，则转换为相应的数值，否则得到 NaN，空字符串转为 0
* 布尔值：true 转成 1，false 转成 0
* undefined：转成 NaN
* null：转成 0
* 对象：先调用对象自身的 valueOf 方法，如果该方法返回原始类型的值，则直接对该值使用 Number 方法，不再进行后续步骤。如果 valueOf 返回复合类型值，在调用自身的 toString 方法，如果返回原始类型的值，则对该值使用 Number 方法，不再进行后续步骤，如果 toString 返回的是复合类型的值，则报错。

String 函数
* 数值：转为相应的字符串
* 字符串：还是原来的值
* 布尔值：true 转成 'true'，false 转成 'false'
* undefined：转成 'undefined'
* null：转成 'null'
* 对象：先调用对象自身的 toString 方法，如果该方法返回原始类型的值，则直接对该值使用 String 方法，不再进行后续步骤。如果 toString 返回复合类型值，在调用自身的 valueOf 方法，如果返回原始类型的值，则对该值使用 String 方法，不再进行后续步骤，如果 valueOf 返回的是复合类型的值，则报错。

Boolean函数
* undefined、null、-0、+0，NaN，'' 为 false，其余为 true

## 博客回顾
尾递归优化
* 每个栈帧代表了被调用中的一个函数，这些函数栈帧以先进后出的方式排列起来，就形成了一个栈。每个栈帧保存着：上一个栈帧的指针，输入参数，返回值，返回地址等
* 栈容量是有限的，如果 n 值太大了，就有可能栈溢出
* 当递归调用是函数体中最后执行的语句，并且它的返回值不属于表达式的一部分时，这个递归就是尾递归。现在编译器就会发现这个特点，生成优化的代码，复用栈帧。

通过代码演示尾递归
```c++
// 优化前
int factorial() {
  if(n == 1) {
    return 1
  } else {
    return n * factorial(n -1)
  }
}
// 优化后
int factorial(int n, int result) {
  if(n == 1) {
    return result
  } else {
    return factorial(n-1, n*result)
  }
}
```

屏蔽浏览器差异：reset.css

性能优化的考虑方向：文件大小、文件数量、缓存、DNS 预解析、CDN、按需加载

setTimeout 和 requestAnimationFrame 区别
* setTimeout 由于不准确会存在掉帧情况
* requestAnimationFrame 是由帧刷新驱动的

JSON.stringify 高阶用法

CSS 权重
* 内联样式 1000
* ID 选择器的权值为 100
* Class 类选择器的权值为 10
* HTML 标签选择器的权值为 1

CSS 优先级：(外部样式）External style sheet <（内部样式）Internal style sheet <（内联样式）Inline style

let 和 var 变量声明的差别
* let 没有变量前置现象
* let 在全局作用域声明变量不能用全局对象引用
* let 声明变量受限于块级作用域
* let 命令不允许重复声明
* let 声明变量会形成暂时性死区：从变量声明所在的作用域顶端到变量声明这块区域就是暂时性死区。在这个区域内，该变量不能被使用，总结来说，let声明变量，必须先声明再使用。

函数声明提升比同名变量声明提升优先级要高
```js
function valueof(){
    return 1;
}
var valueof;
alert(typeof valueof); // function
```

现在的单页应用多数使用片段标识符来坐路由，那你知道为啥有时候会将 `#` 换成 `#!` 吗？

因为网络蜘蛛默认会忽略#后面的内容，这对于搜索引擎还是开发者都是不利的，解决方案hash bang，将#改成#!，实现大致为：当网络蜘蛛遇到#!时候，会自动将#!identifier转成_escaped_fragment_=identifier形式的参数。
* 将#改成#!告诉网络蜘蛛：我们支持这个解决方案：hash bang
* 同时，我们的应用也需要具备相应的支持能力，对于网络蜘蛛带 escaped_fragment=casper 的 GET 请求，需要能够提供相应的网页内容

容易弄混的几个方法
* substr(start, [length])
  * start 开始位置的下标，可以是负数(使用 length+start 换算成正数，此时也就是从尾部开始数，最后一个元素是-1)
  * length 是要截取的字符的长度,必须是数字.如果未指定,则从 start 位置处开始截取到字符串结尾
* substring(start, [end])
  * start 是截取的开始位置的下标，从0开始算起，如果负数则按零处理
  * end 必须是数字，如果未指定，则从 start 位置处开始截取到字符串结尾
  * 如果 start>end ，会交换位置
* slice(start, [end])
  * start 开始位置的下标，可以是负数(使用 length+start 换算成正数，此时也就是从尾部开始数，最后一个元素是-1)
  * end 结束位置的下标，可以是负数(使用 length+start 换算成正数，此时也就是从尾部开始数，最后一个元素是-1)，若未指定此参数，则要提取的子串包括 start 到原字符串结尾的字符串
  * 数组也是可以使用的
  * 如果 start>end ，不复制任何元素到新数组中
* splice(index, [howmany],[element1, ..., elementX])

## Vue 技术栈

## webpack

## 重学前端
如何解析请求回来的 HTML 代码，DOM 树是如何构建的

> 具体流程：字符流 -> 状态机 -> 词 token -> 栈 -> DOM 树

## 排序算法