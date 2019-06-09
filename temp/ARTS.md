ARTS 打卡第十二周

本次打卡值得关注的内容有，算法题比较简单就不多说了，Share 主要内容为判断一个数组类型的几种方式的差异，Tips 内容为 git stash pop 出现冲突的一个注意事项，分享的内容为上一篇博客，React for Vue developers。

<!-- more -->

## Algorithm
本周继续完成 easy part，名为 Length of Last Word，得到一个句子中，最后一个单词的长度，这里需要注意一个前后多于空格的问题。代码如下
```js
var lengthOfLastWord = function(s) {
    s = s.replace(/^\s+|\s+$/g, '');
    if(!s || !s.length) {
        return 0;
    }
    var ss = s.split(' ');
    var lastWorld = ss[ss.length - 1];
    return lastWorld.length;
};
```

## Review
本周阅读的原文来自 medium，原文地址[Better Array check with Array.isArray](https://medium.com/dailyjs/better-array-check-with-array-isarray-dae0283263be)，内容主要是使用 Array.isArray 判断数组是一种更好的方式。

平时我们判断数组的方式可能有
```js
// Old way
Object.prototype.toString.call(books) === '[object Array]';
// Better
Array.isArray(books);
```

特别注意不能使用 `typeof` 表达式，因为它返回的是 object。另外一种我们可能选择的方式是 `instanceof` 表达式
```js
books instanceof Array; // true
```

instanceof 和执行上下文有关，只适用于单执行环境，对于多窗口的环境会检测出错，因为本质是检查该类型是否出现在原型链上。
```js
html: <iframe frameborder="1" name="result" id="result"></iframe>
script:  document.querySelector('#result').src = 'demo5.html';
//下面是deml5界面代码
alert(parent.arr instanceof Array);//false
alert(parent.arr instanceof parent.window.Array);//true  这样才是true
```

类型判断总结
* `typeof` 判断基本类型和 function
* `instanceof`  用于单一环境下对象类型的判断，可以用于判断自定义类型
* Object.prototype.toString.call 无法判断自定义对象，常用来判断系统内置对象
* 推荐使用 Array.isArray 函数

## Tip
git stash pop 后提示冲突，此时对应的 stash 并不会删除，依旧保留在 stash list 中，但实际上代码已经 pop 出来了。

此时解决冲突，删除 stash 即可。如需删除所有 stash，运行 `git stash clear` 即可。

## Share
本周分享：[React for Vue developers](https://blog.pig1024.me/posts/5cfcf49bb7e3fd426ac5e212)