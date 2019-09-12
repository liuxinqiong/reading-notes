针对大规模的建筑群，可以将不很重要的建筑进行 merge，这样可以大大的提高渲染效率。

extrudeGeometry
* Shape 时传入顶点数组
* moveTo & lineTo

Object3D 函数解释
* add：添加对象到这个对象的子级，被添加对象坐标变换变成相对该对象的局部坐标
* attach：将 object 作为子级来添加到该对象中，同时保持该object 的世界变换。
* clone：返回物体的克隆
* copy：复制给定对象到该对象中

[一篇文章弄懂THREE.js中的各种矩阵关系](https://juejin.im/post/5a0872d4f265da43062a4156)

m -> px

three的模型的顶点组织用米为单位来组织，然后根据经纬度来计算一个整体matrix

设置一个合理的缩放比例，旋转和中心点位置，就能和地图对齐了

如果我需要添加一个灯源，我该如何确定其位置呢

就按照它该有的xyz平面坐标来确定位置，然后乘上一个你的整个场景的转换矩阵（这个是用场景的经纬度计算出来）就行了

你可以先看看threejs相关的技术文章，怎么样坐标系转换，就有谱了

https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-scene-graph.html

three默认的z轴方向和maptalks里是反的