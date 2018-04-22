文档 1.x：webpack.github.io/docs

最新文档：https://webpack.js.org/concepts/

前端技术更新真的是太快了，对于最近才接触webpack的我而言，学习webpack实在是有些不易，因为有可能我看到的是很老的webpack知识了。

摸索完一阵子后，我决定还是从头学习一下webpack。那就从webpack 1.x 开始吧。

webpack是什么
* JS模块打包工具，将很多模块打包成很小的静态文件
* 代码分隔允许在应用需要是加载文件
* 模块加载器，模块可以是CommonJs，AMD，ES6，CSS，Image，JSON，CoffeeScript，less，甚至自定义的文件等

目标
* 切分依赖树，按需加载
* 保证初始加载时间耗时少
* 每个静态资源都是一个文件
* 可以集成第三方库作为一个模块
* 可以定制几乎模块的每个部分
* 适合大型项目

为什么webpack不一样
* 代码分隔
* 加载器
* 插件系统
* 模块热更新

如何将css当初模块使用呢，这就是模块需要发挥作用了，我们需要两个loader
* css-loader：支持将css作为模块
* style-loader：将css内容插入到对应页面，使之生效


loader的使用方式
* 直接引用的时候处理，比如require的时候，import的时候，eg：css-loader!./style.css，注意感叹号很重要
* 每次引用写的时候太麻烦了，可以使用命令行工具，也顺便了解其他命令参数，参数可以写进npm脚本中
  * --module-loader 'css=style-loader!css-loader'
  * --watch 检测改动，自动编译
  * --progress 显示打包过程
  * --display-modules 显示引入的模块
  * --display-reasons 显示模块打包原因
  * -- colors 彩色
* 配置文件

配置文件详解
* 取名 webpack.config.js 
  * 默认从根目录读取此文件，否则通过--config参数进行自定义配置
* entry参数：入口文件，三种方式
  * 简单的字符串，默认chunk name为main
  * 数组：多个入口文件，默认chunk name为main
  * 对象：k-v，k表示chunk name，适合多页应用的情况
* output参数：打包后文件
  * path：执行输出目录
  * filename：多页应用，不能写死，或者会被后者覆盖，支持写目录，来进一步划分子目录
    * 使用占位符 [name],[hash],[chunkhash]
  * publicPath：设置上线地址，可以理解成一个占位符，设置就会使用他进行替换绝对地址

插件的使用方式，eg：自动生成html
* 插件：html-webpack-plugin
* plugins字段，是一个插件数组
* 使用示例
```js
new htmlWebpackPlugin({
    template:'index.html'，
})
```
* 为什么是指向当前的目录的index.html呢，上下文的概念，context字段，默认是当前配置文件脚本运行的目录
* 其他非必要字段
  * filename：也可以使用占位符，默认和模板名称保持一致
  * inject：指定插入的位置，比如head或body里
  * 其他字段，比如title，date，favicon等。
  * minify：实现压缩html，值是对象，可以配置压缩哪些内容，比如删除空格，删除注释等
* 在模板文件中使用，通过htmlWebpackPlugin引用
  * 比如<%= htmlWebpackPlugin.options.title>读取
  * 主要有两个属性：options和files
  * options 配置信息
  * files 文件信息，可以实现类似于，一部分js在head引入，一部分在body引入的功能，但是需要关闭自动inject，设置inject为false即可
* 实现多页
  * 我们直接plugins数组中创建多个htmlWebpackPlugin即可
  * 如果我们不想创建多个模板页面，如何支持一个模板生成多个页面呢
  * 使用chunks：指定页面加载哪些chunk
  * excludeChunks：指定排除哪些chunk
* 初始化代码不想通过加载js脚本的方式实现，而是直接inline到页面，减少http请求，这时候就需要关闭inject，然后在模板中使用模板写法过滤掉已经加载完成的初始化脚本啦
```js
<script>
    <%= compilation.assets[htmlWebpackPlugin.files.chunks.main.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source()%>
</script>
```

loader 常见使用场景
* 处理es6
* 处理css，less、sass
* 图片压缩，转base64（减少请求）
* loader配置文件参数有test、loader、loaders、include、exclude


loader处理es6
```js
module:{
    loaders:[
        {
            test:/\.js$/,
            loader:'babel-loader'
        }
    ]
}
```

安装babel-loader
```shell
npm install -save-dev babel-loader babel-core
```

使用babel-loader，通常我们还会有个`.babelrc`，指定babel的一些配置，比如
```js
{
    presets:['latest'] // 指定支持哪些语法，比如es2015 es2016 es2017，lastest囊括三者
}
```

我们也可以直接在webpack配置文件中，使用query指定参数
```js
{
    test:/\.js$/,
    loader:'babel-loader',
    query:{
        presets:['latest']
    }
}
```

我们还可以在package.json中增加babel参数指定
```js
"babel":{
    presets:['latest']
}
```

这个预设置配置，也是需要安装的，比如latest
```shell
npm install --save-dev babel-preset-latest
```

优化babel的速度
* babel转换语法是非常耗时的
* 通过exclude排除node_modules下的转换
* 注意路径比如是正则表达式，绝对路径，函数或绝对路径数组，绝对路径可以使用path
```js
var path = require('path');

exclude:path.resolve(__dirname,'node_modules/'),
include:path.resolve(__dirname,'src/'),
```

loader处理css
* 安装style-loader,css-loader
* postcss-loader 
  * 需要安装
  * 在css-loader处理之前，sass-loader后面，帮助我们后处理css的
  * 非常多的postcss-plugins
    * autoprefixer：添加兼容性前缀
  * module同级，添加postcss配置，配置下的插件依旧需要单独安装，比如autoprefixer
  * 这时直接@import其他css模板，语法支持，但postcss并没有进行处理，给css-loader添加importLoaders参数解决
* less-loader sass-loader
  * 不需要加importLoaders，自身处理了
* 实例
```js
module:{
    loaders:[
        {
            test:/\.css$/,
            loader:'style-loader!css-loader?importLoaders=1!postcss-loader'
        },
        {
            test:/\.less$/,
            loader:'style-loader!css-loader!postcss-loader!less-loader'
        },
        {
            test:/\.scss$/,
            loader:'style-loader!css-loader!postcss-loader!sass-loader'
        }
    ]
},
// module同级，添加postcss配置
postcss:function(){
    return [
        require('autoprefixer')({
            browsers:['last 5 versions']
        })
    ]
}
```

loader处理项目模板文件
* 由于现在有很多的模板处理器，关于处理模板的插件，webpack对应也收录了很多，比如ejs，handlebars，jsx，html等
* 对于一些热门的模板，比如jsx，已经集成在babel，因此不需要在额外添加loader
* 安装html-loader
* 实例
```js
{
    test:/\.html$/,
    loader:'html-loader'
}
```

loader处理图片和其他文件
* css引用图片，模板引用图片，最顶层html引用图片
* file-loader
* css引用图片，顶层html引用图片都会被替换，但是模板中会出现问题，怎么解决
  * 使用绝对路径，比如cdn
  * 使用webpack提供的require函数
* 指定名称，需要提供参数
* url-loader（依赖file-loader）
  * 处理图片或文件
  * 通过设置limit参数，如果文件大小大于limit，丢给file-loader处理，如果小于limit，图片和文件转成base64的编码
* image-loader
  * 安装 npm install --save-dev image-webpack-loader 
  * 和file或url loader搭配使用
  * 压缩图片
* 实例
```js
{
    test:/\.(png|jpg|gif|svg))$/i,
    loaders:[
        'url-loader?limit=20000&name=assets/[name]-[hash:5].[ext]',
        'image-webpack'
    ]
}
```
