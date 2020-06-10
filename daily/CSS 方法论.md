CSS 方法论

## 是什么
为了提高 CSS 的可维护性和拓展性而衍生出的一种 CSS 样式名的原则、概念以及命名规范。

## BEM 方法论
BEM 分别指 Block、Element、Modifier 组成。

## Block
Block 可以看作是 WebComponents 中的 Component，它是独立的，并且可复用的。它描述了模块是什么，但不会描述模块的外观和特性。比如 error 和 red 中选取的话，error 才是正解。

每个 Block 应该是独立的，它可以包含其他 Block。不收外界影响的，也不影响外界的。

## Element
Element 是 Block 的一部分，不能单独存在。也是用来描述 DOM 是什么，而不是外观和特性。举个例子，tablist-item 和 tablist-selected-item 中 tablist-selected-item 是错误的，因为它表示了选中状态。

和 Block 不同，Element 不能包含其他 Element，他是最小组成元素

## Modifier
Modifier 用来定义 Block 和 Element 的状态，比如外观、样式和属性等特性。通过 Modifier 可以区分不同的 Block 和 Element，比如选中态 selected

Modifier 通常可以在运行时被动态改变，表示状态的迁移和转换

BEM 定义了两种定义 Modifier 的方法
* 布尔命名方式：用来表示 DOM 中某种状态是否存在，比如 disabled、focused
* 键值对命名方式：用来表示 DOM 的某些属性等于什么值的，比如 input-type-radio

## 命名范式
经典 BEM 范式
1. 所有样式名全部小写
2. 同一类型单词之间使用短线-连接
3. Block 和 Element 使用两个下划线__连接，Modifier 与 Block 和 Element 之间使用一个下划线_连接

BEM-like 范式
* 双短线范式：将 Element 和 Modifier 以及键值对的 Modifier 之间均使用双短线连接
* 骆峰命名范式：同一类型单词之间使用小驼峰
* React 命名范式：Block 和 Element 采用大驼峰，使用一个短线连接，Modifier 采用小驼峰，Element 与 Modifier 以及键值对的 Modifier 之间均使用下划线连接

## 困惑
命名 CSS 样式的工作加倍增长。那么如何降低 BEM 给我们带来的工作量和复杂度，同时保证样式命名的准确性呢。

使用 CSS Modules，我们可以利用设置，让 CSS Modules 帮助我们完成一部分 BEM 命名工作