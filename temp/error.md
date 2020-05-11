错误监控

错误被吞掉？

错误类型
* 客户端错误
* 服务端错误

工具：stacktracejs

已有平台：rollbar

可能存在的问题：文件压缩问题

待确认问题
* 收集哪些信息
* 发送频率
* 同一个错误需要过滤掉吗

接入的复杂度

前端错误监控需求

后端工作
1. 收集错误
2. 客户端错误堆栈需要解析才有意义

错误简单分类，不同错误类型收集的错误信息会不同
1. 客户端错误
2. 服务端错误：指接口出错

解析工作：由于前端代码会被合并压缩，生产环境的错误堆栈需要根据 sourcemap 文件翻译成未压缩前代码才有意义。这里涉及到
1. 前端 sourcemap 文件生成，确定 sourcemap 的版本
2. 后端解析工作，nodejs 社区有开源包：https://www.npmjs.com/package/source-map，不知有没有对应 python 版本

error-stack-parser
source-map

environment

code_version

是否需要手动操作

了解 arms 各参数的作用

https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/

https://docs.rollbar.com/docs/source-maps#section-enabling-source-map-translation-in-rollbar

https://help.aliyun.com/document_detail/66404.html?spm=a2c4g.11186623.6.668.8ba12f4d0J7F4I

https://arms.console.aliyun.com/retcode?pid=goa9ep4x84%40582846f37273cf8#/index

https://blog.csdn.net/weixin_33698823/article/details/88705083

https://reactjs.org/docs/error-boundaries.html

https://docs.sentry.io/platforms/javascript/

https://www.stacktracejs.com/