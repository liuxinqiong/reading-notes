## 自我介绍
你好，我叫刘新琼，毕业于长沙理工大学网络工程系，在校期间主要学习 Java Web 开发，从 15 年开始接触前端开发工作，工作期间经历了前端技术的多次迭代，技术选型从 jQuery 到 angularjs，再到最近项目中最多使用的 Vue，平时工作生活中注重原生 JS 的学习。最后想说的是，虽目前从事前端，但个人并不局限于前端，对常见 Node Web 框架和 Nginx 代理服务器也有所涉及

## Grid 布局
CSS Grid 是创建网格布局最强大和最简单的工具。

CSS Grid 布局由两个核心组成部分是 wrapper（父元素）和 items（子元素）。要把 wrapper 元素变成 grid 网格，直接 display: grid 即可，如果没有添加其他属性，则只是简单的将 div 堆叠在一起。

为了使其成为二维的网格容器，我们需要定义列和行。让我们创建 3 列和 2 行。我们将使用 grid-template-row 和 grid-template-column 属性。比如
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
    grid-column: 1/4;
}
```

## Symbol 类型
ES6 引入的原因：防止属性名的冲突（ES5的对象属性名都是字符串，容易造成属性名的冲突）

ES6引入一种新的原始数据类型：Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：Undefined、Null、Boolean、String、Number、Object。

Symbol 的特点
* Symbol 函数不能使用 new 调用，否则会报错，因为生成的 Symbol 是一个原始类型的值，而不是对象，所以不能添加属性。它是一种类似于字符串的数据类型。
* Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
* 由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。
* Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames() 返回。但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名。由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

注意事项
* Symbol 函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的 Symbol 函数的返回值是不相等的。
* Symbol 值作为对象属性名时，不能用点运算符。因为点运算符后面总是字符串
* 在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。

其他
* Symbol.for 方法：接受一个字符串作为参数，并且创建的 Symbol 值是全局的，如果我们已经有一个 Symbol 值了，并且想重新使用，那么就可以利用这个方法来获取。
* Symbol.keyFor 方法：返回一个已登记的 Symbol 值的 key。

内置的 Symbol 值，ES6 提供了11个内置的 Symbol 值，它们都是对象的属性，指向语言内部使用的方法。这里主要了解一个常用的
* Symbol.iterator

## URL 编码
encodeURI 和 encodeURIComponent 区别
* 它们都是编码 URL，唯一区别就是编码的字符范围
* encodeURI 方法不会对下列字符编码 ASCII字母、数字、~!@#$&*()=:/,;?+'
* encodeURIComponent 方法不会对下列字符编码 ASCII字母、数字、~!*()'

> encodeURIComponent 比 encodeURI 编码的范围更大。

什么场合用什么
* 如果你需要编码整个 URL，然后需要使用这个 URL，那么用 encodeURI，如果你使用 encodeURIComponent 编码，则连 "/" 都被编码了，整个 URL 已经没法用了。
* 当你需要编码 URL 中的参数的时候，那么 encodeURIComponent 是最好方法

为什么 URI 需要编码，主要原因是 URI 有规范。比如 = 和 & 符号，服务端认定这些字符为分隔符，从而得到参数 K-V 键值对，但是如果参数值中本身就包含 = 或 & 等特殊字符，就会导致解析出错。举个例子

比如说“name1=value1”,其中 value1 的值是“va&lu=e1”字符串，那么实际在传输过程中就会变成这样“name1=va&lu=e1”。我们的本意是就只有一个键值对，但是服务端会解析成两个键值对，这样就产生了奇异。

解决的办法就是对参数进行 URL 编码，URL 编码只是简单的在特殊字符的各个字节前加上 %，例如，我们对上述会产生奇异的字符进行 URL 编码后结果：“name1=va%26lu%3D”，这样服务端会把紧跟在 `%` 后的字节当成普通的字节，就是不会把它当成各个参数或键值对的分隔符。

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
        // 构造函数时，bind 的 this 失效
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
* 获取 Cookies（登录态）
* 劫持前端逻辑（欺骗用户）
* 发送请求
* ...

XSS 攻击点（永远不要相信用户输入）
* HTML节点内容
* HTML属性（用户输入超出属性本身）
* JavaScript 代码（变量提前关闭）
* 富文本（富文本得保留 HTML）

XSS 防御
* 浏览器自带防御：X-XSS-Protection 的 header
* 内容转义
* cookie 设置为 http-only
* 终极解决方案：CSP，Content Security Policy 内容安全策略，用于指定哪些内容可执行

CSRF 跨站请求伪造：指其他网站对本网站产生了影响，其他网站对目标网站发起了请求，在用户不知情的情况下完成

CSRF 攻击原理
* 用户登录 A 网站
* A 网站确认身份
* B 网站通过表单、链接、图片等访问 A 网站后端（带 A 网站身份）

CSRF 攻击危害：拿到了用户的登录态

CSRF 防御从原理发现特征
* 会带上 A 网站 Cookie
* 不访问 A 网站前端
* HTTP 头中 referer 会为 B 网站

因此 CSRF 具体防御为
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
* 原理：通过 iframe 访问目标网站，但是对于用户而言不可见，通过按钮等元素的重叠效果，触发指定操作
* 危害：盗取用户资金，获取用户敏感信息等

点击劫持防御
* JavaScript 禁止内嵌（top 对象）
* X-FRAME-OPTIONS 头禁止内嵌，兼容性很好，推荐解决点击劫持方案
  * DENY
  * SAME-ORIGIN
  * ALLOW-FROM + url

## HTTP 相关
HTTP 特点、常见头、HTTPS、HTTP 2.0

GET 和 POST 关于长度限制问题
* GET 可提交的数据量受到 URL 长度的限制，HTTP 协议规范没有对 URL 长度进行限制。这个限制是特定的浏览器及服务器对它的限制
* 理论上讲，POST 是没有大小限制的，HTTP 协议规范也没有进行大小限制，出于安全考虑，服务器软件在实现时会做一定限制
* GET 和 POST 数据内容是一模一样的，只是位置不同，一个在 URL 里，一个在 HTTP 包的包体里

POST 提交数据内容类型
* HTTP 协议中规定 POST 提交的数据必须在 body 部分中，但是协议中没有规定数据使用哪种编码方式或者数据格式。
* 开发者完全可以自己决定消息主体的格式，同时服务端需要解析成功才有意义，服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。

POST 提交的 Content-Type 有
* application/x-www-form-urlencoded
* multipart/form-data
  * 生成了一个 boundary 用于分割不同的字段，为了避免与正文内容重复，boundary 很长很复杂。
  * 每部分都是以 --boundary 开始，紧接着是内容描述信息，然后是回车，最后是字段具体内容（文本或二进制）。如果传输的是文件，还要包含文件名和文件类型信息。消息主体最后以 --boundary-- 标示结束。
* application/json：Ajax 流行后，json 格式就变得很流行

Keep-Alive：如果客户端浏览器支持 Keep-Alive ，那么就在 HTTP 请求头中添加一个字段 Connection: Keep-Alive，当服务器收到附带有 Connection: Keep-Alive 的请求时，它也会在响应头中添加一个同样的字段来使用 Keep-Alive 。这样一来，客户端和服务器之间的 HTTP 连接就会被保持，不会断开（超过 Keep-Alive 规定的时间，意外断电等情况除外），当客户端发送另外一个请求时，就使用这条已经建立的连接。在 HTTP 1.1 版本中，默认情况下所有连接都被保持，如果加入 "Connection: close" 才关闭。目前大部分浏览器都使用 HTTP 1.1 协议，也就是说默认都会发起 Keep-Alive 的连接请求了，所以是否能完成一个完整的 Keep-Alive 连接就看服务器设置情况。
* HTTP 长连接不可能一直保持，例如 Keep-Alive: timeout=5, max=100，表示这个TCP通道可以保持5秒，max=100，表示这个长连接最多接收100次请求就断开。
* 使用长连接之后，客户端、服务端怎么知道本次传输结束呢？两部分：1. 判断传输数据是否达到了 Content-Length 指示的大小；2. 动态生成的文件没有 Content-Length ，它是分块传输（chunked），这时候就要根据 chunked 编码来判断，chunked 编码的数据在最后有一个空 chunked 块，表明本次传输数据结束

Transfer-Encoding 是一个用来标示 HTTP 报文传输格式的头部值。尽管这个取值理论上可以有很多，但是当前的 HTTP 规范里实际上只定义了一种传输取值——chunked。如果一个 HTTP 消息（请求消息或应答消息）的 Transfer-Encoding 消息头的值为 chunked，那么，消息体由数量未定的块组成，并以最后一个大小为 0 的块为结束。

HTTP Pipelining（HTTP 管线化）：默认情况下 HTTP 协议中每个传输层连接只能承载一个 HTTP 请求和响应，浏览器会在收到上一个请求的响应之后，再发送下一个请求。在使用持久连接的情况下，某个连接上消息的传递类似于请求1 -> 响应1 -> 请求2 -> 响应2 -> 请求3 -> 响应3。HTTP Pipelining（管线化）是将多个 HTTP 请求整批提交的技术，在传送过程中不需等待服务端的回应。使用 HTTP Pipelining 技术之后，某个连接上的消息变成了类似这样请求1 -> 请求2 -> 请求3 -> 响应1 -> 响应2 -> 响应3。

### HTTP 常见头
请求头：Accept、Accept-Encoding、Accept-Language、Cache-Control、Connection、Host、If-Modified-Since、If-None-Match、User-Agent、Cookie

响应头：Cache-Control、Content-Encoding、Content-Length（单位 byte）、Content-Type、Date、Etag、Expires、Keep-Alive、Last-Modified、Set-Cookie

这里回顾下来 Cache-Control 基本忘记了，赶紧回忆一下
* 可缓存性
  * public：客户端与代理服务器都可以进行缓存
  * private：只有发起请求的浏览器可以进行缓存
  * no-cache：任何节点都不能缓存（本质其实可以缓存，但是每次都必须去服务器验证）
* 到期
  * max-age=`<seconds>`
  * s-maxage=`<seconds>`，只有代理服务器才会生效，如果代理服务器同时设置了两者，则忽略 max-age
* 重新验证
  * must-revalidate：如果 max-age 到期了，则必须从源服务端重新获取数据
  * proxy-revalidate：用在缓存服务器中
* 其他
  * no-store：客户端和代理服务器彻底不能进行缓存
  * no-transform：主要用在代理服务器，告诉代理服务器不要去改变内容

### HTTP 2.0 & HTTPS
HTTP 2.0 最大的改进有两点：一是支持服务端推送，二是支持 TCP 连接复用
* 服务端推送能够在客户端发送第一个请求到服务端时，提前把一部分内容推送到客户端，放入缓存中
* TCP 连接复用，使用同一个 TCP 连接来传输多个 HTTP 请求，避免三次握手开销和初建 TCP 连接时传输窗口小的问题

连接复用的好处
* 在 HTTP/1.1 中如果需要加载很多资源，并发发送受限于浏览器最大的 TCP 连接数，因为在一个 TCP 连接上，比如客户端必须等第一个请求发送完成后才能发送第二个请求，同时服务端必须等前一个请求数据全部返回后才能返回第二个请求数据，实质还是串行
* 在 HTTP/1.1 中，创建 6个(Chrome)TCP 连接开销很大，同时服务器的最大 TCP 连接数也是有限制的
* 在 HTTP/2.0 后，一个用户永远只需要一个 TCP 连接，因为可以并发发送和返回

## mini Vue
Vue 的基本原理
* 通过 Object.defineProperty 将 data、methods、computed 等值代理到实例上
* 监听 data 变化
  * 通过 Object.defineProperty 监听数据变化
  * 收集依赖项（哪些变动依赖该数据，数据改变时，调用对应的函数），为避免对同一个依赖项多次收集且解耦，这里有个小技巧，在 getter 中收集对该数据的依赖项
* 模板编译
  * 具体依赖项收集（分析模板的相关指令、事件、{{}} 绑定等），new Watcher 时获取 value 值前，将自身赋值给 Dep.target，获取 value 后，重新赋值为 null，这样就保证了不重复收集同一个依赖项

Vue 中使用了典型的观察者模式，观察者模式解决了主体对象和观察者之间功能的耦合，主要内容：收集依赖（观察者） + 通知观察者

DocumentFragment
* DocumentFragments 是 DOM 节点。它们不是主 DOM 树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到 DOM 树。在 DOM 树中，文档片段被其所有的子元素所代替。
* 因为文档片段存在于内存中，并不在 DOM 树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。

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

函数防抖使用场景：比如 input 输入格式验证，如果需要进行远程验证，如果用户每键入一个字符就发送一个请求的话，无意会加大服务端开销。这时候就可以使用防抖。

函数节流，throttle。节流的概念可以想象一下水坝，你建了水坝在河道中，不能让水流动不了，你只能让水流慢些。换言之，你不能让用户的方法都不执行。如果这样干，就是 debounce 了。为了让用户的方法在某个时间段内只执行一次，我们需要保存上次执行的时间点与定时器。

函数节流会用在比 input, keyup 更频繁触发的事件中，如 resize, touchmove, mousemove, scroll。throttle 会强制函数以固定的速率执行。因此这个方法比较适合应用于动画相关的场景。

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
```html
<meta http-equip="content-type" content="text/html; charset=UTF-8">
```

meta 标签可以被自由定义，只要写入和读取的双方约定好 name 和 content 格式就可以了。接下来看一个 meta 类型，没有在 HTML 标准中定义，却是移动端开发的事实标准：viewport。这类 meta 的 name 为 viewport，它的 content 是一个复杂结构，是用逗号分隔的键值对，键值对的格式是 key=value

## 混合开发
file 协议：加载本地文件，速度快。http(s) 协议：网络加载，速度慢

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

## 类型转换
数据类型：最新标准定义了 7 种数据类型
* 原始类型：Boolean，Null，Undefined，Number，String，Symbol
* 对象：Object

类型转换有两种
* 显式类型装换：显示调用 Number/String/Boolean 函数
* 隐式类型转换：四则运算、判断语句、Native 调用（alert，console）

> Number、String 和 Boolean，三个构造器是两用的，当跟 new 搭配时，它们产生对象，当直接调用时，它们表示强制类型转换。

> 为什么给对象添加的方法能用在基本类型上？因为.运算符提供了装箱操作，他会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。

### StringToNumber
这里顺便谈谈 parseInt 和 parseFloat，parseInt 有两个参数 string 和 radix，radix 表示上述字符串的基数。parseFloat 只有一个参数 value。

始终指定 radix 参数可以消除阅读该代码时的困惑并且保证转换结果可预测。当未指定基数时，不同的实现会产生不同的结果，通常将值默认为 10。在基数为 undefined，或者基数为 0 或者没有指定的情况下，JavaScript 作如下处理：
* 如果字符串 string 以 `0x` 或者 `0X` 开头, 则基数是 16 (16进制).
* 如果字符串 string 以 `0` 开头, 则基数是 8（八进制）或者10（十进制），那么具体是哪个基数由实现环境决定。ECMAScript 5 规定使用 10，但是并不是所有的浏览器都遵循这个规定。
* 如果字符串 string 以其它任何值开头，则基数是10 (十进制)。

> 由于实现标准可能不一样，因此，永远都要明确给出 radix 参数的值。

parseInt 特点如下
* 如果 parseInt 的字符不是指定基数中的数字，则忽略该字符和所有后续字符，并返回解析到该点的整数值。parseInt 将数字截断为整数值。允许使用前导空格和尾随空格。
* 一些数中可能包含 e 字符（例如6.022e23），使用 parseInt 去截取包含 e 字符数值部分会造成难以预料的结果。也就是说 parseInt 不支持科学记数法的字符串解析。
* 如果 parseInt 遇到了不属于 radix 参数所指定的基数中的字符那么该字符和其后的字符都将被忽略。接着返回已经解析的整数部分。parseInt 将截取整数部分。开头和结尾的空白符允许存在，会被忽略。

类型转换支持十进制（30）、二进制（0b111）、八进制（0o13）、十六进制（0xFF），此外还有正负号科学记数法，可以使用大写或者小写的 e 来表示，根据上述 MDN 可知，parseInt 和 parseFloat 并不是使用这个转换，在不传入第二个参数的情况下，parseInt 只支持 16 进制前缀"0x"，而且会忽略非数字字符，也不支持科学记数法，在一些古老的浏览器环境中，parseInt 还支持 0 开头的数字作为 8 进制前缀，这是很多错误的来源。所以在任何环境下，都建议传入 parseInt 的第二个参数，而 parseFloat 则直接把原字符串作为十进制来解析，它不会引入任何其他的进制。

> 因此多数情况下，Number 是比 parseInt 和 parseFloat 更好的选择。

### NumberToString
在较小的范围内，数字到字符串的转换是完全符合你直觉的十进制表示。当 Number 绝对值较大或者较小时，字符串表示则是使用科学记数法表示的，目的保证产生的字符串不会过长。

### 具体结果
对象到 String 和 Number 的转换都遵循"先拆箱再转换"的规则，通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的 String 或 Number。

拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型，如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError。

Number 函数
* 数值：还是原来的值
* 字符串：可以解析为数值，则转换为相应的数值，否则得到 NaN，空字符串转为 0
* 布尔值：true 转成 1，false 转成 0
* undefined：转成 NaN
* null：转成 0
* 对象：先调用对象自身的 valueOf 方法，如果该方法返回原始类型的值，则直接对该值使用 Number 方法，不再进行后续步骤。如果 valueOf 返回复合类型值，在调用自身的 toString 方法，如果返回原始类型的值，则对该值使用 Number 方法，不再进行后续步骤，如果 toString 返回的是复合类型的值，则报错。

String 函数
* 数值：转为相应的字符串，当 Number 绝对值较大或者较小时，字符串表示则是使用科学记数法表示的，目的保证产生的字符串不会过长。
* 字符串：还是原来的值
* 布尔值：true 转成 'true'，false 转成 'false'
* undefined：转成 'undefined'
* null：转成 'null'
* 对象：先调用对象自身的 toString 方法，如果该方法返回原始类型的值，则直接对该值使用 String 方法，不再进行后续步骤。如果 toString 返回复合类型值，在调用自身的 valueOf 方法，如果返回原始类型的值，则对该值使用 String 方法，不再进行后续步骤，如果 valueOf 返回的是复合类型的值，则报错。

Boolean函数
* undefined、null、-0、+0，NaN，'' 为 false，其余为 true

## 递归优化
递归优化原理
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

```js
function factorial(n ,result) {
    if(n === 1) {
        return result
    } else {
        return factorial(n - 1, result * n)
    }
}
```

## 编译原理
编译原理，程序中一段源代码在执行之前会经历三个步骤，统称为编译
1. 分词/词法分析：将字符组成的字符串分解成有意义的代码块，这些代码块被称为词法单元
2. 解析/语法分析：将词法单元流转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树称为抽象语法树（AST）
3. 将 AST 转换为可执行代码的过程被称为代码生成。这个过程与语言、目标平台等息息相关

词法分析（有意义代码块）-> 语法分析（抽象语法树）-> 代码生成

比起那些编译构成只有三个步骤的语言的编译器，JS 引擎要复杂的多，例如在语言分析和代码生成阶段有特定的步骤来对性能进行优化，包括对冗余元素进行优化等。
* 首先，JS 引擎不会有大量的时间来进行优化，因为和其他语言不同，JS 的编译过程不是发生在构建之前
* 大部分情况下编译发生在代码执行前的几微妙的时间内。在作用域背后，JS 引擎用尽了各种办法（比如 JIT，可以延迟编译甚至实施重编译）来保证性能最佳

## 最大整数与字符串最大长度
关于最大整数，首先需要明白的是，JS 中没有真正的整数，JS 中所有的数字类型，实际存储都是通过 8 字节 double 浮点型表示的。

正是因为 JS 中整数也是用浮点数表示的，因此不同于其他语言（8 字节）中一样，最大整数是：2^63 - 1，而是
```js
Math.pow(2, 53) - 1
```

要知道原因，就必须先知道 IEEE 754 表示规则，由三个部分组成，分别是符号位、指数和尾数，在双精度（64位）中，尾数长度 52，指数长度 11，同时约定小数点左边隐含有一位，通常这位数是 1，因此最终尾数长度需要增加一位。

在 JS 中，最大和最小安全值可以这样获得
```js
console.log(Number.MAX_SAFE_INTEGER); // Math.pow(2, 53) - 1
console.log(Number.MIN_SAFE_INTEGER); // Math.pow(-2, 53) - 1
```

这里有点小奇怪，比如在 Java 中 32 位的 int 型范围为`[-2^31, 2^31 - 1]`，为什么在 JS 中最小整数却也就还是减 1 呢？

在 Java 中，比如用 4 位表示 int，范围为 [-8, 7]，在这里 -0 会被当做 -8 来处理，因此负数部分能表示的个数需要加 1。我估摸着还是因为 JS 中使用浮点数表示整数的原因，因此并没有对 -0 进行处理。

在 JS 中有 +0 和 -0，在加法类运算中它们没有区别，但是除法的场合则需要特别留意区分，"忘记检测除以-0，而得到负无穷大"的情况经常会导致错误，而区分 +0 和 -0 的方式，正式检测 1/x 是 Infinity 还是 -Infinity。

String 理论上最大长度是 2^53 - 1，这也是 JS 中可表达的最大安全整数。这在一般开发中都是够用的，但有趣的事，这个所谓最大长度，并不完全是你理解中的字符数。因为 String 的意义并未字符串，而是字符串的 UTF-16 编码，同时我们的字符串的操作 charAt、charCodeAt、length 等方法针对的都是 UTF-16 编码。因为字符串的最大长度，实际上是受字符串编码长度影响的。

## 事件模型（补充）
DOM 的事件操作（监听和触发），都定义在 EventTarget 接口。除了我们常用的 addEventListener 和 removeEventListener，还有一个 dispatchEvent 触发事件的函数也是需要了解滴

dispatchEvent 方法在当前节点上触发指定事件，从而触发监听函数的执行。该方法返回一个布尔值，只要有一个监听函数调用了 Event.preventDefault()，则返回值为 false，否则为 true。
```js
para.addEventListener('click', hello, false);
var event = new Event('click');
para.dispatchEvent(event);
```

事件绑定监听函数的三种方式
* HTML 标签的 on- 属性：违反了 HTML 与 JavaScript 代码相分离的原则
* Element 节点的事件属性：同一个事件只能定义一个监听函数
* addEventListener 方法：推荐的指定监听函数的方法
  * 可以针对同一个事件，添加多个监听函数。
  * 能够指定在哪个阶段（捕获阶段还是冒泡阶段）触发回监听函数。
  * 除了 DOM 节点，还可以部署在 window、XMLHttpRequest 等对象上面，等于统一了整个 JavaScript 的监听函数接口。

上面的三种方式，相比有点经验都会知道，但是监听函数中 this 指向问题，却是容易忽略的地方。实际编程中，监听函数内部的 this 对象，常常需要指向触发事件的那个 Element 节点。

addEventListener 方法指定的监听函数，内部的 this 对象总是指向触发事件的那个节点。具体原理看下面代码便知
```js
para.onclick = hello;
```

如果将监听函数部署在 Element 节点的 on- 属性上面，this 不会指向触发事件的元素节点。
```js
// pElement.setAttribute('onclick', 'hello()'); 类似于如下写法
para.onclick = function () {
  hello();
}
```

针对上述情况的一种解决办法是：不引入函数作用域，直接在 `on-` 属性写入所要执行的代码。因为 `on-` 属性是在当前节点上执行的。
```html
<p id="para" onclick="console.log(this.id)">Hello</p>
```

stopPropagation 与 stopImmediatePropagation：stopPropagation 只会阻止当前监听函数的传播（并不是表示如果有多个监听函数，其他函数没有阻止冒泡，就会继续冒泡的意思），不会阻止节点上的其他同事件的监听函数。如果想要不再触发那些监听函数，可以使用 stopImmediatePropagation 方法。

事件对象：IE8 及以下版本，事件对象不作为参数传递，而是通过 window 对象的 event 属性读取，并且事件对象的 target 属性叫做 srcElement 属性。所以，以前获取事件信息，往往要写成下面这样。
```js
function myEventHandler(event) {
  var actualEvent = event || window.event;
  var actualTarget = actualEvent.target || actualEvent.srcElement;
  // ...
}
```

事件对象相关属性
* event.bubbles：表示当前事件是否会冒泡。该属性为只读属性，只能在新建事件时改变。除非显式声明，Event 构造函数生成的事件，默认是不冒泡的。
* event.eventPhase：返回一个整数值，表示事件目前所处的节点。
  * 0 事件未发生
  * 1 事件捕获阶段
  * 2 事件目标阶段
  * 3 事件冒泡阶段
* event.cancelable：返回一个布尔值，表示事件是否可以取消。该属性为只读属性，只能在新建事件时改变。除非显式声明，Event 构造函数生成的事件，默认是不可以取消的。如果要取消某个事件，需要在这个事件上面调用 preventDefault 方法，这会阻止浏览器对某种事件部署的默认行为。
* event.defaultPrevented：返回一个布尔值，表示该事件是否调用过 preventDefault 方法。
* event.currentTarget：返回事件当前所在的节点，即正在执行的监听函数所绑定的那个节点。在监听函数中，currentTarget 属性实际上等同于 this 对象。
* event.target：返回触发事件的那个节点，即事件最初发生的节点。如果监听函数不在该节点触发，那么它与 currentTarget 属性返回的值是不一样的。
* event.type：返回一个字符串，表示事件类型，大小写敏感。
* event.detail：返回一个数值，表示事件的某种信息。
* event.timeStamp：返回一个毫秒时间戳，表示事件发生的时间。
* event.isTrusted：返回一个布尔值，表示该事件是否为真实用户触发。

event.preventDefault()
* 取消浏览器对当前事件的默认行为，比如点击链接后，浏览器跳转到指定页面，或者按一下空格键，页面向下滚动一段距离。该方法生效的前提是，事件的 cancelable 属性为 true，如果为 false，则调用该方法没有任何效果。
* 该方法不会阻止事件的进一步传播（stopPropagation 方法可用于这个目的）。只要在事件的传播过程中（捕获阶段、目标阶段、冒泡阶段皆可），使用了 preventDefault 方法，该事件的默认方法就不会执行。
  * 比如单选框点击选中，如果设置监听函数，取消默认行为，会导致无法选中单选框。
  * 利用这个方法，可以为文本输入框设置校验条件。如果用户的输入不符合条件，就无法将字符输入文本框。
* 如果监听函数最后返回布尔值 false（即 return false），浏览器也不会触发默认行为，与 preventDefault 方法有等同效果。

自定义事件
```js
// 新建事件实例
var event = new Event('build');
// 添加监听函数
elem.addEventListener('build', function (e) { ... }, false);
// 触发事件
elem.dispatchEvent(event);
```

如果自定义数据需要传递参数
```js
var event = new CustomEvent('build', { 'detail': 'hello' });
function eventHandler(e) {
  console.log(e.detail);
}
```

## 浏览器解析与渲染
浏览器拿到请求回来的 HTML，怎么显示在浏览器上呢
1. 构建 DOM 树：具体流程：字符流 -> 状态机 -> 词 token -> 栈 -> DOM 树
2. CSS 计算：流式的计算和匹配 CSS
3. 排版：确定每个元素的位置
4. 渲染、合成、绘制：根据样式信息和大小信息，为每个元素在内存中渲染它的图形，并且把它绘制到对应的位置

> 渲染过程把元素变成位图，合成把一部分位图变成合成层，最终的绘制过程把合成层显示到屏幕上。

第四步骤，有个性能优化点
* 渲染的过程中，是不会把子元素绘制到渲染的位图上的，这样，当父子元素的相对位置发生变化时，可以保证渲染的结果能够最大程度被缓存，减少重新渲染。
* 由于渲染过程不会把子元素渲染到位图上面，合成的过程，就是为一些元素创建一个“合成后的位图”，把一部分子元素渲染到合成的位图上面。

合成的策略
* 原则：最大限度的减少绘制参数
* 极端例子：所有元素都进行合成，比如为根元素 html 创建一个合成后的位图，把所有子元素都进行合成，那么一旦用 JS 改变了任何一个 CSS 属性，这份合成后的位图就失效了，我们需要重新绘制所有的元素，如果所有的元素都不合成，结果就是相当于每次都必须重新绘制所有元素，这也不是性能友好的选择
* 好的合成策略：猜测可能变化的元素，把它排除到合成之外

目前主流浏览器一般根据 position、transform 等属性来决定合成策略，来猜测这些元素未来可能发生变化。但是这样的猜测准确性有限，所以新的 CSS 标准中，规定了 will-change 属性，可以由业务代码来提示浏览器的合成策略，灵活运用这样的特性，可以大大提升合成策略的效果。

重排与重绘
* 当改变影响到文本内容、结构或元素位置时，就会发生重排
* 改变不会影响元素的位置及大小的样式时，则会触发重绘。

异步 layout 和同步 layout
* 异步 layout：浏览器为了尽可能减少 reflow 和 repaint 的操作，而将这些操作积攒起来，再统一做一次 reflow。
* 什么时候产生同步 layout
  * resize 窗口
  * 改变页面默认字体时，
  * 脚本作出以下请求
    * offsetTop/Left/Width/Height
    * scrollTop/Left/Width/Height
    * clientTop/Left/Width/Height
    * getComputedStyle() 或 currentStyle（IE）那么浏览器需要立即 layout 以返回最新的值。

扩展：offsetWidth/offsetHeight、clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别
* offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect() 相同
* clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
* scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

截止今日，产生了很多不同的浏览器，各个浏览器本质大同小异，核心部分基本相似，由渲染引擎和 JS 引擎组成。最常见的渲染引擎为 webkit。

## service worker
背景：JS 单线程、异步、回调、Promise、Web Worker

### Web Worker
HTML 5 标准支持的 Web Worker，我们可以为 JavaScript 创建运行在后台的额外线程，并被多个页面共享。

主线程中通过 new Worker(path of task) 的方式创建工作线程，主线程和工作线程通过 postMessage 函数和 onmessage 事件传递消息和接收消息

### PWA
PWA (Progressive Web Apps) 是一种 Web App 新模型，并不是具体指某一种前沿的技术或者某一个单一的知识点，，这是一个渐进式的 Web App，是通过一系列新的 Web 特性，配合优秀的 UI 交互设计，逐步的增强 Web App 的用户体验。
* Https 环境部署
* 响应式设计，一次部署，可以在移动设备和 PC 设备上运行 在不同浏览器下可正常访问。
* 浏览器离线和弱网环境可极速访问。
* 可以把 App Icon 入口添加到桌面。
* 点击 Icon 入口有类似 Native App 的动画效果。
* 灵活的热更新

### Service Worker
Service Worker 基于 Web Worker 事件驱动。

在PWA要求的各种能力上，关于离线环境的支持我们就需要仰赖 ServiceWorker。Service workers 本质上充当 Web 应用程序与浏览器之间的代理服务器。由于 PWA 是谷歌提出，那么对 ServiceWorker，同样也提出一些能力要求：
* 后台消息传递
* 网络代理，转发请求，伪造响应
* 离线缓存
* 消息推送

在目前阶段，ServiceWorker 的主要能力集中在网络代理和离线缓存上。

Service Worker 事件
* install
* activate
* message
* fetch
* sync
* push

Service Worker 全局对象
* self 指向这个对象本身
* caches 管理缓存

## HTML5

### 新增内容
对比 HTML4
* 文件类型声明（<!DOCTYPE>）仅有一型
* 新的解析顺序：不再基于SGML
* 新的元素：video、canvas、audio、语义化标签
* input元素的新类型：date, email, url等
* 移除元素：big、center、font、frame、frameset、noframes 等

HTML5增加了更多样化的API:
* HTML Geolocation
* HTML Drag and Drop
* HTML Local Storage
* HTML Application Cache
* HTML Web Workers
* HTML SSE
* HTML Canvas/WebGL
* HTML Audio/Video

### 离线存储
通过离线存储，我们可以通过把需要离线存储在本地的文件列在一个 manifest 配置文件中，这样即使在离线的情况下，用户也可以正常使用 App。

怎么用？
1. html 的 manifest 属性指定 `xxx.manifest` 列表文件
2. manifest 文件按照一定的书写格式
  * CACHE：表示需要离线存储的资源列表，由于包含 manifest 文件的页面将被自动离线存储，所以不需要把页面自身也列出来。
  * NETWORK：表示在它下面列出来的资源只有在在线的情况下才能访问，他们不会被离线存储，所以在离线情况下无法使用这些资源。
  * FALLBACK：表示如果访问第一个资源失败，那么就使用第二个资源来替换他

例子
```shell
CACHE MANIFEST
#v0.11 更新注释行中的日期和版本号是一种使浏览器重新缓存文件的办法。

CACHE:

js/app.js
css/style.css

NETWORK:
resourse/logo.png

FALLBACK:
/ /offline.html
```

在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

离线的情况下，浏览器就直接使用离线存储的资源。

与传统浏览器缓存的区别：离线缓存断网还可以打开页面，浏览器缓存不行。

注意事项
* 如果服务器对离线的资源进行了更新，那么必须更新 manifest 文件之后这些资源才能被浏览器重新下载，如果只是更新了资源而没有更新 manifest 文件的话，浏览器并不会重新下载资源，也就是说还是使用原来离线存储的资源。
* 浏览器在下载 manifest 文件中的资源的时候，它会一次性下载所有资源，如果某个资源由于某种原因下载失败，那么这次的所有更新就算是失败的，浏览器还是会使用原来的资源。
* 在更新了资源之后，新的资源需要到下次再打开 app 才会生效，如果需要资源马上就能生效，那么可以使用 window.applicationCache.swapCache() 方法来使之生效，出现这种现象的原因是浏览器会先使用离线资源加载页面，然后再去检查 manifest 是否有更新，所以需要到下次打开页面才能生效。

该方案缺点
* 更新完版本后，必须刷新一次才会启动新版本（会出现重刷一次页面的情况）
* 无法进行灰度发布等策略
* 无法增量更新

## CSS
link 与 @import
* link 在 HTML 中使用，@import 在 CSS 中使用
* @import 是 CSS 提供的语法规则，只有导入样式表的作用。而 link 是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

inline-block 空格，主要原因在于大多数 inline-block 元素默认 `vertical:baseline`；因此会有一个 X 字符空隙，解决办法
* 设置 img display: block
* 设置 img 的 vertical 为 middle|top
* 设置 img 父元素的 font-size: 0 或者 line-height: 0

清除浮动

IFC

### 包含块
其实在编写 CSS 过程中，都会有这方面的简单意识，但是这个概念还是第一次碰见，因此还是总结一下

在 CSS2.1 中，很多框的定位和尺寸的计算，都取决于一个矩形的边界，这个矩形，被称作是包含块( containing block )。 一般来说，(元素)生成的框会扮演它子孙元素包含块的角色；注意：这里只是一般来说，这里还是有一系列规则的。

“一个框的包含块”，指的是“该框所存在的那个包含块”，并不是它建造的包含块。

每个框关于它的包含块都有一个位置，但是它不会被包含块限制；它可以溢出(包含块)。包含块上可以通过设置 'overflow' 特性达到处理溢出的子孙元素的目的。

包含块的概念很重要，因为可视化格式模型中很多的理论性知识都跟这个概念有关系
* 宽度高度自动值的计算
* 浮动元素的定位
* 绝对定位元素的定位

元素框的定位和尺寸与其包含块有关，而元素会为它的子孙元素创建包含块。元素的包含块就是它的父元素呢？包含块的区域是不是父元素的内容区域呢？答案是否定的。大致有如下几种情况
* 根元素：处于文档树最顶端的元素，它没有父节点。根元素存在的包含块，被叫做初始包含块 (initial containing block)。具体，跟用户端有关。
* 静态定位元素和相对定位元素：由它最近的块级、单元格（table cell）或者行内块（inline-block）祖先元素的内容框创建（内边界）。
* 固定定位元素：当前可视窗口
* 绝对定位元素：离它最近的 'position' 属性为 'absolute'、'relative' 或者 'fixed' 的祖先元素创建。

针对绝对定位元素，还有种特殊情况是，如果其祖先元素是行内元素，则包含块取决于其祖先元素的 'direction' 特性
* 如果 'direction' 是 'ltr'，包含块的顶、左边是祖先元素生成的第一个框的顶、左内边距边界(padding edges) ，右、下边是祖先元素生成的最后一个框的右、下内边距边界(padding edges)
* 如果 'direction' 是 'rtl'，包含块的顶、右边是祖先元素生成的第一个框的顶、右内边距边界 (padding edges) ，左、下边是祖先元素生成的最后一个框的左、下内边距边界 (padding edges)

其他情况下，如果祖先元素不是行内元素，那么包含块的区域应该是祖先元素的内边距边界

## 项目难点与解决方案
左侧菜单自动生成（实现解耦）

小程序 canvas 涂抹擦除

## Vue 技术栈

### Vue
事件选择
* created 获取数据，创建非响应式数据
* mounted 获取真实 DOM 元素（如需要）

动画
* transition || transition-group 组件
  * 特定 CSS 类型
  * 特定钩子函数
* JS 应用 CSS animation（create-keyframe-animation）
* 第三方 CSS 动画库，如 Animate.css
* 第三方 JavaScript 动画库，如 Velocity.js

父子组件交互
* 父组件通过属性传值给子组件
* 子组件通过函数属性或事件派发与父组件交互

CSS 规范
* index.scss 包含 base.scss/reset.scss/icon.scss
* base.scss 全局基础样式
* reset.scss 重置浏览器样式
* icon.scss 字体图标
* mixin.scss 常用的 CSS 函数库，一般达到简写的目的，比如（bg-image 多倍屏、no-wrap 不换行，extend-click 扩充点击区域）
* variable.scss 颜色规范（背景，文字、主题） + 字体大小规范

编写可复用的组件，除了 Props 和事件之外，还有两个东西十分重要，ref 属性和插槽系统，这里就复习下插槽系统
* 单个插槽
* 具名插槽
* 作用域插槽

边界情况
* $root $parent provide 和 inject
* 循环引用：需要给定一个点，这里对另一个的依赖改为异步加载，问题就可以解决。

插件开发：在实际开发中，我们需要引入各种模块来实现功能，或者给全局的 Vue 对象添加一些全局功能。这些都可以通过插件帮助我们完成，我们也可以开发自己的插件。Vuejs 插件范围没有限制，一般有以下几种：
* 添加全局方法或者属性，直接挂在 Vue 对象上
* 添加全局资源：指令、过滤器等
* 通过全局 mixin 方法添加一些组件选项，如：vue-router
* 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。

响应式原理
* 由于 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明根级响应式属性，哪怕只是一个空值。（性能和维护性方面考虑）
* 异步更新队列：Vue 是异步执行 DOM 更新的，只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环 `tick` 中，Vue 刷新队列并执行实际 (已去重的) 工作。
* Vue.js 通常鼓励开发人员沿着 `数据驱动` 的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 vm.$nextTick()。这样回调函数在 DOM 更新完成后就会调用。

Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive property)。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上。在组件内容可以直接使用 this.$set，他是全局 Vue.set 的别名。

具体使用限制
* Vue 不能检测以下变动的数组
  * 当你利用索引直接设置一个项时
  * 当你修改数组的长度时
* Vue 不能检测对象属性的添加或删除

有时你可能需要为已有对象赋予多个新属性，比如使用 Object.assign()。在这种情况下，你应该用两个对象的属性创建一个新的对象。
```js
// 这是错误的
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})

// 创建新对象重复赋值才是正确的
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

这里主要弄明白两个问题
* 关于使用限制的奇怪现象：在实际应用中，我们经常会粗心使用了错误的写法，但是却发现它的响应式貌似是生效的，这是为什么呢
* Object.assign 为何要求重新赋值呢

> getter 触发依赖收集，setter 触发 notify。

首先解释 Object.assign，针对错误的用法，将源对象的属性赋值给目标对象，这时候目标对象的值是没有改变的，因为都是指向堆区的一个地址。因此并没有触发对象的 setter，从而导致没有触发 rerender。这里还有个细节需要关心，使用正确的方式，由于重新赋值，会导致触发 setter，从而 rerender。但此时查看新添加的属性，会发现他是有 getter/setter 的，也就是说对于新添加的属性，加入了响应式。这是怎么做到的呢？原因就是 Vue 从源码层面帮我们消除了这里可能存在的问题。重新对一个属性赋值，会触发对应的 setter，此时 setter 内部会判断，newVal 和 oldVal 是否相等，如果不相等会 observe(newVal)，observe 内部判断 newVal 是对象，就会对新对象进行响应式观察。

再来解释第一个问题，出现这种和文档矛盾的情况，多出现在响应式和非响应式混合使用的情况下，假设两行代码，第一行是正确的响应式数据更改，第二行是非响应式的数据更改（比如对象添加新属性），如果页面要求显示这个属性，此时会发现页面正确更新了，但是单独使用是无法实现视图更新的。这个原因主要是因为响应式数据更改会触发组件的 rerender（setter -> notify -> update -> render），顺带非响应式的也更新了，但本质新添加的属性还是非响应式的，单独修改依旧不会触发页面更新。

### vuex
认识 vuex
* 是什么
  * 状态管理模式，集中式存储应用的所有组件的状态，并以相应的规则保证状态以一种可以预测的方式发生变化
  * 闭环：state -> components -> actions(api) -> mutations -> state
  * 问题：不使用 vuex，我们可以直接修改组件数据，数据的变化会直接映射到DOM上，在 vuex 中，不能直接修改组件数据，必须通过 dispatch action 或 commit mutations 来修改组局，反而变得繁琐了
* 解决什么问题
  * 多个组件之间状态共享
  * 路由跳转复杂数据传递
  * 显示代码与数据代码分层
* 和单纯的全局对象有以下两点不同：
  * Vuex 的状态存储是响应式的，当我们变更状态时，监视状态的 Vue 组件也会自动更新。
  * 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation

有两种使用方式
* 使用了 vuex 后，vue 组件实例拥有属性 `$store`，下面有 `getters/commit/dispatch/state` 属性来操作 store 中的数据
* 通过 vuex 提供的辅助函数，mapGetters/mapMutations/mapActions

modules 模块化：考虑到项目的逐步增大，会对 state、mutations、actions、getters 进行模块化拆分，这里列出几个注意事项，具体的查阅文档进行操作
* 会有内部模块状态和全局模块状态的区别，因此对于 mutations、actions、getters 的入参会有所变化
* 可通过 namespaced 设置命名空间，同时可以通过 createNamespacedHelpers 解决书写麻烦的问题
* 动态注册模块 registerModule 函数，主要是为了可扩展

keep-alive
* `<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
* 当组件在 `<keep-alive>` 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。
* keep-alive 的缓存也是基于 VNode 节点的而不是直接存储 DOM 结构。

### vue-router
为什么需要子路由（children），难道仅仅只是为了少写几个 path 属性字符，其实非也，这里涉及到组件是否缓存的问题。

父子路由的存在是为了解决实际问题的。出于性能考虑，组件通常会使用 `<keep-alive>` 缓存，一个典型的场景就是列表和列表项详情，具体交互通常是这样的，点击列表中某一项，跳转到一个新的路由组件，接着我们可能回到列表，点击另一个列表项查看新的详情，针对这种回退的场景，列表详情页是不需要缓存的，因为如果缓存，created 事件不会触发，浏览位置会被保存，这本身就是不合适的。

如果不区分父子组件，就会在同一个 `<router-view>` 中渲染，这时候我们就只能选择全部缓存或全部缓存，但区分父子组件的话，我们可以使用一个新的 `<router-view>` 容器来渲染子组件。

路由动态加载的几种方式
* 动态 import
* 动态 require

更多功能
* 命名视图（components 属性存在的意义，视图和组件的对应关系）
* $route 解耦：props 实现路由参数与组件的解耦
* 路由守卫：beforeEnter
* 路由元信息：meta 字段，可以做路由级别权控等

## webpack

## 深浅拷贝
为什么原生不提供深拷贝方法呢？

浅拷贝：slice、concat 返回一个新数组的特性来实现拷贝，object.assign/ES6 ...扩展符也可以实现浅拷贝

通用深拷贝函数
```js
var deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
```

很明显，如果深拷贝只是上面简单的代码的话，那为什么 JS 不从标准层面上提供一个原生的深拷贝函数呢？主要是因为 JS 无法选择一个默认的拷贝算法
* 循环引用如何处理？是否应该检测循环引用并终止循环（不复制深层元素）？还是应当直接报错或者是选择其他方法呢？
* 如何复制一个函数呢？
* 如何复制 Date、RegExp、Node 节点等是否需要考虑进去呢？

利用 Map 轻松检查是否存在环
```js
var a = { age: 20}
var b = { name: 'sky', a: a}
a.b = b
function getCheckFunc(target) {
    var map = new Map()
    function checkCircle() {
        var keys = Object.keys(target)
        for(var i = 0; i < keys.length; i++) {
            var value = target[keys[i]]
            if(typeof value === 'object') {
                if(map.get(value)) {
                    return true
                } else {
                    map.set(value, 1)
                }
                return checkCircle(value)
            }
        }
        return false
    }
    return checkCircle
}
```

一直都没有思考过 Object 和 Map 的区别，因为 Object 也是键值对存储，但 ES6 既然新增了 Map、Set、Symbol 肯定是有意义的对吧，这里看看区别
* 一个 Object 的键只能是字符串或者 Symbols，但一个 Map 的键可以是任意值，包括函数、对象、基本类型。
* Map 中的键值是有序的，而添加到对象中的键则不是。因此，当对它进行遍历时，Map 对象是按插入的顺序返回键值。
* 你可以通过 size 属性直接获取一个 Map 的键值对个数，而 Object 的键值对个数只能手动计算。
* Map 可直接进行迭代，而 Object 的迭代需要先获取它的键数组，然后再进行迭代。

## 题目
求一个字符串的字节长度，假设：一个英文字符占用一个字节，一个中文字符占用两个字节。
```js
function getBytes(str) {
    var len = str.length
    var bytes = len;
    for(var i = 0; i < len; i++){
        if (str.charCodeAt(i) > 255) bytes++;
    }
    return bytes;
}
```

类型转换：这种东西真是快不知道怎么解释了
```js
[]+[] // ""

[]+{} // [object Object]

{}+[] // 0

{}+{} // [object Object]
```

## 杂项
性能优化的考虑方向：文件大小、文件数量、缓存、DNS 预解析、CDN、按需加载

setTimeout 和 requestAnimationFrame 区别
* setTimeout 由于不准确会存在掉帧情况
* requestAnimationFrame 是由帧刷新驱动的

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
* let 声明变量会形成暂时性死区：从变量声明所在的作用域顶端到变量声明这块区域就是暂时性死区。在这个区域内，该变量不能被使用，总结来说，let 声明变量，必须先声明再使用。

函数声明提升比同名变量声明提升优先级要高
```js
function valueof(){
    return 1;
}
var valueof;
alert(typeof valueof); // function
```

现在的单页应用多数使用片段标识符来坐路由，那你知道为啥有时候会将 `#` 换成 `#!` 吗？

因为网络蜘蛛默认会忽略 # 后面的内容，这对于搜索引擎还是开发者都是不利的，解决方案 hash bang，将 # 改成 #!，实现大致为：当网络蜘蛛遇到 #! 时候，会自动将 #!identifier 转成 _escaped_fragment_=identifier 形式的参数。
* 将 # 改成 #! 告诉网络蜘蛛：我们支持这个解决方案：hash bang
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

老版本 IE 浏览器支持新标签
* IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签
* 可以利用这一特性让这些浏览器支持 HTML5 新标签
* 浏览器支持新标签后，还需要添加标签默认的样式
* 当然也可以直接使用成熟的框架、比如 html5shiv

## 实现单向链表、双向链表、循环链表

## 排序算法
Array.sort 原理：ECMAScript 只规定了效果，没有规定实现的方式，所以不同浏览器实现的方式还不一样。
* 以 v8 为例，v8 在处理 sort 方法时，当目标数组长度小于 10 时，使用插入排序；反之使用快速排序和插入排序的混合排序。因此v8引擎的 sort 排序是插入排序和快速排序的结合。
* 为什么 v8 要如此选择呢，主要是因为当数组是快要排序好的状态或者问题规模比较小的时候，插入排序效率更高。这也是为什么 v8 会在数组长度小于等于 10 的时候采用插入排序。

Array.sort 基本使用
* arrayObject.sort(sortby)；参数 sortby 可选，用于规定排序规则，必须是函数。
* 如果调用该方法时没有使用参数，将按字母顺序对数组中的元素进行排序(按照字符串 Unicode 码点)

如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：
* 如果返回值小于 0，则 a 在 b 前面
* 如果返回值等于 0，则 a 和 b 的相对位置不变
* 如果返回值大于 0，则 b 在 a 前面

要比较数字而非字符串，比较函数可以简单的以 a 减 b
```js
function compareNumbers(a, b) {
  return a - b;
}
```

如果比较的是字符串，则不能以减法简写了
```js
function compareStrings(a, b) {
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}
```

### 快速排序
排序思想
* 先从数列中取出一个数作为“基准”。
* 分区过程：将比这个“基准”大的数全放到“基准”的右边，小于或等于“基准”的数全放到“基准”的左边。
* 再对左右区间重复第二步，直到各区间只有一个数。

排序代码
```js
function quickSort(arr) {
    if(arr.length <= 1) {
        return arr
    }
    var pivotIndex = Math.floor(arr.length / 2)
    var pivot = arr.splice(pivotIndex, 1)[0]
    var left = [], right = []
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] < pivot) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    return quickSort(left).concat([pivot], quickSort(right))
}
```

排序复杂度
* 平均复杂度 O(n log n)
* 最好情况 O(n log n)，最坏情况 O(n^2)
* 不稳定算法

> 假定在待排序的记录序列中，存在多个具有相同的关键字的记录，若经过排序，这些记录的相对次序保持不变，则称这种排序算法是稳定的；否则称为不稳定的。

快速排序优化，聪明的你可能看到，每次递归我们都会创建左右两个数组，有没有办法可以不用浪费内存去创建多余的数组呢？
* 默认第一个元素为基准值，用剩余的值和基准值进行比较
* 基准值右边元素构成一个左边数组，用 storeIndex 记录此时左边数组的最后一个元素下标
* 此处应该有一个比较函数，在这里使用升序的方式，因此小于时将目标元素放入左边数组操作就是与左边数组的后一个元素交换
* 将基准值和左边数组最后一个元素交换，实现左右数组结构
* 经过分区之后，便有了左右数组，然后递归调用，出口就是 left>=right 时

优化后代码实现
```js
function quickSort(arr) {
  // 交换元素
  function swap(arr, a, b) {
      var temp = arr[a];
      arr[a] = arr[b];
      arr[b] = temp;
  }

  function partition(arr, left, right) {
      var pivot = arr[left];
      var storeIndex = left;

      for (var i = left + 1; i <= right; i++) {
          if (arr[i] < pivot) {
              swap(arr, ++storeIndex, i);
          }
      }

      swap(arr, left, storeIndex);

      return storeIndex;
  }

  function sort(arr, left, right) {
      if (left < right) {
          var storeIndex = partition(arr, left, right);
          sort(arr, left, storeIndex - 1);
          sort(arr, storeIndex + 1, right);
      }
  }

  sort(arr, 0, arr.length - 1);

  return arr;
}
```

### 选择排序
算法步骤
* 在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
* 从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
* 重复第二步，直到所有元素均排序完毕。

JS 实现
```js
function selectionSort(arr) {
    var minIndex, len = arr.length
    for(var i = 0; i < len - 1; i++) {
        minIndex = i
        for(var j = i + 1; j < len; j++) {
            if(arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        if(i !== minIndex) {
            var temp = arr[i]
            arr[i] = arr[minIndex]
            arr[minIndex] = temp
        }
    }
    return arr
}
```

排序复杂度
* O(n^2)
* 不稳定算法

### 插入排序
插入排序原理在于将第一个元素视为有序序列，遍历数组，将之后的元素依次插入这个构建的有序序列中。

代码实现
```js
function insertSort(arr) {
    for(var i = 1; i < arr.length; i++) {
        var element = arr[i]
        for(var j = i - 1; j >= 0; j--) {
            var temp = arr[j]
            var order = comparefn(temp, element)
            if(order > 0) {
                arr[j + 1] = temp
            } else {
                break;
            }
        }
    }
}

function comparefn(a, b) {
    return a - b;
}
```

插入排序优化：插入排序的原理是从乱数组中选择元素插入已排序数组中，因此针对已排序数组选择插入位置的查找过程可以使用二分法。

二分法元素查找：
```js
function binarySearch(items, value) {
    var startIndex = 0, stopIndex = items.length
    var middle = Math.floor((startIndex + stopValue) / 2)
    while(startIndex > stopIndex && items[middle] != value) {
        if(value < items[middle]) {
            stopIndex = middle -1
        } else {
            startIndex = middle + 1
        }
        middle = Math.floor((startIndex + stopValue) / 2)
    }
    return (items[middle] != value) ? -1 : middle;
}
```

我们的需求需要对二分法进行修改，得到的下标应该是我们元素的插入位置，修改如下：
```js
function binarySearch(arr, target) {
    var left = 0;
    var right = arr.length - 1;
    while (left <= right) {
        var middle = parseInt((left + right) / 2);
        if (target < arr[middle]) {
            // 说明在左半区
            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }
    return left;
}
```

二分法优化后的插入排序
```js
function binaryInsertionSort(arr) {
    // 原数组，从1开始，默认0号位是已排序
    for (var i = 1; i < arr.length; i++) {
        var element = arr[i],
            left = 0,
            right = i - 1;
        // 对于已排序数组，可以使用二分查找
        while (left <= right) {
            var middle = parseInt((left + right) / 2);
            if (element < arr[middle]) {
                // 说明在左半区
                right = middle - 1;
            } else {
                left = middle + 1;
            }
        }
        // 实现插入
        for (var j = i - 1; j >= left; j--) {
            arr[j + 1] = arr[j]
        }
        arr[left] = element;
        return arr;
    }
}
```

排序复杂度
* 平均复杂度 O(n^2)
* 最好情况 O(n) 最坏情况 O(n^2)
* 稳定算法

### 冒泡排序
算法描述
* 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
* 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
* 针对所有的元素重复以上的步骤，除了最后一个；
* 重复步骤 1~3，直到排序完成。

JS 实现
```js
function bubbleSort(arr) {
    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < arr.length - 1 - i; j++) {
            if(arr[j] > arr[j + 1]) {
                var temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr
}
```

性能优化点1：上述方案其实建立在一个假定上，就是每次冒泡后，有且仅有已冒泡次数个元素是排好序的，其实不然，有时候数组可能部分已经排好序，这时候对于已排好序的元素做遍历就是浪费了。我们可以这么做：置一标志性变量 pos，用于记录每趟排序中最后一次进行交换的位置。由于 pos 位置之后的记录均已交换到位，故在进行下一趟排序时只要扫描到 pos 位置即可。
```js
function bubbleSort2(arr) {
    var i = arr.length - 1;
    while (i > 0) {
        var pos = 0;
        for (var j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                pos = j;
            }
        }
        i = pos;
    }
    return arr;
}
```

优化思路二：双向冒泡
```js
function bubbleSort3(arr) {
    var low = 0;
    var high = arr.length - 1;
    var tmp, j;
    while (low < high) {
        //正向冒泡,找到最大者
        for (j = low; j < high; j++) {
            if (arr[j] > arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
        high--;
        //反向冒泡,找到最小者
        for (j = high; j >low; j--) {
            if (arr[j] < arr[j - 1]) {
                var temp = arr[j];
                arr[j] = arr[j - 1];
                arr[j - 1] = temp;
            }
        }
        low++;
    }
    return arr;
}
```

### 希尔排序
希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。但希尔排序是非稳定排序算法。

TODO：https://segmentfault.com/a/1190000009461832