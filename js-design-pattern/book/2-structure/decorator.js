/**
 * 装饰者模式：本质就是添砖加瓦
 */

 var decorator = function(input, fn) {
    var input = ducoment.getElementById(input)
    if(typeof input.onclick === 'function') {
        var oldClickFn = input.onclick
        input.onclick = function() {
            oldClickFn()
            fn()
        }
    } else {
        input.onclick = fn
    }
 }

 // 适配器模式增加的方法要调用原有的方法，就需要了解原有方法的实现具体字节

 // 装饰器模式原封不动的使用，不需要知道原有方法实现的具体细节，只有当我们调用方法时才会知道