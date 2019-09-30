maptalks 与 maptalks.three 使用小结

最近业务需求，需要在现有 three.js 的场景下，加上地图作为底图，目的提供更为丰富的交互，决定尝试使用 maptalks 来衔接，在使用过程中还是碰到不少问题滴。

<!-- more -->

## 技术选型
对于该需求，了解到的可选方案有
* mapbox
* maptalks
* 地图支持：如高德地图从 v1.4.5 版本开始，支持三维立体图形的能力

决定使用 maptalks 的原因在于
* mapbox：目前地图源不支持国内源，基于 osm 源，国内网络环境不允许，否则会是一个优秀的解决方案
* 地图：与特定地图源强绑定，对于未来的切换会成本较大，同时要使用其 api 对现有场景进行

maptalks 的优缺点
* 优点：支持多地图源，同时支持插件扩展，比如 three、echarts 等
* 缺点：还是存在一些坑，但作者有在积极维护，地图样式无法定制

正是由于支持 three 接入，对现有代码改动较小，决定尝试下 maptalks，下面聊聊碰到的一些坑。

## 现有场景
场景中心点坐标为 (0, 0, 0)，其他顶点坐标使用相对中心点用米为单位来组织。

## 关于 maptalks
官网的介绍为：一个集成 2D/3D 地图的开源 JavaScript 库。通过 pitching 和 rotating 2D 地图集成地图

这段时间的研究，踩了不少的坑，大致如下
* 镜头控制问题：镜头托管给 maptalks 控制，目前不支持正射，同时视角无法完全水平
* maptalks.three 0.6.x 对于新版本 three 的对接存在问题
  * r102 版本后，光线渲染存在问题
  * r103 版本后，raycaster 存在问题
* 坐标轴问题
  * maptalks.three 0.6.x 坐标轴与 three 中 Y、Z 相反
  * maptalks.three 0.5.x 坐标轴与 three 中 Y、Z 相反，同时 Z 反向

> 光线问题和 raycaster 问题，所幸 maptalks.three 0.5.0 中是正常的，不然真是不知道怎么办了

重点理解坐标系问题
* 经纬度坐标
* 墨卡托投影：使用经纬度 (0, 0) 处作为中心点
* 世界坐标：基于墨卡托投影坐标，进行转换，目前不清楚 maptalks 的转换原理
* 现有场景中 Three 的局部坐标

向地图中添加 Object3D 物体，要想显示在地图中正确的位置，就需要将坐标转换成世界坐标，但我现有的坐标的局部坐标，maptalks api 提供了 coordinateToVector3 api，可以将经纬度转换成世界坐标，因此可以这么做：通过中心点经纬度和各个顶点的相对坐标得到每个顶点的经纬度 => 每个顶点调用 coordinateToVector3 函数得到每个顶点的世界坐标

当这么做存在的问题是
* 对于每个顶点都需要进行二次转换，会不会有点浪费计算量
* 对于已有的 Object3D 均需要进行改造，侵入太大，如果要同时兼顾两种模式，对于代码来说绘制异常灾难

直觉告诉我，应该有更好的实现方式，找一种方式，对于 Object3D 做整体的矩阵转换（位置、大小、坐标系等）。

## Three 矩阵转换
之所以直接将现有 Object3D 物体贴到地图上会看不见的问题，在于物体的位置不对，解决办法如下
1. 通过 coordinateToVector3 函数计算中心点在 map 上的世界坐标
2. 由于 Object3D 使用米为单位进行建模，使用 distanceToVector3 计算 1 单位实际值，将相对坐标进行缩放
3. 由于坐标系的差异，需要进行坐标系调整，办法就是乘以一个矩阵
4. 相对中心点世界坐标平移

这样一来，原有的 Object3D 物体的实现均无需做修改。那么 Three.js 中如何应用矩阵呢，代码如下
```js
const translateMatrix = new Matrix4()
// three 对常见场景，如平移、旋转、缩放进行了封装
translateMatrix.makeTranslation(x, y, z)
const scaleMatrix = new Matrix4()
scaleMatrix.makeScale(scale, scale, scale)
// 转标系调整，y 变 -z， z 变 y
const exchangeMatrix = new Matrix4()
exchangeMatrix.elements = [
  1, 0, 0, 0,
  0, 0, -1, 0,
  0, 1, 0, 0,
  0, 0, 0, 1
]
// 调用 Object3D 的 applyMatrix 依次应用矩阵即可，原则 先缩放、再旋转、再平移
```

看到 mapbox 中使用 Three 的一个[例子](https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/)，也做了一些平移、缩放、旋转的操作，但其貌似是通过墨卡托坐标做转换的。比如 `MercatorCoordinate.fromLngLat` 应该是得到墨卡托坐标，`meterInMercatorCoordinateUnits` 得到缩放值，而且其最终矩阵应用在 camera.projectionMatrix 上，这个日后在研究了。

## Three 注意点

### 关于光源
除了物体外，光源也需要做更改，否则显示效果肯定不同，我们回顾下常见光源的特点
* 环境光：不能投射阴影，因为它没有方向
* 平行光：沿着特定方向发射的光，由自身 position 和 target 决定方向。平行光的方向是从它的位置到目标位置。默认的目标位置为原点 (0,0,0)。注意: 对于目标的位置，要将其更改为除缺省值之外的任何位置,它必须被添加到 scene 场景中去。
* 点光源：一个点向各个方向发射的光源，可以理解成灯泡发出的光，因此没有 target 属性

从上了解到光源的 position 十分重要，但对于平行光而言，target 属性同样重要，这决定光源的方向。但这里有几个小坑
* target 是一个 Object3D 物体，需要被添加到 scene 中
* 你可能想通过 helper 查看下 target 设置是否生效，你需要调用一下 `target.updateMatrixWorld()`

### 坐标转换
世界坐标转换为屏幕坐标
1. 调用 Vector3 的 project 函数，传入 camera，返回设备标准坐标
2. 设备标准坐标转屏幕坐标

屏幕坐标转世界坐标
1. 屏幕坐标转设备标准坐标
2. 调用 Vector3 的 unproject 函数，传入 camera，得到世界坐标

## 高德 3D
高德不是支持 3D 绘制了么，那么了解下呗。

光源支持
* 环境光源
* 平行光源

支持的图形分类
* Mesh
* Line
* Points

Mesh 的 attribute 属性
* vertices：存放顶点位置的一维数组，三个元素代表一个顶点的位置
* vertexColors：存放顶点颜色的一维数组，四个元素代表一个顶点的颜色
* faces：存放三角形顶点索引的一维数组，三个元素代表一个三角形面。
  * 当 faces 长度不为 0 时，按照 faces 顶点索引来绘制；
  * 否则当 faces 长度为 0 时，按照 vertices 来依次绘制三角形面。
* vertexUVs：存放顶点纹理坐标的一维数组，两个元素代表一个顶点的纹理坐标
* textureIndices：存放顶点纹理索引的一维数组，一个元素元素代表一个顶点的纹理索引。
  * 当 Mesh 的 textures 属性的长度大于1时，代表一个 mesh 使用多个纹理，
  * textureIndices 表示每个顶点使用哪个纹理。
  * 只使用一个纹理时，这个属性可以不设置
* vertexNormals：存放顶点法向量的一维数组，三个元素元素代表一个顶点的法向量。

> 任何一个 Object3D 的形体都具有顶点坐标、顶点颜色两个基本属性；如果有大量重复顶点的时候可以使用顶点索引；如果用到贴图的话，就需要顶点纹理坐标，多纹理的时候还会用到纹理索引；需要光照的时候还会有顶点法向量。

棱柱 Prism：为了简化使用，可以基于经纬度、高度、颜色来构建不规则棱柱体。和 ExtrudeGeometry 类似。

Line 的使用方法与 Mesh 类雷同，区别在于它们 geometry 的 attribute 属性中表述顶点索引的属性略有不同，Mesh 通过 faces 属性来表述顶点索引，Line 通过 segments 属性来表述索引

Points 类型显示为矩形点，支持位置、大小、纹理等样式，并可指定有效填充区域。属性就不啰嗦了。

## Three 需深入点
理解矩阵在 3D 世界中的应用

理解 Mesh 中各个 matrix 的含义和作用

理解 Geometry 和 BufferGeometry 在数据结构上的区别
* Geometry
  * colors：顶点颜色
  * faceVertexUvs：顶点纹理坐标
  * faces：几何体三角形信息
  * vertices：顶点位置
* BufferGeometry
  * colors：顶点颜色
  * normal
  * position：顶点位置数据
  * index：顶点索引数据
  * uv