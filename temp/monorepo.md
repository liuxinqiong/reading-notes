



lerna 基本命令
```shell
lerna init # 在项目根目录下执行该命令，初始化一个 lerna 项目，会创建 package.json、lerna.json、packages 文件夹
lerna bootstrap # lerna 为每个 package，npm install 所有的外部依赖，为内部互相依赖的 package 建立 symlink，对所有的 package 执行 npm prepublish
```

兄弟模块之间通过模块 package.json 定义的 name 相互引用，保证模块之间的独立性，但又不需要真正发布或安装这个模块，通过 tsconfig.json 的 paths 与 webpack 的 alias 共同实现虚拟模块路径的效果。

yarn workspace VS lerna：lerna 默认情况下重复安装的依赖包太多，会导致依赖爆炸的问题

https://classic.yarnpkg.com/en/docs/workspaces/

Monorepo 集成方案
* nx：https://nx.dev/latest/react/getting-started/intro
* rushstack：https://rushstack.io/


[你知道 monorepo 居然有那么多坑么？](https://blog.csdn.net/qiwoo_weekly/article/details/115713366)