## Math
什么是反函数：对于 y = f(x)，如果存在一个函数 g 是的，g(y) = g(f(x)) = x，那么 x = g(y) 就是反函数

几个常见但是比较生疏的数学函数
* acos：反余弦
* asin：反正弦
* atan：反正切
* atan2
  * 可返回从 x 轴到点 (x,y) 之间的角度
  * -PI 到 PI 之间的值，是从 X 轴正向逆时针旋转到点 (x,y) 时经过的角度
  * = atan(y/x)

项目开发中在根据两点获取角度时， atan 和 atan2 的计算结果在 x 为负数时，结果不是一样的
```js
// 使用 atan
export function calRotateAngle(start: [number, number], end: [number, number]) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  let angle = (180 * Math.atan(dy / dx)) / Math.PI;
  if (dx < 0) {
    angle -= 180;
  }
  return angle;
}
// 使用 atan2
export function calRotateAngle(start: [number, number], end: [number, number]) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const angle = (180 * Math.atan2(dy, dx)) / Math.PI;
  return angle;
}
```

atan vs atan2 结论
* 推荐使用 atan2，因为内部会处理 dx 为 0 的情况
* atan2 的取值范围为 [-Math.PI, Math.PI]，逆时针为正，顺时针为负
* atan 的取值范围需要用象限来解释，一二三四象限依次为：正负正负。表示与 x 轴的夹角