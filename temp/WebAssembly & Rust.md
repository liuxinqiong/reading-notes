## WebAssembly 简介
MDN 对于 WebAssembly 的介绍：WebAssembly 是一种新的编码方式，可以在现代的网络浏览器中运行。它是一种低级的类汇编语言，具有紧凑的二进制格式，可以接近原生的性能运行，并为诸如 C/C ++ 等语言提供一个编译目标，以便它们可以在 Web 上运行。它也被设计为可以与 JavaScript 共存，允许两者一起工作。

> WebAssembly 提供了一条途径，使得以各种语言编写的代码都可以以接近原生的速度在 Web 中运行。

WebAssembly 扮演的角色：与 JavaScript 一起工作的协同者。
* JavaScript 是一门高级语言。对于写网络应用程序而言，它足够灵活且富有表达力。它有许多优势——它是动态类型的，不需要编译环节以及一个巨大的能够提供强大框架、库和其他工具的生态系统。
* WebAssembly 是一门低级的类汇编语言。它有一种紧凑的二进制格式，使其能够以接近原生性能的速度运行，并且为诸如 C++ 和 Rust 等拥有低级的内存模型语言提供了一个编译目标以便它们能够在网络上运行
* 不同类型的代码能够按照需要进行相互调用，通过使用 WebAssembly 的 JavaScript API，你可以把 WebAssembly 模块加载到一个 JavaScript 应用中并且在两者之间共享功能。这允许你在同一个应用中利用 WebAssembly 的性能和威力以及 JavaScript 的表达力和灵活性。

WebAssembly 是什么
* 它设计的目的不是为了手写代码而是为了诸如 C、C++ 和 Rust 等低级源语言提供一个高效的编译目标。
* WebAssembly 的模块可以被导入的到一个网络 app（或 Node.js）中，并且暴露出供 JavaScript 使用的 WebAssembly 函数。JavaScript 框架不但可以使用 WebAssembly 获得巨大性能优势和新特性，而且还能使得各种功能保持对网络开发者的易用性。

WebAssembly 关键概念
* 模块 Module：包括了无状态的 WebAssembly 代码，已经被浏览器编译并且能过通过 Workers 高效地共享，缓存到 IndexedDB 中以及多次实例化
* 实例 Instance：有状态的、可执行的模块的实例，包含所有能够从 JavaScript 调用到的 WebAssembly 代码导出的 WebAssembly 函数
* 内存 Memory：可变长的 ArrayBuffer，能够被实例存取的原始字节内存。进阶部分
* 表格 Table：可变长类型数组，存储诸如函数引用之类的不透明值并且能够被实例存取。进阶部分
* 实例化对象 instantiate：第一参数为二进制数据，第二参数为 importObject（用于实现对 WebAssembly 对于 JavaScript 函数的调用，一旦一个模块声明了一个导入，则必须传递一个拥有相应属性的导入对象）

> WebAssembly 只有很小的一个值类型集合，基本上限制在简单数值的范围内。

如何得到 WebAssembly 二进制文件
* 从 C/C++ 移植：使用 Emscripten 来将它编译到 WebAssembly
* 编写 Rust 程序，将 WebAssembly 作为它的输出
* 直接编写 WebAssembly 代码
  * WebAssembly 的二进制格式也有文本表示——两者之间 1:1 对应。你可以手工书写或者生成这种格式然后使用工具把它转换为二进制格式。这是一种用来在文本编辑器、浏览器开发者工具等工具中显示的中间形式
  * 二进制格式通常为 `.wasm` 格式，文本格式通常为 `.wat` 格式
  * [理解 WebAssembly 文本格式](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Understanding_the_text_format)

加载 WebAssembly 代码
* 目前 WebAssembly 还没有和 `<script type="module">` 或 ES6 的 import 语句基础，当前没有内置的方式让浏览器为你获取模块
* 方式一：通过 Fetch 方式加载到内存，使用 response 的 arrayBuffer 函数把响应转换为带类型数组，接收并且使用 WebAssembly.instantiate 函数实现编译和实例化带类型数组，返回一个可以解析为包含已编译模块对象及其实例的 Promise。
* 方式二：XMLHttpRequest 相比 Fetch 会老旧一点，我们需要设置 responseType 为 arraybuffer

> 通常我们只关心实例，但当我们想缓存模块，使用 postMessage 与另一个 work 或 window 共享模块，或者只是创建更多的实例的时候，拥有模块对象很有用。

缓存已编译的 WebAssembly 模块
* 通过在客户端存储已编译的 WebAssembly 模块，从而避免每次都下载和编译他们
* 使用 IndexedDB 实现缓存
  1. 首先我们需要一个标识，判断整个网站缓存是有效的，可以通过 dbVersion 进行控制。如果 wasm 模块代码更新或者他的 URL 发生了变化，你需要更新 dbVersion。
  2. 通过 dbName 以及 dbVersion 创建 db，通过 db 以及 storeName 创建 objectStore
  3. 在 db 中通过 storeName，获取对应的 store，store 可以通过 url 查找缓存，以及通过 url 作为 key 缓存对应数据
* 简单流程 - instantiateCachedURL
  1. 打开数据库得到 db
  2. 通过 db 进行模块查找
  3. 找到直接实例化对应并返回
  4. 没法找通过 fetch 获取二进制数据，完成实例化的同时缓存到 db 中
  5. 如果打开数据库失败，改用获取和编译模块的方式，并且不尝试保存结果
* [缓存参考](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Caching_modules)

运行 WebAssembly 代码：一旦得到了可用的 WebAssembly 实例，你就可以使用那些通过 WebAssembly.Instance.exports 导出的属性了

你可以通过两种方式获得导出的 WebAssembly 函数
* 通过 Table.prototype.get()
* 通过 Instance.exports

使用 WebAssembly 的原因
* 关注性能敏感代码：使用 Rust 你根本不需要成为 JS 优化专家，不需要熟悉 JIT 内部实现，不需要魔法也能加速。
* 集成方便：直接编译为 `.wasm`，使得现有的 JS 代码库可以增量式部分采用 WebAssembly。而且还可以保持你现有代码库，不需要重写。

由于 WebAssembly 是静态类型，因此很难直接使用我们熟悉的 JavaScript 来直接编写，目前的 WebAssembly 都是通过其他静态语言编译而来。比如 AssemblyScript、C++、Rust、Go。不负责任的说，使用 Rust 开发在开发效率和便捷性、包体积大小、对 WebAssembly 的支持度相对完善、社区活跃度高等方面有很大的优势。因此了解下使用 Rust 开发 WebAssembly。

> Rust 在 WebAssembly 生态颇有建树，如 WebAssembly-bindgen、stdweb 等轮子使得我们编写 WebAssembly 应用更加容易。

## Rust 简介
Rust 是 Mozilla 开发的一门静态的支持多种范式的系统编程语言。
* 惊人的运行速度
* 防止内存错误
* 保证线程安全

内存管理模型
* C 语言的 malloc 和 free（手动管理，bug 制造机）
* GC：Golang，Java 等语法（自动管理），导致程序性能不可避免的下降
* 基于生命周期的半自动管理：Rust

如何理解生命周期
* 在 C 中需要手动调用 free 去释放内存
* Rust 在编译器期间计算变量的使用范围
* 当变量不在使用时，编译器自动在源码中插入 free 代码

编译器是傲娇女王
* Rust 把变量分为可变和不可变，对于不可变的，一旦创建以后，就不能再修改。
* 所有权：对于任何给定的对象都只有一个绑定与之对应。
* 借用
  * 不可变借用，可变借用
  * 共享不可变，可变不共享：同一时刻，要么只有一个可变 &mut 借用，要么有多个不可变 & 借用，不能同时存在可变和不可变借用。当大家都在读一个东西的时候，是不能写的。当一个人在写的时候，别人是不能读的。

## 小试牛刀
安装 Rust 工具链
* rustup：负责安装 Rust、切换 Rust 版本、下载标准库文件等
* rustc：Rust 的编译器（一般通过 cargo 命令调用）
* cargo：Rust 的项目管理工具（类似 Node 的 NPM）

初始化与编译
* cargo new projectName
* cargo build
* cargo build --release 性能更好，文件更小，去除了 debug 信息
* cargo run 调试代码

Rust 安装
```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装 WebAssembly 工具链
* wasm-pack：用于将 Rust 项目打包成单个 `.wasm` 文件，运行 `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh` 安装。
* cargo-generate 用于快速生成 WebAssembly 项目的脚手架，运行 cargo install cargo-generate 即可安装。

完成 cargo-generate 的安装后，通过如下方式创建 WebAssembly 项目
```shell
cargo generate --git https://github.com/rustwasm/wasm-pack-template
```

尝试一个求斐波拉契数列的例子
```rs
extern crate cfg_if;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

// 通过如下标记，即可实现自动生成 WASM 函数接口
#[wasm_bindgen]
pub fn fib(i: u32) -> u32 {
    match i {
        0 => 0,
        1 => 1,
        _ => fib(i-1) + fib(i-2)
    }
}
```

运行 `wasm-pack build` 命令，即可编译出 WebAssembly 模块，wasm-pack 会在项目的 pkg 目录下生成 `.wasm` 等文件。
* xxx.wasm：rust 编译成 wasm 的源代码
* xxx.js：JavaScript 粘合剂代码，导入 DOM 和 JavaScript 代码至 Rust，同时导出 Rust 函数给 JavaScript
* xxx.d.ts：用于支持 TypeScript 的声明文件
* package.json：用户协助我们发包

## 奇怪的问题
cargo 命令提示 blocking waiting for file on package cache，如果确定没有多个程序占用，可以通过删除 `~/.cargo/.package-cache` 文件解决

cargo 安装太慢，具体见[Rust Crates 源使用帮助](https://mirrors.ustc.edu.cn/help/crates.io-index.html)
1. 进入当前用户所在目录下的 `.cargo` 目录
2. 新建 config 文件
3. 写入替换源的配置如下
```shell
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
```