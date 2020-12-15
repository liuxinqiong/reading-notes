TypeScript

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

## 声明文件
什么是声明文件：通常我们会把声明语句放到一个单独的文件，声明文件必需以 .d.ts 为后缀。

通常第三方库会定义好声明文件，我们直接使用实际，推荐使用 @types 统一管理第三方库的声明文件

当一个第三方库没有提供声明文件时，我们就需要自己书写声明文件了。

扩展知识：库的使用场景主要有一下几种
* 全局变量：通过 script 标签引入第三方库，注入全局变量
* npm：通过 import 方式引入，符合 ES6 模块规范
* UMD 库：既可以通过 script 引入，又可以通过 import 导入
* 直接扩展全局变量：通过 script 标签引入后，改变一个全局变量的结构
* 在 npm 包或 UMD 库中扩展全局变量：引用 npm 包或 UMD 库后，改变一个全局变量的结构
* 模块插件：通过 script 或 import 导入后，改变另一个模块的结构

声明文件主要有一下几种语法
* 声明全局变量：declare var/let/const
* 声明全局方法：declare function
* 声明全局类：declare class
* 声明全局枚举类型：declare enum
* 声明命名空间：declare namespace
  * 虽然 namespace 在模块系统中被淘汰了，但是在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。
  * 由于 d.ts 结尾的文件会被 TypeScript 默认导入到全局，因此暴露在最外层的 interface 或 type 会作为全局类型作用于整个项目中，我们应该尽可能的减少全局变量或全局类型的数量。故最好将他们放到 namespace 下
  * 注意：在 declare namespace 内部，直接使用 function、const、enum、class 即可，无需 declare
  * 如果对象拥有更深的层级，namespace 也支持嵌套，内部嵌套的 namespace 也无需 declare
* 声明全局类型：interface 和 type：注意，不需要 declare 哦

> 需要注意的是，声明语句中只能定义类型，切勿在声明语句中定义具体的实现

关于**声明合并**：多个具有相同名称的声明会合并为一个声明
* 接口合并
  * 非函数成员保证唯一性
  * 函数成员成为函数重载
* 命名空间
  * 命名空间之间合并：导出的成员变量不可重复定义或实现
  * 命名空间与类合并：为类增加静态成员
  * 命名空间与函数合并：为函数添加属性和方法
  * 命名空间与枚举合并：为枚举添加属性和方法

在我们尝试给一个 npm 包创建声明文件之前，需要先看看它的声明文件是否已经存在。一般来说，npm 包的声明文件可能存在于两个地方：
* 与该 npm 包绑定在一起。判断依据是 package.json 中有 types 字段，或者有一个 index.d.ts 声明文件。这种模式不需要额外安装其他包，是最为推荐的，所以我们自己创建 npm 包的时候，最好也将声明文件与 npm 包绑定在一起。
* 发布到 @types 里。我们只需要尝试安装一下对应的 @types 包就知道是否存在该声明文件，安装命令是 npm install @types/foo --save-dev。这种模式一般是由于 npm 包的维护者没有提供声明文件，所以只能由其他人将声明文件发布到 @types 里了。

假如以上两种方式都没有找到对应的声明文件，那么我们就需要自己为它写声明文件了。由于是通过 import 语句导入的模块，所以声明文件存放的位置也有所约束，一般有两种方案：
* 创建一个 node_modules/@types/foo/index.d.ts 文件，存放 foo 模块的声明文件。这种方式不需要额外的配置，但是 node_modules 目录不稳定，代码也没有被保存到仓库中，无法回溯版本，有不小心被删除的风险，故不太建议用这种方案，一般只用作临时测试。
* 创建一个 **types** 目录，专门用来管理自己写的声明文件，将 foo 的声明文件放到 types/foo/index.d.ts 中。这种方式需要配置下 tsconfig.json 中的 paths 和 baseUrl 字段。

npm 包的声明文件主要有一下几种语法
* export 导出变量
  * 与普通 TS 中的语法类似，区别仅仅在于声明文件中禁止定义具体的实现
  * 支持混用 declare 和 export，使用 declare 先声明多个变量，最后再用 export 一次性导出
* export namespace 导出（含有子属性的）对象
* export default ES6 默认导出：注意，只有 function、class 和 interface 可以直接默认导出，其他的变量需要先定义出来，再默认导出
* export =：针对 commonjs 导出模块
  * 关于 commonjs 模块的导入导出，整体导出使用 `module.exports = foo`，单个导出使用 `exports.bar = bar`，导入同时支持 require 和 import 语法
  * 对于 commonjs 规范的库，编写声明文件，就需要使用到 `export =` 语法

npm 包的声明文件与全局变量的声明文件有很大区别。**在 npm 包的声明文件中，使用 declare 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 export 导出，然后在使用方 import 导入后，才会应用到这些类型声明**。

对于 npm 包或 UMD 库，如果导入此库之后会扩展全局变量，则需要使用另一种语法在声明文件中扩展全局变量的类型，那就是 `declare global`。
```ts
declare global {
    interface String {
        preAppendHello(): string;
    }
}
// 注意即使此声明文件不需要导出任何东西，仍然需要导出一个空对象，用来告诉编译器这是一个模块的声明文件，而不是一个全局变量的声明文件。
export {};
```

更多声明场景
* export as namespace：有了 npm 包的声明文件，再基于它添加一条 export as namespace 语句，即可将声明好的一个变量声明为全局变量
* 直接扩展全局变量：有的第三方库扩展了一个全局变量，可是此全局变量的类型却没有相应的更新过来，就会导致 ts 编译错误，此时就需要扩展全局变量的类型。这里我们可以利用**声明合并**给某声明添加属性或方法
* 有时通过 import 导入一个模块插件，可以改变另一个原有模块的结构。此时如果原有模块已经有了类型声明文件，而插件模块没有类型声明文件，就会导致类型不完整，缺少插件部分的类型。ts 提供了一个语法 `declare module`，它可以用来扩展原有模块的类型。

声明文件中的依赖
* 通过 `import` 导入另一个声明文件中的类型
* 三斜线指令：随着 ES6 的广泛应用，现在已经不建议再使用 TS 中的三斜线指令来声明模块之间的依赖关系了。`types` 用于声明对另一个库的依赖，而 `path` 用于声明对另一个文件的依赖。

但是在声明文件中，它还是有一定的用武之地。与 import 的区别是，当且仅当在以下几个场景下，我们才需要使用三斜线指令替代 import：
* 当我们在书写一个全局变量的声明文件时：**在全局变量的声明文件中，是不允许出现 import, export 关键字的。一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。故当我们在书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了**
* 当我们需要依赖一个全局变量的声明文件时：在另一个场景下，当我们需要依赖一个全局变量的声明文件时，由于全局变量不支持通过 import 导入，当然也就必须使用三斜线指令来引入了

> 注意，三斜线指令必须放在文件的最顶端，三斜线指令的前面只允许出现单行或多行注释。

自动生成声明文件
* 如果库的源码本身就是由 TS 写的，那么在使用 tsc 脚本将 TS 编译为 js 的时候，添加 declaration 选项，就可以同时也生成 .d.ts 声明文件了。
* 使用 tsc 自动生成声明文件时，每个 TS 文件都会对应一个 .d.ts 声明文件。这样的好处是，使用方不仅可以在使用 `import foo from 'foo'` 导入默认的模块时获得类型提示，还可以在使用 `import bar from 'foo/lib/bar'` 导入一个子模块时，也获得对应的类型提示。

发布声明文件
* 将声明文件和源码放在一起
* 将声明文件发布到 `@types` 下

优先选择第一种方案。保持声明文件与源码在一起，使用时就**不需要额外增加单独的声明文件库的依赖**了，而且也能**保证声明文件的版本与源码的版本保持一致**。

仅当我们在给别人的仓库添加类型声明文件，但原作者不愿意合并 `pull request` 时，才需要使用第二种方案，将声明文件发布到 `@types` 下。

将声明文件和源码放在一起
* 如果声明文件是通过 tsc 自动生成的，那么无需做任何其他配置，只需要把编译好的文件也发布到 npm 上，使用方就可以获取到类型提示了
* 如果是手动写的声明文件，那么需要满足以下条件之一，才能被正确的识别
  * 给 package.json 中的 `types` 或 `typings` 字段指定一个类型声明文件地址
  * 在项目根目录下，编写一个 `index.d.ts` 文件
  * 针对入口文件（package.json 中的 `main` 字段指定的入口文件），编写一个同名不同后缀的 .d.ts 文件

具体类型寻找步骤
1. 查找 package.json 的 `types` 或 `typings` 字段
2. 如果没有，就会在根目录下寻找 `index.d.ts` 文件，将它视为此库的类型声明文件
3. 如果没有找到 `index.d.ts` 文件，那么就会寻找入口文件（package.json 中的 `main` 字段指定的入口文件）是否存在对应同名不同后缀的 .d.ts 文件
4. 都不存在的话，就会被认为是一个没有提供类型声明文件的库了

将声明文件发布到 @types 下
* 与普通 npm 模块不同，`@types` 是统一由 DefinitelyTyped 管理的。要将声明文件发布到 `@types` 下，就需要给 DefinitelyTyped 创建一个 pull-request，其中包含了类型声明文件，测试代码，以及 tsconfig.json 等
* pull-request 需要符合它们的规范，并且通过测试，才能被合并，稍后就会被自动发布到 `@types` 下。

## 命名空间
namespace 是 TS 早期时为了解决模块化而创造的关键字，称为 Internal Modules，先与 ES6 提出的 module system。

命名空间：实现原理 - 立即执行函数构成的闭包
* 局部变量对外不可见
* 导出成员对外可见
* 多个文件可共享同名命名空间
* 依赖关系 `/// <reference path="">`

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
由于历史遗留原因，在早期还没有 ES6 的时候，TS 提供了一种模块化方案，使用 module 关键字表示内部模块。但由于后来 ES6 也使用了 module 关键字，TS 为了兼容 ES6，使用 namespace 替代了自己的 module，更名为命名空间。

namespace 是早期 TS 为解决模块化而提出的方案，那么和 ES6 Module 有啥区别呢
* Module 包含代码实现也包含声明，Module 可以依赖其他模块（Commonjs/Require.js/ES Modules），提供了更好的代码复用，作用域隔离以及打包优化。
* namespace 是通过 TypeScript 方式组织代码，不同于 Module，namespace 可以跨文件，但在大型应用中，会导致依赖难以识别
* TS 里的 namespace 是跨文件的，JS 里的 module 是以文件为单位的，一个文件一个 module。

当我们通过 import 语法导入一个 Module 时，TS 编译器是如何定位 Module 的类型信息的呢
* 编译器尝试通过合适的路径寻找 `.ts`、`.tsx` 与 `.d.ts` 文件
* 如果没有找，编译器将寻找环境模块声明（需要定义在 `.d.ts` 中）

你通常不应该通过 namespace 命名模块内容，命名空间的一般思想是提供结构的逻辑分组并防止名称冲突。由于模块文件本身已经是一个逻辑分组，它的顶级名称是由导入它的代码定义的。没有必要为导出的对象使用额外的模块层。

在 TS1.5 以后，推荐全面使用 namespace 代替 module，因为 JS 本身就有 module 的概念，但 TS 里之前的 module 关键字与他们都不太相同，所以为避免概念上的混淆，换一个关键字加以区分。实际语法上 namespace 等价于 TS 之前的 module，同时**推荐代码中不要再出现 module 关键字，这个关键字基本上变成了一个编译后和运行时里的概念，留给纯 JS 中使用**。

随着 ES6 的广泛应用，现在已经不建议再使用 TS 中的 namespace，而推荐使用 ES6 的模块化方案了，故我们不再需要学习 namespace 的使用了。

### infer

### 函数相关

#### 接口定义函数
我们也可以使用接口的方式来定义一个函数需要符合的形状
```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

#### 函数重载
使用重载定义多个 reverse 的函数类型
```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

> TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

## 资料
* [TypeScript 入门教程](https://ts.xcatliu.com/)
* [React+TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react)
* [了不起的 TypeScript 入门](https://juejin.im/post/6844904182843965453)
* [一文读懂 TypeScript 泛型及应用](https://juejin.im/post/6844904184894980104)