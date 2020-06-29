1. 理解 antd form 表单中 shouldUpdate 和 dependencies
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
9. antd/es vs antd/lib：https://github.com/ant-design/ant-design/issues/20847

http://zhangchen915.com/index.php/archives/715/

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