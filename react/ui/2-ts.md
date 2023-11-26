typescript
* 类型系统
* 从 es6 到 es10 甚至 esnext 的语法支持

工具
* nvm

interface
* 对象形状（shape）进行描述
* 类（class）进行抽象
* Duck Typing（鸭子类型）

常量枚举：const enum
* 可以提升性能，因为不会编译成 JS 对象，而是进行直接替换

泛型
* 在定义函数、接口或类时，不声明具体类型，而是在使用时确定类型
* 泛型约束
* 应用场景：函数、类和接口
* 类型别名一个常用的使用场景：联合类型

声明文件
* 后缀名格式：.d.ts，在 vscode 中默认打开时全局生效
* 特殊关键字：declare
* 默认全局作用域，通过 export 关键字转为模块作用域

使用 interface 描述一个函数，且函数本身带带方法
```ts
interface ICalculator {
  (operator: 'plus' | 'minis', numbers: number[]): number;
  plus: (numbers: number[]) => number;
  minis: (numbers: number[]) => number;
}
```

配置文件
* tsconfig.json
* include 比 files 更强大，直接 glob pattern
* compileOptions
  * outDir
  * module 指定输出 module 类型
  * target 指定输出版本，如 es5
  * declaration 是否输出声明文件