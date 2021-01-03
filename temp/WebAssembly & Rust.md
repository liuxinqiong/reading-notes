由于 WASM 是静态类型，因此很难直接使用我们熟悉的 JavaScript 来直接编写，目前的 WASM 都是通过其他静态语言编译而来。比如 AssemblyScript、C++、Rust、Go，相对来说，使用 Rust 开发在开发效率和便捷性、包体积大小、对 WASM 的支持度相对完善、社区活跃度高等方面有很大的优势。因此了解下使用 Rust 开发 WebAssembly。

使用 WebAssembly 的原因
* 关注性能敏感代码：使用 Rust 你根本不需要成为 JS 优化专家，不需要熟悉 JIT 内部实现，不需要魔法也能加速。
* 集成方便：直接编译为 `.wasm`，使得现有的 JS 代码库可以增量式部分采用 Rust。而且还可以保持你现有代码库，不需要重写。

Rust 是 Mozilla 开发的一门静态的支持多种范式的系统编程语言。 它有着惊人的运行速度，能够防止内存错误，并保证线程安全。

Rust 在 WASM 生态颇有建树，如 wasm-bindgen、stdweb 等轮子使得我们编写 WASM 应用更加容易。

Rust 工具链
* rustup：负责安装 Rust、切换 Rust 版本、下载标准库文件等
* rustc：Rust 的编译器（一般通过 Cargo 命令调用）
* cargo：Rust 的项目管理工具（类似 Node 的 NPM）
* 运行：`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` 即可安装

WASM 工具链
* wasm-pack 用于将 Rust 项目打包成单个 WASM 文件（类似 Webpack），运行 `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh` 安装。
* cargo-generate 用于快速生成 WASM 项目的脚手架（类似 create-react-app），运行 cargo install cargo-generate 即可安装。