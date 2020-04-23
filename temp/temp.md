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

> 在 Jest 中如果想捕获函数的调用情况，则该函数必须被 mock 或者 spy，jest.spyOn()是 jest.fn() 的语法糖，它创建了一个和被 spy 的函数具有相同内部代码的 mock 函数。

如何 Mock ES6 Class，主要用两种方式，分为自动 Mock 与手动 Mock
* 自动 Mock：使用 jest.mock 直接 Mock 整个模块
* 手动 Mock：在需要 Mock 的文件同级创建 `__mocks__` 文件夹，然后创建同名文件即可，依旧需要使用 jest.mock 调用，但检测到 `__mocks__` 文件夹且存在同名文件时，会优先使用手动 Mock

> 你还可以通过 jest.mock 中第二参数 moduleFactory 指定 mock，其实只是一种手动 Mock 的变体

jest.genMockFromModule(moduleName)

jest.requireActual(moduleName)