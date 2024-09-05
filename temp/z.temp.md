浅浅分析 Lexical api 设计

发现一个富文本编辑器的设计思路和我对于 editor 的思路有些类似，浅浅分析一些，看看有什么值得借鉴的地方。

<!-- more -->

## 分包
核心包是 `lexical`，针对 react 提供了对应 wrapper `@lexical/react`。

几个 `@lexical/react` 暴露的 API 概念
* LexicalComposer
* LexicalComposerContext
* xxxPlugin

## Lexical core concepts
Editor 实例：最核心的对象，将所有对象连接在一起，如绑定 dom 元素、注册监听器或命令、更新状态。
* 通过 setRootElement 函数和 dom 节点，如果需要解绑，则传递 null，这部分可以参考下
* 通过 update 更新状态，在开始新的更新时，将克隆当前编辑器状态并将其用作起点。

> update 逻辑：从技术角度来看，这意味着Lexical在更新期间利用了一种称为双缓冲的技术。有一个编辑器状态表示屏幕上当前的内容，还有一个正在进行的编辑器状态表示未来的更改。

Editor States 是底层数据模型，用于表示你希望在 DOM 上显示的内容，主要包含两部分
* lexical 节点树
* lexical 选择对象

Editor States 是不可变对象，可通过 editor.update 更新，通过在 node transforms 和 command handlers 中可以 hook 到现有的更新。Editor States 支持序列号和反序列化。

Listeners, Node Transforms and Commands: 除了执行更新外，Lexical 大部分通过是通过这三者完成的，这些都源于 editor 实例，api 设计均通过 register 前缀修饰。

Commands 是用于将 Lexical 中所有内容连接在一起的通信系统。
* 通过 createCommand 创建自定义 Command，通过 editor.dispatchCommand(command, payload) 进行派发
* 通过 editor.registerCommand(handler, priority) 进行 command 处理

## 第一个好奇点
Readme 中监听 change 事件时，是这么演示的
```js
import {$getRoot, $getSelection} from 'lexical';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';

function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}
```

好奇点有两点
* onChange 回调会回传 editorState 对象，通过 read 函数读取，且通过回调函数的方式调用，难道这里是异步的吗
* $getRoot 和 $getSelection 的设计

文档中对此也有介绍
* update 和 read 会回调是很重要的，且必须是同步的，这是唯一一个你可以得到完整 lexical 上下文的地方，并为您提供对编辑器状态节点树的访问。
* 提倡使用以 $ 为前缀的函数，表明这些函数必须在这个上下文中使用，在外部使用会导致 runtime 错误