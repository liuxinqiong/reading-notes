Matrix 相关源码
```js
class Matrix4 {
    set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		const te = this.elements;

		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;

	}
}

```


矩阵乘法与几何意义
* 行*列
* 矩阵应用向量上：实现平移、旋转、缩放、剪切、正交或透视等变换
* 矩阵应用矩阵上

three.js 中矩阵存储
* 内部存储是列优先 column-major 顺序存储在数组中
* 表达和描述的仍然是线性代数中行主序，set 方法参数采用行优先 row-major

任何 3D 物体 Object3D 都有三个关联的矩阵：
* Object3D.matrix: 存储物体的本地变换矩阵。 这是对象相对于其父对象的变换矩阵。
* Object3D.matrixWorld: 对象的全局或世界变换矩阵。如果对象没有父对象，那么这与存储在矩阵 matrix 中的本地变换矩阵相同。
* Object3D.modelViewMatrix: 表示对象相对于摄像机坐标系的变换矩阵，一个对象的 modelViewMatrix 是物体世界变换矩阵乘以摄像机相对于世界空间变换矩阵的逆矩阵。实践证明，针对 Group 和 Object3D，该矩阵总为单位矩阵，但 Mesh 符合预期，猜测有 geometry 的对象才会有预期值。

摄像机 Cameras 有三个额外的四维矩阵:
* Camera.matrixWorldInverse: 视矩阵 - 摄像机世界坐标变换的逆矩阵。
* Camera.projectionMatrix: 投影变换矩阵，表示将场景中的信息投影到裁剪空间。
* Camera.projectionMatrixInverse: 投影变换矩阵的逆矩阵。

three.js 前乘、后乘
* A.multiply(B) = A * B
* A.premultiply(B) = B * A

相关定义：转置矩阵、逆矩阵、单位矩阵
* 转置矩阵：行列互换得到的新矩阵
* 逆矩阵：逆变换
* 单位矩阵

Vector3 中关于矩阵的应用
```js
class Vector3 {
    applyMatrix4( m ) {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;

	}
}
```

透视投影矩阵推演

视图变换矩阵通过 position、up、lookAt 确定

vertexShader
```glsl
void main() {
    gl_Position = projectMatrix * modelViewMatrix * vec4(position, 1.0);
}
```