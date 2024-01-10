/**
 * widget模式：将页面分解成部件，针对部件开发，最终组合成完整的页面
 */

// 实现模板引擎 1.处理数据 2.获取模板 3.处理模板 4.编译模板

F.module('lib/template', function () {
    var _TplEngine = function (str, data) {
        // 数组循环处理
        if (data instanceof Array) {
            var html = '',
                i = 0,
                len = data.length;
            for (; i < len; i++) {
                html += _getTpl(str)(data[i])
            }
            return html
        } else {
            return _getTpl(str)(data)
        }
    }
    var _getTpl = function (str) {
        // str如果是id，获取元素内容，如果是字符串直接当做模板
        // 模板可以是页面标签内容，表单元素内容，script模板内容，甚至手写的模板内容
        var ele = document.getElementById(str)
        if (ele) {
            var html = /^(textarea|input)$/i.test(ele.nodeName) ? ele.value : ele.innerHTML
            return _compileTpl(html)
        } else {
            return _compileTpl(str)
        }
    }
    var _dealTpl = function (str) {
        var _left = '{%',
            _right = '%}';
        return String(str)
            // 将&lt;&gt;转< >
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            // 去除三类空白符
            .replace(/[\r\t\n]/g, '')
            // 取值符号，转成内容，进行非空判断，注意注意这里的逗号细节，因为push格式如下，push(a,b,c),同时push多个
            .replace(new RegExp(_left + '=(.*?)' + _right, 'g'), "',typeof($1)==='undefined'?'':$1,'")
            .replace(new RegExp(_left, 'g'), "');")
            .replace(new RegExp(_right, 'g'), "template_array.push('")
    }
    var _compileTpl = function (str) {
        str = _dealTpl(str)
        // 函数声明技巧
        var fnBody = `
                var template_array = [];
                var fn = (function(data) {
                    var template_key = ''; 
                    for(var key in data) {
                        template_key += ('var ' + key + '=data[\"'+ key +'\"];');
                    }
                    eval(template_key);
                    template_array.push('${str}');
                    template_key = null;
                })(templateData);
                fn = null;
                return template_array.join('');
            `
        return new Function('templateData', fnBody)
    };
    return _TplEngine;
})

// 注意: 使用Function构造器生成的函数，并不会在创建它们的上下文中创建闭包；它们一般在全局作用域中被创建。
// 当运行这些函数的时候，它们只能访问自己的本地变量和全局变量，不能访问Function构造器被调用生成的上下文的作用域。
// 这和使用带有函数表达式代码的 eval 不同。