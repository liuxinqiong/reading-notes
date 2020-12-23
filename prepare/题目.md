怎么判断一个对象是不是可迭代对象
```js
const isIterable = obj => obj != null && typeof obj[Symbol.iterator] === 'function';
```