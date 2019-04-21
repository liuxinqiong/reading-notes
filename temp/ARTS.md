ARTS 打卡第三周

背景就不介绍啦，可以去看第一周的文章啦，撸起柚子加油干咯

<!-- more -->

## Algorithm
本周继续完成 easy part，名为 Roman to Integer，将罗马数组转换成普通数组，其实非常简单，只是有几种特殊情况需要判断一下。我的答案如下
```js
// map 将字符快速转数字
var map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
};
// 判断是否属于减法情况
var isSubCase = function(prevChar, curChar) {
    var bool = false
    if((prevChar === 'I' && (curChar === 'V' || curChar === 'X') || 
        prevChar === 'X' && (curChar === 'L' || curChar === 'C') ||
        prevChar === 'C' && (curChar === 'D' || curChar === 'M'))) {
        bool = true
    }
    return bool
}
var romanToInt = function(s) {
    var len = s.length
    var res = 0
    var prevChar
    for(var i = 0; i < len; i++) {
        var curChar = s[i]
        if(prevChar && isSubCase(prevChar, curChar)) {
            res += map[curChar] - 2 * map[prevChar]
        } else {
            res += map[curChar]
        }
        prevChar = curChar
    }
    return res
};
```

## Review
本周阅读的英文技术文章来自于 medium，名为 Number Truncation in JavaScript，主要内容讲 JS 中数字的裁剪。了解到一个新 api。

在 JS 中，获取整数部分，我们可能会这么写
```js
const number = 80.6
// Old Way
number < 0 ? Math.ceil(number) : Math.floor(number);
```

如今在 ES6 中，我们可以这么写
```js
const es6 = Math.trunc(number);
```

你可能会发现这个 api 得到的结果和 parseInt 是类似的，但还是有区别，因为 parseInt 主要用于 String 参数类型的，如果是 Number 类型，也会自动调用 toString() 函数转成字符串

很多时候 parseInt 都能正常工作，但下面就会得到错误的结果
```js
const number = 1000000000000000000000.5;
const result = parseInt(number);
console.log(result);
```

主要是因为数字在转 String 时，会变成科学记数法
```js
const number = 1000000000000000000000.5;
const result = number.toString();
console.log(result); // "1e+21"
```

## Tip
取数字整数部分的其他方法，按位取反和按位或，这里需要好好理解下原理
```js
console.log(~~80.6); // 80
console.log(80.6 | 0); // 80
```

## Share
重读《CSS 世界》，对 CSS 的理解又加深了，CSS 真不像看上去那么简单，深入理解后发现一切都是有原因的：[传送门](https://blog.pig1024.me/posts/5cac686bb7e3fd426ac5e205)