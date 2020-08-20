2. 构造函数中提前返回会怎么样
3. typescript 高级类型之条件类型
4. match/exec/matchAll
5. html 自定义属性，需要手动传递
6. 利用 setXXX 和 dispatch 的稳定性，在 oop 中进行反向操作，或者 oop 对象发射事件
7. three 设置对象不能被拾取
```js
object.traverse(child => {
    child.layers.disableAll()
    // child.layers.enableAll() // 恢复
})
```
8. useEffect 非预期的方式执行
  * 通过 previous value 进行值比较，限定需要关心的值范围
  * 使用 ref 避过
9. antd/es vs antd/lib：https://github.com/ant-design/ant-design/issues/20847

泛型高级用法：http://zhangchen915.com/index.php/archives/715/

如何设置一个对象泛型、箭头函数如何添加函数泛型声明、声明一个联合声明（函数声明和普通对象声明）的注意事项
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

typescript 关键字
* extends：三元表达式
* type：if 子句
* infer：从一个结构中提取类型
* typeof
* keyof

```ts
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
```

多种类型
* 继承类型
* 条件类型
* 映射类型
* 元素类型
* 交叉类型 &
* 联合类型 |

全集和空集
* any 类型：对应全集，泛指一切可能的类型
* never 类型：对应空集，即使是 undefined 或 null 也不能赋值给 never
* unknown

类型断言
* <类型>值
* 值 as 类型

泛型
* 多个类型参数，泛型不只是能用 T，你能用你想用的任何大写字母，且可同时使用多个
* 默认值：比如 T = {}，使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。
* 泛型约束：extends 关键字

更多类型工具

如何引用一个类型的子类型：A['a']

补充：对于事件机制，会存在多个地方发布事件修改同一个值的情况，如果出现问题会导致不易排查，不知道被谁意外修改。建议给每个派发事件的地方，增加一个 target 属性，方便排查

最近发现自己写 CSS 手好生，很不熟练，比如 background 属性
* background-size
  * 初始值：auto auto，以背景图片的比例缩放背景图片。
  * contain：保证整张图片被包含进去，不保证填满整个容器
  * cover：保证填满整个容器，不保证图片显示完全，尽可能大的缩放背景图像并保持宽高比例，以它的全部宽或者高覆盖所在容器
  * apx bpx：设置宽度为 a，高度为 b，如果只设置一个值，则仅设置宽度，高度通过维持长宽比来确定
  * a% b%：相对背景区的百分比，背景区由 background-origin 设置，宽度为 w * a%，高度为 h * b%，如果只设置一个值，则仅设置宽度，高度通过维持长宽比来确定
  * 逗号分隔多个值，设置多重背景
* background-position：为每一个背景图片设置初始位置，位置相对于由 background-origin 定义的图层
  * 默认值：默认从 top left 处开始绘制
  * 关键字：top、left、bottom、right、center
  * 如果被定义为两个值，那么第一个值代表水平位置，第二个代表垂直垂直位置。如果只指定一个值，那么第二个值默认为 center。
  * 百分比值：指定图片的相对位置和容器的相对位置重合
* background-attachment
  * fixed：背景区为浏览器可视区，即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动。
  * local：相对于元素的内容固定，如果元素拥有滚动机制，背景将会随着元素的内容滚动
  * scroll：相对于元素本身固定，而不是随着内容滚动
* background-clip：对背景进行切割
  * border-box
  * padding-box
  * content-box
  * text：内容被裁剪成文字的前景色
* background-origin：定义背景位置的起始点
  * 当 background-attachment 为 fixed 时，该属性不起作用
  * padding-box: 默认为盒模型的内容区与内边距
  * content-box：只有内容区
  * border-box：内容区与内边距，还包括边框
* background-image
  * 提供由逗号分隔的多个值来指定多个背景图像，可指定多个图形，先指定的图像会在之后指定的图像上面绘制。因此指定的第一个图像“最接近用户”。
* background-repeat
  * repeat、no-repeat：会存在裁剪
  * round：随着允许的空间在尺寸上的增长
  * space：尽可能重复，但不裁剪
  * 双值语法中, 第一个值表示水平重复行为, 第二个值表示垂直重复行为

Less 中 ~ 的含义
* import 路径中的 ~ 是 less-loader 提供的路径别名机制
* 表达式中带的，表示不由 Less 计算编译出结果，而是保持原样输出

绘制权限相关流程图
1. 参考 Antd Pro
2. 搜索资料
3. 权控组件

关于类型文件
* models
* types
* typings

箭头函数泛型
```ts
<T>(func: (state: ConnectState) => T) => T
```

比较复杂的使用场景
```ts
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;
export default interface RouterTypes<T extends Object = {}, P = {}> extends BasicRouteProps {
  computedMatch?: match<P>;
  route?: RouteType & T;
}
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
export interface ConnectProps<P extends { [K in keyof P]?: string } = {}, S = LocationState> {}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type WrappedLoginItemProps = Omit<LoginItemProps, 'type' | 'updateActive'>;

```

Three `depthWrite`