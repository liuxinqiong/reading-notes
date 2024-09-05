/**
 * 同步模块模式：Syncchronous Module Definition
 * 将复杂的系统分解成高内聚、低耦合的模块
 * 这里先学习模块的同步加载，不需要考虑模块间异步加载
 */

// 模块定义方法 define
var F = F || {}

F.define = function(str, fn) {
    var parts = str.split('.'),
        // 当前模块祖父模块与父模块
        old = parent = this,
        i = len = 0;
    // 自身先移除
    if(parts[0] === 'F') {
        parts =parts.slice(1)
    }
    // 不能重写define和module
    if(parts[0] === 'define' || parts[0] === 'module') {
        return
    }
    for(len = parts.length; i < len; i++) {
        // 如果父模块不存在当前模块，则声明
        if(typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {}
        }
        old = parent
        parent = parent[parts[i]]
    }
    if(fn) {
        old[parts[--i]] = fn()
    }
    return this
}

F.define('string', function() {
    return {
        trim: function(str) {
            return str.replace(/^\s+|\s+$/g, '')
        }
    }
})

// 对于模块的构造函数，我们也可以使用构造函数的形式返回接口
F.define('dom', function() {
    var $ = function(id) {
        $.dom = document.getElementById(id)
        return $
    }
    $.html = function(html) {
        if(html) {
            this.dom.innerHTML = html
            return this
        } else {
            return this.dom.innerHTML
        }
    }
    return $
})

// 对于模块的创建啊，我们也可以先声明，后创建
F.define('dom.addClass')
F.dom.addClass = function(type, fn) {
    return function(className) {
        if(!~this.dom.className.indexOf(className)) {
            this.dom.className += ' ' + className
        }
    }
}

// 模块调用方法
F.module = function() {
    // 参数转数组
    var args = [].slice.call(arguments),
        fn = args.pop(),
        parts = args[0] && args[0] instanceof Array ? args[0] : args,
        modules = [],
        modIDs = '',
        i = 0,
        ilen = parts.length,
        parent, j, jlen;
    while(i < ilen) {
        if(typeof parts[i] === 'string') {
            parent = this;
            modIDs = parts[i].replace(/^F./, '').split('.')
            for(j = 0, jlen = modIDs.length; j < jlen; j++) {
                parent = parent[modIDs[j]] || false
            }
            modules.push(parent)
        } else {
            modules.push(parts[i])
        }
        i++;
    }
    fn.apply(null, modules)
}

F.module(['dom', document], function(dom, doc) {
    console.log(dom, doc)
})

F.module('dom', 'string.trim', function(dom, trim ) {
    console.log(dom, trim)
})

// 是不是很熟悉，有点像angular 1.x

/**
 * 1. 系统的分解，使用时又是对模块的组合
 * 2. 问题一般出现在局部，使得开发人员处理相应模块即可，而不用顾虑整个刺痛
 * 3. 对于局部模块的改造、优化甚至替换所需成本要小得多
 */

 // 在浏览器异步加载文件的环境模式限制了同步模块模式的应用，不过对于服务端如nodjs，他们文件都存储在本地，因此同步模块模式更加适用
