ARTS 打卡第十周

本次打卡值得关注的内容有，手动实现 indexOf 函数，在 JS 中如何写出干净的代码，cherry-pick 的功能和使用

<!-- more -->

## Algorithm
本周继续完成 easy part，名为 Implement strStr，判断一个子串在母串出现的下标位置，其实就是实现一下 JavaScript 中的 indexOf 函数，我直接调用原生 indexOf 函数，运行时间是 52ms，自己手写的运行时间是 56ms，还是有差距哇，代码如下：
```js
var strStr = function(haystack, needle) {
    if(!needle) {
        return 0;
    }
    var findIndex = -1;
    var needleIndex = 0;
    var length = needle.length;
    var resetIndex = 0;
    for(var i = 0; i < haystack.length; i++) {
        if(haystack[i] === needle[needleIndex]) {
            needleIndex++;
        } else {
            needleIndex = 0;
            i = resetIndex++;
            continue;
        }
        if(needleIndex === length) {
            findIndex = i;
            break;
        }
    }
    return findIndex === -1 ? -1 : findIndex - length + 1;
};
```

## Review
本周看的技术文章来自于 JavaScript Weekly 推荐，JavaScript Clean Code - Best Practices，主要表达的观点就是如何写出可解释的，容易被人理解的和易扩展的代码。[原文地址](https://devinduct.com/blogpost/22/javascript-clean-code-best-practices)

作者基于 JavaScript 给出了一些建议
* 使用强类型检查
* 关于变量
  * 变量命名需要能表达出意图
  * 变量命名不要添加一些不需要的单词
  * 不要强迫用户记住变量上下文，因此说的还是变量要容易理解
  * 不要添加一些不需要的上下文，比如 user.name 比 user.userName 要好
* 关于函数
  * 使用具有描述性的命名，应该由动词或者短语组成，能充分表达表达背后的意图，参数也是如此
  * 避免过多个数的入参，理想状况下，一个函数应该有两个或更少的函数入参
  * 使用默认参数，而不是条件判断
  * 函数功能要单一，避免在一个函数中执行多个动作
  * 使用 Object.assign 设置缺省值
  * 不要使用标志位入参，这意味着你的函数做了它不应该做的事情
  * 不要污染全局对象，如果需要扩展对象，使用 ES6 的继承
* 关于条件判断
  * 避免否定的判断，也就是说需要手动取反的那种
  * 使用简写判断，主要是针对 false 的判断，毕竟在 JS 中 empty string，undefined，null，false，0，NaN 都是 false
  * 尽量避免判断，考虑使用多态和继承替代
* 关于 Class
  * 推荐使用更好理解的 Class，而不是 prototype
  * 使用函数调用链，在函数中返回 this 实现
* 总体上
  * DRY 原则，提高自己的抽象能力
  * 不要留下不用到的函数和死代码

## Tip
本周由于对开发流程还不是很熟悉，错误的将修复 bug 用到的分支 merge 到 hotfix 分支的代码 merge 到了 dev，由于 dev 有很多开发中的 feature 功能，自然是不能将 dev 在融到 hotfix 的，这可如何是好，难道需要我重新从 hotfix 拉分支，在写一遍，然后提交到 hotfix 么，想想都有点可怕呗。这时候就需要请出 cherry pick 这个命令了。

关于 cherry pick git 深入学习：[Git知识总览(五) Git 中 的merge、rebase、cherry-pick 以及交互式 rebase](https://www.cnblogs.com/ludashi/p/8213550.html)

为了避免下次再犯类似的错误，对公司的开发流程深入了解了一下，在这里写个笔记如下。

主分支类别，分别对应四个不同的环境
* master：主分支，一般很少直接拉修复分支
* hotfix：从该分支拉 hotfix 分支来修复 master 上的 bug
* rc：只从 dev/hotfix merge 过来
* dev：feature/refactor/hofix

分支类别
* hotfix：修 bug 分支，各个环境都有
* refactor：代码重构，上 dev
* optimize：优化，上 dev 或 master_hotfix
* feature：特性分支，上 dev

分支命名：`<issue-type>/<issue-id>-<dev-id>-<desc>`，desc 使用下划线

开发流程：四个主分支形成一个闭环，而且方向是绝对不能反的
* master <-> hotfix -> dev -> rc -> master
* 方向绝对不能反的，就是 master 不可以直接 merge dev。必须通过 rc

## Share
本周无