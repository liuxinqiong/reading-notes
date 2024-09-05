/**
 * 访问者模式：不改变该对象的前提下访问结构中元素的新方法
 * 主要是call和apply的使用
 */

//  低版本IE中DOM2事件绑定的问题
var bindEvent = function(dom, type, fn) {
    if(dom.addEventListener) {
        dom.addEventListener(type, fn, false)
    } else if(dom.attachEvent){
        dom.attachEvent('on' + type, fn)
    } else {
        dom['on' + type] = fn
    }
}

// 如果在回调函数中通过this访问事件源对象，在低版本ie中会报错
bindEvent(dom, 'click', function() {
    // 在低版本ie中，this指向window，如果需要获取事件源对象，需要通过window.e来获取，是不是很变态
})

// 我们总不可能在回调函数中，再去判断选择，因为回调中一般是业务代码，我们如何抹掉这些不和谐的地方呢
function bindIEEvent(dom, type, fn, data) {
    // 顺便扩展一下，支持向回调函数中传入自定义数据
    var data = data || {}
    dom.attachEvent('on' + type, function(e) {
        fn.call(dom, e, data)
    })
}

// 原生对象构造器：我们为对象添加的属性数据通常是没有次序的，所以很难找到我们最后一次添加的属性数据，如果我们可以像处理数组的方式一样来处理一个对象就好了，这样我们创建的类数组对象

// 访问器
var Visitor = (function(){
    return {
        splice: function() {
            // 第二个参数开始算起
            var args = Array.prototype.splice.call(arguments, 1)
            return Array.prototype.splice.apply(arguments[0], args)
        },
        push: function() {
            var len = arguments.length || 0
            var args = this.splice(arguments, 1)
            // 修正length属性
            arguments[0].length = len + arguments.length - 1
            return Array.prototype.push.apply(arguments[0], args)
        },
        pop: function() {
            return Array.prototype.pop.apply(arguments[0])
        }
    }
})()

// 类数组在工作中十分常见