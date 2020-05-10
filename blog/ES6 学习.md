
学习ES6的核心语法。

<!-- more -->

## ES6 是什么
* 2015 年 6 月正式发布
* 使用 babel 语法转换器，支持低端浏览器
* 流行库基本基于 ES6 构建

## ES6 重点内容
* 块级作用域、字符串、函数
  * let、const
  * 字符串模板
  * 参数默认值、箭头函数（简写代码、绑定 this 作用域）、展开运算符（...）
* 对象扩展
  * Object.keys、values、entries
  * 对象方法简写，计算属性
  ```js
  const obj = {name,[name]:'hello',hello(){}}
  ```
  * 展开运算符{...obj1,...obj2}
* 解构赋值
  * 数组解构：let [ary1, ary2] = ary
  * 对象结构：let {name,course} = obj
* 类
  * prototype语法糖
  * extends继承
  * constructor构造函数
* 新数据结果
  * set，元素不可重复
  * map
  * symbol
* 模块化
  * 告别 seajs 和 requirejs
  * import、import {}
  * export、export default
  * Node现在还不支持，需要require加载文件
* ES6其他
  * Promise
  * 迭代器和生成器
  * 代理 Proxy
* 其他
  * 虽然不在 ES6 的范围，但也被 babel 支持，普遍被大家接受和使用，可能需要安装插件
  * 对象扩展符，函数绑定
  * 装饰器
  * async await

## const 和 let
* 被 const 声明的变量不能被重新赋值或重新声明。你必须小心地使用 const。使用 const 声明的变量不能被改变，但是如果这个变量是数组或者对象的话，它里面持有的内容可以被更新。它里面持有的内容不是不可改变的。
* let 语句声明一个块级作用域的本地变量，被关键字 let 声明的变量可以被改变。
* 不同的声明方式应该在什么时候使用呢？有很多的选择。我的建议是在任何你可以使用 const 的时候使用它。这表示尽管对象和数组的内容是可以被修改的，你仍希望保持该数据结构不可变。而如果你想要改变你的变量，就使用 let 去声明它。
* React 和它的生态是拥抱不可变的。这就是为什么 const 应该是你定义一个变量时的默认选择。

### let 深入
* let 声明的变量只在其声明的块或子块中可用，这一点，与 var 相似。二者之间最主要的区别在于 var 声明的变量的作用域是整个封闭函数。
* 简化内部函数代码，当用到内部函数的时候（闭包时），let 会让你的代码更加简洁。
* 在程序或者函数的顶层，let 并不会像 var 一样在全局对象上创造一个属性。
* 在处理构造函数的时候，可以通过 let 绑定来共享一个或多个私有成员，而不使用闭包。
* 在相同的函数或块作用域内重新声明同一个变量会引发 SyntaxError。
* 在 ECMAScript 2015 中，let 绑定不受变量提升的约束，这意味着 let 声明不会被提升到当前执行上下文的顶部。在块中的变量初始化之前，引用它将会导致 ReferenceError。
* 块作用域根据{}区别，switch-case 下如果不使用{}则会引发 SyntaxError，使用{}则不会

### const 深入
* 此声明创建一个常量，其作用域可以是全局或本地声明的块。
* 与 var 变量不同，全局常量不会变为窗口对象的属性。
* 需要一个常数的初始化器，您必须在声明的同一语句中指定它的值。
* const 声明创建一个值的只读引用。但这并不意味着它所持有的值是不可变的，只是变量标识符不能重新分配。
* 一个常量不能和它所在作用域内的其他变量或函数拥有相同的名称。

## 箭头函数
箭头函数和普通函数区别与优势
* 更简介，这些函数表达式最适合用于`非方法函数`，并且它们`不能用作构造函数`。
* this 对象的不同行为
  * 普通的函数表达式总会定义它自己的 this 对象。
  * 箭头函数表达式仍然会使用包含它的语境下的 this 对象。
  * 由于 this 已经在词法层面完成了绑定，通过 call() 或 apply() 方法调用一个函数时，只是传入了参数而已，对 this 并没有什么影响
* 箭头函数如果函数只有一个参数，你就可以移除掉参数的括号，但是如果有多个参数，你就必须保留这个括号。
* 在 ES6 的箭头函数中，你可以用简洁函数体来替换块状函数体，且简洁函数体的返回不用显示声明。
  * 加括号的函数体返回`对象字面表达式`，直接返回例如{ foo: 1 }会是 undefined，这是因为花括号({})里面的代码被解析为一系列语句
* 不绑定 arguments
  * 参数只是在封闭范围内引用相同的名称
  * 在大多数情况下，使用剩余参数是使用 arguments 对象的好选择。
* 其他
  * 支持剩余参数和默认参数
  * 同样支持参数列表解构
  * 箭头函数没有 prototype 属性。
  * yield 关键字通常不能在箭头函数中使用，因此，箭头函数不能用作生成器。
  * 箭头函数在参数和箭头之间不能换行。
  * 箭头函数也可以使用闭包

> 箭头函数的本质，就是在外层缓存 this

## 类
ECMAScript 2015 中引入的 JavaScript 类(classes) 实质上是 JavaScript 现有的基于原型的继承的语法糖。JavaScript 类提供了一个更简单和更清晰的语法来创建对象并处理继承。

定义类
* 类语法有两个组成部分：类表达式和类声明。
* 函数声明和类声明之间的一个重要区别是函数声明会声明提升，类声明不会。

类体和方法定义
* 类声明和类表达式的主体都执行在严格模式下，构造函数，静态方法，原型方法，getter 和 setter 都在严格模式下执行。
* 构造函数方法是一个特殊的方法，其用于创建和初始化使用一个类创建的一个对象。一个类只能拥有一个名为 “constructor”的特殊方法。一个构造函数可以使用 super 关键字来调用一个父类的构造函数。
* 原型方法
* 静态方法：static 关键字用来定义一个类的一个静态方法。调用静态方法不需要实例化该类，但不能通过一个类实例调用静态方法。静态方法通常用于为一个应用程序创建工具函数。

继承
* 如果子类中存在构造函数，则需要在使用“this”之前首先调用 super（）。
* 类不能扩展常规（不可构造/非构造的）对象。如果要继承常规对象，可以改用 Object.setPrototypeOf():

JavaScript ES6 引入了类的概念。类通常在面向对象编程语言中被使用。JavaScript 的编程范式在过去和现在都是非常灵活的。你可以根据使用情况一边使用函数式编程一边使用面向对象编程。React 混合使用了两种编程范式中的有益的部分。
* 类都有一个用来实例化自己的构造函数。这个构造函数可以用来传入参数来赋给类的实例。
* 类可以定义函数。因为这个函数被关联给了类，所以它被称为方法。

组件类
* Component 类封装了所有 React 类需要的实现细节。它使得开发者们可以在 React 中使用类来创建组件。
* React Component 类暴露出来的方法都是公共的接口。这些方法中有一个方法必须被重写（render()），其他的则不一定要被重写。

## 对象初始化
ES6 中对象初始化比 ES5 更加简洁
* 当你的对象中的属性名与变量名相同时，可以省略变量名
* 简写方法名，eg：const obj = {func(){}}
* 使用计算属性名，eg：const user = {[key]: 'Robin',};

## 解构
在 JavaScript ES6 中有一种更方便的方法来访问对象和数组的属性，叫做解构。

在 JavaScript ES5 中每次访问对象的属性或是数组的元素都需要额外添加一行代码，但在 JavaScript ES6 中可以在一行中进行。

在例子中，我们可以对 this.state 使用解构，达到代码的简短

```js
const { searchTerm, Users } = this.state;
```

## 扩展操作符
`React拥护不可变数据结构`。因此你不应该改变一个对象，更好的做法是基于现在拥有的资源来创建一个新的对象。这样就没有任何对象被改变了。这样做的好处是数据结构将保持不变，因为你总是返回一个新对象，而之前的对象保持不变。

因此你可以用 JavaScript ES6 中的 Object.assign() 函数来到达这样的目的。它把接收的第一个参数作为目标对象，后面的所有参数作为源对象。然后把所有的源对象合并到目标对象中。只要把目标对象设置成一个空对象，我们就得到了一个新的对象。这种做法是拥抱不变性的，因为没有任何源对象被改变。
```js
const updatedHits = { hits: updatedHits };
const updatedResult = Object.assign({}, this.state.result, updatedHits);
```

> Object.assign 是浅拷贝，属性被后续参数中具有相同属性的其他对象覆盖，继承属性和不可枚举属性是不能拷贝的

上述已经是一个解决方案了。但是在 JavaScript ES6 以及之后的 JavaScript 版本中还有一个更简单的方法。那就是使用扩展符...，当使用它时，数组或对象中的每一个值都会被拷贝到一个新的数组或对象。

使用扩展运算符如下：
```js
const updatedHits = this.state.result.hits.filter(isNotId);
this.setState({
  result: { ...this.state.result, hits: updatedHits }
});
```

## 模块
在 JavaScript ES6 中你可以从模块中导入和导出某些功能。这些功能可以是函数、类、组件、常量等等。基本上你可以将所有东西都赋值到一个变量上。模块可以是单个文件，或者一个带有入口文件的文件夹。

import 和 export 语句可以帮助你在多个不同的文件间共享代码。在此之前，JavaScript 生态中已经有好几种方案了。从 JavaScript ES6 后，现在是一种原生的方式了。

此外这些语言还有利于代码分割。代码风格就是将代码分配到多个文件中去，以保持代码的重用性和可维护性。前者得以成立是因为你可以在不同的文件中导入相同的代码片段。而后者得以成立是因为你维护的代码是唯一的代码源。

最后但也很重要的是，它能帮助你思考代码封装。不是所有的功能都需要从一个文件导出。其中一些功能应该只在定义它的文件中使用。一个文件导出的功能是这个文件公共 API。只有导出的功能才能被其他地方重用。这遵循了封装的最佳实践。

* 命名的导出：你可以导出一个或者多个变量，可以用对象的方式导入另外文件的全部变量`import * as object`。
* 导入可以有一个别名`as`
* default 语句
  * 为了导出和导入单一功能
  * 为了强调一个模块输出 API 中的主要功能
  * 这样可以向后兼容 ES5 只有一个导出物的功能
  * 在导入 default 输出时省略花括号。
  * 只能有一个默认的导出

### import 深入
基础语法
```js
import defaultExport from "module-name";
import * as name from "module-name";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
```

> 同时使用默认语法与命名空间导入或命名导入，在这种情况下，默认导入将必须首先声明

### export 深入
基础语法
```js
export { name1, name2, …, nameN };
export { variable1 as name1, variable2 as name2, …, nameN };
export let name1 = …, name2 = …, …, nameN; // also var, const
export default expression;
export { name1 as default, … };
export * from …; // 不会导出已导入模块中的默认导出
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
```

如果需要导出默认值，请使用下列代码：
```js
import mod from "mod";
export default mod;
```

## 数组迭代
这部分内容并是 ES6 的语法，但是样式合理使用的习惯可以简化我们的代码
* forEach：让数组中的每一项做一件事情
* map：让数组通过某种计算产生一个新的数组
* filter：筛选出数组中符合条件的项，组成新数组
* reduce：让数组的前项和后项做某种计算，并累计最终值
  * 相对比较复杂：正确的语法为 arr.reduce(callback[, initialValue])，callback 可以有四个参数，initialValue 用作第一个调用 callback 的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。
  * accumulator：累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或 initialValue
  * currentValue：数组中正在处理的元素。
  * currentIndex：可选，数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0开始，否则为索引为1开始。
  * array：可选，调用 reduce 的数组
* every：检测数组中每一项是否符合条件，
* some：检测数组中是否有某些符合条件

>  map 和 filter 都是 immutable methods，也就是说它们只会返回一个新数组，而不会改变原来的那个数组

## async+await
async+await优化异步代码发展：
* 回调函数，已出现回调地狱，造成不可读，不可调试
* Promise
* generator
* async + await 是 generator 的优化，ES7 的内容

> await 必须在 async 内部