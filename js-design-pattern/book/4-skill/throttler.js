/**
 * 节流器模式：但看代码而言，我更愿意理解为函数防抖，这个之前深入学习过，就不赘述
 */

 var throttle = function() {
     var isClear = arguments[0], fu
     if(typeof isClear === 'boolean') {
        fn = arguments[1]
        fn.__throttleID && clearTimeout(fn.__throttleID)
     } else {
        fn = isClear
        param = arguments[1]
        var p = extend({
            context: null,
            args: [],
            time: 300
        }, param)
        arguments.callee(true, fn)
        fn.__throttleID = setTimeout(function() {
            fn.apply(p.context, p.args)
        }, p.time)
     }
 }

// 应用场景：鼠标划过元素展现浮层，图片延迟加载，优化请求次数

// 图片延迟加载：页面首屏加载过多图片时，会严重影响其他必要资源的加载（css、js等），这会造成糟糕的用户体验，同时也会使得页面的load事件处理逻辑推迟执行
// 当页面篇幅很长，并且图片较多时，用户快速将页面拉到底部时，由于上面的图片会优先加载造成底部图片加载推迟，这种体验也不好，我们可以使用节流模式，使可视范围类图片优先加载

// 实现：监听scroll和resize事件（节流处理）
// 所有图片做缓存，检测是否在可视范围内，如果在则加载，并将此张图片从缓存中清楚

function LazyLoad(id) {
    this.container = document.getElementById(id)
    this.imgs = this.getImgs()
    this.init()
}

LazyLoad.prototype = {
    init: function() {
        this.update() // 初始化图片加载
        this.bindEvent()
    },
    getImgs: function() {
        // 类数组转数组，因为IE中执行执行数组方法slice会报错，故显形创建数组
        var arr = []
        var imgs = this.container.getElementByTagName('img')
        for(var i = 0; i < imgs.length; i++) {
            arr.push(imgs[i])
        }
        return arr
    },
    update: function() {
        if(!this.imgs.length) {
            return
        }
        var i = this.imgs.length
        for(--i; i>=0; i--){
            if(this.shouldShow(i)){
                this.imgs[i].src = this.imgs[i].getAttribute('data-src')
                this.imgs.splice(i, 1)
            }
        }
    },
    shouldShow: function() {
        // 图片底部高度大于可视视图顶部高度并且图片底部高度小于可视视图底部高度或者图片顶部高度大于可视视图顶部高度并且图片顶部高度小于可视视图底部高度
        var img = this.imgs[i],
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            scrollBottom = scrollTop + (document.documentElement.clientHeight || document.body.clientHeight),
            imgTop = this.pageY(img),
            imgBottom = imgTop + img.offsetHeight
        if(imgBottom > screenTop && imgBottom < scrollBottom || (imgTop > scrollTop && imgTop < scrollBottom)) {
            return true
        }
        return false
    },
    pageY: function(element) {
        // getBoundingClientRect() 距离最近有定位属性的父元素
        if(element.offsetParent) {
            return element.offsetTop + this.pageY(element.offsetParent)
        } else {
            return element.offsetTop
        }
    },
    on: function(element, type, fn) {
        if(element.addEventListener) {
            addEventListener(type, fn, false)
        } else {
            element.attachEvent('on' + type, fn, false)
        }
    },
    bindEvent: function() {
        var that = this
        this.on(window, 'resize', function() {
            throttle(that.update, {context: that})
        })
        this.on(window, 'scroll', function() {
            throttle(that.update, {context: that})
        })
    }
}

// 统计打包，通过节流模式优化请求次数
var LogPack = function() {
    var data = [],
        MaxNum = 10,
        itemSplitStr = '|',
        keyValueSplitStr = '*',
        img = new Image()
    function sendLog() {
        var logStr = '',
            fireData = data.splice(0, MaxNum)
        for(var i = 0; i < fireData.length; i++) {
            logStr += 'log' + i + '='
            for(var j in fireData[i]) {
                logStr += j + keyValueSplitStr + fireData[i][j]
                logStr += itemSplitStr
            }
            logStr = logStr.replace(/\|$/,'') + '&'
        }
        logStr += 'logLength=' + fireData.length
        img.src = 'a.gif?' + logStr
    }
    return function(param){
        if(!param) {
            sendLog()
            return
        } else {
            data.push(param)
            data.length >= MaxNum && sendLog()
        }
    }
}

// 这样一来减少了请求对流量的浪费，减轻了服务器对于统计请求的承载压力