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
        this._root = []
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
