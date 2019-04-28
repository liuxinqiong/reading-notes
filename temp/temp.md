windows 平台要注意，node-gyp 可能需要安装 visual studio

ng serve --prod --aot

ng build --prod --aot

ng test

单向数据流、数据不可变形（相比 angularJS 性能提升的地方）

生成组件树工具：angular2-dependencies-graph

为什么需要 ngModule
* 资源按需加载
* 文件体积和请求数量需要取得一个平衡
* 利用 Router 和 ngModule 配合实现异步模块

路由配置：path: '**'，作为一个 fallback router 必须配置在最后
* 静态路由（path + component）会导致资源被加载都一个文件中
* 动态路由（path + loadChildren）

核心架构思想
* 依赖注入 DI
  * 构造器注入
  * 每个 HTML 标签都会有一个注射器实例
  * @Injectable 是 @Component 的子类
* 数据绑定
* 组件化
