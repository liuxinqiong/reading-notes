ARTS 打卡第四周

本周是新工作的第一天，可谓什么都是新的，同事是新的，项目技术栈完全是不熟悉的，加上项目本身体量也比较大，差点就自闭了，都不知道自己能不能最终稳定下来，希望自己能好好努力，技术上多学习，和同事多沟通，早点熟悉项目，能早点有生产力，本周就加上一个本周回顾吧。

<!-- more -->

## 本周回顾
这周过的有点累，倒不是因为加班什么的，主要是心累，从而导致身体也有点累，总是睡不醒。加入了新的团队，很多东西都要花时间去熟悉和学习，这里列举一下新公司需要技术储备的地方，Angular 这种大方向就不说了哈。大致如下
* Angular material UI
* svg.js svg.draw.js
* RxJS
* three.js

## Algorithm
本周继续完成 easy part，名为 Longest Common Prefix，求字符串数组中最长相同前缀
```js
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    // 如果一个单词都没有，直接返回空
    if(strs.length === 0) return ''
    // 取第一个单词
    var firstStr = strs[0]
    // 取第一个单词的长度
    var firstLen = firstStr.length
    // 用来存储结果
    var res = ''
    // 参考第一个单词长度循环
    for(var i = 0; i< firstLen; i++) {
        var count = 0;
        // 循环每一个单词
        for(var j = 0; j < strs.length - 1; j++) {
            // 取各自单词的各自 i 号位置上的字母
            var a = strs[j][i]
            var b = strs[j + 1][i]
            // 两两比较，如果相同，将成功次数 count + 1
            if(compare(a, b)) {
                count++
            } else {
                // 不相同，认定出现不一致的地方了，跳出循环
                break;
            }
        }
        // 如果成功次数等于所有单词个数减 1，认为大家该位置都相同，将字符累加到结果上
        if(count === strs.length - 1) {
           res += firstStr[i]
        } else {
            // 出现不一致结束循环
            break;
        }
    }
    return res
};

function compare(a, b) {
    return a === b
}
```

## Review
翻墙软件竟然挂了，时间也比较晚了，这周就免了吧！

## Tip
翻墙软件竟然挂了，时间也比较晚了，这周就免了吧！

## Share
翻墙软件竟然挂了，时间也比较晚了，这周就免了吧！