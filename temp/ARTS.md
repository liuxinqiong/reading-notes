ARTS 打卡第十四周

本次打卡值得关注的内容有，算法题最大子序和还是很经典的，Review 主要内容为 React 中 class component 和 functional component 的区别，Tips 内容为如何控制 gif 的暂停和播放，分享的内容为 React Hooks 深入与状态逻辑复用发展。

<!-- more -->

## Algorithm
本周继续完成 easy part，名为最大子序和，给定一个子数组，找出最大连续数组的和。

一开始看这个问题一点思路都没有，满脑子都是很暴力的解法，看来自己这方面思维有待加强。还是看了评论区才得出如下解法
```js
var maxSubArray = function(nums) {
    var res = nums[0];
    var sum = 0;
    for(var i = 0; i < nums.length; i++) {
        var num = nums[i];
        if(sum > 0) {
            sum += num;
        } else {
            sum = num
        }
        res = Math.max(res, sum);
    }
    return res;
};
```

有点像是求数组中最大值的感觉，不过这有点特别而已。进阶部分提到`分治法`，有时间扩展一下！

> 如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的分治法求解。

## Review
本周阅读的文章来自 JavaScript Weekly 推荐，名为 [Building Micro Frontends with React, Vue, and Single-spa](https://dev.to/dabit3/building-micro-frontends-with-react-vue-and-single-spa-52op)

主要内容为如何构建一个由 React 和 Vue 应用组成的微前端应用。需要使用到一个工具 [single-spa](https://single-spa.js.org/)

## Tip
你知道图片的 gif 可以手动控制暂停和播放吗？哈哈，发现一个很有意思的库 [freezeframe.js](https://github.com/ctrl-freaks/freezeframe.js/) 就可以轻松做到。

## Share
本周分享：[React Hooks 深入与状态逻辑复用发展](https://blog.pig1024.me/posts/5d0fa8d0b7e3fd426ac5e217)