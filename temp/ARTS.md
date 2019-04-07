ARTS 打卡第三周

背景就不介绍啦，可以去看第一周的文章啦，撸起柚子加油干咯

<!-- more -->

## Algorithm
本周 leetcode 算法题，依旧是一道难度级别为 easy 的题目，名称为 palindrome number，大概意思就是说判断一个数是不是顺着读，倒着读结果是一样的。

脑海里的第一个想法就是借用数组的 reverse 函数，因此代码如下
```js
var isPalindrome = function(x) {
    var reverseInterge = Number((x).toString().split('').reverse().join(''))
    return reverseInterge === x
};
```

洋洋洒洒写下来，一顿提交后，运行速度好像不是太理想，占用内存也比较大，难道是我借用数组的原因，于是不用数组写了如下的代码
```js
var isPalindrome = function(x) {
    var xString = (x).toString()
    var len = xString.length
    var res = ''
    for(var i = len - 1; i >=0; i--) {
        res += xString[i]
    }
    return x === Number(res)
}
```

代码提交后，也是没啥大问题的，可惜的是，我发现运行时间和占用内存和第一个方法差别不大。

## Review
本周阅读的英文技术文章来自于 medium，名为 Passing Arrays as Function Arguments，讲的是如何将数组每一项作为函数参数列表。

在 ES6 出来之前，我们使用的方式是 apply 函数，代码如下
```js
func.apply(null, array)
```

ES6 de 扩展运算符带来了中更简单的方式
```js
func(...array)
```

文章中还提到，这种将数组转换成参数列表的能力给 Math 对象函数提供了便利。比如 Math.max 用来的到参数列表中的最大值。我们日常开发中也可以用来得到数组中的最大值，用法如下
```js
Math.max.apply(null, array)
```

利用扩展符，写法就更加美观了
```js
Math.max(...array)
```

什么是参数可变的函数：可以接受无限的或者参数个数可变的的函数，比如 Math.max 就是其中之一

## Tip
无

## Share
关于 HTML 字符串是如何一步步被解析成 DOM 节点的，尝试使用状态机实现了一个简单的函数，具体分享内容见：[用原生 JS 实现 innerHTML 功能](https://blog.pig1024.me/posts/5ca2d1f2b7e3fd426ac5e202)