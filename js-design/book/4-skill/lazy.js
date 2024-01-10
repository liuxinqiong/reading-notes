/**
 * 惰性模式：减少每次代码执行时的重复分支判断，通过对对象重定义来屏蔽原对象的分支判断
 * 主要是解决浏览器兼容性分支判断的问题（能力检测）：比如事件绑定，创建XHR，CSS兼容性
 */

// 两种方式
// 1. 文件加载进来时通过闭包执行该方法
// 2. 在第一次调用的时候对其重定义

// 闭包
A.on = (function(dom, type, fn) {
    if(document.addEventListener) {
        return function(dom, type, fn) {
            dom.addEventListener(type, fn, false)
        }
    } else if(document.attachEvent) {
        return function(dom, type, fn) {
            dom.attachEvent('on' + type, fn)
        }
    } else {
        return function(dom, type, fn) {
            dom['on' + type] = fn
        }
    }
})()

// 重定义
A.on = function(dom, type, fn) {
    if(document.addEventListener) {
        A.on = function(dom, type, fn) {
            dom.addEventListener(type, fn, false)
        }
    } else if(document.attachEvent) {
        A.on = function(dom, type, fn) {
            dom.attachEvent('on' + type, fn)
        }
    } else {
        A.on = function(dom, type, fn) {
            dom['on' + type] = fn
        }
    }
}

// XHR就不写了，大概就是这么个意思

// 标准浏览器：世界武大浏览器除IE以外其他四种，Chrome、Safari、Opera、Firefox四种浏览器通常是符合w3c规范的，国内浏览器一般是双核（IE内核和标准浏览器内核）