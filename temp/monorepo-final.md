## multi-repo 的困境
在最开始，我们还是聊聊 multi-repo 的优势
* 代码物理隔离，各个团队管理好自己的 repo 即可，仓库体积小，模块划分清晰
* 独立部署，提高单个服务的构建速度（相对传统的 single-repo 方案）

使用 multi-repo 模式，时间一长，最先摆在我们面前的问题就是，多项目之间如何共享代码，常用方式有
* Git Submodule
* Git Subtree
* NPM

> 这几种方式，都有各自的问题，比如 NPM 侧重于包的依赖管理，但没办法双向同步，更适用于子项目比较稳定的情形。Git Submodule 和 Git Subtree 都是官方支持的功能，但不具有依赖管理的功能

共享代码只是一个导火索，multi-repo 还带来了更多深层次的问题（其实很多问题在我们团队已经暴露出来，而且变得很尖锐）
* 代码分散在不同的 repo 中，容易导致大量重复的内容，且团队间不容易迭代同步
  * dependencies 依赖被大量重复安装（忘记被 node_modules 支配的恐惧了吗）
  * configuration
    * environments
    * build configurations
    * test configuration
    * eslint
    * prettier
    * pull request templates
    * CI/CD
* 公共模块不敢轻易迭代
  * 现象：A、B 都依赖 C，某个 B 开发者更新的 C 的代码，B + C 是可以正常工作，但 A + C 可能工作异常了
  * 解决办法：理论上需要检查一遍所有可能影响到的模块，检查方式是跑单元测试、编译，但分属不同仓库的时候，这个事情做起来就比较麻烦（我们团队很好的将这个矛盾转移给了 QA 团队）
* 代码复用很麻烦
  * 如果 A 的里面一部分代码需要给 B 使用，那么就需要把这部分代码拆分出来，新建一个​ C ​的仓库，然后再往​ npm​ 发布一个版本（或 submodules）
  * 操作步骤比较繁琐，而且很多时候并不需要发布 npm 版本，因为可能是临时的
* 三方依赖版本可能不一致（同一个团队，我们还是尽量希望一致的）

## monorepo
于是乎，社区针对这些问题，就想出了一个 monorepo 的解决方案。简单来说，monorepo 就是 all in one 的意思。

monorepo 的优势
* 单个配置共享：项目相关的配置，比如 lint、test、build、environments、tsconfig 等（**工程统一标准化**）
* 统一的地方处理 issue、merge request
* 代码重构便捷：毕竟都在同一个 repo 里，解决了公共模块不敢轻易迭代的问题
* 代码复用便捷
  * 如果有些代码需要复用，直接新增一个平级的 shared 目录，把代码迁移过去，然后修改 a、b、c 相关的逻辑，直接依赖 shared 这个模块
  * 愿景：packages 下面的模块越来越多，功能越来越独立。业务就是组合这些模块搭建起来
* 公共三方依赖版本保持一致（共同依赖可以提取至 root，版本控制更加容易，依赖管理会变的方便）

当然了，有优势就有劣势
* 单个 repo 的体积变得很大
* 权限管理的粒度会比较大
* CI 测试运行时间也会变长

## 方案选择
社区常用的方案有两种
* yarn workspace
* lerna

这里我们直接使用 lerna，它的作用是什么？帮助我们解决了什么问题？

### just monorepo
在讨论 lerna 之前，我们先假设我们不使用 lerna，我们会碰到哪些问题，主要从如下几个方面
* 安装依赖
  * 在 package.json 中加上 workspaces 字段表明多包目录，通常为 packages。
  * yarn 会尽量把依赖拍平装在根目录下，存在版本不同情况的时候会把使用最多的版本安装在根目录下，其它的就装在各自目录里。
  * 新问题：比如多个 package 都依赖了 React，但是它们版本并不都相同。此时 node_modules 里可能就会存在这种情况：根目录下存在这个 React 的一个版本，包的目录中又存在另一个依赖的版本。**依赖拍平的解决方案带来了不同版本依赖冲突的问题**
  * 因为 node 寻找包的时候都是从最近目录开始寻找的，此时在开发的过程中可能就会出现多个 React 实例的问题。遇到这种情况的时候，我们就得用 resolutions 去解决问题。**resolutions 用于指定使用哪个版本**。
  * 出现多个版本的问题，通常是因为安装依赖的依赖造成的多版本问题。这种依赖的依赖术语称之为「**幽灵依赖**」。
* link
  * yarn 在安装依赖的时候会帮助我们将各个 package 软链到根目录中，这样每个 package 就能找到另外的 package 以及依赖了。
  * 新问题：因为各个 package 都能访问到拍平在根目录中的依赖了，因此此时其实我们无需在 package.json 中声明 dependencies 就能使用别人的依赖了。这种情况很可能会造成我们最终忘了加上 dependencies，一旦部署上线项目就运行不起来了。
* 构建
  * 因为所有包都存在一个仓库中了，如果每次执行 CI 的时候把所有包都构建一遍，我们需要使用增量构建
  * 存在包于包之间有依赖的场景时，需要寻找出各个包之间的依赖关系，然后根据这个关系去构建。比如说 A 包依赖了 D 包，当我们在构建 A 包之前得先去构建 D 包才成
  * 如果我们用上 lerna 的话，内置的一些命令就可以基本帮助我们解决问题了
    * lerna changed 寻找代码有变动的包，接下来我们就可以自己去进行增量构建了。
    * 通过 lerna 执行命令，本身就会去进行拓扑排序，所以包之间存在依赖时的构建问题也就被解决了。
* 单测 - 增量单测
* 部署
  * 如何部署单个 package - 找到改过代码的包
  * 单个 package 部署时有依赖关系如何解决 - 拓扑排序
  * package 部署时版本如何自动计算

## lerna 实践
创建 lerna 项目
```shell
git init lerna-repo && cd lerna-repo
lerna init
```

更多命令
* 依赖安装
  * 根应用安装
  * 所有应用安装
  * 具体应用安装
* 执行命令
  * 执行某个项目的某个命令
  * 执行所有项目的某个命令
* 清理依赖
  * lerna clean

TODO
1. 合并 Eslint，Typescript 与 Babel 配置
2. 统一命令脚本 scripty
  * 允许您将脚本命令定义在文件中，并在 package.json 文件中直接通过文件名来引用
  * 子项目间复用脚本命令；
  * 像写代码一样编写脚本命令，无论它有多复杂，而在调用时，像调用函数一样调用；
3. Lerna
  * 如果我们需要在多个子目录执行相同的命令，我们需要手动进入各个目录，并执行命令；
  * 当一个子项目更新后，我们只能手动追踪依赖该项目的其他子项目，并升级其版本。
  * npmClient workspaces？？？、version 属性指定为一个关键字 independent

Lerna 命令
* lerna bootstrap：等同于 lerna link + yarn install，用于创建符合链接并安装依赖包；
* lerna run：在所有子项目中执行 npm script 脚本，并且，它会非常智能的识别依赖关系，并从根依赖开始执行命令；
* lerna exec：像 lerna run 一样，会按照依赖顺序执行命令，不同的是，它可以执行任何命令，例如 shell 脚本；
* lerna publish：发布代码有变动的 package，因此首先您需要在使用 Lerna 前使用 git commit 命令提交代码，好让 Lerna 有一个 baseline；
* lerna create package_name：新增 packages
* lerna add：将本地或远程的包作为依赖添加至当前的 monorepo 仓库中，该命令让 Lerna 可以识别并追踪包之间的依赖关系，因此非常重要；
* lerna import
  * 用来将我们已有的包导入到 monorepo 仓库，并且还会保留该仓库的所有 commit 信息。该命令仅支持导入本地项目，并且不支持导入项目的分支和标签
  * 如果我们想要导入远程仓库，可以尝试使用 tomono，其内容是一个 shell 脚本。
* 灵活的参数
  * --concurrency <number>：参数可以使 Lerna 利用计算机上的多个核心，并发运行，从而提升构建速度；
  * --scope '@mono/{pkg1,pkg2}'：--scope 参数可以指定 Lerna 命令的运行环境，通过使用该参数，Lerna 将不再是一把梭的在所有仓库中执行命令，而是可以精准地在我们所指定的仓库中执行命令，并且还支持示例中的模版语法；
  * --stream：该参数可使我们查看 Lerna 运行时的命令执行信息；

默认情况下，lerna bootstrap 如同在每个 package 下执行 npm install，会导致各个 package 中安装很多重复的部分，lerna 提供了一个 --hoist 参数将子项目的依赖包提升到最顶层的方式，但这种方式会有一个问题，**不同的版本号只会保留使用最多的版本**，当项目中有些功能需要依赖老版本时，就会出现问题

我们有一种更有呀的方法，就是 lerna 搭配 yarn workspaces 的方式，yarn workspaces 会检查每个子项目里面依赖及其版本，只有依赖版本一致时才会提升到顶层。通过在 lerna.json 下添加如下字段告诉 lerna，这里有多个空间
```json
"npmClient": "npm",
"useWorkspaces": true
```

如果仅仅是修改 lerna.json，你会得到一个报错，表示你需要在 root package.json 下添加 workspaces 字段，我们添加如下
```json
"workspaces": [
    "packages/*"
],
```

这时你使用 lerna bootstrap 安装依赖，发现 package 下的 package.json 声明的依赖根本没有被安装。这是以为 npm7 以下的版本不支持 workspaces 语法，我们将 npmClient 修改为 yarn 试试。这样就符合预期了，相同的依赖会被提取到 root node_modules，自身的依赖在自己的 node_modules

## 踩过的坑
之前通过 submodule 管理的代码，最终会被放置在主项目的 src 目录下，这样就可以沿用主项目的 webpack 打包和 tsc 的编译能力。通过 monorepo 的方式进行管理后，由于自身没有 package 管理机制，会导致很多问题。如果想通过纯文件的方式进行引用，可以通过如下方式进行修改
* 禁用 ModuleScopePlugin，将 webpack 的工作范围不在只是 src 目录
* 扩展 typescript 的 paths 字段，进行别名扩展
* 扩展 typescript 的 include 字段
* 修改 webpack 配置，将对应的纯文件目录加入 babelInclude 列表
* 修改 webpack 配置，增加对应纯文件目录的 alias 配置

更多配置提取至 Root
* 提取 eslint、prettier、stylelint、editorconfig
* 提取 script、common deps、environments config
* 提取 .gitattributes、.gitignore
* react-app-rewired 要求 config-overrides.js 在根目录下，但我们依旧可以提取公共部分到 Root 下，然后具体 package 引用 Root 文件即可

## 更多工具
更多可选的优秀工具
* Volta：JavaScript 工具管理器，它可以让我们轻松地在项目中锁定 node，npm 和 yarn 的版本。
* Verdaccio：npm 包本地发布
* commitlint：检查提交的 commit 信息，它强制约束我们的 commit 信息必须在开头附加指定类型，用于标示本次提交的大致意图，支持的类型关键字有 feat、chore、fix、refactor、style

## 资料
* [https://mp.weixin.qq.com/s/mV6gvPy-N3NZPEYONV4A0A](https://mp.weixin.qq.com/s/mV6gvPy-N3NZPEYONV4A0A)

## frontend_prime
存在的一些问题
* 纯文件 packages 之间相互引用，ide 中会提示报错
  * 解决办法：在 tsconfig.json 的 paths 下依次添加别名可以解决
* 某些文件首行 eslint 报错："parserOptions.project" has been set for @typescript-eslint/parser.The file does not match your project config.The file must be included in at least one of the projects provided.
  * 出现的原因如下
    1. 你使用的 rule 要求有类型信息，但是并没有声明一个 parserOptions.project
    2. 你声明了 parserOptions.project，但你 linting 的文件并不包含在 project 中，比如一些常见的 xxx.config.js
  * 解决办法：通过 .eslintignore 中忽略报错文件
* TypeScript 设置别名导致顶级别名下，必须写完 index，否则提示找不到
  * 这是由于 paths 的语法导致的，因为别名使用的是 `@config/*` 导致匹配不到 `@config`
  * 但这个好坑，真要解决的话，好像只能写两个，也就是再写一个 `@config` 专门用于匹配它

还有可能存在的一些问题
* 更改公共 package，主仓库会自动重新编译吗
* lerna run script 控制台看不到启动状态了

https://juejin.cn/post/6844904116477493256

https://github.com/lerna/lerna

lerna：版本控制，包发布
* 为什么要开启 useWorkspaces 呢，不开启会有啥区别吗

workspaces：依赖管理
* package.json 中设置 workspaces
* 为什么需要 workspaces
  * 工作空间可以相互依赖，总是使用最新的可用代码
  * 比 link 机制更好，因为它只影响你的工作空间，而不是整个系统



## 渐进式尝试
workspaces 的作用
* 对比未开启 workspaces 的情况
  * 只会识别根目录的 package.json 进行依赖安装，如果某些子目录也有 package.json 指定依赖，则需要手动进入特定文件夹并执行 install
  * 由于均是手动进行安装，更不存在依赖提升复用的优化了
* 开启 workspaces 的情况
  * 注意：npm 需要 7 的版本才支持 workspaces 字段，如果不是请升级或使用 yarn 进行测试
  * 设置 workspaces 字段时，需要指定 private 为 true
  * 在根目录中使用 install 给所有包统一安装依赖
  * 对于相同的重复依赖，会进行以来提升，减少重复下载。具体逻辑这里不赘述
* 有 lerna 的话还需要 workspaces 吗？为啥还提供 useWorkspaces 字段呢
  * bootstrap 默认会便利所有的 packages 进行依赖安装，提供 --hoist 同样支持依赖提升

回答上一个问题时，先来了解下 lerna 具体解决了什么问题
* 缘由：将大的代码库拆分成独立的版本包对于代码共享十分有用。如果拆分成多个代码库的话，是一件混乱且难以追踪的事情。Lerna 就是这样一个优化 monorepo 管理方式的工具。支持 hoist 参数进行重复依赖优化。
* 最常用的两个命令：bootstrap 和 publish
  * bootstrap：本地包做 link 以及安装剩余包
  * publish：帮助发布有更新的包
* 其他命令
  * updated：检查哪些包有更新
  * import：从外部导入一个已存在的包，包括 git 历史
  * clean：移除所有 packages 的 node_modules
  * diff：和上一次版本做比较
  * init：初始化一个 lerna repo
* 版本管理模式：fixed or independent
  * fixed：任何包中的重大更改都会导致所有包都有一个新的主版本。
  * independent：每个 package 的版本都是独立的
* 最佳实践
  * packages/* 的 package 都是叶子节点被认为是最佳实践，虽然不是强制
  * 大部分 devDependencies 依赖可以被提升到 root 级别


yarn workspace <workspace_name> run/add/remove

Lerna 介绍
* Lerna 是 babel 维护自己的 monorepo，并开源出的一个项目
* 使用 Lerna 发布，使用 yarn workspaces 管理包的依赖

若开启了 workspace 功能，则 lerna 会将 package.json 中 workspaces 中所设置的项目路径作为 lerna packages 的路径，而不会使用 lerna.json 中的 packages 值。

https://github.com/lerna/lerna/tree/main/commands/publish#readme
https://github.com/lerna/lerna/blob/main/doc/hoist.md

the difference between lerna use workspace or not