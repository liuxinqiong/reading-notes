3. typescript 高级类型之条件类型
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

mouseEvent.stopImmediatePropagation();

Diff 算法
* react 技术揭秘：https://react.iamkasong.com/
* https://zhuanlan.zhihu.com/p/20346379
* https://github.com/aooy/blog/issues/2
* http://blog.vjeux.com/2013/javascript/react-performance.html

设备分辨率、物理分辨率

响应式设计