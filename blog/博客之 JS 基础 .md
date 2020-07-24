# 博客知识点

记录易混淆的点

## 关于原型和原型链

* 原型对象 `Person.prototype` 的用途是为每个实例对象存储共享的方法和属性，它仅仅是一个普通对象，也有 `__proto__` 指向上一级 prototype，所有的实例是共享同一个原型对象，因此有别于实例方法或属性，原型对象仅有一份。结构如下：

```js
Function.prototype = {
    constructor : Function,
    __proto__ : parent prototype,
    some prototype properties: ...
};
```

* 对象在调用一个方法时会首先在自身里寻找是否有该方法，若没有，则去原型链上去寻找，依次层层递进，这里的原型链就是实例对象的 `__proto__` 属性。
* 总结：函数的原型对象 constructor 默认指向函数本身，原型对象除了有原型属性外，为了实现继承，还有一个原型链指针 `__proto__`，该指针指向上一层的原型对象，而上一层的原型对象的结构依然类似，这样利用 `__proto__` 一直指向 Object 的原型对象上，而 Object 的原型对象用 `Object.prototype.__proto__ = null` 表示原型链的最顶端，如此形成了 javascript 的原型链继承，同时也解释了为什么所有的 javascript 对象都具有 Object 的基本方法。理解下面三个表达式：

```js
person.__proto__ === Person.prototype; // true
Person === Person.prototype.constructor; // true
Person.prototype.__proto__ === Object.prototype; // true
```

## 执行上下文和执行上下文栈

* 准备工作：变量提升、函数提升，且同名函数提升 > 变量提升
* 执行上下文栈：底部永远有全局执行上下文(`globalContext`)，当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。
* 执行上下文：变量对象、作用域链、this
* 变量对象：变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。
  * 分析：活动对象 AO 的组成有：`arguments` (初始化阶段)+ 所有形参(分析阶段) + 函数声明(分析阶段) + 变量声明(分析阶段)
  * 执行：在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值
* 作用域链
  * 函数创建：函数有一个内部属性 `[[scope]]`，当函数创建的时候，就会保存所有父变量对象到其中，你可以理解 `[[scope]]` 就是所有父变量对象的层级链
  * 函数激活：当函数激活时，创建函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。`[AO].concat([[Scope]]);`
* this
  * Reference 组成
    * base value：属性所在的对象或者就是 `EnvironmentRecord`，比如单纯的 foo.boo()，则值为 foo，如果只是 foo()，则值为`EnvironmentRecord`
    * referenced name：属性的名称
    * strict reference：严格模式
  * 获取 Reference 方法
    * GetBase：得到 `Reference` 的 `base` 值 - IsPropertyReference：如果 `base value` 是一个 `对象`，就返回 `true`。 - GetValue： 从 Reference 类型获取对应值的方法，调用 `GetValue`，返回的将是具体的值，而不再是一个 `Reference`，这个很重要！ - ImplicitThisValue：该函数始终返回 `undefined`。
  * Reference to this
    * ref = MemberExpression = ()左边的部分
    * 判断 `ref` 是不是一个 `Reference` 类型
      * 属性访问方式(`eg:foo.boo`)，return true
      * 分组操作符(`eg:(express)`)，根据组内表达式决定
      * 赋值，逻辑与，逗号，会调用 GetValue 函数，返回的将是具体的值，不再是 Reference
      * 解析标识符(`eg:foo`)，最简单情况，属于 Reference，base 值为`EnvironmentRecord`
    * Reference 结果
      * true，并且`IsPropertyReference(ref)`是`true`(对象即可), 那么`this`的值为`GetBase(ref)`
      * true，并且`base value`值是`Environment Record`, 那么`this`的值为`ImplicitThisValue(ref) == undefined`
      * false，那么`this`的值为`undefined`，非严格模式下，`this`的值为`undefined`的时候，其值会被隐式转换为全局对象。
* 具体处理过程
  * 创建全局上下文压入全局上下文栈
  * 全局上下文初始化
  * A 函数创建，保存作用域链到内部属性`[[scope]]`
  * A 函数执行，创建函数上下文并压入执行上下文栈
  * 函数上下文初始化
    * 复制函数[[scope]]属性创建作用域链 -- 为什么复制，因为函数会被调用多次
    * 用 `arguments` 创建活动对象，初始化活动对象，即加入形参、函数声明、变量声明
    * `[AO].concat([[Scope]]);`
* 如果函数内部又创建了函数，则重复 3-5 步骤
* 函数执行完毕，函数上下文从执行上下文栈中弹出

## 闭包、共享传递、call、apply、bind、new

* 闭包 = 函数 + 函数能够访问的自由变量
  * 闭包是指那些能够访问自由变量的函数。
  * 自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。
* 共享传递
  * 共享传递是传递对象的引用的副本，在共享传递中对函数形参的赋值操作，不会影响实参的值。
* call、apply
  * call 像点名，one by one，因此参数是多个入参。apply 是直接应用，因此参数是数组
  * 改变 this 的原理：将方法变成传入对象的属性，这样方法的 this 也就被改变了，同时避免污染对象，执行完后调用 delete 删除方法。
  * 参数：arguments 配合 eval
* bind
  * 返回一个函数，bind 传入参数，执行时也可以传入参数
  * 细节：bind 返回的函数作为构造函数使用时，绑定 this 会失效，但参数依旧有效
  * 内部调用 call、apply
* new
  * 新建一个对象
  * 将对象的原型指向 Constructor.prototype，`obj.__proto__ = Constructor.prototype;`
  * 执行构造函数 Constructor.apply(obj)
  * 返回这个对象

## 类数组、对象创建与继承

* 类数组对象
  * 拥有一个 length 属性和若干索引属性的对象
  * 读写，长度，遍历都和数组一样，不同的是数组的 API 不能直接使用，使用 call&apply 数组原型方法
* Arguments
  * 参数不定长
  * 函数柯里化
  * 递归调用
  * 函数重载
* 对象创建和继承
  * 创建组合模式
  * 组合继承
  * 理解原型链与原型式(空对象做中转)

## IIFE

* 构造私有变量
* 避免全局空间污染，
* 隔离作用域目的。

## 切面编程

* 类似于 call、apply 和 bind 等，直接在 Function 的原型上增加方法
* 直接新增 before 和 after 方法，执行原方法且执行传入的方法

## 函数节流和函数防抖

* 化高频率执行 js 代码的一种手段
* 函数防抖：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，就是要等你触发完事件 n 秒内不再触发事件，我才执行。
* 函数节流：如果你持续触发事件，每隔一段时间，只执行一次事件。
  * 使用时间戳
  * 设置定时器
