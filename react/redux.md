## 基础

### 操作 Actions
操作是将数据从应用程序发送到商店的信息的有效载荷。他们是商店唯一的信息来源。使用 dispatch 将其发送到商店。

操作是纯 JavaScript 对象。操作必须具有 type 指示正在执行的操作类型的属性。类型通常应该定义为字符串常量。一旦您的应用程序足够大，您可能需要将它们移动到单独的模块中。

动作创造者：创造动作的函数，在 Redux 动作创建者只需返回一个动作

### 数据流
Redux 数据生命周期
1. dispatch 派发动作
2. 调用 reducer 纯函数计算下一个状态。它应该是完全可预测的：多次调用相同的输入应该产生相同的输出。不应该执行任何副作用。
3. 根 reducer 将多个 reducer 的输出组合成单个状态树。combineReducers 辅助函数用于将根简化器“分解”为单独的函数，每个函数都管理状态树的一个分支。
4. redux 存储保存由根 reducer 返回的完整状态树

### Reducer
需要注意的点
* 绝不会直接写入 state 或其字段，而是返回新的对象
* 不完全变异：比如想更新数组中的某个特定项目而不使用突变，所以我们必须创建一个新数组，其中除了索引处的项目外，其他项目都是相同的。这种代码的编写 immer 等第三方库就可以派上用处了
* 减速器拆分与组合：其实就是 reducer 函数的进一步拆分与组合

纯粹的 reducer
* 不执行边缘作用（例如调用 API 或修改非本地对象或变量）。
* 不调用非纯函数（如 Date.now 或 Math.random）。
* 不改变它的参数。

因为它通常会中断时间行程调试和 React Redux 的 connect 功能
* 对于时间旅行，Redux DevTools 期望重放记录的动作会输出一个状态值，但不会改变其他任何东西。诸如变异或异步行为之类的副作用会导致时间旅行改变步骤之前的行为，从而破坏应用程序。
* 对于 React Redux，connect 检查是否 mapStateToProps 已更改从函数返回的值以确定组件是否需要更新。为了提高性能，connect 需要一些依赖状态不可变的快捷方式，并使用浅层引用相等检查来检测更改。这意味着不会检测到通过直接变异对对象和数组所做的更改，并且组件不会重新呈现。

功能分解
* 提取实用工具函数：比如 updateObject 与 updateItemInArray
* 提取 case reducer
* 按域分隔数据处理：combineReducers
* 减少模板代码，比如不使用 switch

不使用 switch 例子
```js
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
```

### React-redux
展示组件
* 目标：How things look
* aware of Redux：No
* 读取数据：props
* 改变数据：执行 props 回调函数

容器组件
* 目标：How things work
* aware of Redux：Yes
* 读取数据：redux state or local state
* 改变数据：dispatch or setState

> 从技术上讲，容器组件只是一个 React 组件，用于 store.subscribe() 读取Redux状态树的一部分，并为它呈现的呈现组件提供道具。您可以手动编写容器组件，但我们建议使用 React Redux 库的 connect() 函数生成容器组件，该函数提供了许多有用的优化以防止不必要的重新渲染。

## 介绍
Redux 本身十分简单
1. 你的应用程序的状态被描述为一个普通的对象。
2. 这个对象就像一个“模型”，除了没有 setter 。这是因为代码的不同部分不能任意改变状态，导致难以重现的错误。
3. 要改变这个状态，你需要发送一个动作。一个动作是一个普通的 JavaScript 对象。强制将每一项变更都描述为一项行动，让我们清楚了解应用中发生的情况。如果有什么改变，我们知道它为什么改变。
4. 为了将状态和动作绑定在一起，我们编写了一个名为 reducer 的函数。它只是一个以状态和动作为参数的函数，并返回应用程序的下一个状态。
5. 为大型应用程序编写这样的功能将很难，因此我们编写管理部分状态的较小函数。

大多数应用程序处理多种类型的数据，大致可以分为三类：
* 域数据：应用程序需要显示，使用或修改的数据（例如“从服务器检索到的所有Todos”）
* 应用程序状态：特定于应用程序行为的数据（例如“当前选择了待办事项#5”或“请求正在处理获取待办事项”）
* 用户界面状态：表示用户界面当前如何显示的数据（如“EditTodo模式对话框当前处于打开状态”）

### 计算派生数据
计算派生数据：基于 redux state 的数据计算新的数据

如果计算派生数据的开销很大，则可以考虑使用 reselect 提升性能

在多个组件上共享选择器，则需要使用到 connect 的高阶用法：如果 mapStateToProps 返回一个函数而不是一个对象，它将用于为容器的每个实例mapStateToProps 创建一个单独的函数 connect mapStateToProps

## 资料
* [redux](https://cloud.tencent.com/developer/doc/1204)