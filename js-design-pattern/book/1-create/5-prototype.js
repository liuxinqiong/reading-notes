/**
 * 原型模式：用原型实例指向创建对象的类，使用于创建新的对象的类用来共享原型对象的属性及方法
 * 总结：其实就是基于原型的继承的实现
 */

// 思想：抽象出一个基类，对于差异化的需求通过重写这些继承下来的属性或者方法来解决

// 最优解决方案：其实就是最优继承方案，在code-labroom中有详细学习，就不赘述了

// 重要特点：原型对象是一个共享的对象，不论父类的实例对象还是子类的继承，都是对他的一个引用。因此对于原型对象的扩展，因此对原型对象的扩展，不论是子类或者父类的实例对象都会保存继承下来
// 这带来了很大的灵活性，举个例子

function Animal(age) {
    this.age = age
}

Animal.prototype.sayAge = function() {
    return this.age
}

function Person(age, language) {
    Animal.call(this, age)
    this.language = language
}

Person.prototype = new Animal()

var p = new Person()

// 日后对原型对象的扩展，p对象就能访问到
// 总结：任何时候都可以对基类和子类进行方法的扩展，而所有被实例化的对象或者类都能获取这些方法，这样给予我们对功能扩展的自由性
// 上述实现的缺点，知道继承原理的都知道，构造函数执行两次，带来了空间和时间上的浪费

function prototypeExtend() {
    var F = function() {},
        args = arguments,
    for(var i=0; i< args.length; i++) {
        for(var j in args[i]) {
            F.prototype[j] = args[i][j]
        }
    }
    return new F()
}

// 原型对象更适合在创建复杂对象时，对于那些需求一直在变化而导致对象结构不断改变时，将哪些比较稳定的属性与方法共用而提取的继承的实现