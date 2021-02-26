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

npm link 步骤
```shell
# 在 b 包里
npm link # 相当于 npm install b -g
# 在 a 包里
npm link b # 代码无须修改，package.json 中引用 b 的包会自动指向本地 b 的打包文件
```

> 使用 npm link 的方式，所有的小调整都不需要发包就可以验证正确性，尤其是对于不能确定正确的测试性改动，更加具有优越性

package.json 与 package-lock.json
* package.json 用于标注项目中对各个 npm 包的依赖
* package-lock.json 用于记录当前状态下实际安装的各个 npm package 的具体来源和版本号

package-lock 出现的原因：通常 package.json 使用的是 ^ 版本控制符，^ 指的是向后兼容，这就导致 npm i 的时候，装得库的版本和之前装得并不一样（有可能版本号会更新一些），而这个时候若是 npm 包开发者没有遵守——”相同的大版本号的包，接口保持兼容“，就会出现兼容性问题。为了解决这个问题，所以才有了 package-lock.json。

如果改了 package.json，且 package.json 和 lock 文件不同，那么执行 npm i 时 npm 会根据 package 中的版本号以及语义含义去下载最新的包，并更新至 lock。如果两者是同一状态，那么执行 npm i 会根据 lock 下载，不会理会 package 实际包的版本是否有新。