前端微服务

改造思路
* 只有一个不包含子项目资源的主项目，子项目通过主项目来按需加载，子系统间切换不再刷新
* 菜单栏、登录、退出等功能都从子项目剥离，写在主项目里，包括错误监控、埋点等行为
* 子项目原本需要加载的公共部分（第三方依赖），全部由主项目调度，配合 webpack 的 externals 功能通过外链的方式按需加载，这样一来每个子项目的 dist 文件里就只有子项目自己的业务代码

微前端强大之处：不同单页项目可随意组合成一个项目，反过来说，可以拆分一个大的主项目。

对于微服务来说，模块分开解藕基本就完事了，但是微前端不一样，前端应用在运行时却是一个整体，需要聚合，甚至还需要交互，通信。

为什么需要微前端
* 系统模块增多，单体应用变得臃肿，开发效率低下，构建速度变慢；
* 人员扩大，需要多个前端团队独立开发，独立部署
* 解决遗留系统，新模块需要使用最新的框架和技术，旧系统还继续使用。

方案对比
* 路由转发
* 构建时组合
  * 独立仓储、独立开发，构建时整体打包，合并应用
  * 优点：方便管理，抽取公共模块
  * 缺点：无法独立部署
* 运行时组合
  * 每个子应用独立构建，运行时由主应用负责应用管理，加载、启动、卸载、通信机制
  * 优点：真正的独立开发、独立部署
  * 缺点：复杂，需要设计加载、通信机制，无法彻底隔离，需要解决依赖冲突，样式冲突问题
* Web Components

大致用户流程
1. 用户访问 index.html 后，浏览器运行加载器的 js 文件
2. 加载器去读取配置文件 apps.config.js，然后注册配置文件中配置的各个项目
3. 加载主项目(菜单等)，再通过路由判定，动态远程加载子项目

细节
* System.js：实现远程加载子项目
* Webpack Externals

社区已有方案
* [single-spa](https://github.com/CanopyTax/single-spa)
* [基于 single-spa 的 qiankun](https://github.com/umijs/qiankun)
* [micro-frontends](https://github.com/neuland/micro-frontends)

相关资料
* [前端微服务化解决方案](https://alili.tech/archive/ea599f7c/)
* [微前端的那些事儿](https://microfrontends.cn)
* [基于 qiankun 的微前端最佳实践（万字长文） - 从 0 到 1 篇](https://juejin.im/post/5ebbd2986fb9a0432f0fff86)
* [iframe 接班人-微前端框架 qiankun 在中后台系统实践](https://mp.weixin.qq.com/s/duUxw82DizU15vqRrL_iOw)
* [EMP微前端解决方案](https://mp.weixin.qq.com/s/l0-uCLFRcBBrs4yTiAvryg)

相关书籍
* 《前端架构 - 从入门到微前端》

讨论细节
* 确认中枢仓库
* 配置收敛、跳转问题
* 服务注册

umi 集成 qiankun 的插件：@umijs/plugin-qiankun

https://www.syncfusion.com/blogs/post/micro-frontend-why-and-how.aspx