/**
 * 策略模式：将定义的一组算法封装起来，使其互相之间可以替换，封装的算法具有一定的独立性
 * 和状态模式很像，也是在内部封装一个对象，然后通过返回的接口对象实现对内部对象的调用，不同的是，策略模式不需要管理状态、状态间没有依赖关系、策略之间可以相互替换，在策略对象内部保存的是相互独立的一些算法
 */

// 策略对象
var PriceStrategy = function() {
    var strategy = {

    }
    return function(algorithm, price) {
        return strategy[algorithm] && strategy[algorithm](price)
    }
}

// 表单验证
var InputStrategy = function() {
    var strategy = {
        notNull: function(value) {
            // \s表示空白字符
            return /\s+/.test('value') ? '请输入内容':''
        },
        number: function(value) {
            return /^[0-9]+(\.[0-9]?$)/.test(value) ? '':'请输入数字'
        },
        // 本地电话
        phone: function(value){
            return /^\d{3}\-\d{8}$|^\d{4}\-\d{7}$/.test(value) ? '':'请输入正确的电话号码格式'
        }
    }
    return {
        check: function(type, value) {
            // 取出首尾空格
            value = value.replace(/^\s+|\s+$/g, '')
            return strategy[type] ? strategy[type](value) : '没有该类型的检测方法'
        },
        addStrategy: function(type, fn) {
            strategy[type] = fn
        }
    }
}

// 这一章看的有点莫名其妙，感觉过分套用概念了