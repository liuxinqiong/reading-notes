常用类型与函数
* React.ReactNode
* React.ReactElement
* React.CSSProperties
* HTMLElement
* React.isValidElement：验证对象是一个 React 元素
* React.createElement：使用 JSX 通常不会手动调用
* React.cloneElement
* React.Children.forEach/map/count/only/toArray
* ReactDOM.createPortal(child, container)：将孩子呈现到父组件的 DOM 层次结构之外的 DOM 节点中
* ReactDOM.findDOMNode

```js
React.cloneElement(
  element,
  [props],
  [...children]
)

// 相当于
<element.type {...element.props} {...props}>{children}</element.type>

function toArray(children: React.ReactNode) {
  const res = []
  React.Children.forEach(children, item => {
    res.push(item)
  })
  return ret
}
```

## 构造函数与生命周期
构造函数
* 避免在构造函数中引入任何副作用或订阅。对于这些用例，请 componentDidMount() 改为使用。
* 构造函数是初始化状态的正确位置。构造函数也经常用于将事件处理程序绑定到类实例。
* 如果您没有初始化状态并且没有绑定方法，则不需要为您的 React 组件实现构造函数。

componentWillMount()
* 在安装发生之前立即被调用。它之前被调用 render()
* 在服务器渲染上调用的唯一生命周期钩子。

componentDidMount()
* componentDidMount()在组件被安装后立即被调用。需要 DOM 节点的初始化应该放在这里。
* 如果您需要从远程端点加载数据，则这是一个实例化网络请求的好地方。
* 此方法是设置任何订阅的好地方。如果你这样做，不要忘记退订 componentWillUnmount()

componentDidUpdate()
* 在更新发生后立即调用。此方法不用于初始渲染。
* 在更新组件时，将此用作在 DOM 上操作的机会

componentWillUnmount()
* 在此方法中执行任何必要的清理操作，例如使定时器失效，取消网络请求或清理在其中创建的任何订阅

componentDidCatch()
* 在其子组件树中的任何位置捕获 JavaScript 错误，记录这些错误并显示回退 UI，而不是崩溃的组件树。

## refs
对于refs有几个很好的用例：
* 管理焦点，文本选择或媒体播放。
* 触发命令式动画。
* 与第三方 DOM 库集成。

> 避免将 ref 用于任何可以通过声明完成的事情。

React 支持可以附加到任何组件的特殊属性。该 ref 属性采用回调函数，并且在组件挂载或卸载后立即执行回调。
* 当在 refHTML 元素上使用该属性时，该 ref 回调接收基础 DOM 元素作为其参数
* 当在 ref 声明为类的自定义组件上使用该属性时，ref 回调接收组件的已装入实例作为其参数
* 将 DOM Refs 公开给父组件，通过传递 props 函数

## 性能工具
推荐两个可用工具
* react-addons-perf：测量重新渲染花费的时间
* why-did-you-update：发现应用里是否存在不该重新渲染的节点工具