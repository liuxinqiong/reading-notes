《从零开始搭建前端监控平台》
[探索 webpack5 新特性Module federation在腾讯文档的应用](https://mp.weixin.qq.com/s/iS-prT1xZPV6cpH7MHRRdQ)
[图解常用的 Git 指令含义](https://mp.weixin.qq.com/s/oKMdlo6jsIcMcZW8nzoAUg)
[Service Worker运用与实践](https://mp.weixin.qq.com/s/vI2bxaFsFSB5rGC4Bkr8vQ)
[React Hooks的体系设计之四 - 玩坏ref](https://mp.weixin.qq.com/s/7c6zncb5ZIef9xgaAvt9uw)
[JavaScript 20 年中文版 - 语言诞生](https://mp.weixin.qq.com/s/eRne5EIQGDbE0-JclAzNAA)
[微前端在小米 CRM 系统的实践](https://mp.weixin.qq.com/s/5qwgZ9aNKFC3naWRUGajmA)
[微前端在企业级应用中的实践(上)](https://mp.weixin.qq.com/s/tutFXv6djecT6lnL9Je71Q)

Test Library
* 原则：从用户实际使用角度出发的 UI 组件测试框架
* 核心库：DOM Testing Library
  * 通过 label 文本寻找表单元素
  * 通过 text 文本寻找链接和按钮
  * 通过 data-testid 寻找那些没有明确的 label 和 text 元素
* 指定 UI 框架包装器：React，Angular 和 Vue
* 生态
  * React Testing Library
  * use-event 模拟浏览器事件
  * js-dom 添加自定义的 Jest 匹配器

render
* asFragment：获取快照
* container
* unmount
* getBy/getAllBy：无匹配项会报错
* queryBy/queryAllBy：无匹配项返回 null 和空数组
* findBy/findAllBy：返回 Promise
* ByLabelText/ByPlaceholderText/ByText/ByAltText/ByTitle/ByDisplayValue/ByRole/ByTestId

> query 的参数可以是字符串，正则或函数

fireEvent
* fireEvent(node, event)
* fireEvent[eventName](node)

expect
* toMatchSnapshot：匹配快照
* toHaveTextContent：文本元素
* toHaveAttribute：是否有某个属性
* toBeDisabled
* toMatch
* toContainElement
* toHaveBeenCalledTimes
* toHaveBeenCalledWith
* toBe
* toBeInTheDocument
* toMatchInlineSnapshot
* toBeTruthy
* toBeNull
* ……

helper
* jest.mock
* jest.fn
* waitFor
* waitForElementToBeRemoved

setup
* custom Render：比如全局提供 context，store 等
* add custom queries
* 默认会执行 afterEach(cleanup)，为避免内存泄露考虑

demo
```js
await waitFor(() =>
  expect(queryByTestId(container, 'printed-username')).toBeTruthy()
)
await waitForElement(() => getByText('1')) 
```

custom utils
```js
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, cleanup, fireEvent } from '@testing-library/react';

const renderWithRedux = (
  component,
  { initialState, store = createStore(reducer, initialState) } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  }
}

const renderWithContext = (
  component
) => {
  return {
    ...render(
      <CounterProvider value={CounterContext}>{component}</CounterProvider>
    )
  }
}

const renderWithRouter = (component) => {
  const history = createMemoryHistory()
  return { 
    ...render (<Router history={history}>{component}</Router>)
  }
}
```

className 为空的坑

单元测试框架
* 匹配器 Matchers
  * 通用：浅比较、深比较
  * 真假：undefined、null、boolean
  * number 比较
  * string：toMatch
  * 数组与迭代器：包含
  * 异常
* 异步能力
* 装载与卸载：beforeEach/afterEach/beforeAll/afterAll，同时可通过 describe 限定作用域范围
* Mock Functions
  * jest.fn => mockFn
  * mockFn.mock.(calls|results|instances)
  * mockFn.(mockReturnValueOnce|mockReturnValue|mockResolvedValue|mockImplementation|mockImplementationOnce|mockReturnThis|mockName)
* Mock Module
  * jest.mock
* Manual Mock
  * 约定文件夹名称为：`__mocks__`
  * 用户模块需要限制调用 jest.mock
  * node module 在 node_modules 同级建立 `__mocks__` 文件即可，且无需显示调用 jest.mock。注：如果 mock 的是 Node code modules，比如 fs 或 path，依旧需要显示调用 jest.mock

> 在 Jest 中如果想捕获函数的调用情况，则该函数必须被 mock 或者 spy，jest.spyOn()是 jest.fn() 的语法糖，它创建了一个和被 spy 的函数具有相同内部代码的 mock 函数，使用它可以轻松监控一个对象函数的调用情况，函数原型：jest.spyOn(object, methodName)。

如何 Mock ES6 Class，主要用两种方式，分为自动 Mock 与手动 Mock
* 自动 Mock：使用 jest.mock 直接 Mock 整个模块
* 手动 Mock：在需要 Mock 的文件同级创建 `__mocks__` 文件夹，然后创建同名文件即可，依旧需要使用 jest.mock 调用，但检测到 `__mocks__` 文件夹且存在同名文件时，会优先使用手动 Mock

> 你还可以通过 jest.mock 中第二参数 moduleFactory 指定 mock，其实只是一种手动 Mock 的变体。这里有个限制，由于 jest 需要将 jest.mock 提升到文件顶部，因此对于工厂函数需要用到的变量，jest 提供了一个逃生舱，变量名使用 mock 开头，同样会自动将变量提升到文件顶部

理解为什么 Mock 一个类看上去比他本来的样子更复杂
* 首先需要知道的是你也可以在 mock 中直接创建一个普通的类来替换原本的类，但你无法监控函数的调用情况
* 如果你需要跟踪使用情况，你就需要用到 spy 技术，你需要用到 jest mock 的函数来替换普通的函数
  * 监测构造函数：你需要用到 jest.fn.mockImplementation
  * 监测自身函数：用 jest.fn 来创建函数

> 总的来说就是，我们为了监控函数的调用情况，才导致 mock 的类看上去比原本更复杂

其他高阶的 jest api
* jest.genMockFromModule(moduleName)：当你手动 Mock 时，使用该函数先得到自动 Mock 的版本，然后你可以修改部分
* jest.requireActual(moduleName)：获取真正的模块，使用该 api 可以做到一部分真实，一部分修改
* jest.unmock(moduleName)：总是返回真实的模块
* jest.doMock(moduleName, factory, options)：mock 函数会被提升到代码顶部，该 api 可以回避掉这个特性
* jest.dontMock(moduleName)：unmock 函数会被提升到代码顶部，该 api 可以回避掉这个特性