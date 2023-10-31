## React.js
大致内容
* React.createElement function
* ReactDOM.render function
  * document.createElement
  * document.createTextNode
  * appendChild
* Concurrent Mode
  * 递归调用会导致任务一旦开始，就必须渲染完整的元素树，如果浏览器需要做一些高优先级的事情，比如处理用户输入或保持动画流畅，它将不得不等到渲染完成。
  * 将把工作分解成小单元，在完成每个单元之后，如果有其他需要处理的事情，我们将让浏览器中断渲染。
  * 使用 requestIdleCallback 来创建一个循环。
* Fibers
  * 组织每一个 unit work 的一个数据结构
  * 每一个 element 会构成一个 fiber 对象，每一个 fiber 将是一个工作单元
  * 在 render 函数中，创建一个 root fiber 且设置为 nextUnitOfWork，其余的工作将发生在 performUnitOfWork 函数上，在那里我们将为每个 fiber 做三件事
    1. 将 element 添加到 dom
    2. 为 element 的每一个 child 创建 fiber
    3. 选择下一个工作单元
  * 这个结构的其中一个目的是寻找下一个 unit work 更简单，这就是为什么每个 fiber 都持有 first child/next sibling/parent 引用
    * 当我们完成一个工作单元时，如果有 child，则 child 为下一个工作单元
    * 如果没有 child，则选择 sibling 作为下一个工作单元
    * 如果没有 child 和 sibling，则寻找 uncle（parent’s sibling）
    * 如果 parent 没有 sibling，我们继续向上遍历父结点，直到找到一个有兄弟姐妹的结点，或者直到找到根结点
* Render and Commit Phases
  * 每次处理一个元素时，我们都会向 DOM 添加一个新节点。、由于浏览器可能会在我们完成整个树的渲染之前中断我们的工作。在这种情况下，用户将看到一个不完整的UI。我们不希望那样。
  * 因此我们不能在 unit work 中实时更新 dom，因此我们需要跟踪 root tree，称之为 wip root，一旦我们完成了所有的工作(当没有下一个 unit work 时)，我们就把整个 fiber tree 提交给 DOM。我们在 commitRoot 函数中完成它。这里我们递归地将所有节点附加到 dom。
* Reconciliation 调和新旧 fiber
  * 新增是十分简单的，如果是更新和删除呢，我们需要将 render 函数中得到的 elements 和上一次我们提交到 dom 中的 fiber tree 进行比较，因此我们保存一个指向上一次的引入 currentRoot，同时我们为每一个 fiber 新增 alternate 指向旧的 fiber currentRoot。
  * 将 performUnitOfWork 创建 fiber 的逻辑提取到 reconcileChildren 函数中
  * 同时迭代 old fiber 的 children 和我们需要调和的元素，先仅关注最重要的东西，oldFiber 和 element，其中元素是我们想要渲染到 DOM 的东西，而 oldFiber 是我们上次渲染的东西。我们需要比较它们，看看是否需要对DOM应用任何更改。
  * 我们使用 type 属性进行比较
    * 具有相同的类型，我们保留 DOM 节点，只使用新的 props 更新它
    * 如果类型不同并且有一个新元素，则意味着我们需要创建一个新的DOM节点
    * 如果类型不同，有旧的 fiber，我们需要移除旧的节点
    * 需要注意的是：React 使用了 key 属性，这样可以更好地进行协调。例如，它检测子元素在元素数组中的位置何时改变。
  * 当旧 fiber 和元素具有相同的类型时，我们创建一个新 fiber，保留旧 fiber 中的 DOM 节点和 elements 中的 props。为 fiber 添加了一个新属性 effectTag，设置为 PLACEMENT。我们将在提交阶段使用此属性。
  * 当元素需要一个新的 dom 节点时，将新的 fiber 的 effectTag 标记为 PLACEMENT
  * 对于需要删除节点的情况，我们没有新的 fiber，所以我们将 effect 标签添加到旧 fiber 中，标记为 DELETION，但当我们提交时，我们是工作在 wip root 上，此时没有 old fibers，因此我们需要一个数组跟踪需要被我们删除的节点。当我们向 DOM 提交更改时，我们也使用该数组中的 fiber
* Function Components
  * 函数式组件 fiber 没有 dom 节点
  * 子元素来自于运行函数，而不是直接从 props 中获取。我们检查 fiber 类型是否是一个函数，并根据它转到不同的更新函数
* hooks
  * 初始化一些全局变量，以便在 useState 函数中使用它们。

没考虑 wip root 的示例
```js
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
​
  return dom
}

let nextUnitOfWork = null

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}​

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)
​
// 执行一个单元，且返回下一个单元
function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
​  // create new fibers
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
​
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
​  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```

考虑 wip root 之后示例
```js
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
​
  return dom
}

function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
}
​
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
​

let nextUnitOfWork = null
let wipRoot = null

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
  nextUnitOfWork = wipRoot
}​

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)
​
// 执行一个单元，且返回下一个单元
function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

​  // create new fibers
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
​
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
​  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```

考虑了调和时候的示例
```js
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
​
  return dom
}

let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null;
let deletions = null

const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
​
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
​
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}


function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  nextUnitOfWork = wipRoot
  deletions = []
}​

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child

  let prevSibling = null
​
  while (index < elements.length ||  oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type
​
    if (sameType) {
       newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }​

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
}​

// 执行一个单元，且返回下一个单元
function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  ​// create new fibers
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)

​  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```

支持函数组件
```js
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
​
  return dom
}

let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null;
let deletions = null

const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
​
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
​
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}


function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  nextUnitOfWork = wipRoot
  deletions = []
}​

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child

  let prevSibling = null
​
  while (index < elements.length ||  oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type
​
    if (sameType) {
       newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }​

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
}​
​
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
​
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}
​

// 执行一个单元，且返回下一个单元
function performUnitOfWork(fiber) {
  const isFunctionComponent =
    fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

​  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```

支持 hooks 版本
```js
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
​
  return dom
}

let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null;
let deletions = null

const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
​
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
​
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}


function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  nextUnitOfWork = wipRoot
  deletions = []
}​

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child

  let prevSibling = null
​
  while (index < elements.length ||  oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type
​
    if (sameType) {
       newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }​

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
}

let wipFiber = null
let hookIndex = null​
​
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function useState(initial) {
  // 如果存在 oldHook，则直接 copy 状态，否则进行初始化
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }

  // 从 oldHook 中取，这样就表示在下一次 render 时执行
  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = action => {
    hook.queue.push(action)
    // 类似于 render 函数，这样工作循环就可以开始一个新的呈现阶段。
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }
​
​
  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}
​
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}
​

// 执行一个单元，且返回下一个单元
function performUnitOfWork(fiber) {
  const isFunctionComponent =
    fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

​  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```