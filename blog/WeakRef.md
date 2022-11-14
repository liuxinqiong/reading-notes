# Weak
WeakRef 对象允许您保留对另一个对象的弱引用，而不会阻止被弱引用对象被 GC 回收.

对象的弱引用是指当该对象应该被 GC 回收时不会阻止 GC 的回收行为。

函数 deref()：返回当前实例的 WeakRef 对象所绑定的 target 对象，如果该 target 对象已被 GC 回收则返回undefined。

你不能更改 WeakRef 的 target，它将始终是第一次指定的 target 或者在回收该 target 时会定义

WeakSet and WeakMap
* WeakSet
  * 只能是对象的集合
  * 集合中对象的引用为弱引用，如果没有其他的对 WeakSet 中对象的引用，那么这些对象会被当成垃圾回收掉
* WeakMap
  * 键必须是任意对象，值可以是任意的
  * 持有的是每个键对象的弱引用，当没有其他引用存在时垃圾回收能正确进行

用例：检测循环引用
```js
function execRecursively(fn, object, refs = new WeakSet()) {
  if(refs.has(object)) {
    return;
  }
  fn(object);
  if(typeof object === 'object') {
    refs.add(object);
    for(const key in object) {
      execRecursively(fn, object[key], refs)
    }
  }
}
```