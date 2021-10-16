前端微服务

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