Rust 回顾需加强的点
1. trait objects
2. Option/Result/unwrap/?
3. 解引用 *

## trait objects
Rust 要求 if-else 两个分支的返回值类型必须相同，那能不能让函数返回多种类型呢？首先要明白，Rust 之所以要求函数不能返回多种类型是因为 Rust 需要在编译期确定返回值占用的内存大小，不同类型的返回值其内存大小不一定相同。既然如此，我们可以通过把返回值通过 Box **装箱**，返回一个胖指针，这样就可以确定返回值大小。

先学习下 Box，Box 允许你将一个值放在堆上而不是栈上。留在栈上的则是指向堆数据的指针。Box 没有性能损失，所用于如下场景
* 当有一个在编译时未知大小的类型，而又想要在需要确切大小的上下文中使用这个类型值的时候
* 当有大量数据并希望在确保数据不被拷贝的情况下转移所有权的时候
* 当希望拥有一个值并只关心它的类型是否实现了特定 trait 而不是其具体类型的时候，这时被称为 trait objects

> warning: trait objects without an explicit `dyn` are deprecated，因此现在使用 trait objects 需要添加 dyn 关键字

Rust 如何确定一个类型需要多少空间，比如如下枚举，Message 值所需的空间等于储存其最大成员的空间大小
```rs
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

当代码中包含多态时，需要有一种机制来确定实际运行的是哪个类型，这种机制叫做分发，有两种主要形式的分发，静态分发和动态分发。Rust 更倾向于静态分发，但同样支持通过 trait objects 机制支持动态分发。

静态分发与动态分发
* 静态分发以 impl Trait 的方式实现，通过单态化，编译器消除了泛型，而且没有性能损耗，但大量使用有可能造成二进制文件膨胀。静态分发虽然有很高的性能，但缺点就是无法让函数返回多种类型。因为它发生在编译期，也叫做早绑定
* 动态分发以 trait object 的概念通过虚表实现，会带来一些运行时开销，因为 trait object 与 Trait 在不引入 dyn 的情况下经常导致语义混淆，所以特地引入了 dyn 关键字。因为它发生在运行期，也叫做晚绑定

Rust 的 trait object 使用了与 c++ 类似的 vtable 实现，trait object 含有一个指向实际类型的 data 指针，和一个指向实际类型实现 trait 函数的 vtable，以此实现动态分发

## Option/Result/unwrap/?
Option 表示可空变量。

Result 表示包含错误信息的结果，可以理解成一个加强版本的 Option，因为 Result 包含了错误相关信息，这是 Option 中所没有的。

unwrap 表示故障时执行 panic，在开发过程中，当我们更关心程序的主流程时，unwrap 可以作为快速原型使用。

`?` 表达式表示故障时返回 Err 对象，这是不同于 panic 的一种遇到错误的处理方式，由于通常 Error 我们都是可以处理的，因此 `?` 更常用。

> `?` 和 unwrap 可以不仅可以用来处理 Result，对于 Option 也是可以的

## 解引用 *
解引用可以分为：自动解引用和手动解引用。

Rust 为了减少某些场合下重复解引用导致的代码美观问题，在编译期做了一些智能识别功能，比如 &T 参数的参数被调用的使用，你传 &&……&&& 都可以自动解引用，直到符合函数的参数类型为止。

> 借用是 & 操作符，解引用是 * 操作符

Rust 已经为所有的 &T 和 &mut T 的类型默认实现了简陋的 Deref，解引用就是得到 T 本身。

手动实现一个解引用
```rs
use std::ops::Deref;
struct DemoStruct {
    name: &'static str
}
impl Deref for DemoStruct {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        println!("defef execute");
        &*self.name
    }
}
fn check(s: &str) {
    println!("check finish {}", s);
}
fn main() {
    let a = DemoStruct {name: "test"};
    check(a)
}
```