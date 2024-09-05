/**
 * 命令模式：将请求与实现解耦，并封装成独立对象，从而使不同的请求对客户端的实现参数化
 */

var ViewCommand = (function () {
    var tpl = {
        product: [
            '<div>',
                '<img src="{#src#}">',
                '<p>{#text#}</p>',
            '</div>'
        ].join(''),
        title: [
            '<div class="title">',
                '<div class="main">',
                    '<h2>{#text#}</h2>',
                    '<p>{#tips#}</p>',
                '</div>',
            '</div>'
        ].join('')
    }
    var html = ''
    function formatString(str, obj) {
        return str.replace(/\{#(\w+)#\}/g, function(match, key) {
            return obj[key]
        })
    }
    var Action = {
        create: function(data, view) {
            // 根据数据拼接HTML
        },
        display: function(container, data, view) {
            if(data) {
                this.create(data, view)
            }
            document.getElementById(container).innerHTML = html
            // 展示后清空
            html = ''
        }
    }
    return function execute(msg) {
        // 通过Object.prototype代理，主要是考虑到prototype中断的特殊情况
        msg.params = Object.prototype.toString.call(msg.param) === '[object Array]' ? msg.params : [msg.params]
        Action[msg.command].apply(Action, msg.params)
    }
})()

// 命令模式也常用于解耦
var CanvasCommand = (function() {
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')
    var Action = {
        // 填充色彩
        fillStyle(c) {
            ctx.fillStyle = c
        },
        // 填充矩形
        fillRect(x, y, width, height) {
            ctx.fillRect(x, y, width, height)
        },
        // 描边色彩
        strokeRect(c) {
            ctx.strokeStyle = c
        },
        // 描边矩形
        strokeRect(x, y, width, height) {
            ctx.strokeRect(x, y, width, height)
        },
        // 填充字体
        fillText(text, x, y) {
            ctx.fillText(text, x, y)
        },
        // 开启路径
        beginPath() {
            ctx.beginPath()
        },
        // 移动画笔
        moveTo(x, y) {
            ctx.moveTo(x, y)
        },
        // 画笔连线
        lineTo(x, y) {
            ctx.lineTo(x, y)
        },
        // 绘制弧线
        arc(x, y, r, begin, end, dir) {
            ctx.arc(x, y, r, begin, end, dir)
        },
        // 填充
        fill() {
            ctx.fill()
        },
        stroke() {
            ctx.stroke()
        }
    }
    return {
        execute(msg) {
            if(!msg) {
                return
            }
            if(msg.length) {
                // 执行多个命令
                for(var i = 0; i < msg.length; i++){
                    arguments.callee(msg[i])
                }
            } else {
                msg.params = Object.prototype.toString.call(msg.param) === '[object Array]' ? msg.params : [msg.params]
                Action[msg.command].apply(Action, msg.params)
            }
        }
    }
})()

// 有了这个对象后，我们就可以命令式绘图了，不兼容的问题我们可以在命令对象内部解决
CanvasCommand.execute([
    {command: 'fillStyle', params: 'red'},
    {command: 'fillRect', params: [20, 20, 100, 100]}
])