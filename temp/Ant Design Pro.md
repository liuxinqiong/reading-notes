Ant Design Pro

开发方式
* 基于区块开发：下载区块 -> 基于区块初始化好的页面组件修改代码。
* 传统开发模式：创建 JS -> 创建 CSS -> 创建 Model -> 创建 service -> 写页面组件。

单元测试库：jest + enzyme

e2e 测试：puppeteer

> puppeteer 是 Google Chrome 团队官方的无界面（Headless）Chrome 工具。它默认使用 chrome / chromium 作为浏览器环境运行你的应用，并且提供了非常语义化的 API 来描述业务逻辑。

聚焦和忽略用例：使用 xit() 取代 it() 可以暂时忽略用例，fit() 可以聚焦当前用例并忽略其他所有用例。这两个方法可以帮助你在开发过程中只关注当前需要的用例。

接入集成测试服务：注意 e2e 测试需要集成环境支持 electron，如果不支持，你可以使用 npm test .test.js 单独运行单元测试。

了解 yarn，通过 Zero Install 概念，让依赖安装速度不在是瓶颈

react-testing-library(@testing-library/react) + jest 成为主流，enzyme 淡出