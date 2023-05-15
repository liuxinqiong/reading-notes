/**
 * 外观模式：名字真的很奇怪
 * 作用：为复杂的子系统接口提供一个更高级别的统一接口
 * 兼容性统一封装
 */

// 顺便学习下事件相关兼容性问题啦

// 兼容方式绑定事件
function addEvent(dom, type, fn) {
    // 支持DOM2级事件处理程序addEventListener
    if(dom.addEventListener) {
        dom.addEventListener(type, fn, fasle)
    } else if(dom.attachEvent) {
        // 对于不支持addEventListener但支持attachEvent浏览器，主要是<IE9
    } else {
        // 使用使用DOM0级别了
        dom['on' + type] = fn
    }
}

// 兼容性问题的又一个例子，低版本IE浏览器不兼容e.preventDeafult()和e.target
var getEvent = function(event) {
    return event || window.event
}

var getTarget = function(event) {
    var event = getEvent(event)
    // 标准浏览器target，IE下srcElement
    return event.target || event.srcElement
}

var preventDeafult = function(event) {
    var event = getEvent(event)
    if(event.preventDeafult) {
        event.preventDeafult()
    } else {
        event.returnValue = false
    }
}

// 很多代码库都是通过外观模式来封装多个功能，简化底层操作