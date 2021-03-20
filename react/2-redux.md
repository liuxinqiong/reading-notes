为什么需要 redux：让组件通信更加容易

redux 三个特性
* 单一数据源
* 可预测性：state + action = new state（不可变数据）
* 纯函数更新 Store（reducer）

三个核心概念
* Store：createStore(reducer)
  * getState()
  * dispatch(action)
  * subscribe(listener)
* action：描述行为的数据结构
* reducer：纯函数，返回新对象来触发 state 更新

工具函数
* combineReducers({...reducers}) 多个 reducer 组合成一个新的 reducer
* bindActionCreators({...actions}, dispatch)：高阶函数，使得一个函数具备自动 dispatch 功能

> addTodoWithDispatch，这个 with 单词简直打开了我命名的新大门哇。

react-redux
* 通过高阶组件的方式
* connect 函数，接受两个函数，分别为
  * mapStateToProps(state)
  * mapDispatchToProps(dispatch)

异步 action 与 redux 中间件
* 异步 action
  * 返回一个函数，参数为 dispatch 和 getState
  * redux-thunk 负责截获
* 中间件原理
  * 截获 action
  * 发出 action

如何组织 Action 和 reducer
* 标准形式存在的问题
  * 所有 Action 放一个文件，会无限扩展
  * Action 和 reducer 分开，实现业务逻辑时需要来回切换
  * 系统中有些 Action 不够直观
* 新的方式：单个 action 和 reducer 放在同一个文件
  * 易于开发：不用在 action 和 reducer 文件间来回切换
  * 易于维护：每个 action 文件都很小，容易理解
  * 易于测试：每个业务逻辑只需对应一个测试文件
  * 易于理解：文件名就是 action 名字，文件列表就是 action 列表

不可变数据
* 不可以直接修改值，通过复制值产生新对象的方式来重新赋值
* 为什么？
  * 性能优化，不需要深层次比较值，直接比较引用即可
  * 易于调试和跟踪
  * 易于推测
* 如果操作不可变数据
  * 原生写法：{...} Object.assign
  * immutability-helper：适合稍微深层次一点的结构
  * immer