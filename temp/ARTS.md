ARTS 打卡第八周

吼吼，我又来打卡了，今天 leetcode 题为已排序数组在 O(1) 空间复杂度的情况下去重，Tip 旨在说明 git 提示你不是该项目成员时可能的情况一级解决办法。

<!-- more -->

## Algorithm
本周继续完成 easy part，名为 Remove Duplicates from Sorted Array，看了描述一大堆，甚至有点看不懂，但代码一写一尝试，发现好简单的样子，主要需要注意的地方就是要倒序遍历数组，否则删除元素会导致 index 发生变化，从而不正确，代码如下：
```js
var removeDuplicates = function(nums) {
    for(var i = nums.length - 1; i >= 0; i--) {
        if(nums[i] === nums[i+1]) {
           nums.splice(i+1, 1);
        }
    }
    return nums.length;
};
```

## Review
本周看的技术文章来自于 JavaScript Weekly 推荐的如何在 Vue.js 中处理 Error。在 Vue 中处理错误通常有如下几种方式
* Vue.config.errorHandler
* Vue.config.warnHandler
* renderError：非 global 级别，而是组件级
* errorCaptured：非 global 级别，而是组件级
* window.onerror (not a Vue-specific technique)

## Tip
最近公司项目托管从 github 迁移到 gitlab，push 代码时一直报错提示不是项目成员。可是我将全局的 .gitconfig 和 .git 裸仓库的 user 都已经修改，均无效。后面想到该 commit 是在我修改 user 之前就已经创建了，是不是记录好了之前的 user 信息呢。一看果然如此，因此使用 git rebase 修改了该 commit 的 author 信息，push 成功，具体步骤如下
* `git rebase -i commitid`
* 交互模式修改 pick 为 edit，保存退出
* `git commit --amend --author "user <email>"`
* `git rebase --continue`

## Share
本周无