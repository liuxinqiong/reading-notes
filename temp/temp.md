正则表达式
监控系统总结
理解 antd form 表单中 shouldUpdate 和 dependencies
了解投资品种
* 期货
* 融资
* 融券
前端错误监控方案研究

<!-- more -->

## 目的
错误监控处理
* 当报错时提供一个友好的信息给用户
* 为开发者收集重要的数据

## 关键指标
一个优秀的前端监控解决方案，通常该具备哪些能力呢
* 基础能力：准确捕获错误并上报，主要捕获客户端错误和 HTTP 请求错误，主要报错如下几种错误
  * JavaScript 执行错误
  * 资源加载错误
  * HTTP 请求错误
  * unhandledRejection
* 支持 source map 解析
* 报警方式与规则：比如异常等级划分，对于严重的问题，可以直接发送邮件和短信给相关人员
* 出错场景链路跟踪，用于复现 BUG
* 敏感信息过滤
* 接入简单
* 扩展能力
  * 统计 PV，UV 等
  * 统计页面性能
  * 展示、分析能力

日志落地方案选择
* 即时上传
* 持久化在本地，特定频率上传

## 方案选择
市面上提供的错误监控的方案有很多，了解并对比如下几种方案
* Rollbar
* ARMS
* Fundebug
* Sentry

上报方式都是即时上报，请求方式有些不同
* Rollbar：POST，普通接口
* ARMS：请求 IMG，POST 和 HEAD 均有
* Fundebug：POST，普通接口

信息收集，错误监控已经是很成熟的市场的，收集的信息都比较同质化，大致如下几类
* 错误信息堆栈
* 链路跟踪信息：页面上发生的各个事件节点定义为用户行为，包括页面加载、路由跳转、页面单击、API 请求、控制台输出等信息，按照时间顺序将用户行为串联起来就是用户的行为链路。
* 终端信息：浏览器类型、是否开启 cookie、所用语言、screen 分辨率、浏览器开启插件
* 性能指标
* 请求信息
* ……

ARMS 大致有如下几种类别
* api：接口请求信息
* behavior：分辨率
* error：错误信息
* perf：性能指标
* pv：pv 统计

## 框架集成
针对 React、Vue 和 Angular，不同的监控方案可能会提供一些针对特定框架的支持。大致表现为如下几种
* React：使用 16 版本后提供的 error boundary
  * static getDerivedStateFromError：当错误产生后渲染一个 fallback UI
  * componentDidCatch：记录错误信息
* Vue.config.errorHandler
* Angular：ErrorHandler 和 HttpInterceptor

### ARMS
ARMS 的接入并没有具体说明不同框架之间是否会所不同，采取的方式都是一样的，直接安装对应的 node_module，然后初始化一下即可。

但亲测还是有一些平台相关性的，比如 Angular 中，还是需要声明 ErrorHandler，然后手动上报，否则错误不会被收集

### Rollbar
Rollbar 配合 Angular 使用，Angular Way 特别明显，需要使用 ErrorHandler 捕获 JS 错误，需要使用 HttpInterceptor 来捕获 API 错误。

Rollbar 中 React 的接入比较简单，直接在 head 标签中插入脚本即可

### Fundebug
对于 Vue 提供了一个插件

对于 React 16 之前的版本，仅需接入插件即可，无需额外配置，对于 React 16 及以后的版本，需要创建 ErrorBoundary  组件，在 `componentDidCatch` 钩子中埋代码

对于 Angular 应用，需要使用 ErrorHandler 来全局捕获错误并手动提交

## 实用工具
实践市面上方案后，了解到一些实用工具
* stacktrace-js：生成、解析、增强 JavaScript 错误堆栈，支持所有浏览器
* source-map：将压缩后文件的错误信息翻译对应源文件中的位置
* error-stack-parser：解析错误堆栈，得到更多有意义的信息

## 小小实践
一开始本计划，不适用市面服务，而是自己来实现，source-map 的解析工作中需要行号和列号，我们可以通过运用正则从 stack 中获取，简单代码如下
```js
const reg = /(http:\/\/.*\.js\??\d*):(\d+):(\d+)/;
const errorInfo = stack.match(reg)
const errorData = {
  errorObj: stack,
  scriptURI: errorInfo[1] || 'unknown script url',
  lineNumber: errorInfo[2] || -1,
  columnNumber: errorInfo[3] || -1
}
// report errorData
```

## 资料
* [Error Handling with Angular 8 - Tips and Best Practices](https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/)
* [Expecting the Unexpected — Best practices for Error handling in Angular](https://medium.com/angular-in-depth/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4)
* [前端监控怎么玩](https://juejin.im/post/5ea3eb326fb9a03c485791f9)
