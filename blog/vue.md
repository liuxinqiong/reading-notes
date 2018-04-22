前端价值
1. 搭建前端工程
  * 已经不是所见即所得了（ES6，sass）
2. 网络优化
  * HTTP知识
3. API定制
4. nodejs层npm

webpack-dev-server

cross-env
* mac上设置环境变量，直接NODE_ENV=production
* windows上设置环境变量，需要set NODE_ENV=production
* 帮助我们忽略平台的不同，统一如下：cross-env NODE_ENV=production

webpack.DefinePlugin很重要
* 方便自己代码进行环境判断
* 第三方库，比如vue和react，会根据不同环境进行区分打包

开启热更新
* 设置 hot 为 true
* 加入 HotModuleReplacementPlugin 和 NoEmitOnErrorsPlugin 插件

config.devtool
* 帮助我们在浏览器中调试
* 原理使用sourceMap映射
* config.devtool = '#cheap-module-eval-source-map'

vue2
* 数据绑定 MVVM模式
* vue单文件开发方式
  * 对jsx支持不好，自创vue方式
* render 方法
  * vue2采用虚拟dom
  * 数据变动，自动调用render
  * 会逐层遍历template结构，渲染数据

API重点
* 生命周期方法
* computed
  * 有变动自动调用
  * 缓存功能
  * 不用调用，直接写函数名即可

vue使用jsx与使用vue文件
* jsx操作能力更强，因为你可以使用js的所有能力，而不是通过v-if等指令，vue2开始支持
* vue结构更清晰，使用更方便

webpack优化
* 安装extract-text-webpack-plugin
* 非javascipt资源打包成单独的文件
  * 做浏览器缓存
  * 还是希望通过head头部加载style资源

  区分打包类库代码
  * 类库代码比较稳定，业务经常迭代，优化浏览器缓存