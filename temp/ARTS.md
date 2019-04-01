ARTS 打卡第二周

背景就不介绍啦，可以去看第一周的文章啦，撸起柚子加油干咯

<!-- more -->

## Algorithm
本周是一道比较简单的题，名称为 Reverse Integer，给定一个数字，将数组部分反转，需要考虑到大小边界问题，假定为 32 位带符号整形，同时需要考虑到负数的问题。

我的解法是借用数组的 reverse 方法，具体如下
```js
var reverse = function(x) {
    var res = (x).toString().split('').reverse().join('')
    // 判断是不是负数，特殊处理，借用 Number 函数将字符串转为数组，会自动去除开始可能存在的 0
    if(res.charAt(res.length - 1) === '-') {
        res = Number('-' + res.substring(0, res.length - 1))
    }
    // 判断是否超出范围
    if(Math.abs(res) > 0x7FFFFFFF) {
        return 0
    }
    return res
};
```

## Review
本周阅读的英文技术文章来自于 medium，名为 3 Ways to Set Default Value in JavaScript，三种方式设置默认值。分享的内容其实比较简单，但还是一些细节值得学习的。首先看看有哪三种写法
* || 或运算符
* 三元运算符
* if/else

作者重点讲了 || 的用法，因为它觉得这种写法更加简洁，代码量也更少，同时也更好理解

我们通常会如此使用
```js
function(name) {
  name = name || 'no name';
}

// 注意在 ES6 中更推荐参数默认值写法
function(name = 'no name') {

}
```

|| 运算符只有左边为 false 时，右边的值才会被赋值给其他变量，那么那些值是 false 呢？
* false
* undefined
* null
* NaN
* 0
* empty string

我们已经知道有上述 6 种可能会被转换为 false 值，但有时候我们并不想捕获所有的 false 值，此时 || 就表示无能为力了，就需要用到三元运算符啦
```js
a = (a === undefined) ? a : b;
```

## Tip
不知道你有没有思考过 HTTP 协议传输的纯文本的 HTML 字符串，是如何被浏览器解析的呢？甚至更大的话题，我们写的 JS 代码是如何被解释执行的呢？

这里设计到一个状态机的概念，近期准备自己实现一下浏览器的 innerHTML 属性的功能，实现一个对应的函数，将字符串解析成 DOM 元素。

如果你感兴趣的话也可以一起把弄哦。

## Share
这篇文章可以看看哦，关于 node 服务端日志分片，如何防止站点被笨笨机器人灌水，以及加深对 CSRF 攻击的理解，传送门：[站点被机器人疯狂灌水](https://blog.pig1024.me/posts/5c9b2d25b7e3fd426ac5e1fe)