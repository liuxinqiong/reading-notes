multi-repo 劣势
* 代码分散在不同的 repo 中，容易导致大量重复的内容，而且不易于同步迭代
  * Dev environments
  * Build configurations
  * Dependencies
  * Test configuration
  * Pull request templates
  * ESLint
  * Prettier
  * CI/CD
* 某个被多方依赖的 repo 更新容易导致问题
  * a、b 都依赖 c，某个 b 开发者更新的 c 的代码，b + c 是可以正常工作，但 a + c 可能工作异常了
  * 上述情况中，理论上需要检查一遍所有可能影响到的模块，检查方式是跑单元测试，但分属不同仓库的时候，这个事情做起来就比较麻烦
* 代码复用麻烦
  * 如果 a 的里面一部分代码需要给 b 使用，那么就需要把这部分代码拆分出来，新建一个​ c ​的仓库，然后再往​ npm​ 发布一个版本，大致存在如下问题
  * 操作步骤比较繁琐，而且很多时候并不需要发布 npm 版本，因为可能是临时的
* 三方依赖版本可能不一致

multi-repo 优势：独立部署，提高构建速度（好像 monorepo 也可以？）

> 虽然拆分子仓库、拆分子 NPM 包（For web）是进行项目隔离的天然方案，但当仓库内容出现关联时，没有任何一种调试方式比源码放在一起更高效。

monorepo 优势
* 单个配置共享：项目相关的配置，比如 lint、test、build、tsconfig 等
* 统一的地方处理 issue、merge request
* 跨项目的操作和修改变得容易
* 代码复用便捷，不同于之前 multi-repo 的方式
  * 如果有些代码需要复用，直接新增一个平级的 shared 目录，把代码迁移过去，然后修改 a、b、c 相关的逻辑，直接依赖 shared 这个模块
  * 愿景：packages 下面的模块越来越多，功能越来越独立。业务就是组合这些模块，搭建起来

monorepo 劣势
* repo 的体积变得很大
* 权限管理的粒度会比较大
* CI 测试运行时间也会变长

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