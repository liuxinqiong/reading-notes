Webpack 的目的
* JavaScript 打包工具，最大的作用是帮助我们把 JS 文件里的 import 和 require 把多文件打包成一个单一的 JS 文件。因此 Webpack 往往由一个文件作为入口，这个文件可能会 import 一些东西，变成一个单个的大的文件，这样比较符合我们在 Web 上的性能和发布
* Babel：把新版本的 JS 文件翻译成老版本 JS 文件的一种工具，通过 loader 的方式去使用
* Webpack 允许我们使用 loader 去定制各种各样的文件，从而扩充它自身的能力，并不仅仅只是 JS 文件

> npm 不太推荐使用 -g 的方式安装到全局，而是通过 npx 的方式