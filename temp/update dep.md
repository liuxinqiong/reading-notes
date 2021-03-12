## npm
平时常用的 npm CLI 命令，就那么几个，一些非常实用的工具，反而被自己忽略了。今天查阅了一些 npm 提供的所有命名。

下面是一些对于工作中可能能提供帮助的命令，其他一个包开发者才会用到的就不列举在这里了

npm 实用命令
```shell
# config
npm config edit
npm config list
# dedupe 搜索本地依赖树，试图通过将依赖项向上移动来简化整体结构，从而可以更有效的被多个包共享
npm dedupe
# 安全审查与修复：检查是否有已知的风险，如果有任何风险被检测到，将计算影响和适当的补救措施。如果使用了 fix 参数，则
npm audit
npm audit fix
# 树结构展示本地安装的包的版本，在解决版本冲突时很好用
npm ls <pkg>
# 检测过期包
npm outdated
# 将某个包版本标记为过期，包管理这才会用到，列举的目的就是别和 outdated 冲突
npm deprecate
# 直接在浏览器中访问包
npm repo <pkg>
# 查看 node_modules 地址
npm root -g
# 移除没有直接联系的包，在 node_modules 中存在，但没有在 package 依赖性列举出的
npm prune
# 方便内部包开发迭代，而不需要频繁地编译
npm link
# 使用本地或远程包运行一个运行
npx
```

### npm dedupe
有时候你通过 `npm ls` 会看到如下的依赖树
```shell
a
+-- b <-- depends on c@1.0.x
+-- c@1.0.3
`-- d <-- depends on c@1.x
    `-- c@1.9.9
```

在安装过程中，对于 b 而言的依赖 `c@1.0.3` 被放置在树的顶层，虽然 `c@1.0.3` 于此同时已经满足 d 包的要求，更新 `c@1.9.9` 依赖会被使用，因此 npm 默认会选择更新的，即使这样会导致重复。

这时候运行 `npm dedupe` 命令，将会使 npm 意识到重复以及重新评估，删除嵌套的 c 模块，因为 root 级别的 c 已经可以满足了。

如果你希望安装时，不是喜欢更新，而是删除重复，使用 `npm install --perfer-dedupe` 或者设置如下
```shell
npm config set prefer-dedupe true
```

### npm link
关于 npm link 具体工作原理分为两步
* 创建全局链接：在一个 package 目录中执行 `npm link` 将会在全局目录 `{prefix}/lib/node_modules/<package>` 创建一个符号链接，链接到刚执行 npm link 的软件包，同时会链接 `{prefix}/bin/{name}` 下的所有 bin。prefix 参数使用全局的 prefix 值（通过 `npm prefix -g` 可看到）
* 将全局目标连接到项目中：在项目中，执行 npm link package-name 将会创建一个从全局安装下的 package 到当前目录的 node_modules 下的链接

npm 使用 demo
```shell
cd ~/projects/node-redis    # go into the package directory
npm link                    # creates global link
cd ~/projects/node-bloggy   # go into some other package directory.
npm link redis              # link-install the package
```

## eslint 报错
更新后，eslint 新增了很多错误，这里大致做一下总结。

错误信息提示：`Shorthand method signature is forbidden. Use a function property instead.`，具体规则为 `method-signature-style`，提供了 `property` 和 `method` 两个选项，默认 `property`，没啥特殊目的，就是为了统一风格。
```ts
// method shorthand syntax
interface T1 {
  func(arg: string): number;
}

// regular property with function type
interface T2 {
  func: (arg: string) => number;
}
```

错误信息提示：`All imports in the declaration are only used as types. Use import type.`，在 TypeScript 3.8 中提供了 import type 和 export type 语法，专门用于导入导出类型。目的为了协助 TypeScript 编译器清除掉运行时不需要的类型信息，

错误信息提示：`A record is preferred over an index signature.`，这条规则其实很有用，对于对于初级 TypeScript 开发者而言，当他想声明一个键值对象时，往往可能会如下做
```ts
interface {
  [key: string]: string
}
```

这条规则直接限制为必须使用 Record，在我看来确实优雅很多，使用如下
```ts
type a = Record<string, string>
```

下面三条都属于 `ban-types`，主要是考虑到如下观点
* 有些内置类型有别名
* 有些类型是危险

默认配置了如下最佳实践
* 对于原始类型，你应该使用小写，而不是大写，比如应该使用 `number`，而不是 `Number`
* 避免使用 `Function` 类型，因为它提供的安全性是有限的
  * 对于参数类型没有显示
  * 它可以接受类声明，但这会导致错误，因为没有使用 `new` 的方式进行调用
* 避免使用 `Object` 和 `{}`，因为它意味着任何非空值（除 null、undefined 之外）
  * 会对开发者造成困惑，认为是任何对象类型
  * `{}` 不是意味着任何空对象，而是任何非空值，它的表现类似于空的 interface，因为同时也有 no-empty-interface 的规则
  * TS 没有表示空对象的类型，你可以使用一个类似的 `Record<string, never>`
  * 当你想表示任何对象时，可以使用 `Record<string, unknown>`，当你想表示任何值时，可以使用 `unknown`
* 避免使用 object 类型，因为它很难断言键是否存在
  * 推荐使用 `Record<string, unknown>`

以下是相关在项目升级中碰到的问题
* 错误信息提示：`Don't use Function as a type. The Function type accepts any function-like value.`，至于这一条错误信息，没啥好说的，站好挨就打好了，当初写代码图方便，就直接 Function 了事了，但这种方式提供的类型限制是不够的。
* 错误信息提示：`Don't use Object as a type. The Object type actually means "any non-nullish value", so it is marginally better than unknown.`
* 错误信息提示：`Don't use object as a type. The object type is currently hard to use ([see this issue](https://github.com/microsoft/TypeScript/issues/21732)).Consider using Record<string, unknown> instead, as it allows you to more easily inspect and use the keys.`

报错信息：`Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.`，解决方案就是把报错的文件加入到 tsconfig.include 下，但觉得有点其他，因为其他平级的类似文件却没有报错！

> 关于 eslint 规则，团队成员直接将 rule 禁用掉的方式来修复掉错误，真的让人很无语。

## antd
本次 antd 升级还算稳定。在项目中简单测试发现有个小功能表现异常，排除了不是新版 React 导致的问题后，锁定了是 antd 新版引入的 bug。

问题表现为：antd 新版有个小问题，modal 搭配 tooltip 使用，tooltip 存在不消失的情形。暂时给 antd 提交了一个 issue。

## three
本次升级从 r114 -> r126 版本，可能需要关心的 feature 或 fix 有
* 移除了 Scene.dispose() 方法：https://github.com/mrdoob/three.js/pull/19972
* 支持 Texture.dispose() 方法
* 添加 Object3D.clear() 方法
* 添加 InstancedMesh.dispose() 方法
* 废弃了 Geometry 类，改为使用 BufferGeometry：https://discourse.threejs.org/t/facevertexuvs-for-buffergeometry/23040
* 把 TypeScript 交由 @type 管理

three 有详细的[升级指导](https://github.com/mrdoob/three.js/wiki/Migration-Guide)

## 历史问题
总结下几个问题
* 以下依赖可以删除：当初是因为 react-scripts 存在 bug 而导致的，更新后该问题得到了解决
  * @babel/core
  * eslint-plugin-import
* 你可能会忘记更新但又比较重要的依赖
  * prettier：最新版（2.2.1）的默认项有差别，最典型的就是参数括号问题
  * stylelint：最新版（13.12.0）的也有所差别，比如新版会格式化掉多余的空行
* 其他工作
  * antd/lib => antd/es
  * 分清 devDependency 与 dependency
  * 关于 antd 某些特殊类型的导入

## 其他
热重载好像变得高级了，而且我没有注册 hot。先不研究了，哈哈哈……