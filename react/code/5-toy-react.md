## 基础环境
Webpack 的目的
* JavaScript 打包工具，最大的作用是帮助我们把 JS 文件里的 import 和 require 把多文件打包成一个单一的 JS 文件。因此 Webpack 往往由一个文件作为入口，这个文件可能会 import 一些东西，变成一个单个的大的文件，这样比较符合我们在 Web 上的性能和发布
* Babel：把新版本的 JS 文件翻译成老版本 JS 文件的一种工具，通过 loader 的方式去使用
  * babel-loader
  * @babel/core
  * @babel/preset-env
  * @babel/plugin-transform-react-jsx
* Webpack 允许我们使用 loader 去定制各种各样的文件，从而扩充它自身的能力，并不仅仅只是 JS 文件

> npm 不太推荐使用 -g 的方式安装到全局，而是通过 npx 的方式

jsx 自定义组件机制：type 是 string，当做普通的 element 去处理，如果是函数，则走自定义组件逻辑

通过 Wrapper 调和 element 和自定义组件差异
```js
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }

    appendChild(component) {
        this.root.appendChild(component.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}

export class Component {
    constructor() {
        this.props = Object.create({})
        this.children = []
        this._root = null
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(component) {
        this.children.push(component)
    }

    get root() {
        // 会触发递归
        if(!this._root) {
            this._root = this.render().root;
        }
        return this._root;
    }
}

export function createElement(type, attributes, ...children) {
    let e;
    if(typeof type === 'string') {
        e = new ElementWrapper(type)
    } else {
        e = new type;
    }
    for(let p in attributes) {
        e.setAttribute(p, attributes[p])
    }
    const insertChildren = (children) => {
        for(let child of children) {
            if(typeof child === 'string') {
                child = new TextWrapper(child)
            }
            if(child === null) {
                continue;
            }
            if(child instanceof Array) {
                insertChildren(child)
            } else {
                e.appendChild(child)
            }
        }
    }
    insertChildren(children)
    return e;
}

export function render(component, parentElement) {
    parentElement.appendChild(component.root)
}

// 调用方
class MyComponent extends Component {
    render() {
        return <div>123</div>
    }
}
```

## State 和生命周期
先看简单基于 range api 的重新渲染。

下面 MyComponent 组件，给他添加 state
```js
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }

    setAttribute(name, value) {
        // 小技巧 /s/S 正好互补，所有空白+所有非空白，用于表示所有字符
        if(name.match(/^on([/s/S]+)$/)) {
            this.root.addEventListener(RegExp.$1.replace(/^[/s/S]/, c => c.toLowerCase), value)
        } else if(name === 'className') {
            this.root.setAttribute('class', value)
        } else {
           this.root.setAttribute(name, value)
        }
    }

    appendChild(component) {
        const range = document.createRange()
        range.setStart(this.root, this.root.childNodes.length)
        range.setEnd(this.root, this.root.childNodes.length)
        component._renderToDom(range)
    }

    _renderToDom(range) {
        range.deleteContents();
        range.insertNode(this.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }

    _renderToDom(range) {
        range.deleteContents();
        range.insertNode(this.root)
    }
}
export class Component {
    constructor() {
        this.props = Object.create({})
        this.children = []
        this._root = null
        this._range = null
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(component) {
        this.children.push(component)
    }

    _renderToDom(range) {
        // 使用 range api 进行操作和重新渲染
        this._range = range;
        this.render()._renderToDom(range)
    }

    rerender(range) {
        // 需要保证 range 非空，否则会出现 range 合并
        const oldRange = this_range;

        const range = document.createRange()
        range.setStart(this._range.startContainer, this._range.startOffset)
        range.setEnd(this._range.startContainer, this._range.startOffset)
        this._renderToDom(range)

        oldRange.setStart(range.endContainer, range.endOffset)
        oldRange.deleteContents()
    }

    setState(newState) {
        if(this.state === null || typeof this.state !== 'object') {
            this.state = newState
            this.rerender()
            return;
        }
        const merge  = (oldState, newState) => {
            for(let p in newState) {
                if(oldState[p] === null || typeof p !== 'object') {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        merge(this.state, newState)
    }
}

class MyComponent extends Component {
    constructor() {
        super();
        this.state = { a: 1, b: 2 }
    }

    render() {
        return <div>
            <button onClick={() => {this.setState({a: this.state.a+1})}}>add</button>
            <div>{this.state.a}</div>
            <div>{this.state.b}</div>
        </div>
    }
}

export function render(component, parentElement) {
    const range = document.createRange()
    range.setStart(parentElement, 0)
    range.setEnd(parentElement, parentElement.childNodes.length)
    range.deleteContents()
    component._renderToDom()
}
```

## 基于虚拟 DOM 的简易实现
直接看代码
```js
function replaceContent(range, node) {
    range.insertNode(node);
    range.setStartAfter(node);
    range.deleteContents();
    range.setStartBefore(node);
    range.setEndAfter(node;)
}

export class Component {
    constructor() {
        this.props = Object.create({})
        this.children = []
        this._root = null
        this._range = null
    }

    get vdom() {
        return this.render().vdom;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(component) {
        this.children.push(component)
    }

    _renderToDom(range) {
        // 使用 range api 进行操作和重新渲染
        this._range = range;
        this._vdom = this.vdom;
        this._vdom._renderToDom(range)
    }

    update() {
        // 比较粗暴的判断
        const isSameNode = (oldNode, newNode) => {
            if(oldNode.type !== newNode.type){
                return false
            }
            for(let name in newNode.props) {
                if(newNode.props[name] !== oldNode.props[name]) {
                    return false
                }
            }
            if(Object.keys(oldNode.props).length !== Object.keys(newNode.props).length) {
                return false
            }
            if(newNode.type === '#text') {
                if(newNode.content !== oldNode.content){
                    return false
                }
            }
            return true
        }
        const update = (oldNode, newNode) => {
            // 对比 type、props、children
            // #text content
            if(!isSameNode(oldNode, newNode)) {
                newNode._renderToDom(oldNode._range)
                return
            }
            newNode_range = oldNode_range;
            const newChildren = newNode.vChildren;
            const oldChildren = oldNode.vChildren;
            if(!newChildren || !newChildren.length) {
                return;
            }
            const tailRange = oldChildren[oldChildren.length - 1]._range;
            for(let i = 0; i < newChildren.length; i += 1) {
                const newChild = newChildren[i];
                const oldChild = oldChildren[i];
                if(i < oldChildren.length) {
                    update(oldChild, newChild)
                } else {
                    const range = document.createRange();
                    range.setStart(tailRange.endContainer, tailRange.endOffset)
                    range.setEnd(tailRange.endContainer, tailRange.endOffset)
                    newChild._renderToDom(range)
                    tailRange = range
                }
            }

        }
        const vdom = this.vdom;
        update(this._vdom, this.vdom);
        this._vdom = vdom;
    }

    setState(newState) {
        if(this.state === null || typeof this.state !== 'object') {
            this.state = newState
            this.update()
            return;
        }
        const merge  = (oldState, newState) => {
            for(let p in newState) {
                if(oldState[p] === null || typeof p !== 'object') {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        merge(this.state, newState)
    }
}

class ElementWrapper extends Component {
    constructor(type) {
        super(type);
        this.type = type;
    }

    get vdom() {
        this.vChildren = this.children.map(child => child.vdom)
        return this;
        // return {
        //     type: this.type,
        //     props: this.props,
        //     children: this.children.map(item => item.vdom)
        // }
    }

    _renderToDom(range) {
        this_range = range
        const root = document.createElement(this.type)
        for(let name in this.props) {
            const value = this.props[name];
            if(name.match(/^on([/s/S]+)$/)) {
                // React 使用的事件中心机制，会更细致
                this.root.addEventListener(RegExp.$1.replace(/^[/s/S]/, c => c.toLowerCase), value)
            } else if(name === 'className') {
                root.setAttribute('class', value)
            } else {
                root.setAttribute(name, value)
            }
        }
        if(!this.vChildren) {
            this.vChildren = this.children.map(child => child.vdom)
        }
        for(let child of this.vchildren) {
            const childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)
            child._renderToDom(childRange)
        }
        replaceContent(range, root)
    }
}

class TextWrapper extends Component {
    constructor(content) {
        super(content);
        this.type = '#text';
        this.content = content;
    }

    get vdom() {
        return this;
        // return {
        //     type: '#text',
        //     content: this.content
        // }
    }

    _renderToDom(range) {
        this._range = range;
        const root = document.createTextNode(this.content)
        replaceContent(range, root)
    }
}

class MyComponent extends Component {
    constructor() {
        super();
        this.state = { a: 1, b: 2 }
    }

    render() {
        return <div>
            <button onClick={() => {this.setState({a: this.state.a+1})}}>add</button>
            <div>{this.state.a}</div>
            <div>{this.state.b}</div>
        </div>
    }
}

export function render(component, parentElement) {
    const range = document.createRange()
    range.setStart(parentElement, 0)
    range.setEnd(parentElement, parentElement.childNodes.length)
    range.deleteContents()
    component._renderToDom()
}
```