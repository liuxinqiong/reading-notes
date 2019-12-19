## 环境选型
React 全家桶
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [React-Redux](https://github.com/reduxjs/react-redux)
* [Redux-Saga](https://github.com/redux-saga/redux-saga)
* [React-Route-Dom](https://reacttraining.com/react-router/web/guides/quick-start)

常用周边生态
* 组件库：[Ant Design](https://ant.design/index-cn)
* 请求库：[axios](https://github.com/axios/axios)
* 国际化：[react-intl](https://github.com/formatjs/react-intl)
* 页面 title、meta 动态修改：[react-helmet](https://github.com/nfl/react-helmet)
* immutable 选型：[immer](https://immerjs.github.io/immer/docs/introduction)
* 热更新：[react-hot-loader](https://github.com/gaearon/react-hot-loader)

单元测试
* [Jest](https://jestjs.io/)
* [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro)
* [jsdom](https://github.com/jsdom/jsdom)

CSS 相关
* 预处理器：[less](http://lesscss.org/)
* 后处理器：[PostCSS](https://www.postcss.com.cn/)

lint 相关
* 统一代码风格：[prettier](https://prettier.io/)
* 代码校验：[eslint](https://eslint.org/)
* 样式校验：[stylelint](https://stylelint.io/)

### 关于 Ant Design
Ant Design 组件已开启按需加载，如果对于资源加载要求严格，有如下可优化点
* 优化组件内置图标：仅加载项目中用到的
* moment 仅加载用到的语言包
* moment 使用 day.js 代替

### 单元测试
单元测试文件
* `__tests__` folders
* `.test.js` suffix
* `.spec.js` suffix

推荐将测试文件或 `__tests__` 文件夹和源文件放置在同一个目录

如需要修改相关 Jest 配置
* `src/setupTests.js` 初始化测试环境
* `package.json` 通过设置 `jest` 可覆盖 Jest config

单元测试分类及要求
* 单元测试
  * 通用组件
  * 工具类函数
  * 业务逻辑
  * 业务组件
* e2e 测试

优先级：通用组件、工具类函数 > 业务逻辑 > 业务组件 > 业务组件、e2e 测试

### 关于 CSS
对 CSS 做了什么？
* 使用 less 预处理器
* CSS Reset：使用 `normalize.css` 抹平不同浏览器默认样式的差异
* 在 React 中，尽情把 CSS 当做 JS 使用吧，因此推荐遵循骆驼命名
* 除了 global.less，其他 less 文件会遵循 CSS Modules，因此你无需担心 CSS 名称冲突，开发中尽量短和通用，同时减少不必要的嵌套
* 生产环境 PostCSS 会通过 `Autoprefixer` 自动为你添加浏览器前缀，因此无需手动编写

关于覆盖组件样式：使用 `:global` 关键字，但是要注意使用嵌套限制其作用范围

### 国际化
国际化不仅自身业务需要注意，组件库自身也需要注意
* 业务自身
* Ant Design
* moment

项目中针对 Ant Design 组件和 moment 已处理，开发只需要关心业务自身！

### 图标、图表
图标使用 IconFont 进行管理，采用 SVG 符号方式引用。现代浏览器未来主流的图标引入方式。支持多色图标，不再受到单色图标的限制

主流图表选择：[echarts](https://www.echartsjs.com/zh/index.html)

### 路由类型
不同于 Vue 和 Angular 的配置式，React 采用的是组件声明式路由。更多内容请查看 doc。

### 多环境支持
环境变量
* NODE_ENV
* PUBLIC_URL
* REACT_APP_

> 使用 CRA 创建的项目，自定义环境变量必须使用 `REACT_APP_` 做为前缀，否则会被忽视，目前已使用 `REACT_APP_STAGE` 来作为不同环境的标识符

### 绝对路径
使用 `@` 风格

### 提效工具
优秀的协助开发工具
* VS Code 扩展
  * Prettier - Code formatter
  * ESLint
  * stylelint
  * Jest
* Chrome 扩展
  * React Developer Tools
  * Redux DevTools

## 性能相关
关于提升项目性能的研究
* 始终使用唯一属性作为 key，如果数据不支持，可以考虑使用 shortid 模块
* immer
* reselect（可选项：有需要在开启）
* memoize-one（可选项：有需要在开启）
* prepack

### 懒加载
React 提供 API 支持懒加载
* React.lazy() 实现懒加载，
* React.Suspense 在懒加载完成之前显示其他组件

## 开发规范

### 代码质量
为保证代码质量和统一团队风格，开启代码校验，具体如下
* prettier 统一代码风格
* eslint、stylelint 保证代码质量

> 已开启 pre-commit 进行代码强制校验和格式化，如果不满足规范，commit 会失败，部分错误可以通过 `npm run lint:fix` 自动修正，其他请查看原因耐心修改

关于 lint 规则的修改：团队一起讨论，是否有开启该 lint 的必要性。

### 编程规约
命名风格
* 【强制】类名使用 UpperCamelCase 风格
* 【强制】方法名、参数名、成员变量、局部变量都统一使用 lowerCamelCase 风格
* 【强制】常量命名全部大写，单词间用下划线隔开
* 【强制】不要使用奇怪的单词缩写 browser -> brsr
* 【强制】避免抽象的、通用的命名方式
  * obj/data/value/item/elem
  * 根据变量类型命名：str/num，本质提供不了有价值的含义
  * 如果找不到更多的名字呢？追加一个数字，比如 item1、item2，注意这不可取哈
* 【强制】避免智能同义词，比如
  * displayXXX、showXXX、renderXXX、paintXXX：选 showXXX
  * getXXX、findXXX：选 getXXX
* 【参考】枚举类名建议带上 Enum 后缀，枚举成员名称需要全大写，单词间用下划线隔开。

【参考】函数命名
* 获取单个对象的方法用 get 做前缀。
* 获取多个对象的方法用 list 做前缀，复数形式结尾如：listObjects。
* 获取统计值的方法用 count 做前缀。
* 插入的方法用 save/insert 做前缀。
* 删除的方法用 remove/delete 做前缀。
* 修改的方法用 update 做前缀。

类型定义，对于前端而言，待讨论
* 【参考】接口获取的数据，可以使用 DO 后缀，比如 ProjectDO
* 【参考】前端可能会对数据进行修改，以更加适应前端开发，可以考虑使用 VO 为后缀，比如 ProjectVO

代码格式
* 【推荐】单个方法总函数不超过 80 行：代码逻辑分清红花和绿叶，个性和共性，绿叶逻辑单独出来成为额外方法，使主干代码更加清晰；共性逻辑抽取成为共性方法，便于复用和维护。
* 【推荐】不同逻辑、不同语义、不同业务的代码之间插入一个空行分隔开来以提升可读性。说明：任何情形，没有必要插入多个空行进行隔开。

OOP 规约
* 【强制】构造方法里面禁止加入任何业务逻辑，如果有初始化逻辑，请放在 init 方法中
* 【推荐】类内方法定义的顺序依次是：公有方法或保护方法 > 私有方法 > getter/setter 方法
* 【推荐】类成员与方法访问控制从严，比如，对于仅内部使用的函数，请加上 private

> 如果是一个 private 的方法，想删除就删除，可是一个 public 的 service 成员方法或成员变量，删除一下，不得手心冒点汗吗？

控制语句
* 【推荐】不要在条件判断中执行其它复杂的语句，将复杂逻辑判断的结果赋值给一个有意义的布尔变量名，以提高可读性。
* 【推荐】表达异常的分支时，少用 if-else 方式，如果非得使用，避免后续代码维护困难，请勿超过 3 层。超过 3 层的 if-else 的逻辑判断代码可以使用卫语句、策略模式、状态模式等来实现

注释规约
* 【强制】所有的枚举类型字段必须要有注释，说明每个数据项的用途。
* 【参考】谨慎注释掉代码。在上方详细说明，而不是简单地注释掉。如果无用，则删除。
* 【参考】特殊注释标记，请注明标记人与标记时间。比如 TODO。

【推荐】编写单元测试代码遵守 BCDE 原则，以保证被测试模块的交付质量。
* B：Border，边界值测试，包括循环边界、特殊取值、特殊时间点、数据顺序等。
* C：Correct，正确的输入，并得到预期的结果。
* D：Design，与设计文档相结合，来编写单元测试。
* E：Error，强制错误信息输入（如：非法数据、异常流程、非业务允许输入等），并得到预期的结果

【参考】关于复杂组件
* UI 复杂：拆分组件
* 逻辑复杂，拆分多个类
  * 业务无关工具类
  * 业务功能细分类

> 组件的“逻辑”更多的应该是和 UI 相关的交互逻辑，而不是比较底层的逻辑，我们还是应该把相对稳定的逻辑抽出来放到更下一层。

其他
* 【强制】定义 TypeScript 类型，如无必要，请使用 interface，而不是 class
* 【强制】避免重用名字
  * 覆盖形参变量的值，会导致后来人不自己检查代码，根本不知道变量被修改过
  * 本地变量覆盖外部同名变量
* 【强制】避免副作用和非标准结果
  * isXXX/checkXXX/findXXX 等函数看起来不会改变任何东西，也就是无副作用函数，因此一定不要产生去改变某些东西
  * 比如 isXXX/checkXXX 表意应该是返回 boolean，因此不要返回其他等不标准结果
* 【推荐】不要使用一个常量类维护所有常量，要按常量功能进行归类，分开维护。

### 目录结构
基本目录结果
```shell
├── api                 # 接口请求
├── assets              # 静态资源
├── components          # 业务通用组件
├── constants           # 常量
├── environments        # 多环境
├── hooks               # 通用 hooks
├── layouts             # 常见布局组件
├── locales             # 国际化
├── models              # 接口、枚举声明
├── pages               # 路由页面入口，可考虑按领域进行归类
    ├── pageA
        ├── components  # 子组件
├── store               # 集中状态管理
    ├── modules         # 多模块管理
├── styles              # 样式文件
├── utils               # 存放工具函数
└── index.tsx           # 程序入口
```

### Redux 使用规范
尽可能少的把数据放到 redux store 中

### Three.js 开发规范
非常重要！见单独文章

## In Progress
多仓库公共代码问题
* node module
* git submodule
* git subtree

后续考虑
* Mock Data（在我司感觉应用场景不多）
* Micro Frontend
* 打点、错误监控的封装
* 构建产物发布到 CDN
* 研究静态资源持久化
* 性能监控

## 参考
* 编程规约部分参考《阿里 Java 开发手册》

## Special Part
权限相关
* 接口级别：未登录跳转登录，登录成功跳转回之前访问页
* 权限组件：Authorize | SecurityLayoutState
* 大概逻辑
  * 获取当前用户信息，显示 loading 态
  * 接口返回未登录，则跳转登录页
  * 已登录但没有权限，显示 403 组件
  * 有权限，正常显示
