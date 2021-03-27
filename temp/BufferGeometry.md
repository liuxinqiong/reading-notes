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

## Obj 文件
Obj 文件内容如下
* v：表示顶点，即组成图的点
* vt：纹理坐标，其值为 u、v、w
* vn：顶点法向量，其值为 x、y、z，这个法向量表示顶点的朝向。比如由三个顶点组成一个面，面由两个朝向，向里或向外，可以通过顶点的朝向来确定面的朝向。而且这三个顶点的法向量是一样的
* f：表示一个面，由三个 v/vt/vn 的索引形式组成。比如 obj 文件中 f 5/15/7 4/14/6 6/16/8 ，表示由第 5、第 4、第 6 这三个顶点组成了一个三角平面,平面的纹理由第 15、第 14、第 16 这三个纹理坐标形成，这个平面的朝向是第 7、第 6、第 8 这三个顶点的法向量求平均值

补充说明
* 顶点的个数与顶点法向量的个数一样多。
* 顶点的个数不一定与纹理坐标的个数一样多，因为有可能很多顶点公用一个纹理坐标的像素。
* 面索引的个数也与其余数据数量无关。
* 最终每个三角面的颜色，是由构成这个三角面的三个顶点进行插值计算