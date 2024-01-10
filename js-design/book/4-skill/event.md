扩展部分

在委托模式中，我们讲到完整事件流，从事件捕获开始，到触发该事件，再到事件冒泡三个阶段，接下来我们深入了解下发展历史

JS事件流最早要从IE和网景公司的浏览器大战说起，IE提出的是冒泡流，而网景提出的是捕获流，后来在W3C组织的统一之下，JS支持了冒泡流和捕获流，但是目前低版本的IE浏览器还是只能支持冒泡流(IE6,IE7,IE8均只支持冒泡流)，所以为了能够兼容更多的浏览器，建议大家使用冒泡流。

DOM0和DOM2事件区别
1. DOM Level 2可以在一个元素上面注册多个事件，但是DOM Level 0就不可以
2. DOM Level 0的兼容性好，可以支持所有的浏览器，但是DOM Level 2中的addEventListener的这个方法在IE浏览器是不支持的，IE浏览器（主要是<IE9）支持attachEvent事件，attachEvent事件支持两个参数，第一个是事件类型，第二个是执行的函数，DOM Level 0不同于addEventListener，这个在使用的时候要加上on，例如：addEventListener的单击事件是click，而attachEvent的单击事件是onclick，由于IE只支持冒泡事件，所以没有第三个参数
3. DOM Level 2在IE中的绑定事件是attachEvent，解除绑定是detachEvent，在标准的浏览器绑定事件是addEventListener，解除绑定是removeEventListener

阻止默认行为和阻止冒泡
* 标准浏览器：stopPropagation()与preventDefault()
* 低版本IE浏览器：window.event.returnValue=false与event.cancelBubble=true


阻止冒泡
```js
var preventDeafult = function(event) {
    var event = getEvent(event)
    if(event.preventDeafult) {
        event.preventDeafult()
    } else {
        event.returnValue = false
    }
}
```

获取事件对象
```js
var getEvent = function(event) {
    return event || window.event
}
```

获得事件源
```js
var getTarget = function(event) {
    var event = getEvent(event)
    // 标准浏览器target，IE下srcElement
    return event.target || event.srcElement
}
```