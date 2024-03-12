three.js 对底层 WebGL 的高级封装的同时，保留底层开发的特性，仍然可以使用点、面、法向量、UV 构造几何体，以及编写着色脚本来创造自己想要的特殊材质。

有趣的做法
* 把光源也绑定到摄像机上，这样光源就会随着摄像机移动
* 三维建模软件组成：本质上是一个 Group，组合多个 3D 对象层级，对象定义自己的 BufferGeometry 和 Materials 材质
* 通过 CanvasTexture 运行时生成纹理
* 通过 RenderTarget 根据 three api 动态生成纹理。渲染目标大体上指的是可以被渲染的纹理，当它被渲染之后，你可以像使用其他纹理一样使用它
* 判断用户是点击还是拖动，除了判断按下和松开的距离外，我们可以也判断时间间隔，如果大于 200ms，则认为是拖动，可能效果更好

理解相机原理：通过一些矩阵变换，将 near 至 far 之间物体，投影到 near 平面上，即为最终呈现到屏幕上的元素

自定义缓冲几何体
* 理解 BufferGeometry.attributes 的 position、normal、uv 和 color 属性
  * 顶点的组成部分：position、normal、uv、color，一个简单的顶点是所有组成部分的集合
  * 如果顶点需要其中的任一部分变得不同，那么它必须是一个不同的顶点
  * 比如方块的 Geometry，看起来在角的地方共用顶点，但是实际不是，因为 normal 和 uv 等通常不同
* 理解 BufferGeometry.index 属性

> uv 表示纹理坐标，因为 xyz 已经被顶点坐标使用，所以使用 uvw 表示纹理坐标，表示贴图映射到模型表面的依据，把表面的点与平面上的像素对应起来，通常通过 0-1 表示，其中 u 表示水平，v 表示垂直，w 表示垂直于显示器表面，一般情况只是在表面贴图，就涉及不到 w，所以常称为 uv

贴图原理
* 纹理坐标系统 [0, 1]，WebGL 坐标系统 [-0.5, 0.5]，维护好顶点坐标对应的纹理坐标，其余色值是通过光栅化自动生成的
* 一个几何体对象不同三角形可以对应不同材质，通过 groups 设置
* 通过 texture.offset 设置纹理偏移
* 通过 texture.repeat 设置重复次数

Group 和 Object3D 有区别吗
* 几乎没有任何区别，Group 继承自 Object3D，设置 type 为 Group 仅此而已
* 相比 Object3D 而言只是更语义化

研究相关问题
* 分析 BoxGeometry 是如何默认支持六面贴图的
  * 本质上是依次生成六个面
  * 生成一个面的步骤为
    * 计算每个面的四个顶点坐标、法向量以及 uv 坐标
    * 计算 index 数组，指定每三个顶点构成一个三角面
    * 通过 addGroup(groupStart, groupCount, materialIndex) 设置该面使用的索引下标，表示从 start 到 start+count 之间顶点构成的所有三角面使用该材质
* 理解 PlaneGeometry、CircleGeometry 的贴图原理
  * PlaneGeometry 没有调用 addGroup，因此仅能运用一个 Material
  * CircleGeometry 有调用 addGroup，那么圆形应用方形贴图会是什么效果呢？TODO
* ShapeGeometry 的贴图原理
  * 当传入的 shapes 为数组时，针对每个 shape 定义 addGroup，否则不指定
  * 内部调用 ShapeUtils.triangulateShape 对轮廓和 holes 进行三角化得到面
* 分析 CylinderGeometry 如何生成 BufferGeometry 和应用贴图
  * 分别两步，生成侧面以及上底和下底。
  * 侧面：根据设置的高度分段数和圆弧分段数，生成侧面的顶点坐标、法向量以及 uv 坐标
  * 侧面：根据设置的高度分段数和圆弧分段数，生成 index 以及计算 groupCount
  * 侧面：设置 addGroup，materialIndex 设置为 0，贴图效果应该是整个侧面
  * 底面：底面逻辑差不多，计算顶点、法向量、uv 坐标，计算 index，设置 materialIndex，top 为 1，bottom 为 2
* 分析 ExtrudeGeometry 的贴图原理，UVGenerator 工作原理
  * 相比其他规则图形而言，ExtrudeGeometry 要复杂很多
  * 遍历所有给定的 shapes 计算 position 和 uv 信息，通过调用 computeVertexNormals 计算方向量
  * 如果自定义了 UVGenerator 则使用传入的生成器，否则使用内置的 WorldUVGenerator
  * 对给定的 Shape 进行采样处理，逆时针转换，然后三角化
  * uvGen 签名
     * generateTopUV
     * generateSideWallUV

注意性能优化
* 应用 merge geometry 后，对于一整个 mesh，我们只能应用一个材质，因此只能使用一种颜色，某些场景下可以通过顶点着色法解决
* 大量物体的动画
  * 使用 Morphtargets 给每个顶点提供多个值，以及使用他们变形或 lerp 的方法
  * 通过设置 BufferGeometry 的 morphAttributes 来设置多个值，不同的是 position、color 等属性是一个 attribute 数组
  * 通过改变 mesh 的 morphTargetInfluences 属性来应用突变

有趣的例子：https://threejs.org/manual/#zh/load-gltf
* 如何一步一步矫正模型
* 如何让物体根据轨迹动起来

天空盒
* 使用 CubeTextureLoader 加载天空盒的六张图
* 使用等距矩形贴图(Equirectangular map)， 这是被 360 全景相机拍摄的一种特殊类型的图片。使用 WebGLCubeRenderTarget.fromEquirectangularTexture 从等距矩形纹理中生成一个立方体贴图，我们传入预期的立方体贴图的大小给 WebGLCubeRenderTarget

如何绘制透明的物体
* 简单而言是使用 transparent 和 opacity 属性
* 但有时候效果可能不太符合预期，因为对于 3d 物体的一般绘制方式，对于每个几何体，一次绘制一个三角形。当三角形的一个像素在被绘制的时候，会记录两件事情，一是像素的颜色，一是像素的深度。当下一个三角形绘制时，对于深度大于先前被记录的深度的像素，将不会被绘制，这就对于透明物体而言，有东西消失了一般。这个问题的解决方案是将透明的物体进行排序，排在后面的物体比排在前面的物体先绘制。
* 三角形绘制的顺序和在几何体中构建的顺序是一致的，取决于我们从哪个方向看向这些三角形，距离摄像机近一些的先被绘制。因此，在后面的那些三角形不会被绘制。这就是我们看不到后面的面的原因。
* alpha 测试是指像素的 alpha 值低于某个水平的时候，three.js 就不会绘制它。
* 完美的透明是困难的，有着各种问题、取舍和变通方法。

> 浏览器限制了 WebGL 上下文(WebGL contexts)的数量。通常浏览器将其限制为 8 个，一旦超出这个数量，最先创建的 WebGL 上下文就会被自动弃用。

数学库：Frustum 视窗体
```js
const frustum = new THREE.Frustum();
const viewProjection = new THREE.Matrix4();
viewProjection.multiplyMatrices(
    camera.projectionMatrix, camera.matrixWorldInverse);
frustum.setFromProjectionMatrix(viewProjection);
const inFrustum = frustum.contains(someMesh));
```

GPU 拾取：概念简单，使用复杂，为了完成 GPU 拾取，对每个对象使用唯一的颜色进行离屏渲染，然后检查鼠标位置关联的像素颜色，通过颜色告诉我们哪个对象被选中。这里演示了 [GPU 拾取的简单例子](https://threejs.org/manual/#zh/picking)

后期处理
* 在结果被输出到 canvas 之前，我们也可以通过另外的一个 RenderTarget 并应用一些后置效果。这被称为 PostProcessing，因为它发生在主场景渲染过程之后。
* 使用方式：EffectComposer 搭配各种 Pass 对象，每个 Pass 对象就是一个效果
* EffectComposer 工作原理：创建两个 RenderTarget，交替应用不同的 pass 对象，实现叠加的效果
* 对于几乎所有的后期处理 EffectComposer，RenderPass 都是必需的。因为它是初始输入。
* 自定义后期处理：ShaderPass

注意：raycaster 只会与有 geometry 对象做相交判断，因此 group 做相交会得到它的 children

这两个示例好强
* [Voxel(Minecraft Like) Geometry](https://threejs.org/manual/#zh/voxel-geometry)
* [Start making a Game](https://threejs.org/manual/#zh/game)

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

透视投影矩阵推演
* 视图变换矩阵通过 position、up、lookAt 确定
* 问题：XYZ 平面问题，将 camera.up 设置为 z 轴后，总感觉有些奇怪的问题，需求目标：基于 z 旋转，基于 xy 绘制和坐标拾取

## meshline vs line2
meshline vs line2
* meshline 是社区方案，目前处于不维护状态，line2 属于官方内置示例
* meshline 虚线绘制过于紧密，line2 表现良好
* 三维视角下，都存在正面不是维持向上问题
* line2 设置透明度后，顶点重叠部分效果不好（之前也正是因为该原因不支持透明度）

我们如何确定一个颜色
* 为什么是三原色？因为人类对色彩的感知结果位于一个三维的线性空间中。最少需要三种颜色的光才能有足够的表达能力来表现各种颜色
* 为什么选 RGB 作为三原色？因为色彩空间不是真正数学意义上的线性空间，从工程角度考虑，以 RGB 作为三原色，能让显示器能够显示更多的颜色
* 对于 RGB 色彩空间来说，关键点在于两个：1. 如何选择三个作为基底的颜色；2. 如何定义白色。一旦选好这两个关键参数，那么从 CIE XYZ 空间到设备的 RGB 空间的转换就完全确定了
* 不同的 RGB 空间所能表示的颜色范围是不一样的，并且我们可以推断出，即使是同样的 RGB 分量，在不同的 RGB 空间中所代表的颜色也是不一样的。所以我们在描述一个 RGB 颜色的时候，不仅需要描述它的 RGB 三个分量，还要说明是在哪个空间，这就是 ICC 文件的作用
* 常见的网络环境下图片的色彩空间是 sRGB，有很多浏览器不能正确地解析图片自带的色彩空间说明，默认按照 sRGB 来进行解析。

three.js 颜色空间
* 颜色空间由基色、白点、转换函数
* 常用空间 sRGB 和 Linear-sRGB，两者都使用相同的基色和白点，因此具有相同的颜色范围，都使用 RGB 颜色模型，它们仅在传输函数上有所不同
  * Linear-sRGB 相对于物理光强度是线性的。
  * sRGB 使用非线性 sRGB 传递函数，更接近于人眼感知光的方式和普通显示设备的灵敏度
* 这种区别很重要。光照计算和其他渲染操作通常必须在线性色彩空间中进行。然而，线性颜色存储在图像或帧缓冲区中的效率较低，并且在由人类观察者观看时看起来不正确。因此，输入纹理和最终渲染的图像通常会使用非线性的sRGB色彩空间。

颜色空间中三个角色
* 输入颜色空间：纹理、三维模型等资源都会有关联的颜色空间，不是 Linear-sRGB 颜色空间的必须被转换，在开启了 ColorManagement 后，某些转换(对于sRGB中的十六进制和CSS颜色)可以自动进行
* 工作颜色空间：渲染、插值和许多其他操作必须在开放域线性工作色彩空间中执行，其中 RGB 分量与物理照明成比例。在 three.js 中，工作颜色空间是 Linear-sRGB。
* 输入颜色空间：输出到显示设备、图像或视频可能涉及从开放域 Linear-sRGB 工作色彩空间到另一个色彩空间的转换。这种转换可以在主渲染通道(WebGLRenderer.outputColorSpace)中执行，也可以在后期处理期间执行。自定义着色器必须实现自己的输出颜色空间转换。

关于色彩系统的重要破坏性更新：https://discourse.threejs.org/t/updates-to-color-management-in-three-js-r152/50791