TypeScript
* declare module/namespace
* d.ts 结尾的文件会被 TypeScript 默认导入到全局，但是其中不能使用 import 语法，如果需要引用需要使用三斜杠。

## 基础类型
先看看 ES6 提供的基础类型有：boolean/number/string/Array/function/object/symbol/undefined/null

TypeScript 基础类型有：Boolean/Number/String/Array/Function/Object/Symbol/undefined/null/**void**/**any**/**never**/**元组（Tuple）**/**枚举**

> 注意 `Array<number | string>` 并不等同于 `number[] | string[]`

元组：限定元素个数与类型的数组

symbol：表示独一无二的值

枚举类型
* 默认数字枚举，从 0 开始，支持反向映射
* 字符串枚举，不支持反向映射

never、unknown、any
* never：异常了、死循环了，对应空集，即使是 undefined 或 null 也不能赋值给 never
* unknown：所有类型都可以分配给 unknown，只能将 unknown 类型的变量赋值给 any 和 unknown
* any：任何类型

## 类型检查
类型推断场景
* 初始化变量
* 设置函数默认参数
* 函数返回值类型

类型兼容性
* 结构之间兼容：成员少的兼容成员多的
* 函数之间兼容：参数多的兼容参数少的

类型保护：特定的区块中保证变量属于某种类型

类型断言
* 用自己声明的类型覆盖类型推断
* `express as type` 或 `<type>express`

类型保护
* 创建区块的办法：`instanceof`、`typeof`、`in` 以及类型保护函数
* 类型保护函数：特殊的返回值 `arg is type`

类型保护函数是个很有意思的东西，你可以看下 Array.isArray 的 TS 定义，因为使用该函数时，你是知道它的确可以创建区块的，它使用的就是类型保护函数，定义如下
```ts
isArray(arg: any): arg is any[];

// 举个例子
function isJava(lang: Java | JavaScript): lang is Java {
    return (lang as Java).helloJava !== undefined
}
```

## 高级类型
常用的高级类型大致分为如下几类
* 交叉类型：混入（&）
* 联合类型：多类型支持（|）
* 字面量类型：限定变量取值范围（数字字面量、字符串字面量）
* 索引类型：从一个对象中选取某些属性值
* 映射类型：从旧类型创建出新类型
* 条件类型：T extends U ？X : Y（如果类型 T 可以赋值给 U，那么结果类型就是 X，否则就是 Y）

条件类型举例
```ts
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type Diff<T, U> = T extends U ? never : T
```

具体索引类型的方式
* `keyof T`：类型 T 公共属性名的字面量联合类型
* `T[K]`：对象 T 的属性 K 所代表的类型
* `typeof`：获取实例对应的类型

映射类型
* `Readonly<T>`：将 T 的所有属性变为只读
* `Partial<T>`：将 T 的所有属性变为可选
* `Pick<T, K>`：选取以 K 为属性的对象 T 的子集
* `Omit<T, K>`：排除以 K 为属性的对象 T 的子集
* `Record<K, T>`：创新属性为 K 的新对象，属性值的类型为 T

条件类型
* `Exclude<T, U>`：从 T 中剔除可以赋值给 U 的类型
* `Extract<T, U>`：提取 T 中可以赋值 U 给的类型
* `NonNullable<T>`：从 T 中除去 undefined 和 null
* `ReturnType<T>`：获取函数的返回值类型

## 泛型
泛型的好处
* 增强程序的可扩展性：函数或类可以轻松支持多种数据类型
* 增强代码的可读性：不必写多条函数重载，或冗长的联合类型声明
* 灵活的控制类型之间的约束

泛型常见使用场景
* 泛型函数
* 泛型接口
  * 有个很好的使用场景：**某个属性有多种可能时，可通过泛型传入，从而拥有一个确定的类型**
* 泛型类
  * 泛型不能应用于类的静态成员
* 泛型约束
* 泛型默认值：比如 T = {}，使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

定义泛型函数类型与泛型约束示例
```ts
// 定义泛型函数类型
type Generic = <T>(arg: T) => T;

// 泛型约束 T 必须具有 U 的属性
T extends U;

interface Length {
    length: number
}
function logAdvance<T extends Length>(value: T): T {
    console.log(value, value.length);
    return value;
}
```

> 多个类型参数，泛型不只是能用 T，你能用你想用的任何大写字母，且可同时使用多个，比如针对 keyof 出来的属性，通常用 K 接受

## 声明合并
声明合并：多个具有相同名称的声明会合并为一个声明
* 接口合并
  * 非函数成员保证唯一性
  * 函数成员成为函数重载
* 命名空间
  * 命名空间之间合并：导出的成员变量不可重复定义或实现
  * 命名空间与类合并：为类增加静态成员
  * 命名空间与函数合并：为函数添加属性和方法
  * 命名空间与枚举合并：为枚举添加属性和方法

## 命名空间
命名空间：实现原理 - 立即执行函数构成的闭包
* 局部变量对外不可见
* 导出成员对外可见
* 多个文件可共享同名命名空间
* 依赖关系 /// <reference path="">

具体例子
```ts
// a.ts
namespace Shape {
    const pi = Math.PI
    export function circle(r: number) {
        return pi * r ** 2
    }
}
// b.ts
/// <reference path="a.ts" />
namespace Shape {
    export function square(x: number) {
        return x * x
    }
}
```

## TSCONFIG.JSON
简单聊聊相关配置
* 文件选型
* 编译选项
* 工程引用

文件选型
* files：需要编译的单个文件列表
* include：需要编译的文件或目录
* exclude：需要排除的文件或目录
* extends：配置文件继承

编译选项
* incremental：增量编译
* target：目标语言
* module：目标模块系统
* outFile：将多个依赖文件生成一个文件（amd 模块）
* lib：TS 需要引用的库，即声明文件，es5 默认 "dom", "es5", "scripthost"
* allowJs：允许编译 JS
* checkJs：允许在 JS 文件中报错，通常与 allowJS 一起使用
* outDir：输出目录
* rootDir：输入目录，用于调整输出目录结构
* declaration：生成声明文件
* declarationDir：声明文件的路径
* emitDeclarationOnly：只生成声明文件
* sourceMap：生成 sourceMap
* inlineSourceMap：生成目标文件的 inline sourceMap
* declarationMap：生成声明文件的 sourceMap
* typeRoots：声明文件目录，默认 node_modules/@types
* types：声明文件包
* removeComments：删除注释
* noEmit：不输出文件
* noUnusedLocals：检查只声明，未使用的局部变量
* noUnusedParameters：检查未使用的函数参数
* noFallthroughCasesInSwitch：防止 switch 语句贯穿
* noImplicitReturns：每个分支都要有返回值
* strict
  * allowStrict：注入 use strict
  * noImplicitAny：不允许隐式 any
  * strictNullChecks：严格 null 检查
  * strictFunctionTypes：严格函数类型检查
  * strictPropertyInitialization：类成员变量必须初始化
  * strictBindCallApply：call、apply、bind context 检查
  * noImplicitThis：不允许隐式 this 调用，常用类函数返回一个函数
* esModuleInterop：允许 export = 导出，由 import from 导入
* allowUmdGlobalAccess：允许模块中访问 umd 全局变量
* moduleResolution：模块解析策略
* baseUrl：解析非相对模块的基地址
* paths：路径映射，相对于 baseUrl
* rootDirs：将多个目录放在一个虚拟目录下，方便运行时访问

工程引用
* composition：工程可以被引用或进行增量编译
* declaration：必须开启
* references：该工程依赖的工程
* tes --build 模式：单独构建一个工程，依赖工程也会被构建

## 实践
创建 React 组件时，我们可以手动定义所有 props 类型，同时 React 也提供了 React.FC<P>，特点就是隐含 children 声明

Redux 与类型
```ts
type Action = {
    type: string;
    payload: any; // Redux 的特点注定这个 any 无法避免，除非使用 | 列举所有情况，但很麻烦
}
// 注意这里的 readonly
type State = Readonly<{
    user: User | null;
}>
const initialState: State = {
    user: null;
}
export default function(state = initialState, action: Action) {
    switch(action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload as User; // 注意这里的 User 很重要
            }
        default:
            return state;
    }
}
```

自定义 useMergeState hooks
```ts
import { useState, useCallback, Dispatch, SetStateAction } from 'react';

function useMergeState<T = {}>(initial: T) {
  const [state, setState] = useState<T>(initial);

  const mergeSetState = useCallback(
    <K extends keyof T>(
      updater: ((prevState: Readonly<T>) => Pick<T, K> | T | null) | (Pick<T, K> | T | null),
    ) => {
      setState(prev =>
        updater instanceof Function ? { ...prev, ...updater(prev) } : { ...prev, ...updater },
      );
    },
    [],
  );

  return [state, mergeSetState as Dispatch<SetStateAction<Partial<T>>>] as const;
}

export default useMergeState;
```

官方工具：Omit、Readonly、Partial、Required 的实现
```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}

// 全键可选
type Partial<T> = {
    [P in keyof T]?: T[P];
};


type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

## 进阶

### interface 和 type 有什么区别？
* type 不能被 extends，interface 可以
* 同名 type 不能被重复定义，interface 会将同名合并成一个类型
* type 可以使用合并类型 &，使用联合类型 |、定义元组类型、声明函数类型
* 具体使用哪个，主要看意图。interface 适合用于描述对象，type 定义函数以及复杂类型

### module vs namespace

### infer

## 资料
* [TypeScript 入门教程](https://ts.xcatliu.com/)
* [了不起的 TypeScript 入门](https://juejin.im/post/6844904182843965453)
* [一文读懂 TypeScript 泛型及应用](https://juejin.im/post/6844904184894980104)
* [React+TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react)