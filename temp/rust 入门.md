Rust 特点
* 系统编程语言
* 惊人的运行速度
* 内存安全
* 线程安全
* 优秀的泛型支持
* 模式匹配
* 类型推断

初始化与编译
* cargo new projectName
* cargo build
* cargo build --release 性能更好，文件更小，去除了 debug 信息
* cargo run 调试代码

调用宏与函数
* 宏需要在名称结尾使用 !
* 函数直接使用名称即可

变量与可变性
* 变量与常量之分
* 变量再细分为可变变量与不可变变量
* 默认情况下变量是不可变的
* let 声明变量，如果需要可变，则使用 let mut
* const 声明常量，且必须声明类型，eg：const X: i32 = 2;
* 常量与变量的差异
  * 常量不仅是不可变的，并且使用是不可变的，因为不能使用 mut 修饰
  * 常量可以在全局声明
  * 常量只能设置为常量表达式，不能设置为函数的调用结果，或者是只能在运行时候的其他任何值

数据类型
* 如何判断静态还是动态：不允许字符串和整数相加，编译期报错则为静态类型，运行期报错则为动态
* 如何判断强类型还是弱类型：弱类型最大的特点是隐式的类型转换
* 整数
  * 无符号整数：u8,u16,u32,u64,usize，默认为 32
  * 有符号整数：i8,i16,i32,i64,isize，默认为 32
  * size 表示和计算机位数相关，尽量不要使用 usize 和 isize
  * 如果能确保不是负数，有限使用无符号整数，无符号整数中优先使用 u32
* 浮点数：f32/f64，默认 f64
* 布尔值
* 字符
  * Unicode 编码，总是 4 bytes 大小
  * 单引号
* 字符串：&str | String
* 数组
  * 固定长度，相同类型
  * 方括号包围
  * 显示声明类型格式为 let a: [i32, 5]

流程控制
* 判断（if）
  * 括号可以省略
  * 表达式必须是 bool 值
  * 是表达式，可以有返回值，比如实现三目表达式功能，let number = if condition { 5 } else { 6 };
* 循环（loop、while、for）
  * loop 表示一直循环，除非使用 break 语句
  * while 可理解为带停止条件的 loop 循环
  * for 通常用于遍历集合，eg：for ele in a.itr()

结构体、函数和方法
* 结构体还是对象
  * 程序 = 数据结构 + 算法
  * 结构体 = 数据的集合
  * 对象 = 数据 + 算法的集合
  * 关键字 struct
* 函数：使用 fn
* 为结构体定义方法
  * 使用 impl 关键字
  * 第一个参数永远为 self 关键字，表示调用该方法的结构体实例
  * 方法定义在结构体的上下文中

struct 使用例子
```rs
struct User {
    name: String,
    age: u32,
    email: String,
}

fn say_hello(user: &User) {
    println!("name is {}", user.name);
}

impl User {
    fn say_hello(&self) {
        println!("name is {}", self.name);
    }
}

fn main() {
    let user = User {
        name: String::from("someone"),
        age: 32,
        email: String::from("someone@qq.com"),
    };
    // println!("name is {}", user.name);
    say_hello(&user)
}
```

泛型
* 使用尖括号
* 两个重要的泛型类型
  * Option<T> 代表有或无
  * Result<T, E> 代表成功或失败

先看看有趣的 if 表达式简写
```rs
fn largest2(a: u32, b: u32) -> u32 {
    if a > b {
        return a;
    } else {
        return b;
    }
}

// 有返回值的 if
fn largest(a: u32, b: u32) -> u32 {
    if a > b {
        a
    } else {
        b
    }
}

// 泛型 约束 std::cmp::PartialOrd 表示可比较大小
fn largest<T: std::cmp::PartialOrd>(a: T, b: T) -> T {
    if a > b {
        a
    } else {
        b
    }
}

largest::<f32>(5.5, 6.6);
// ::<f32> 可以省略，因为会自动推断
// largest(4, 5);

// enum Option<T> {
//     Some<T>,
//     None<T>,
// }

// enum Result<T, E> {
//     Ok<T>,
//     Err<E>,
// }

// 比如有个系统函数返回的结果为 Option 以及 Result
fn main() {
    match std::env::home_dir() {
        Some(data) => {
            println!("option is data = {:?}", data);
        }
        None => println!("option is none"),
    }
    match std::env::var("LANG") {
        Ok(data) => println!("ok! {:?}", data),
        Err(err) => println!("err {}", err),
    }
}
```

## 所有权
常见的内存管理模型
* C 语言的 malloc 和 free（手动管理，bug 制造机）
* GC：Golang，Java 等语法（自动管理），导致程序性能不可避免的下降
* 基于生命周期的半自动管理：Rust

先回忆堆和栈的区别
* 栈是先进先出的数据结构，每个元素都有固定的大小，通常是你机器 CPU 的位宽，比如是 64 位的机器，那么栈的宽度就是 64 位，也就是一个寄存器的大小。
* 那么要存储一个字符串该怎么办呢，因为它的长度是不固定的，因为无法使用栈进行存储，因为必须用到堆
* 堆的存放结构为：在栈中存放一个堆中的地址，在堆的地址上再存储字符串数据

如何理解生命周期
* 在 C 中需要手动调用 free 去释放内存
* Rust 在编译器期间计算变量的使用范围
* 当变量不在使用时，编译器自动在源码中插入 free 代码

所有权规则
* 在 Rust 中，每一个值都必须绑有一个变量，这就是这个值的所有者，每个值都会有自己的作用域（大括号创建作用域）。
* 所有权的唯一性，每一个值有且只有一个所有者
* 所有权转移：let a = b; 会导致 b 中的变量的所有者变成了 a，从而导致 b 不可用

引用
* 如何使用引用类型
  * 在函数入参类型前加一个取地址符号 &
  * 同时在使用函数时，也需要在变量前加取地址符号 &
* 引用规则
  * 不会获取所有权
  * 默认情况下是不可变的
  * 同一时间最多只能同时存在一个可变引用，主要是为了防止多线程下的数据竞争

总结：编译器是傲娇女王
* Rust 把变量分为可变和不可变，对于不可变的，一旦创建以后，就不能再修改。
* 所有权：对于任何给定的对象都只有一个绑定与之对应。
* 借用
  * 不可变借用，可变借用
  * 共享不可变，可变不共享：同一时刻，要么只有一个可变 &mut 借用，要么有多个不可变 & 借用，不能同时存在可变和不可变借用。当大家都在读一个东西的时候，是不能写的。当一个人在写的时候，别人是不能读的。

```rs
fn reverse_string1(str: String) -> (String, String) {
    return (str.clone(), str.chars().rev().collect());
}

fn reverse_string(str: &String) -> String {
    return str.chars().rev().collect();
}

fn main() {
    let s1 = String::from("abc");
    let s2 = reverse_string(&s1)
}

// 可变引用
fn append_str(s: &mut String) {
    s.push_str("abc");
}

fn main() {
    let mut s = String::from("lala");
    append_str(&mut s);
    println!("{}", s);
}
```

实践：反转二叉树

## 学习路径
1. [The Rust Programming Language](https://doc.rust-lang.org/book/)