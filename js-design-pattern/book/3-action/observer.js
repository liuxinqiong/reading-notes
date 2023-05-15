/**
 * 观察者模式：又称发布-订阅模式或消息机制，定义了一种依赖关系，解决了主体对象和观察者之间功能的耦合
 * 最主要作用：解决类和对象之前的耦合，解耦两个相互依赖的对象，使其依赖于观察者的消息机制
 */

// 一般而言，观察者模式会有注册，发布和移除函数
var Observer = (function() {
    var _messages = {}
    return {
        register(type, fn) {
            if(typeof _messages[type] === 'undefined') {
                _messages[type] = [fn]
            } else {
                _messages[type].push(fn)
            }
        },
        fire(type,args) {
            // args 用来传递可能的 payload
            if(!_messages[type]) {
                return
            }
            var events = {
                type: type,
                args: args || {}
            }
            for(var i = 0; i < _messages[type].length; i++) {
                _messages[type][i].call(this, events)
            }
        },
        remove(type, fn) {
            if(_messages[type] instanceof Array) {
                // 从后往前遍历，因为需要删除
                for(var i = _messages[type].length - 1; i >= 0; i--) {
                    _messages[type][i] === fn && _messages[type].splice(i, 1)
                }
            }
        }
    }
})()

// 其实如上就已经构建了一个基本的观察者模式对象了，具体嵌入业务中就可以实现解耦

// 对象间解耦
var Student = function(result) {
    var that = this
    that.result = result
    that.say = function() {
        console.log(that.result)
    }
}

Student.prototype.answer = function(question) {
    Observer.register(question, this.say)
}

Student.prototype.sleep = function(question) {
    Observer.remove(question, this.say)
}

var Teacher = function(){}
Teacher.prototype.ask = function(question) {
    Observer.fire(question)
}

// 通过观察者模式，可以解决团队开发中最重要的模块间通信问题，这是模块间解耦的可行方案