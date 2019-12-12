## 环境搭建
React 全家桶
* React
* Redux
* Redux-Saga
* React-Route-Dom

常用周边生态
* 组件库：Ant Design
* 请求库：axios
* 国际化：react-intl

其他实用工具
* 页面切换 loading 条：nprogress
* 页面 title、meta 动态修改：react-helmet

单元测试
* Jest
* enzyme
* mocha
* chai
* sinon：辅助库，简化单测编写

### 关于 Ant Design
Ant Design 组件已开启按需加载，如果对于资源加载要求严格，有如下优化点
* 优化组件内置图标：仅加载项目中用到的
* moment 仅加载用到的语言包
* moment 使用 day.js 代替

### 单元测试
单元测试文件
* `__tests__` folders
* `.test.js` suffix
* `.spec.js` suffix

推荐将测试文件或 `__tests__` 文件夹和源文件放置在同一个目录

单元测试分类及要求
* 单元测试
  * 通用组件
  * 工具类函数
  * 业务逻辑
  * 业务组件
* e2e 测试

优先级：通用组件、工具类函数 > 业务逻辑 > 业务组件 > 业务组件、e2e 测试

### 关于 CSS
我们对 CSS 做了什么
* CSS Reset：抹平不同浏览器默认样式的差异
* 使用 less 变量
* 在 React 中，尽情把 CSS 当做 JS 使用吧，因此推荐遵循骆驼命名
* 除了 global.less，其他 less 文件会遵循 CSS Modules，因此你无需担心 CSS 名称冲突，开发中尽量短和通用
* 生产环境 CSS 后置处理器会通过 `Autoprefixer` 自动为你添加浏览器前缀，因此无需手动编写

### 国际化
国际化不仅自身业务需要注意，组件库自身也需要注意，我们项目中目前需要考虑的点有
* 业务自身
* Ant Design
* moment

### 图标、图表
图标使用 IconFont 进行管理，采用 SVG 符号方式引用。现代浏览器未来主流的图标引入方式。支持多色图标，不再受到单色图标的限制

主流图表选择：echarts、antv

### 路由类型
声明式路由、配置式路由？路由自动按需加载？

### 功能扩展
功能扩展，比如 string.trim

### 多环境支持
环境变量
* NODE_ENV
* PUBLIC_URL
* REACT_APP_

> 使用 CRA 创建的项目，自定义环境变量比如使用 `REACT_APP_` 做为前缀，否则会被忽视

### 常用组件
权限组件

## 代码质量
为保证代码质量和统一团队风格，开启代码校验，具体如下
* prettier 统一代码风格
* eslint、stylelint 保证代码质量

> 已开启 pre-commit 进行代码强制校验和格式化，如果不满足规范，commit 会失败，部分错误可以通过 `npm run lint:fix` 自动修正，其他请查看原因耐心修改

优秀的协助开发工具
* VS Code 扩展
  * Prettier - Code formatter
  * ESLint
  * stylelint
* Chrome 扩展
  * React Developer Tools
  * Redux DevTools


路由权限控制

静态资源持久化

本地代理

## 性能相关
关于提升项目性能的思考
* 始终使用唯一属性作为 key，如果数据不支持，可以考虑使用 shortid 模块
* immer
* Reselect
* memoize-one
* prepack

### 懒加载
路由懒加载

组件级懒加载：react-loadable、react.lazy React.lazy() 实现懒加载，React.suspense() 在懒加载完成之前显示其他组件

## 开发规范

### 通用规范
代码规范
* 不要使用奇怪的单词缩写 browser -> brsr
* 避免抽象的、通用的命名方式
  * obj/data/value/item/elem
  * 根据变量类型命名：str/num，本质提供不了有价值的含义
  * 如果找不到更多的名字呢？追加一个数字，比如 item1、item
* 避免智能同义词，比如函数前缀 display、show、render、paint
* 避免重用名字
  * 覆盖形参变量的值，会导致后来人不自己检查代码，根本不知道变量被修改过
  * 本地变量覆盖外部同名变量
* 避免副作用和非标准结果
  * isXXX/checkXXX/findXXX 等函数看起来不会改变任何东西，也就是无副作用函数，因此一定不要产生去改变某些东西
  * 比如 isXXX/checkXXX 表意应该是返回 boolean，因此不要返回其他等不标准结果

关于 typescript
* 定义类型 interface
* 使用封装 private

关于复杂组件
* UI 复杂：拆分组件
* 逻辑复杂，拆分多个类
  * 业务无关工具类
  * 业务功能细分类

> 组件的“逻辑”更多的应该是和 UI 相关的交互逻辑，而不是比较底层的逻辑，我们还是应该把相对稳定的逻辑抽出来放到更下一层。

### 目录结构

### Redux 使用规范

### Three.js 开发规范

## In Progress
即将到来的
* mock data
* micro frontend
* 打点、错误监控的封装
* 构建产物发布到 CDN

## 参考
领域驱动设计
编写有弹性组件