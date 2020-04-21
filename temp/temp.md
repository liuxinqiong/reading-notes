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