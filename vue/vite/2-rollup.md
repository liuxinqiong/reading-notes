rollup 介绍
* 开源类库优先选择
* 以 ESM 标准为目标的构建工具，对于 require 和 module.exports 语法的 commonjs 模块默认是不支持的，需要通过额外的插件才能支持
* Tree Shaking

format
* umd：进行环境判断，比如有没有 exports 判断是不是 commonjs 环境、通过又没 define 判断是不是处于 amd 环境、通过 global 判断是否通过全局对象加载模块
* cjs：输出 require 语法的代码
* es：就是 es module
* iife：自执行函数

ES Module 出现以前的非标准的模块管理方案
* commonjs 规范
* amd 规范
* umd 规范

但这些规范本质上都是通过 JS 脚本的执行来进行管理，并不是原生的模块管理能力，而 ES Module 则是原生的 JS 语法，增加了 import 和 export 两个主要关键字

现代主流的浏览器基本上都支持了 ES Module 的 JS 模块管理功能，通过 script 标签的 type 属性指定为 module 即可，**对于 ES Module 的 JS 脚本，在浏览器解析并执行后，浏览器会根据其路径继续请求其依赖的模块，也就是说只有真正被依赖的 JS 模块才会被真正的加载**

动态加载模块：ES Module 中也提供了 import() 函数，接收一个字符串作为路径，返回一个 Promise，加载功能则会调用 then 函数

mjs 和 js
* 在 ES Module 官宣时，也宣布了 mjs 后缀。统一的认知是以 mjs 结尾的文件视为 ES Module 文件，而 js 视为非 ES Module 文件
* node 14 后正式支持了 ES Module，如果没有在 package.json 中声明 module: true，那么你只能在 mjs 中使用 ES Module

ES Module 和 commonjs 的区别
* commonjs 模块通过 require 函数和 module 对象进行模块管理，则两个函数是在 js 脚本执行前，由 js 引擎通过 vm 进行注入的全局对象，本质上就是 js 的函数或对象，可以在任意地方被引用和使用，它们运行的同时也是 JS 运行的同时
* ES Module 的 import 和 export 则不同，他们是关键字，在脚本语法解析还没有执行时，就已经可以知道该模块导入或者导出了什么内容，本质上这两个模块的管理方式就是不同的
* 典型区别：import 导入的内容是静态不允许修改的，而 require 引入的对象本身就是原始对象的引用，可以直接修改

rollup 命令行（通常可以通过单杠加首字母达到缩写的目的，下面写全称）
* input 指定输入文件，可以指定多个
* file 指定输出文件
* format 指定输出格式
* dir 指定输出目录，对于多个输入时十分有用
* name 指定全局输出的名字，对于 umd 输出十分有用
* watch 监控文件修改，自动重新编译
* environment 环境变量，格式 K:V，比如 --environment TEST:123
* config 指定配置文件
* plugin 指定配置插件

默认的配置文件名：rollup.config.js，且必须使用 es 写法，如果想使用 module.exports 写法，则需要改成使用 cjs 后缀

rollup 配置文件
* 可以 export 一个对象，也可以是数组，用于处理不同的输出，比如你要同时支持 es、cjs 两种不同的输出
* plugins：功能增强，常用插件
  * @rollup/plugin-json：json 文件转 js 对象
  * @rollup/plugin-node-resolve：node_modules 找包
  * @rollup/plugin-commonjs：增加对于 commonjs 支持
  * @rollup/plugin-babel
    * 兼容 babel 自身的配置
    * babelHelpers 建议显示设置，即使使用默认值
      * exclude/include/filter/extensions
      * runtime：使用 rollup build 类库时尤其会被用到，它依赖 @babel/plugin-transform-runtime，同时你也要声明 @babel/runtime 依赖
      * bundled：当你希望你的 bundle 含有这些 helper 时，这在打包应用程序代码时尤其有用。
      * external：你需要知道你在做什么，它将引用全局 babelHelpers 对象上的 helper，需要与 @babel/plugin-external-helpers 结合使用
      * inline：并不推荐，helper 将会插入到每个文件，会导致严重的代码重复
  * @rollup/plugin-typescript：还有一个民间的 rollup-plugin-typescript2
  * @rollup/plugin-eslint：编译的时候校验语法是否符合期望
  * @rollup/plugin-image
  * @rollup/plugin-strip：移除 log 代码
  * @rollup/plugin-alias
  * @rollup/plugin-replace
  * @rollup/plugin-wasm
  * rollup-plugin-dts
  * rollup-plugin-node-polyfills
  * rollup-plugin-terser
* external：指定外部导入，从而不会将指定的依赖打包仅最终 js 中
* output.plugins
  * 和 plugins 的差别在于执行时机不一样，只有在文件的编译等完成了之后才会执行，最典型的场景就是代码压缩
  * rollup-plugin-terser：代码压缩
* output.banner 最终文件添加说明等
* output 字段也可以是数组

> babel 本身也已经支持编译 typescript 语法的功能了，但只编译语法，不做类型校验

rollup 插件
* 指定流程：input => rollup core => ...plugins => file
* Hook：rollup 在执行的不同阶段，会调用不同的钩子，从而让 plugin 有了增强的接入点
  * options：第一个被执行的 hook，进行配置上的预处理，完成本地变量的一些存储，与 buildStart 的区别在于，options 修改的配置，再 buildStart 阶段是可以看到的
  * buildStart：入参是 rollup 的整体配置，一般用来读取项目配置，然后进行一些修改
  * resolveId：每个文件会有一个 id，入参是 importee 和 importer
  * load：入参是 id
  * transform：入参是 code 和 filename
  * renderStart
  * renderChunk
  * renderEnd
  * …… 具体看文档吧
* 通用配置
  * include
  * exclude
* 了解三个官方插件
  * alias：路径别名
  * babel：代码编译，es6/7 => es5
  * replace：环境变量替换

esbuild 使用：esbuild.github.io
* esbuild 是用 go 书写，没有配置文件一说，通过命令行进行调用
* esbuild file
  * --outfile 指定输出文件
  * --outdir 指定文件目录
  * --bundle 指定为打包操作，而不是简单编译，支持 tree shaking
  * --target 指定编译目标
  * --platform 指定平台 browser、node
  * --format 指定格式
  * --watch 文件修改监听
  * --define 类似于 replace
  * --loader 支持类似图片的处理
  * --jsx-factory
* esbuild plugin
  * hook 扩展
  * 支持 js 书写，也支持 go

nodejs 中使用 esbuild 的方法
```js
require('esbuild').build({
    entryPoints: ['app.js'],
    bundle: true,
    outfile: 'out.js',
    plugins: [envPlugin]
}).catch(() => {
    process.exit(1)
})
```

扩展：babel 配置解释
* @babel/core：babel transform 代码的核心模块
* plugins 参数
  * 执行顺序：从前往后
  * 代码转换功能以插件的形式出现
* presets 参数：一组 babel 插件或 options 配置的可共享模块
  * 执行顺序：从后往前
  * 我们需要通过配置一个个的 plugin 实现转换需求，这事很麻烦，你可以根据所需要的插件组合创建一个自己的 preset 并分享出去
  * 官方插件 @babel/preset-env 做的就是这样一件事，其包含的插件将支持所有最新的 JS(ES2015/ES2016 等)的特性，preset 也是支持参数的
    * useBuiltIns 参数
      * usage 当使用此选项时，只需要安装 @babel-polyfill 即可，不需要在webpack中引入，也不需要在入口文件中引入(require/import)
      * entry 当使用此选项时，安装完 @babel-polyfill 之后，然后在项目的入口文件中引入
      * false 当使用此选项时，需要安装依赖包，然后加入 webpack.config.js 的 entry 中
    * esmodules 参数：目标浏览器是否支持 es 模块管理
    * modules
      * 将 es 模块转换成另一种模块，比如 amd、umd、commonjs 等
  * @babel/preset-typescript
  * @babel/preset-react
  * babel 7.4.0 之后，@babel/polyfill 这个包已经废弃了，推荐直接是用 core-js/stable 以及regenerator-runtime/runtime
* transform-runtime：提取一些帮助函数来减小打包的体积，在开发自己的类库时，建议开启 corejs 选项
  * 自动引入 @babel/runtime/regenerator，当你使用了 generator/async 函数(通过 regenerator 选项打开，默认为 true)
  * 提取一些 babel 中的工具函数来达到减小打包体积的作用
  * 如果开启了 corejs 选项(默认为false)，会自动建立一个沙箱环境，避免和全局引入的 polyfill 产生冲突

babel.config.json vs .babelrc
* .babelrc 会在一些情况下，莫名地应用在 node_modules 中
* .babelrc 的配置不能应用在使用符号链接引用进来的文件
* 在 node_modules 中的 .babelrc 会被检测到，即使它们中的插件和预设通常没有安装，也可能在 babel 编译文件的版本中无效

monorepo 配置加载规则
* 在向上搜索配置的过程中，一旦文件夹中找到了 package.json，就会停止搜索其他配置，babel 用 package.json 文件来划定 package 的范围
* 这种搜索行为找到的配置，如 .babelrc 文件，必须位于 babel 运行的 root 目录下，或者是包含在 babelRoot 这个 option 配置的目录下，否则找到的配置会直接被忽略

扩展 AST 介绍
* 首先我们写的代码其实就是普通的文本字符串，因为存在着 JS 引擎解析我们的代码，转变成更低一层的实现，比如是 C++ 的函数
* 为什么要定义语法的原因，也是因为解析器只能按照既定的规则进行解析，才能映射到对应的 low level 函数
* 代码到执行的过程，需要有解析编译这个过程，这个过程产生的副产品之一，就是 AST 语法树
* AST 语法树是现代最流行的语法解析结构，其本身就是一个嵌套的树结构，每个节点可以表达特定的含义
* 为什么我们需要把简单明了的代码翻译成这个树结构呢？代码是给人看的，机器看不懂，但是机器可以认识 AST 语法树，你要在 C++ 中执行 JS 代码怎么办，最简单的就是翻译成通用的 AST 语法树，因为本身是 JSON 数据，大部分语言都支持
* 还有一个重要功能就是**代码转译**，比如 babel 做的就是这样一件事，通过指定我们的目标浏览器范围，babel 就可以把最新的一些代码，翻译成浏览器可以识别的低版本代码，让我们保证开发效率的同时，又可以保证支持目标浏览器