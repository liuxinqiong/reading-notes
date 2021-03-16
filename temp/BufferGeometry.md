Geometry
* 本意是对 BufferGeometry 的用户友好替代，但在新版本 THREE 中被废弃
 * 利用 Vector3 或 Color 存储了几何体相关的 attributes
 * 比 BufferGeometry 更容易读写，但运行效率不如有类型的队列
* colors：顶点 colors 队列，与顶点数量和顺序保持一致
* faces：faces 队列，描述每个顶点之间如何组成模型面的面对列
* faceVertexUvs：面的 UV 层的队列，改队列用于将纹理和几何信息进行映射
* vertices：顶点的队列，保存了模型中每个顶点的位置信息

BufferGeometry
* 顶点信息 attributes.position：存储每个顶点的坐标
* 法向量信息 attributes.normal：参与光照计算，存储每个顶点的法向量
* 颜色信息 attributes.color：存储每个点的颜色值
* 纹理坐标 attributes.uv
* 面片索引 index：允许顶点在多个三角面片见可以重用

工具函数
```js
// 计算这个mesh在gpu中所占内存
BufferGeometryUtils.estimateBytesUsed(mesh.geometry) + " bytes"

// 使用 DefaultUVEncoding 降低内存数
GeometryCompressionUtils.compressUvs(mesh);

// 使用 QuantizePosEncoding 降低内存数
GeometryCompressionUtils.compressPositions(mesh);

// 使用NormEncodingMethods降低内存数
// ["None", "DEFAULT", "OCT1Byte", "OCT2Byte", "ANGLES"]
GeometryCompressionUtils.compressNormals(mesh, 'None');
```

Point3d
* x/y/z
* transformBy
* distanceTo
* add
* sub
* toArray

Vector3d
* x/y/z
* mirror
* negate
* transformBy
* dotProduct
* crossProduct
* asPoint
* add
* sub
* normal
* isEqualTo
* toArray

面几何体需要法向量信息，已知三个点, 求出两条边的方向向量, 这两个方向向量做叉乘, 结果变为由三个点构成的三角形的法向量
```js
 // 求法向量, 首先设置三角形的三个顶点
 pA.set( ax, ay, az );
 pB.set( bx, by, bz );
 pC.set( cx, cy, cz );
 // 求出两个方向向量
 cb.subVectors( pC, pB );
 ab.subVectors( pA, pB );
 // 叉积, 求法向量
 cb.cross( ab );
 // 单位化这个法向量
 cb.normalize();

 var nx = cb.x;
 var ny = cb.y;
 var nz = cb.z;

 // 添加法向量到法向量数组中
 // 三角形的三个顶点的法向量相同, 因此复制三份
 normals.push( nx, ny, nz );
 normals.push( nx, ny, nz );
 normals.push( nx, ny, nz );
```