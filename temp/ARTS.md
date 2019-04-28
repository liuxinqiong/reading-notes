ARTS 打卡第五周

Node.js 12 发布啦，简单看了下介绍，印象最深的还是支持 ES6 Module，以后就可以不用 require 啦，想想还是很美好的啦，废话说完了，接下来开启本周的打卡吧。

<!-- more -->

## Algorithm
本周继续完成 easy part，名为 Valid Parentheses，判断给定字符是否是有效的括号搭配，具体字符有'(', ')', '{', '}', '[' and ']'几种，更多描述我就不啰嗦了，看到题目描述的第一瞬间，就立刻感觉需要使用栈数据结构，我的代码如下，令人激动的是打败了 100% 的玩家，这貌似是我首次达成此成就。
```js
var map = {
    ')': '(',
    '}': '{',
    ']': '['
}
var isValid = function(s) {
    var length = s.length
    if(length % 2 !== 0) {
        return false
    }
    var stack = [], top;
    for(var i = 0; i < length; i++) {
        if(stack.length) {
            top = stack[stack.length - 1]
        } else {
            stack.push(s[i])
            continue;
        }
        if(map[s[i]] === top) {
            stack.pop()
        } else {
            stack.push(s[i])
        }
    }
    return stack.length === 0
};
```

## Review
本周看的文章，国外的一篇博客[7 Useful JavaScript Tricks](https://davidwalsh.name/javascript-tricks)，主要内容为 JS 的 7 个小技巧。

数组去重，使用扩展符和 Set
```js
var j = [...new Set([1, 2, 3, 3])]
```

去除数组中的 false 值，你没有看错，直接传入 Boolean 函数名称即可，就是这么酷炫。
```js
myArray
    .map(item => {
        // ...
    })
    // Get rid of bad values
    .filter(Boolean);
```

创建空对象，相比大家都知道啦，这里就强调一下啦
```js
// 没有原型，没有其他东西，真正干净的对象，常用作字典
let dict = Object.create(null);
```

利用扩展符合并对象
```js
const summary = {...person, ...tools, ...attributes};
```

函数参数必传检查，否则报错
```js
const isRequired = () => { throw new Error('param is required'); };
const hello = (name = isRequired()) => { console.log(`hello ${name}`) };
```

解构表达式设置别名
```js
const obj = { x: 1 };
// Grabs obj.x as { x }
const { x } = obj;
// Grabs obj.x as { otherName }
const { x: otherName } = obj;
```

得到查询字符串参数，过去我们常通过正则表达式来完成，如今我们这可以这样
```js
var urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.has('post')); // true
console.log(urlParams.get('action')); // "edit"
console.log(urlParams.getAll('action')); // ["edit"]
console.log(urlParams.toString()); // "?post=1234&action=edit"
console.log(urlParams.append('active', '1')); // "?post=1234&action=edit&active=1"
```

## Tip
很多事情可能并没有办法等你准备周全，尤其对于技术，不经历业务场景的打磨，如何积累哟，所以心态放好，加油努力，学习的过程还是很棒的。

## Share
关于 React 如何开启热更新，这里也许有你不知道的哟，[传送门](https://blog.pig1024.me/posts/5cc5afa6b7e3fd426ac5e209)在此