组件库需要考虑什么问题呢
* 代码结构
* 样式解决方案
* 组件需求分析和编码
* 组件测试用例分析与编码
* 代码打包输出与发布
* CI/CD 文档生成

文件组织
* 没有标准的答案
* 常见的两种
  * 按 features or routes 组织
  * 按 file type 组织
* 注意事项
  * 避免多层嵌套
  * 不要过度思考

样式解决方案
* CSS in JS
  * Styled Components
  * 中立态度
* Sass/Less

样式文件组织
* _variables.scss 各种变量及可变设置
* _mixins.scss 全局 mixins
* _functions.scss 全局 functions，与 mixins 的区别在于有返回
* 每个组件单独的 style.scss 文件

色彩体系
* 系统色板
  * 基础色板
  * 中性色板
* 产品色板
  * 品牌色
  * 功能色板：需要遵守用户的已有认知

组件库样式变量分类
* 基础色彩系统
* 字体系统
* 表单
* 按钮
* 边框和阴影
* 可配置开关

组件需求分析 - 按钮
* 不同的按钮类型
* 不同的按钮尺寸
* 按钮状态 - 禁用、加载

组件测试
* 重要性
  * 高质量的代码
  * 更早的发现 bug，减少成本
  * 让重构和升级变得更加容易和可靠
  * 开发流程变得更加敏捷
* 测试金字塔
  * 顶层：UI
    * 又叫 e2e 测试，模拟真实场景，对整个应用进行测试
    * 改动很大，难以维护，运行用时很长
  * 中间：Service
    * 把几个单元测试组合起来，看是否可以正常工作
  * 底层：Unit 单元测试
    * 单独的，互相独立的部分，互相之间没有依赖，测试每一个部分都可以单独工作
    * 占比最大，容易编写，改动比较小，容易维护，并且运行比较快

通用测试框架 - jest
* 特点
  * 零配置
  * 运行速度快
  * 内置代码覆盖率测试
  * mock 实现
  * 良好的错误报告
* 高级用法
  * wait 解决异步问题

React 测试库 - react-testing-library
* 设计初衷：避免从实现细节出发去测试，因为实现方式是会发生改变的，那样会导致测试很难维护。避免开发思维，从用户思维触发，考虑结果是否达到。
* 其他测试小工具
  * jest-dom 给 jest 断言库，添加了很多新的针对 dom 的断言，方便开发更快编写单测
  * toBeVisible……

Menu 组件需求分析
* 细节考虑
  * 方向：横向、竖向
  * 有无二级菜单
  * 状态：高亮、禁用
* 实现方式
  * 通过传递数据的方式渲染列表，类似于传递 options
  * 通过更加语义化的子标签来实现，比如 Menu.Item
* 属性分析
  * MenuProps：activeIndex、mode、onSelect、className……
  * MenuItemProps：index、disabled、className……

React 提供了用于处理 props.children 不透明数据结构的方法
* React.Children.map
* React.Children.foreach
* React.cloneElement
* TS 支持：React.FunctionComponentElement 用于类型断言

图标解决方案
* 上古时代 - 雪碧图
* 近代 - Font Icon
* 现在 SVG
  * 完全可控
  * 即取即用，Font Icon 需要下载全部字体文件
  * Font Icon 很多奇怪的 Bug，比如没加载好时显示方块

图标动画
* CSS Transition + Transform：永远是首选方案，但有些问题解决不了
  * CSS 方案会存在 display:none 动画失效的问题
* React Transition Group
  * 提供 3 个核心组件
    * Transition
    * CSSTransition
    * TransitionGroup
  * 本身并没有提供 CSS 动画，而是添加一系列 CSS 类名的变化。通过 force reflow 的方式解决 display:none 问题
  * animation.css 可以用来参考哦

目前的痛点
* cra 入口文件不适合管理组件库
* 缺少行为跟踪和属性调试功能

组件开发工具应有的特点
* 分开展示各个组件不同属性下的状态
* 能追踪组件的行为并且具有属性调试功能
* 自动生成文档和属性列表

Storybook
* 安装与编写 stories
* storybook 插件机制 addons - 插件系统在任何大型系统中都代表一种良好的设计思想
  * decoration addon
  * native addon
* addon-docs
  * export default 组件竟然导致 docs 自动生成文档生效，好坑

表单组件

Upload 组件

JS 模块化发展
* 什么是模块化
  * 一组可重用的代码
  * 可维护性
  * 可重用性
* 发展
  * 原始阶段：全局变量 + 命名空间
  * AMD（参考 CommonJS 在浏览器端实现） + CommonJS（服务端，不符合浏览器标准）
  * ES6 Module
* webpack - bundler 神奇功效
  * 分析得到所有必须模块并进行合并
  * 提供了让模块有序正常执行的环境
  * 其他功能：不止支持 js 文件，code-splitting，tree-shaking
* 代码运行流程
  1. ts 文件
  2. tsc 编译器转换成 es6 模块
  3. 入口文件引入需要的文件
  4. 通过 module bundler 进行处理（webpack、rollup）
  5. 得到可供浏览器使用的一个或多个文件
* 创建入口文件
  1. 通过 package.json 的 `main` 字段确定主要入口文件。但由于 package 最早是服务于 node 环境的，因此 main 字段指定的文件可能时 commonjs 格式文件
  2. 为了解决这个问题，webpack 和 rollup 联合推出一个 `module` 字段，用于专门对应 es6 模块的入口文件
  3. 目的：导入所有文件再导出
* 创建 build-ts 命令，通过 tsc 将实现 ts 转 es
* 创建 build-css 命令，通过 node-sass 实现 scss 转 css
* 本地测试 npm link
  * 需要被 link 的创建，运行 npm link 命令，创建软链到全局
  * 在需要使用 package 的项目中，运行 npm link package_name，实现自身 node_modules 中软链到全局

npm 发布
* 命令行注册
  * npm whoami
  * npm config ls 查看是否使用了淘宝源，如有需要切换为原版
* pkg 字段
  * description keywords author version license……
  * files 指定需要上传哪些文件
  * scripts.prepublish
* npm publish
* 精简 dependencies
  * 这时是否区分 dependencies 和 devDependencies 就有实际作用了，用户安装是只会安装 dependencies 内容。
  * dependencies 主要指运行业务逻辑需要用到的第三方库
  * 哪些应该放进 devDependencies 内呢
    * 与核心业务逻辑和最终生成的模块无关的任务，这些任务支撑核心业务的开发过程以及程序开发环境向生产环境的支持过程
    * 单元测试
    * 语法转换
    * lint 工具
    * css 预处理器
    * 程序构建 module bundler
* peerDependencies
  * 解决重复安装问题
* 发布和 commit 前检查
  * 检查单元测试和代码规范是否通过
* CI/CD
  * Travis CI
  * CI 持续集成
    * 频繁的将代码集成到主干
    * 快速发现错误
    * 防止分支大幅偏离主干
  * CD 持续交付
    * 频繁的将软件的新版本交付给质量团队或者用户
    * 代码通过评审以后，自动部署到生产环境