## JS 文法
文法是编译原理中对语言的写法的一种规定，一般来说，文法分成词法和语法两种。

词法规定了语言的最小语义单元：token，可以翻译成"标记"或者"词"。

从字符到词的整个过程是没有结构的，只要符合词的规则，就构成词，一般来说，词法设计不会包含冲突。词法分析技术上可以使用`状态机`或者`正则表达式`来进行。

JS 源代码中的输入分类
* WhiteSpace 空白字符
* LineTerminator 换行符
* Comment 注释
* Token 词
  * IdentifierName 标识符名称：变量名 + 关键字
  * Punctuator 符号：运算符和大括号等符号
  * NumericLiteral：数组直接量
  * StringLiteral：字符串直接量，就是单引号或者双引号引起来的直接量
  * Template：字符串模板，反引号括起来的直接量

为什么 12.toString() 报错呢？因为数字直接量小数点前后部分都可以忽略，但是不能同时忽略，这时候 `12.` 会被当做省略了小数点后面部分的数字而看成一个整体，所以要想让点单独称为一个 token，就要加入空格，`12. toString()` 就是正确的

## 理解编译原理
几个步骤
* 产生式：本例子为定义四则运算：产出四则运算的词法定义和语法分析
* 词法分析：把输入的字符流变成 token
* 语法分析：把 token 变成抽象语法数 AST
* 解释执行：后续遍历 AST，执行得出结果

词法定义
* token：0-9，+、-、*、/
* whitespace（空白）
* LineTerminator（换行符）

语法定义 BNF（这是个啥，待加强）

### 词法分析
词法分析部分，把字符流变成 token 流，词法分析有两种方案，一种是**状态机**，一种是正则表达式，它们是等效的，选择你喜欢的就好。

这部分还算简单咯

### 语法分析：LL
LL 语法：这又是个啥，待加强。

关键是这一块，不知道作者的思路是怎么来的，需要点时间来悟。

### 解释执行
得到 AST 后，对树做遍历操作即可。

## 分号问题
在 JS 中之所以可以省略分号，是因为语言提供了相对可用的分号自动补全规则。

自动插入分号规则
* 要有换行符，且下一个符号是不符合语法的，那么就尝试插入一个分号
* 要有换行符，且语法中规定此处不能有换行符，那么就自动插入分号
* 源代码结束处们，不能行成完整的脚本或者模块结构，那么就自动插入分号

我们可以看一个比较有实际价值的例子
```js
(function(a) {
    console.log(a)
})()
(function(b) {
    console.log(b)
})()
```

我们看第三行结束的位置， JS 引擎会认为函数返回的可能是个函数，那么，在后面在跟括号行程函数调用就是合理的，因此这里不会自动插入分号。

再来看一个例子
```js
function f() {
    return /*
        this is a return value
    */1;
}
```

根据 JS 自动插入分号规则，带换行符的注释也被认为是有换行符的。所以这里会自动插入分号，f 执行的返回值是 undefined。

### no LineTerminator hear 规则
no LineTerminator hear 规则表示它所在的结构中这一位置不能插入换行符。

自动插入分号规则的第二条：要有换行符，且语法中规定此处不能有换行符，那么就自动插入分号。和 no LineTerminator hear 规则强相关，那么 JS 语法中定义了哪些规则呢
* 带标签的 continue 语句，不能在 continue 后插入换行
* 带标签的 break 语句，不能在 break 后插入换行
* return 后不能插入换行
* 后自增、后自减运算符前不能插入换行
* throw 和 Exception 之间不能插入换行
* 凡是 async 关键字，后面都不能插入换行
* 箭头函数的箭头前，也不能插入换行
* yield 之后，不能插入换行

### 注意情况
no LineTerminator hear 规则的存在，多数情况是为了保证自动插入分号行为是符合预期的，但在设计之处，遗漏了一些重要情况，所以有一些不符合预期的情况出现，需要我们格外注意。
* 以括号开头的语句（IIFE）
* 以数组开头的语句（被理解为下标运算符）
* 以正则表达式开头的语句（被理解成除号）
* 以模板字符串开头的语句

### 插话
我们不需要也不可能记住整个架构的知识，但我们却建议在需要的时候想起来这块知识的位置，是干啥呢的，能帮我们解决什么样的问题，可以通过什么关键字检索到，这就够了

对于框架的使用没必要花太多时间，应该多研究一下三大框架背后的设计思想

前端架构主要解决的是**高复用性**，架构能力提升方向主要是**组件库开发、前端架构实现**等

推荐 TensorFlow、可视化切图、PWA、WebGL
* TensorFlow 可以了解使用并做点东西
* PWA 有望进一步发展
* WebGL 在未来会是一个很好的方向

关于 SSR、TypeScript、函数式编程
* SSR 主要用于 SEO，但能够使用的场景不多，而且成本代价太大
* TypeScript 是好东西，但适用于十万行以上代码级别的大项目，小项目反而徒增复杂