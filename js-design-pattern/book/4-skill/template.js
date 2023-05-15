/**
 * 简单模板模式：类似于创建一个简单的模板引擎
 * 功能：通过格式化字符串拼凑出视图，避免创建视图时大量的节点操作，优化内存开销
 */

A.formatString = function(str, data) {
    return str.replace(/\{#(\w+)#\}/g, function(match, key){
        return typeof data[key] === undefined ? '' : data[key]
    })
}

// 对于复杂的，我们还可以创建一个模板库
A.view = function(name) {
    // 模板库
    var v = {
        code: '<pre><code>{#code#}</code></pre>',
        img: '<img src="{#src#}" alt="{#alt#}" title="{#title#}">',
        part: '<div id="{#id#}" class="{#class#}">{#part#}</div>',
        theme: [
            '<div>',
                '<h1>{#title#}<h1>',
                '{#content#}',
            '</div>'
        ]
    }
    if(Object.prototype.toString.call(name) === '[object Array]') {
        var tpl = '';
        for(var i = 0; i< name.length; i++) {
            tpl += arguments.callee(name[i])
        }
        return tpl
    } else {
        return v[name] ? v[name] : ('<' + name + '>{#') + name + '#}</' + name + '>'
    }
}

// 简单模板模式意在解决运动DOM操作创建视图时造成资源消耗大、性能低下、操作复杂等问题
// 通过正则匹配的方式去格式化字符串的执行性能要远告诉DOM操作拼接视图的执行性能，因此这种方式常被用于大型框架（MVC）创建视图中
// 简单模板主要包含三部分：字符串模板库，格式化方法，字符串拼接操作