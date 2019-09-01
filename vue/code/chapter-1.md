## 认识Flow
是什么：静态类型检查工具

背景：Vue.js 在做 2.0 重构时候，在 ES2015 的基础上，除了 ESLint 保证代码风格之外，也引入了 Flow 做静态类型检查

通常类型检查分成两种方式
* 类型推断：通过变量的使用上下文来推断出变量类型，然后根据这些推断来检查类型
* 类型注释：事先注释好我们期待的类型，Flow会基于这些注释来判断

安装flow
```shell
npm install -g flow-bin
# 使用
flow init # 初始化
flow # 执行一轮检查
```

具体类型有：string，number，Array，void，boolean，自定义对象，?T

## 源码目录
目录如下
```shell
└── compiler # 编译相关
└── core # 核心代码
└── platforms
    ├── web
    └── weex
└── server # 服务端渲染
└── sfc
└── shared # 辅助方法，常量
```

## 源码构建
Vue.js 源码基于 rollup 构建

> rollup 相比 webpack 更轻量，更适合 JS 库的构建

Runtime Only VS Runtime + Compiler
* 在使用 Runtime Only 时，通常需要借助如 webpack 的 vue-loader 把.vue 文件编译成 JavaScript，因为是在编译期间做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量
* 如果没有对代码做预编译，又使用了 Vue 的 template 属性并传入字符串，则需要在客户端编译模板

在Vue 2.0中，最终渲染都是通过 render 函数，如果写 template 属性，则需要编译成render函数，那么这个编译会发生在运行时，所以需要带有编译器的版本

> 编译过程对性能有一定损耗，所以通常我们更推荐使用 Runtime-Only 的 Vue

## 入口
Vue 入口是一个 function 形式的构造函数，至于为啥不使用 ES6 class 的方式呢？可以看到在 Vue 下有多个 mixin 方法，内部都是为了在 Vue 的原型上挂载方法，这么做的目的主要是代码拆分，将不同函数分布在不同文件中，利于维护。
* mixin 方法在 Vue 原型上挂载方法
  * initMixin
  * stateMixin
  * eventsMixin
  * lifecycleMixin
  * renderMixin
* initGlobalAPI 在 Vue 对象上挂载全局方法