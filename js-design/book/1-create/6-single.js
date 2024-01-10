/**
 * 单例模式：实例化一次
 * 1. 命名空间管理员
 * 2. 模块分明
 * 3. 实现静态变量（结合闭包）
 * 4. 节省系统资源
 * 命名空间解决的问题：为了让代码更易懂，人们经常用单词定义变量或方法，但由于人们可用的单词是有限的，所以不同的人定义的变量使用的单词名称很可能重复，
 * 此时就需要用命名空间来约束每个人定义的变量来解决此类问题
 */

//  实现静态变量
var Conf = (function() {
    var conf = {
        MAX_NUM: 100,
        MIN_NUM: 1,
        COUNT: 1000
    }
    return {
        get: function(name) {
            return conf[name] ? conf[name] : null
        }
    }
})()

// 如果我们需要延迟创建呢，有人也称为惰性创建
var LazySingle = (function() {
    var _instance = null
    function Single() {
        return {

        }
    }
    return function() {
        if(!_instance) {
            _instance = Single()
        }
        return _instance
    }
})()