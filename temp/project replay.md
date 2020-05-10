新版 CAD 问题
1. FP 风格的代码还是有点多，具体表现在散函数多
2. 缺少自己服务于 view 的 service 层，当初觉得 service 层可能没太多必要，跳过了 service 层直接将 api 层作用于 view 了
3. 类型定义
  * Object3D 的 userData 类型
  * axios 返回值类型定义
  * Redux Action payload 类型定义

技术部茶会
1. 简单、反复重构、单侧、避免过度设计
2. 开发修复，给测试提供服务可能的影响范围
3. 20/80 时间分配
4. markdown 绘制流程图

TODO
* 数值输入框优化
  * 滚动操作
  * 空白重置
* 方案信息面板用户选择刷新不重置
* 物件优化
  * 减少重复代码
  * 架空层和女儿层不能自动被关闭
* ant design 主题定制与变量修改问题
* 依赖升级（react-redux）
* 优化 path 提示：Absolute Imports
* Running Test Part
* MaterialHelper 内存释放问题

在 npm 5.2+，新增 npx 命令，推荐使用 npx 创建项目，它会使用最新的版本
```shell
npx create-react-app my-app
```

在 npm 6+，支持使用 npm init 命令指令一个初始器，使用如下
```shell
npm init react-app my-app
```

通过 --template 参数来指定模板，比如 typescript
```shell
npx create-react-app my-app --template typescript
```

node 版本切换神器
* macOS/Linux：nvm
* windows：nvm-windows

通用组件管理工具
* Storybook for React
* React Styleguidist

yarn vs npm
* 了解 yarn，通过 Zero Install 概念，让依赖安装速度不在是瓶颈

环境变量
* 通过 .env 文件声明环境变量，比如 `.env`、`.env.local`、`env.development`、`env.test`、`env.production` 等等
  * npm start：development
  * npm run build：production
  * npm test: test
* 如果上述三个环境不够用，你还可以通过 `env-cmd` 模块进行自定义设置
* HTML 文件中可以通过 `%REACT_APP_PARAM%` 的方式进行引用