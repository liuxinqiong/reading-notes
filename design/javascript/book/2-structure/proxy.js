/**
 * 代理模式：怎么说的都是跨域的内容呢？？？
 * 主要讲实现跨域目的而采用的代理对象
 * 主要功能：解决系统之间耦合度以及系统资源开销大的问题
 */

// 同源策略限制：不同域名，同一域名不同端口，统一域名不同协议，域名与域名对应IP，主域与子域，子域与子域等做了限制，都不能直接调用

// img标签src属性，比如实现站长统计，数据上报，pv等，单向通信
var count = (function() {
    var _img = new Image()
    return function(param) {
        var str = 'http://xxxx/a.gif?'
        for(var i in param) {
            str += i + '=' + param[i]
        }
        _img.src = str
    }
})()

// JSONP，通过script标签，双向通信，需要服务器和客户端协作配合

// CDN：内容分发网络，一种更接近用户的网络架构，使用户可以就近获取

function jsonpCallback(data) {

}

// 代理模板，抽象出一个代理页面

// 被代理页面，一般包含三部分，如下
function callback(data) {

}

// <iframe name="proxyIframe" id="proxyIframe" src=""></iframe>

/*
<form action="server" method="post" target="proxyIframe">
    <input type="text" name="callback" value="callback"/>
    <input type="text" name="proxy" value="proxy.html"/>
    <input type="submit" value="提交"/>
</form>
*/

// 代理页面
window.onload = function() {
    if(top === self) return
    var arr = location.search.substr(1).split('&'), fn, args
    for(var i = 0, len = arr.length, item; i< len; i++) {
        item = arr[i].split('=')
        if(item[0] === 'callback') {
            fn = item[1]
        } else if(item[0] == 'arg') {
            args = item[1]
        }
    }
    try {
        eval('top.' + fn + '("' + args + '")')
    } catch(e) {}
}


// 关于代理的更多

// 虚拟代理：初期加载文件太多，实现延迟加载，点击加载，显示（inview）加载，图片太大，可以先代理一张预览图片，在将原图片替换这张预览图片