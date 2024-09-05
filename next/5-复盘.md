重点考察基础
* 正则、原型链、闭包、尾递归
* 编译基本原理和步骤
* 事件流与 DOM 操作
* 如何分析内存溢出
* 了解下 service worker（缓存场景）
* git rebase：修改/合并 commit
* git reset：--mixed --soft --hard
* 项目难点与解决方案 -- 这个贼重要，多准备几个
* 空闲时间都做什么？都看什么书，参与什么开源项目
* 封装自己的组件库（视觉、交互）
* 离职的原因，上一家公司的月薪 + 年终奖
* 你的职业规划是什么？如果你担任技术部组长，你要怎么做
* 树遍历：深度优先、广度优先
* 二叉树：前序遍历、中序遍历、后序遍历
* 能够表示的最大整数 + 字符串最大长度
* 无线列表滚动如何优化（复用 DOM）：自己好好实现一下，作为一个项目的难点
* URL -> 页面呈现（浏览器渲染过程：重点）
* 状态管理（Vuex，Redux 的作用是什么：状态管理 + 代码分层）
* webpack（好好复习下 webpack）
* 基础平台组
* 抽象了哪些公共组件、公共函数
  * 数字键盘、模态框侧/右侧滑入、列表左滑/右滑、弹窗、消息提示、开关、多 tab 切换、地址选择、业务组件、分页加载
  * 存储、URL 操作、Cookie 操作、数组相关、ajax
* 类和对象 => 草图和房子，JS 是如何模拟的
* 深入 flex
* 循环引用（Map 的使用）
* 清除浮动
* BFC
* Vue 如何检测数组值变动

题目
* 大数相加
* 统计英文单词
* 元素拖拽与位置判断
* 递归、尾递归
* 垂直居中（兼容 IE8 写法）

如何阻止 Promise 进一步执行，可以回顾一下手写 Promise 原理
```js
function delay() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1)
        })
    })
}
delay().then(res => {
    console.log(res)
    throw new Error('error')
}).catch(err => {
    console.log(err)
}).then(res => {
    console.log(2)
})
```