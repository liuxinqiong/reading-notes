/**
 * 链模式：通过在对象方法中将当前对象返回，实现对同一个对象多个方法的链式调用，从而简化对该对象得的多个方法的多次调用时，对该对象的多次引用
 */

// 简单而言，这么实现就可以了
var A = function() {}
A.prototype = {
    a: function(){
        console.log('a')
        return this
    },
    b: function(){
        console.log('b')
        return this
    }
}

new A().a().b()

// 但是如果你观察过jQuery的使用，可以直接使用$()然后链式调用，并没有使用new啊，那么jQuery是如何实现的呢
var A = function() {
    return A.prototype
}
A.prototype = {
    a: function(){
        console.log('a')
        return this
    },
    b: function(){
        console.log('b')
        return this
    }
}
A().a().b()

// 经测试，直接按照上面的写法是OK的，在jQuery中是这么写的，将原型当做A的一个属性
var A = function() {
    return A.fn
}
A.fn = A.prototype = {}

// 可是这样问题就来了，$()需要的是一组元素簇，目前达不到我们的要求，其实好解决，我们将获取元素的方式封装在fn.init方法中
var A = function(selector) {
    return A.fn.init(selector)
}
A.fn = A.prototype = {
    init: function(selector) {
        this[0] = document.getElementById(selector)
        return this
    }
}

// 上面的写法是有问题的，因为属性在原型对象上是被共享的，test的值会覆盖demo的值
var demo = A('demo')
var test = A('test')

// 你可能会想到，那我使用new创建一个对象呗，比如这样
var A = function(selector) {
    return new A.fn.init(selector)
}

// 这样你就会无法调用原型上其他方法了，因此此时返回的this是A.fn.init的实例对象了，难道办法就没法解决了么，其实我们只需要修正一下原型链即可
A.fn.init.prototype = A.fn

// 这样一来其实我们就可以链式调用啦，还有个小问题，就是要修正一下构造函数，同时我们仿照jQuery的元素簇写法，提供length属性和size函数，增强init，因此最终代码
var A = function(selector, context) {
    return new A.fn.init(selector, context)    
}

A.fn = A.prototype = {
    constructor: A,
    init: function(selector, context) {
        this.length = 0
        context = context || document
        // ~ 将 -1 转 0
        if(~selector.indexOf('#')) {
            this[0] = document.getElementById(selector.slice(1))
            this.length = 1
        } else {
            var doms = context.getElementByTagName(selector),
                i = 0,
                len = doms.length;
            for(; i < len; i++) {
                this[i] = doms[i]
            }
            this.length = len
        }
        this.context = context
        this.selector = selector
        return this
    },
    length: 0,
    size: function() {
        return this.length
    }
}

A.fn.init.prototype = A.fn

// 对象与数组，jQuery里表现的像一个数组，而我们这里像对象，如何解决呢
// jQuery中并没有一个纯粹的数组类型，而且JavaScript引擎的实现也没有做严格的校验，也是基于对象实现的，一些浏览器引擎在判断对象是否是数组时不仅仅判断其有没有
// length属性，可否通过[索引值]方式访问元素，还会判断其是否具有数组方法来确定是否要用数组的形式展现，所以只需要添加几个数组常用的方法来增强数组特性即可
A.fn = A.prototype = {
    // ...
    push: [].push,
    sort: [].sort,
    splice: [].splice
}

// 一个参数表示为对本身的扩展，多个对象表示为对第一个对象的扩展
// 为了日后绑定事件时候，减少浏览器支持功能校验开销，使用了懒函数
A.extend = A.fn.extend = function() {
    var i = 1,
        len = arguments.length,
        target = arguments[0],
        j;
    if(i == len) {
        target = this;
        i--
    }
    for(; i < len; i++) {
        for(j in arguments[i]) {
            target[j] = arguments[i][j]
        }
    }
    return target
}
A.fn.extend({
    on: (function(){
        if(document.addEventListener) {
            return function(type, fn) {
                for(var i = this.length - 1; i >= 0; i--) {
                    // false，其实默认也是false，冒泡
                    this[i].addEventListener(type, fn, false)
                }
                return this
            }
        } else if(document.attachEvent){
            return function(type, fn) {
                for(var i = this.length - 1; i >= 0; i--) {
                    this[i].attachEvent('on' + type, fn)
                }
                return this
            }
        } else {
            return function(type, fn) {
                for(var i = this.length - 1; i >= 0; i--) {
                    this[i]['on' + type] = fn
                }
                return this
            }
        }
    })()
})

A.extend({
    camelCase: function(str) {
        // 将'-'转换为驼峰式
        return str.replace(/\-(\w)/g, function(all, letter) {
            console.log(all, letter)
            return letter.toUpperCase()
        })
    },
    css: function() {
        var arg = arguments,
            len = arg.length;
        if(this.length < 1) {
            return this
        }
        // 只有一个参数
        if(len === 1) {
            // 字符串则获取第一个元素的css样式
            if(typeof arg[0] === 'string') {
                var name = arg[0]
                // IE
                if(this[0].currentStyle) {
                    return this[0].currentStyle[name]
                } else {
                    return getComputedStyle(this[0], false)[name]
                }
            } else if(typeof arg[0] === 'object'){
                // 为对象时则设置多个样式
                for(var i in arg[0]) {
                    for(var j = this.length - 1; j >= 0; j--) {
                        this[j].style[A.camelCase(i)] = arg[0][i]
                    }
                }
            }
        } else if(len === 2){
            // 两个参数则设置一个样式
            for(var j = this.length - 1; j >= 0; j--) {
                this[j].style[A.camelCase(args[0])] = arg[1]
            }
        }
        return this
    },
    attr: function() {
        var arg = arguments,
            len = arg.length;
        if(this.length < 1) {
            return this
        }
        // 只有一个参数
        if(len === 1) {
            // 字符串则获取第一个元素的css样式
            if(typeof arg[0] === 'string') {
                return this[0].getAttribute(arg[0])
            } else if(typeof arg[0] === 'object'){
                // 为对象时则设置多个样式
                for(var i in arg[0]) {
                    for(var j = this.length - 1; j >= 0; j--) {
                        this[j].setAttribute(i, arg[0][i])
                    }
                }
            }
        } else if(len === 2){
            // 两个参数则设置一个样式
            for(var j = this.length - 1; j >= 0; j--) {
                this[j].setAttribute(arg[0], arg[1])
            }
        }
        return this
    },
    html() {
        var arg = arguments,
            len = arg.length;
        if(len === 0) {
            return this[0] && this[0].innerHTML
        } else {
            for(var j = this.length - 1; j >= 0; j--) {
                this[j].innerHTML = arg[0]
            }
        }
    }
})