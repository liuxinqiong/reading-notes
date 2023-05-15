/**
 * 参与者模式：在特定的作用域中执行给定的函数，并将参数原封不动的传递
 * 函数绑定和柯里化
 */

 // 给事件绑定传递参数
 A.on = function(dom, type, fn, data) {
    if(document.addEventListener) {
        dom.addEventListener(type, function(e){
            fn.call(dom, e, data)
        }, false)
    } 
    // ...
}

// bind函数，在低版本浏览器中未被支持，因此我们可以书写一个polyfill
if(Function.prototype.bind === undefined) {
    Function.prototype.bind = function(context) {
        var Slice = Array.prototype.slice,
            args = Slice.call(arguments, 1)
            that = this
        return function() {
            var addArgs = Slice.call(arguments),
                allArgs = args.concat(addArgs)
            return that.apply(context, allArgs)
        }
    }
}