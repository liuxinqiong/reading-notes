## DOM API
DOM API 是最早被设计出来的一批 API，也是用途最广的 API，所以早年的技术社区，常常用 DOM 来泛指浏览器中所有的 API。不过今天学习的 DOM，指的是侠义的文档对象模型。

DOM API 大致会包含 4 个部分
* 节点：DOM 树形结构中的节点相关 API
* 事件：触发和监听事件相关 API
* Range：操作文字范围相关 API
* 遍历：遍历 DOM 需要的 API

### 节点
节点类型
* Element 元素型节点，跟标签对应
  * HTMLElement
  * SVGElement
* Document：文档根节点
* CharacterData 字符数据
  * Text：文本节点
  * Comment：注释
  * ProcessingInstruction：处理信息
* DocumentFragment：文档片段
* DocumentType：文档类型

需要重点掌握的是：Document、Element、Text 节点，DocumentFragment 也非常有用，常常被用来高性能地批量添加节点。因为 Comment、DocumentType 和 ProcessingInstruction 很少需要运行时去修改和操作，因此有所了解即可。

### Node
Node 是 DOM 树继承关系的根节点，定义了 DOM 节点在 DOM 树上的操作，首先提供了一组属性，来表示它在 DOM 树中的关系
* parentNode
* childNodes
* firstChild
* lastChild
* nextSibling
* previousSibling

Node 中也提供了操作 DOM 树的 API，主要是下面几种
* appendChild
* insertBefore
* removeChild
* replaceChild

这几个 API 饱受诟病，主要的批评是它不对称，只有 before，没有 after。实际上 appendChild 和 insertBefore 的这个设计，是一个最小原则设计，这两个 API 满足插入任意位置的必要 API，而 insertAfter 则可以由这两个 API 实现而来。

所有的这几个修改型 API，全都是在父元素上操作的，这样的设计是符合面向对象的基本原则的。拥有哪些子元素是父元素的一种状态，所以修改状态，应该是父元素的行为。

除此之外，Node 还提供了一些高级 API
* compareDocumentPosition：比较两个节点中关系的函数
* contains：一个节点是否包含另一个节点
* isEqualNode：检查两个节点是否完全相同
* isSameNode：两个节点是否是同一个，实际上在 JS 中可以用 ===
* cloneNode：复制一个节点，如果传入参数 true，则会连同子元素做深拷贝

DOM 标准规定了节点必须从文档的 create 方法创建出来，不能够使用原生的 JS 的 new 运算，因此 document 对象有这些方法
* createElement
* createTextNode
* createCDATASection
* createComment
* createProcessingInstruction
* createDocumentFragment
* createDocumentType

### Element 和 Attribute
Node 提供了树形结构上节点相关的操作，而大部分时候，比较关注的是元素。Element 表示元素，它是 Node 的子类。元素对应了 HTML 中的标签，它既有子节点，又有属性。所以 Element 子类中，有一系列操作属性的方法。

把元素的 Attribute 当做字符串来看待，有下列 API
* getAttribute
* setAttribute
* removeAttribute
* hasAttribute

如果追求**极致性能**，可以把 Attribute 当做节点
* getAttributeNode
* setAttributeNode

此外如果你喜欢属性访问的方式，你还可以直接使用 attributes 对象

### 查找元素
document 节点提供了查找元素的能力，比如
* querySelector
* querySelectorAll
* getElementById
* getElementByName
* getElementByTagName
* getElementByClassName

> getElement 系列 API 性能高于 querySelector，而且获取的集合并非数组，而是一个能够动态更新的集合。

遍历元素：通过 Node 相关属性，可以用 JS 遍历整个树，实际上 DOM API 中还提供了 nodeIterator 和 TreeWalker 来遍历树，但由于这两个 API 设计非常老派，因此了解即可，需要遍历 DOM 的时候，直接使用递归和 Node 的属性。

### Range
Range API 是一个比较专业的领域，主要用来富文本编辑类的业务。

Range API 表示一个 HTML 上的范围，以文字为最小单位。通过 Range API 可以比节点 API 更精确的操作 DOM 树，凡是节点 API 能做到的，Range API 都可以做到，而且可以做到更好性能，但是 Range API 使用起来比较麻烦，所以在实际项目中并不常用，只有做底层框架开发和富文本编辑对它有强需求。

### 命名空间
在 HTML 场景中，需要考虑命名空间的场景不多，最主要的场景是 SVG，创建元素和属性的 API 都有带命名空间的版本，在标准上加上 `NS` 即可，比如 createElementNS

## HTML 链接
除了肉眼可见的这些链接，其实 HTML 里面还规定了一些不可见链接的类型。

链接是 HTML 中一种机制，它是 HTML 文档和其他文档或者资源的连接关系，在 HTML 中，链接有两种类型。一种是超链接标签，一种是外部资源链接。

链接家族中有 a 标签、area 标签和 link 标签。

### link 标签
link 标签也是元信息的一种，很多时候它也是不会对浏览器产生任何效果的，link 标签会生成一个链接，它可能生成超链接，也可能生成外部资源链接。

一些 link 标签会生成超链接，这些超链接又不会像 a 标签那样显示在网页中。这就是超链接型的 link 标签。这意味着多数浏览器中，这些 link 标签不产生任何作用。但是这些 link 标签能够被搜索引擎和一些浏览器插件识别，从而产生关键性作用。

另外一些 link 标签则会把外部的资源链接到文档中，也就是说，会实际下载这些资源，并且做出一些处理，比如我们常见的用 link 标签引入样式表。

除了元信息的用法之外，多数外部资源型的 link 标签还能够被放在 body 中使用，从而起到把外部资源链接进文档的作用。

link 标签的链接类型主要通过 rel 属性来区分

超链接类 link 标签是一种被动型链接，在用户不操作的情况下，它们不会被主动下载。产生超链接的 link 标签包括如下就几种等等
* rel="canonical"：这个标签提示页面它的主 URL，在网站常常有多个 URL 指向同一页面的情况，搜索引擎访问这类页面时会去掉重复的页面，这个 link 会提示搜索引擎保留哪一个 URL
* rel="alternate"：提示页面它的变形形式，这个变形可能是当前页面内容的不同格式、不同语言或者为不同设备设计的版本，通常也是提供给搜索引擎来使用的。一个典型的应用场景是，页面提供 rss 订阅时，可以用这样的 link 来引入
```html
<link rel="alternate" type="application/rss+xml" title="RSS" href="">
```
* rel="prev" 和 rel="next"：告诉搜索引擎或者浏览器它的前一项和后一项，有助于页面的批量展示，因为 next 型 link 告诉浏览器这是很可能访问的下一个页面，HTML 标准还建议对 next 型 link 做预处理

其他超链接类 link，表示一个跟当前文档相关联的信息，可以把这样的 link 标签视为一种带链接功能的 meta 标签
* rel="author"：链接到本页面的作者，一般是 mailto: 协议
* rel="help"：链接到本页面的帮助页
* rel="license"：链接到本页面的版权信息页
* rel="search"：链接到本页面的搜索页面（一般是站内提供搜索时使用）

外部资源类 link 标签会被主动下载，并且根据 rel 类型做不同的处理
* 具有 icon 型的 link：多数浏览器会读取 icon 型 link，并把页面的 icon 展示出来。如果没有指定这样的 link，对数浏览器会使用域名根目录下的 favicon.ico，即使它并不存在，所以从性能的角度考虑，建议一定要保证页面中有 icon 型的 link。同时只有 icon 型 link 有有效的 sizes 属性，HTML 标准允许一个页面出现多个 icon 型 link，并且用 sizes 指定它适合的 icon 尺寸
* 预处理类 link：导航到一个网站需要经过 dns 查询域名、建立连接、传输数据、加载进内存和渲染等一系列的步骤。预处理类 link 标签就是允许我们控制浏览器，提前针对一些资源去做这些操作，以提高性能
  * dns-prefetch：提前对一个域名做 dns 查询
  * preconnect：提前对一个服务器建立 tcp 连接
  * prefetch：提前取 href 指定的 url 的内容
  * preload：提前加载 href 指定的 url
  * prerender：提前渲染 href 指定的 url
* modulepreload 型 link：预先加载一个 JS 模块，可以保证 JS 模块不必等到执行时才加载
* stylesheet：从一个 CSS 文件创建一个样式表，这里的 type 属性可以没有，如果有，必须是`text/css`才会生效
* pingback：遵守 pingback 协议的网站在引用本页面时，会向这个 pingback url 发送一个消息

### a 标签
a 标签其实同时充当了链接和目标点的角色，当 a 标签有 href 属性时，它是链接，当它有 name 时，它是链接的目标。

具有 href 属性的 a 标签跟一些 link 一样，会产生超链接，也就是在用户不操作的情况下，它们不会被主动下载的被动型链接。

a 标签也可以有 rel 属性，首先和 link 相同的一些 rel，包括下面几种
* alternate
* author
* help
* license
* next
* prev
* search

这些和 link 语言完全一致，不同的是，a 标签产生的链接是会实际现在在网页中的，而 link 标签仅仅是元信息。除了这些之外，a 标签独有的 rel 类型
* tag 表示本网页所属的标签
* bookmark 到上级章节的链接

a 标签还有一些辅助的 rel 类型，用于提示浏览器或者搜索引擎做一些处理
* nofollow：此链接不会被搜索引擎索引
* noopener：此链接打开的网页无法使用 opener 来获得当前页面的窗口
* opener：打开的网页可以使用 window.opener 来访问当前页面的 window 对象，这是 a 标签的默认行为

a 标签基本解决了在页面中插入文字型和整张图片超链接的需要，但是如果我们想要在图片的某个区域产生超链接，那么就要用到另一种标签了 -- area 标签

### area 标签
area 标签和 a 标签非常相似，不同的是，它不是文本型超链接，而是区域型的链接。

area 标签支持的 rel 与 a 完全一样。

area 是整个 html 规则中唯一支持非矩形热区的标签，它的 shape 属性支持三种类型
* 圆形：circle 或者 circ， coords 支持三个值，分别表示中心点的 x,y 坐标和圆形半径 r
* 矩形：rect 或者 rectangle，coords 支持两个值，分别表示两个对角顶点 x1，y1 和 x2，y2
* 多边形：poly 或者 polygon，coords 至少包括 6 个值，表示多边形的各个顶点

area 必须跟 img 和 map 标签配合使用。

### 总结
link 标签一般用于看不见的链接，它可能产生超链接或者外部资源链接，a 和 area 一般用于页面上显示的链接，它们只能产生超链接。

## CSS 排版
现在 CSS 提供了很多种排版方式，我们有很多选项可以选择自己适合的哪一种，然而，正常流却是我们绕不开的一种排版。

正常流本身是简单和符合直觉的东西，之所以会觉得它奇怪，是因为如果我们从严苛的 CSS 标准角度去理解正常流，规定排版的算法，就需要引入上述那些复杂的概念。但是，如果我们单纯的从感性的认知的层面去理解正常流，它其实是简单的。

用一句话来描述正常流的排版行为，那就是：依次排列，排不下了换行。剩下的功能只需要在它的基础上延伸一下就好了
* float 规则：使得一些盒占据了正常流需要的空间
* vertical-align 规则：规定了如何在垂直方向对齐盒
* margin 折叠：可以把 margin 理解为一个元素规定了自身周围至少需要的空间，这样就好理解为什么 margin 需要折叠了

> vertical-align 相关规则看起来复杂，但是实际上，基线、文字顶/底、行顶/底都是我们正常书写文字时需要用到的概念。

在 CSS 标准中，规定了如何排布每一个文字或者盒的算法，这个算法依赖一个排版的当前状态，CSS 把这个当前状态称为"格式化上下文"

排版过程：格式化上下文 + 盒子/文字 = 位置

需要排版的盒，分为块级盒和行内级盒的，所以排版需要分别为它们规定了块级格式化上下文和行内级格式化上下文

当我们把正常流中的一个盒或者文字排版，需要分成三种情况处理
* 当需要块级盒：插入块级格式化上下文
* 当遇到行内级盒或者文字：首先尝试插入一个行内级格式化上下文，如果排不下，那么创建一个行盒，先将行盒排版（行盒是块级，所以是第一种情况），行盒会创建一个行内级格式化上下文
* 遇到 float 盒：把盒的顶部和当前行内级上下文边缘对齐，然后根据 float 的方向把盒的对应边缘到块级格式化上下文的边缘，之后重排当前行盒。

以上讲的都是一个块级格式化上下文中的排版规则，实际上页面中的布局没有那么简单，一些元素会在其内部创建新的块级格式化上下文
* 浮动元素
* 绝对定位元素
* 非块级但仍能包含块级元素的容器（inline-blocks，table-cells，table-captions）
* 块级的能包含块级元素的容器，且属性 overflow 不为 visible

总得来说：正常流布局主要是使用 inline-block 来作为内容的容器，利用块级格式化上下文的纵向排布和行内级格式化上下文的横向排布来完成布局的，我们需要根据需求的横向和纵向排布要求，来选择元素的 display 属性。

## CSSOM
CSSOM 是 CSS 的对象模型，在 W3C 标准中，它包含两个部分：描述样式表和规则等 CSS 的模型部分（CSSOM）和跟元素视图相关的 View 部分（CSSOM View）。在实际使用中 CSSOM View 比 CSSOM 更常用一些，因为我们很少需要用代码去动态地管理样式表。

### CSSOM

我们通常创建样式表也都是使用 HTML 标签来做到的，用 style 标签和 link 标签创建样式表。

CSSOM API 的基本用法

获取文档中所有的样式表：document.styleSheets，是一个只读列表

我们虽然无法用 CSSOM API 来创建样式表，但是可以修改样式表中的内容
```js
document.styleSheets[0].insertRule("p { color: pink; }", 0)
document.styleSheets[0].removeRule(0)
```

更进一步，我们可以获取样式表中特定的规则，并且对它进行一定的操作，使用 cssRules 属性
```js
document.styleSheets[0].cssRules
```

不过这里的 Rules 可就没那么简单了，它可能是 CSS 的 at-rule，也可能是普通的样式规则，不同的 rule 类型，具有不同的属性。多数 at-rule 均对应着一个 rule 类型
* CSSStyleRule
* CSSCharsetRule
* CSSImportRule
* CSSMediaRule
* CSSFontFaceRule
* CSSPageRule
* CSSNamespaceRule
* CSSKeyframesRule
* CSSKeyframeRule
* CSSSupportsRule

具体规则支持的属性，建议你可以用的时候，再去查阅 MDN，这里介绍下最常用的 CSSStyleRule。

CSSStyleRule 有两个属性：selectorText 和 style，分别表示一个规则的选择器部分和样式部分。

此外 CSSOM 还提供了一个非常重要的方法，来获取一个元素最终经过 CSS 计算得到的属性，第一个参数就是要获取属性的元素，第二个参数可以可选的，用于选择伪元素
```js
window.getComputedStyle(elt, pseudoElt)
```

### CSSOM View
CSSOM View 这一部分的 API，可以视为 DOM API 的扩展，在原本的 Element 接口上，添加了显示相关的功能，这些功能又可以分成三个部分：窗口部分，滚动部分和布局部分

#### 窗口 API
窗口 API：用于操作浏览器窗口的位置、尺寸
* moveTo(x, y)：窗口移动屏幕到特定坐标
* moveBy(x, y)：窗口移动特定距离
* resizeTo(x, y)：改变窗口到特定尺寸
* resizeBy(x, y)：改变窗口大小特定尺寸
* open() 的第三个参数：指定大小、位置

> 一些浏览器处于安全考虑没有实现，也不适用于移动端浏览器，这部分了解即可。

#### 滚动 API
滚动 API：首先要家里一个概念，在 PC 时代，浏览器可视区域的滚动和内部元素的滚动关系是比较模糊的，但是移动端越来越重要的今天，两个必须分开看待，性能和行为都有区别

视口滚动 API，由 window 对象上的一组 API 控制
* scrollX：表示 X 方向上当前滚动距离，有别名 pageXOffset
* scrollY：表示 Y 方向上当前滚动距离，有别名 pageYOffset
* scroll(x, y)：使得页面滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}
* scrollBy(x, y)：使得页面滚动特定的距离，支持传入配置型参数 {top, left}

通过这些属性和方法，我们可以读取视口的滚动位置和操纵视口滚动，不过，要想监听视口滚动事件，我们需要在 document 对象上绑定监听函数
```js
document.addEventListener('scroll', function(e) {})
```

视口滚动 API 是页面的顶层容器的滚动，大部分移动端浏览器都会采用一些性能优化，它和元素滚动不完全一样，请大家一定要建立这个区分的意识

元素滚动 API，在 Element 类为了支持滚动，加入了以下 API
* scrollTop：表示 X 方向上的当前滚动距离
* scrollLeft：表示 Y 方向上的当前滚动距离
* scrollWidth：表示元素内部的滚动内容的宽度，一般来说会大于等于元素宽度(scrollLeft + width)
* scrollHeight：表示元素内部的滚动内容的高度，一般来说会大于等于元素高度(scrollTop + height）
* scroll(x, y)：使得元素滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}
* scrollBy(x, y)：使得元素滚动到特定的位置，支持传入配置型参数 {top, left}
* scrollIntoView(arg)：滚动元素所在的父元素，使得元素滚动到可见区域，可以通过 arg 来指定滚动到中间、开始或者就近

除此之外，**可滚动元素也支持 scroll 事件，但是并不冒泡**，这点需要特别注意
```js
element.addEventListener('scroll', function(e) {})
```

#### 布局 API
整个 CSSOM 中最常用到的部分，同样要分成全局 API 和 元素上 API

全局尺寸信息：window 对象提供了一些全局尺寸信息
* innerHeight/Width：表示视口大小
* outerHeight/Width：浏览器窗口占据的大小，很多浏览器没有实现，一般来说无关紧要
* devicePixelRatio：这个是属性非常重要，表示物理像素和 CSS 像素单位的倍率关系，比如 Retina 这个值是 2，后来也出些一些 3 倍的 android 屏
* screen.
  * width/height 设备的屏幕尺寸
  * availWidth/availHeight 设备屏幕的可渲染区域，一些 android 机器会把屏幕的一部分预留做固定按钮，所以有着两个属性，实际上一般浏览器不会实现的这么细致
  * colorDepth/pixelDepth 固定值 24，应该是为了以后预留

虽然 window 有这么多相关信息，主要使用的是 innerHeight, innerWidth 和 devicePixelRatio 三个属性，其他了解即可。

元素的布局信息
* getClientRects：返回一个列表，里面包含元素对应的每一个盒所占据的客户端矩形区域，可以用 x、y、width、height、top、left、right、bottom 来获取它的位置和大小
* getBoundingClientRect：这个 API 更接近我们脑海中的元素盒的概念，返回元素对应的所有盒的包裹的矩形区域，需要注意，这个 API 获取的元素会包括当 overflow 为 visible 时的子元素区域

这两个 api 获取的矩形区域都是相对于视口的坐标，这意味着，这些区域都是受滚动影响的，如果我们需要获取相对坐标，或者包含滚动区域的坐标，需要一点小技巧
```js
var offsetX = document.documentElement.getBoundingClientRect().x - element.getBoundingClientRect().x
```