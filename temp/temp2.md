针对大规模的建筑群，可以将不很重要的建筑进行 merge，这样可以大大的提高渲染效率。

extrudeGeometry
* Shape 时传入顶点数组
* moveTo & lineTo

Object3D 函数解释
* add：添加对象到这个对象的子级，被添加对象坐标变换变成相对该对象的局部坐标
* attach：将 object 作为子级来添加到该对象中，同时保持该object 的世界变换。
* clone：返回物体的克隆
* copy：复制给定对象到该对象中