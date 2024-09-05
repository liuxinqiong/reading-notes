/**
 * 等待者模式：通过多个异步进程监听，来触发未来发生的动作
 * 本就是Promise的实现哇，很多浏览器都原生支持了Promise，因此这里我们使用Primise
 */

var Waiter = function () {
    // 等待对象容器
    var dfd = [],
        doneArr = [],
        failArr = [],
        slice = Array.prototype.slice,
        that = this;
    var Promise = function() {
        this.resolved = false
        this.rejected = false
    }
    Primise.prototype = {
        resolve: function() {
            this.resolved = true
            if(!dfd.length) {
                return
            }
            for(var i = dfd.length - 1; i >= 0; i--) {
                // 任意监控对象还没有被解决或者解决失败则返回
                if(dfd[i] && !dfd[i].resolved || dfd[i].rejected) {
                    return
                }
                dfd.splice(i, 1) // 已经解决的删除，减少下次循环次数
            }
            _exec(doneArr)
        },
        reject: function() {
            this.rejected = true
            if(!dfd.length) {
                return
            }
            dfd.splice(0) // 直接清空
            _exec(failArr)
        }
    }
    // 创建监控对象
    that.Deferred = function() {
        return new Primise()
    }

    // 抽象出来的回调执行方法
    function _exec(arr) {
        var i = 0,
            len = arr.length;
        for(; i < len; i++) {
            try{
                arr[i] && arr[i]()
            } catch(e){}
        }
    }

    that.when = function() {
        dfd = slice.call(arguments)
        var i = dfd.length
        for(--i; i >=0; i--) {
            if(!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Primice) {
                dfd.splice(i, 1)
            }
        }
        return that // 链式调用
    }

    that.done = function() {
        doneArr = doneArr.concat(slice.call(arguments))
        return that // 链式调用
    }

    that.fail = function() {
        failArr = failArr.concat(slice.call(arguments))
        return that // 链式调用        
    }
}

var waiter = new Waiter()
var first = function() {
    var dfd = waiter.Deferred()
    setTimeout(function() {
        console.log('first finished')
        dfd.resolve()
    }, 5000)
    return dfd
}

var second = function() {
    var dfd = waiter.Deferred()
    setTimeout(function() {
        console.log('second finished')
        dfd.resolve()
    }, 5000)
    return dfd
}

waiter.when(first, second).done(function() {

}).fail(function() {

})

// 我们可以借助等待着模式封装我们的ajax请求
var ajaxGet = function(url, success, fail) {
    var xhr = new XMLHttpRequest()
    var dfd = waiter.Deferred()
    xhr.onload = function(event) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            success && success()
            dfd.resolve()
        } else {
            dfd.reject()
            fail && fail()
        }
    }
    xhr.open('get', url, true)
    xhr.send(null)
}