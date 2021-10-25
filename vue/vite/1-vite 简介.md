vite 的特点
* 开发时效率极高
* 社区丰富，兼容 rollup
* 超高速的热重载
* 预设应用和类库打包模式
* 前端类库无关

什么是 vite
* 构建工具的高阶封装，内部核心依赖 rollup
* 目标：使用简单、快（得益于内部实现以及 esbuild）
* 便于扩展

与传统构建工具（rollup、webpack）的区别
* high level api
* 不包含编译能力
  * 源自 esbuild 和 rollup
  * 只是集成了 rollup 功能，启动了 dev-server
* 完全基于 ESM 加载方式的开发时

webpack vs rollup
* webpack
  * 把所有能加载的东西全部考虑加载进去
  * 核心功能能帮助其他的功能进行实现，比如 dev-server
* rollup
  * 更专一：编译 es module
  * 只考虑 build javascript，而不考虑平台，不同于 webpack，编译出来的东西，会有很多工具函数帮助我们加载模块，rollup 只会编译出符合规范的代码，不会有自己的工具函数
  * 目标：为了工具类库而使用，而不是为了前端项目而服务
* vite
  * 目标：方便开发项目，为项目而生，而不是为构建而生
  * 减少的工作：dev-server、各类 loader、build 命令（类库、项目）
  * 开发环境采用 ESM 模块加载方式，采用了激进的 esbuild（一个用 go 语言开发的 JS 编译工具）
* webpack 更全面，rollup 更专一，vite 更好用

webpack 存在的问题
* 配置过于繁琐
* 慢：启动速度慢、编译速度慢、热更新速度慢