前端价值
1. 搭建前端工程
  * 已经不是所见即所得了（ES6，sass）
2. 网络优化
  * HTTP 知识
3. API 定制
4. nodejs 层 npm

webpack-dev-server

cross-env
* mac 上设置环境变量，直接 NODE_ENV=production
* windows 上设置环境变量，需要 set NODE_ENV=production
* 帮助我们忽略平台的不同，统一如下：cross-env NODE_ENV=production

webpack.DefinePlugin 很重要
* 方便自己代码进行环境判断
* 第三方库，比如 vue 和 react，会根据不同环境进行区分打包

开启热更新
* 设置 hot 为 true
* 加入 HotModuleReplacementPlugin 和 NoEmitOnErrorsPlugin 插件

config.devtool
* 帮助我们在浏览器中调试
* 原理使用 sourceMap 映射
* config.devtool = '#cheap-module-eval-source-map'

vue2
* 数据绑定 MVVM 模式
* vue 单文件开发方式
  * 起初 jsx 支持不好，自创 vue 方式
* render 方法
  * vue2 采用虚拟 dom
  * 数据变动，自动调用 render
  * 会逐层遍历 template 结构，渲染数据

API 重点
* 生命周期方法
* computed
  * 有变动自动调用
  * 缓存功能
  * 不用调用，直接写函数名即可

vue 使用 jsx 与使用 vue 文件
* JSX 操作能力更强，因为你可以使用 JS 的所有能力，而不是通过 `v-if` 等指令，vue2 开始支持
* vue 结构更清晰，使用更方便

webpack 优化
* 安装 extract-text-webpack-plugin
* 非 Javascript 资源打包成单独的文件
  * 做浏览器缓存
  * 还是希望通过 head 头部加载 style 资源

区分打包类库代码
  * 类库代码比较稳定，业务经常迭代，优化浏览器缓存