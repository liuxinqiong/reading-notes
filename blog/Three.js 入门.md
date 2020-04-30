Three.js 入门学习总结

项目中使用 three.js 进行 3D 渲染，本人由一开始的一脸懵逼，到现在小试牛刀，对于这一块一算是有点突破，写点总结吧

<!-- more -->

## 了解 Three.js
官方例子分类
* 几何体
* 材质
* 模型加载器
* 交互/动画
* 相机控制
* 后期处理
* 着色脚本使用

Three.js：对底层 WebGL 的高级封装的同时，保留底层开发的特性，仍然可以使用点、面、法向量、UV 构造几何体，编写着色脚本来创造自己想要的特殊材质

Three.js 与其他同类引擎比较
* 插件式 Web3D 引擎：需要安装插件
  * Flash
  * O3D
  * Unity3D：专业游戏引擎
* 原生 WebGL 引擎
  * GLGE
  * X3DOM
  * PhiloGL
  * CopperLicht
* Three 优势
  * 原生支持，不需要安装插件
  * 兼容性高，支持移动平台
  * 基于 WebGL，Web 开发主流，社区活跃
  * 组件及案例丰富

在 Three.js 应用开发中，我们不仅会用到核心库，也会用到扩展库，扩展库在 example 目录下

## 基本步骤
三维场景基本要素
* 场景：模型、灯光
* 相机：观察场景的视角
* 渲染器：场景渲染输出的目标
* 渲染：执行渲染操作

绘制步骤
1. 构建三维空间(Scene)：一个大容器，一般没有什么复杂操作，在程序最开始的地方进行实例化，然后将物体添加到场景中即可。
2. 选择观察点(Camera)
3. 添加供观察的物体(Mesh,Line,Points……)
4. 将观察到的场景渲染到屏幕上的制定区域

> 一个典型的 Three.js 程序至少要包括渲染器（Renderer）、场景（Scene）、照相机（Camera），以及你在场景中创建的物体。

Three 开发六大要素
* 场景：Scene
* 物体：Object3D
* 相机：Camera
* 相机控制器：多种选择
* 光照：Light
* 渲染器：WebGLRenderer

## 坐标系、原点、单位
Three.js 的原点在画布的正中心

Three 中使用右手坐标系定位

x,y,z 单位问题：其单位与屏幕分辨率无关，是一个虚拟的空间坐标，表示一个相对单位，比如可以选用米为单位来组织

从 3D 世界到 2D 世界
* 局部坐标系：物体均已自身的中心点为原点，所有物体的坐标都相对其中心点定义
* 世界坐标系：整个世界找一个点，将其作为原点，物体相对该原点进行定位
* 视觉坐标系：以相机的中心点作为原点
* 投影坐标系：投影矩阵（近大远小效果）
* 屏幕坐标系：通常左上角为原点，向右为 X 正轴，向下为 Y 正轴

各个阶段以及意义
1. 物体坐标
2. 模型变换 + 视图变换：模型视图矩阵
3. 投影变化 + 透视除法：透视矩阵
4. 视口变换：gl.viewport
5. 视口坐标

齐次坐标系

3D 世界表示点是 (x,y,z)，然而表示向量也是 (x,y,z)，那要如何才知道是向量还是点呢？点只表示位置，向量没有位置只有大小和方向，为了区分点和向量我们给他加上一维，用 (x,y,z,w) 四元组的方式来表达坐标，规定 (x,y,z,0) 表示一个向量，(x,y,z,1) 或 (x,y,z,2) 等 w 不为 0 时来表示点。这种用 n + 1 维坐标表示 n 为坐标的方式称为齐次坐标

一个三维齐次坐标为 (X,Y,Z,w)，那么 3D 空间坐标为
* x = X / w
* y = Y / w
* z = Z / w

ndc 坐标系：设备无关坐标系，[-1, 1]

## 核心对象
核心对象有
* 场景和 Object3D 对象
* 相机对象
* 渲染器对象
* 材质与贴图
* 基本灯光

核心对象之间的关系，如下图
<img />

通过上图可知渲染器需要相机和场景来进行渲染，那么我们可以渲染的时候使用不同的场景和相机吗？答案是可以的，可以通过这种方式实现更加复杂的交互效果。

渲染器对象
* 本质通过 Canvas 进行绘图
* 可通过 CSS 样式控制渲染器的布局
* 需要保持 Canvas 对象的宽高比和渲染器一致，否则会变形

场景和 Object3D 对象
* Object3D 是一个基类，children 属性使得我们可以构建复杂的父子关系和层次结构
* Scene 也继承 Object3D 对象
* Mesh 对象，需要几何对象 geometry 和材质对象 material
* 更多对象：Camera、Light、……

## 相机
照相机定义了三维空间到二维屏幕的投影方式

相机类型 - 视锥体，只有椎体范围内的物体才会被看见
* 透视投影
* 平行投影

相机种类
* 正投影相机 OrthographicCamera(left, right, top, bottom, near, far) ：物体发出的光平行地投射到屏幕上，远近的方块都是一样大的
  * 为了保持照相机的横竖比例，需要保证 (right - left) 与 (top - bottom) 的比例与 Canvas 宽度与高度的比例一致。
  * near 与 far 都是指到照相机位置在深度平面的位置，而照相机不应该拍摄到其后方的物体，因此这两个值应该均为正值。
* 透视投影相机 PerspectiveCamera(fov, aspect, near, far) ：近大远小，符合我们平时看东西的感觉

设置位置的常见方式
* camera.position.x……
* camera.position = vector3
* camera.position.set(x, y, z)

up 轴：Y 轴和 Z 轴平面内的一个向量，通常都取(0,1,0)，便于计算，用来去确定坐标系位置
* 根据观察点到相机的位置，求出向量就是 Z 轴
* 根据 up 轴，计算出 X 轴
* 根据 Z 轴和 X 轴计算出 Y 轴

lookAt 函数指定观察点，默认原点

相机对象
* 相机朝向的含义
* 平视相机
  * 本质是立方体
  * 构造参数 left、right、top、bottom、near、far
* 透视相机
  * 构造参数 fov、aspect、near、far
  * fov：视景体头部夹角
  * aspect：宽高比例
* 多相机切换

### 相机控制
相机基本控制的主要目的是建立一个 2D 屏幕操作与 3D 世界变换的映射关系，将鼠标键盘等输入设备的操作转化成合理顺序的旋转、平移、缩放。

Three.js 提供的控制器
* OrbitControls 轨道控制器：通过鼠标的点击和移动来控制相机的方向和位置，里面涉及的算法都是将鼠标的移动转化成相机的位置和方向的改变
* TrackballControls 追踪球控制器：同上
* DeviceOrientationControls 设备方向控制器：设备在三个方向上的旋转转变成在相机三个轴上的旋转量
* FlyControls 飞行控制器：鼠标的移动转变成相机三个轴上的旋转
* FirstPersonControls 第一人称控制器：通过鼠标和键盘来控制相机的转向和位置
* TransformControls 变换控制器：用于对场景中物体的变换，将鼠标的移动转变成对物体的平移和旋转操作

添加相机控制器后，`camera.lookAt()` 会貌似失效，因为 `controls.update()` 会重置回 `controls.target` 属性

## 物体
Objects：场景中添加的物体，比如 Mesh、Points 等，最常用的 Mesh。

物体与几何图形
* 物体：继承自 Object3D 类，拥有图形和材料属性
* 几何图形：继承 Geometry 或 BufferGeometry，主要信息是顶点和顶点索引

Mesh：计算机的世界里，一条弧线是由有限个点构成的有限条线段连接得到的。线段很多时，看起来就是一条平滑的弧线了。 计算机中的三维模型也是类似的，普遍的做法是用三角形组成的网格来描述，我们把这种模型称之为 Mesh 模型。

Mesh 构造函数 Mesh(geometry, material)

在创建物体时，需要传入两个参数，一个是几何形状（Geometry），另一个是材质（Material）。
* 基本几何形状
* 文字形状
* 自定义形状
  * 由于自定义形状需要手动指定每个顶点位置，以及顶点连接情况
  * 自定义形状使用的是 Geometry 类

物体的默认位置是原点，对于立方体而言，是其几何中心在原点的位置。

位置、缩放、旋转是物体三个常用属性。由于 THREE.Mesh 基础自 THREE.Object3D，因此包含 scale、rotation、position 三个属性。它们都是THREE.Vector3 实例，因此修改其值的方法是相同的

Geometry
* Geometry 通过存储模型用到的点集和点间关系(`哪些点构成一个三角形`)来达到描述物体形状的目的。
* Three 提供了立方体(其实是长方体)、平面(其实是长方形)、球体、圆形、圆柱、圆台等许多基本形状；
* 你也可以通过自己定义每个点的位置来构造形状； 对于比较复杂的形状，我们还可以通过外部的模型文件导入。

Geometry 核心属性
* vertices：数组，保存该几何体下所有顶点（Vector3对象）
* colors：数组，保存该几何体下所有顶点的颜色信息（Color对象）
* faces：数组，保存该几何体下所有面信息，Face3 对象集合，表示那三个点构成一个面

Face3 属性
* 构造函数为几何体顶点的索引，表示那三个点构成一个面
* normal：Vector 对象，表示面的法向量，设置以哪个角度反射光线
* vertexColors：各个顶点对应的颜色

Material：材质其实是物体表面除了形状以外所有可视属性的集合，例如色彩、纹理、光滑度、透明度、反射率、折射率、发光度。
* 基本材质：渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。
* Lambert 材质：只考虑漫反射而不考虑镜面反射的效果，因而对于金属、镜子等需要镜面反射效果的物体就不适应，对于其他大部分物体的漫反射效果都是适用的。
* Phong 材质：Phong 模型考虑了镜面反射的效果，因此对于金属、镜面的表现尤为适合。由于漫反射部分与 Lambert 模型是一致的，因此，如果不指定镜面反射系数，而只设定漫反射，其效果与 Lambert 是相同的。
* 法向材质：法向材质可以将材质的颜色设置为其法向量的方向，有时候对于调试很有帮助。
* 纹理贴图：使用图像作为材质

Material 属性
* vertexColors：定义材料是否使用顶点颜色，默认 false ---如果该选项设置为 true，则 color 属性失效
* side：设置面

Mesh 基本属性
* position：决定该对象相对其`父对象`的位置，多数情况下父对象是 Scene 对象
  - 直接设置相关属性 position.x
  - 一次性设置：position.set
  - 赋值 THREE.Vector3 对象
  - 默认位置父元素中心点，对于 Scene 而言就是原点
- rotation 旋转
- scale 缩放
- translateX translateY
- visible 显影

这里我就踩了一坑，多数情况下是 Scene，但有可能不是 Scene，此时的 position 就另说了，因为 Mesh 自身可以 add 其他 Mesh。

## 动画
动画原理：动画的本质是利用了人眼的视觉暂留特性，快速地变换画面，从而产生物体在运动的假象。

为了衡量画面切换速度，引入了每秒帧数 FPS（Frames Per Second）的概念，是指每秒画面重绘的次数。FPS 越大，则动画效果越平滑，当 FPS 小于 20 时，一般就能明显感受到画面的卡滞现象。

NTSC 标准的电视 FPS 是 30，PAL 标准的电视 FPS 是 25，电影的 FPS 标准为 24。而对于 Three.js 动画而言，一般 FPS 在 30 到 60 之间都是可取的。

requestAnimationFrame 方法：通常可能达到 60FPS

相机控制动画：相机变换 + 重新渲染，相机控制是场景交互和动画的基础

### 3D 动画
Tween.js 是一个制作动画的工具库。Tween 代表用一种顺滑的方式来改变对象的属性值

Tween.js 简介
* 控制函数
  * start、stop
  * update
  * chain 动画链式调用
  * repeat 动画重复次数
  * yoyo 从头到尾 从尾到头
  * delay
* 静态函数
  * update(time)
  * getAll removeAll
  * add remove
* 回调函数
  * onStart
  * onUpdate
  * onStop
  * onComplete
* 丰富的缓动函数

## 模型
使用 Three.js 创建常见几何体是十分方便的，但是对于人或者动物这样非常复杂的模型使用几何体组合就非常麻烦了。因此，Three.js 允许用户导入由 3ds Max 等工具制作的三维模型，并添加到场景中。`*.obj` 是最常用的模型格式，导入 `*.obj` 文件需要 `OBJLoader.js`

加载 OBJ 模型
* 不带材质的模型加载库 OBJLoader
* 带有材质的模型加载库 OBJMTLLoader + MTLLoader
* 通常模型组成：OBJ 文件、mtl 材质文件以及贴图

### OBJ 模型
大部分程序都是从模型文件中读取三维模型的顶点坐标和颜色数据，其中著名的一种模型文件是 OBJ 模型。OBJ 模型是基于文本的，易于理解。

OBJ 文件格式
* `#` 开头代表注释
* mtlib xxx.mtl 代表外部材质名称
* o Mesh 代表模型名称
* v x y z [w] 定义了顶点坐标，w 是可选的（vertices -> position）
* vn x y z 代表顶点的法线坐标（normals -> normal）
* vt x y 代表顶点纹理坐标，纹理坐标是二维的（uvs - uv）
* usemtl default 指定使用材质的名称
* f vi/vti/vni vi/vti/vn vi/vti/vn 代表使用顶点的表面，三角形用到的顶点索引、纹理索引和法向量索引，三个顶点确定一个面

> OBJ 格式的模型只包含物体的顶点和索引信息，而没有材料信息，材料信息来自另一个文件中存储

OBJ 模型加载器解析过程
1. 创建文本
2. 创建 BufferGeometry
3. 创建 Material
4. 创建物体

## 灯光
Light 光影效果是让画面丰富的重要因素。
* 环境光 AmbientLight：场景整体的光照效果，环境光没有明确的光源位置，在各处形成的亮度也是一致的。
* 点光源 PointLight：点光源是不计光源大小，可以看作一个点发出的光源。点光源照到不同物体表面的亮度是线性递减的，因此，离点光源距离越远的物体会显得越暗。
* 聚光灯 SpotLight：聚光灯是一种特殊的点光源，它能够朝着一个方向投射光线。聚光灯投射出的是类似圆锥形的光线，这与我们现实中看到的聚光灯是一致的。
* 平行光 DirectionalLight：对于任意平行的平面，平行光照射的亮度都是相同的，而与平面所在位置无关。
* 半球光 HemisphereLight

阴影：在 Three.js 中，能形成阴影的光源只有 THREE.DirectionalLight 与 THREE.SpotLight；而相对地，能表现阴影效果的材质只有THREE.LambertMaterial 与 THREE.PhongMaterial。因而在设置光源和材质的时候，一定要注意这一点。

基本灯光
* 常用灯光
  * 环境光
  * 点光源
  * 方向光源
* 环境光：仅颜色属性
* 点光源：四周照射
  * 颜色属性
  * 强度
  * 距离：超过该距离则无效果
* 方向光：同一个方向照射
  * 颜色
  * 亮度

## 阴影
开启 shadow 基本设置
* 渲染器启用阴影：renderer.shadowMapEnabled
* 能形成阴影的光源：DirectionalLight SpotLight
* 能够表现阴影的材质：LambertMaterial PhongMaterial
* 光源启用阴影：castShadow
* 物体投射阴影：castShadow
* 物理接受阴影：receiveShadow

## 材质、贴图、纹理
材质和贴图
* 基本材质，常用三种材质
  * Material 所有材料的基类
  * MeshBasicMaterial：无光照特性
  * MeshLambertMaterial：有光照特性，无高光特性，使用 Lambert 反射模型
  * MeshPhongMaterial：有光照特性，具有高光特性，使用 Phong 反射模型
  * ShadowMaterial：此材质可以接收阴影，但在其他方面完全透明
* 贴图
  * 漫反射贴图：map
  * 凹凸贴图：bumpmap
  * 环境贴图：cubemap
  * 光照贴图：lightmap，图片保存了光照信息

材质类型
* BasicMaterial：渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果
  * visible：是否可见，默认为 true
  * side：渲染面片正面或是反面，默认为正面 THREE.FrontSide，可设置为反面 THREE.BackSide，或双面 THREE.DoubleSide
  * wireframe：是否渲染线而非面，默认为 false
  * color：十六进制 RGB 颜色，如红色表示为 0xff0000
  * map：使用纹理贴图
* MeshLambertMaterial：只考虑漫反射而不考虑镜面反射的效果，因而对于金属、镜子等需要镜面反射效果的物体就不适应，对于其他大部分物体的漫反射效果都是适用的。
  * ambient：ambient 表示对环境光的反射能力，只有当设置了 AmbientLight 后，该值才是有效的
  * emissive：是材质的自发光颜色，可以用来表现光源的颜色
* MeshPhongMaterial：考虑了镜面反射的效果，因此对于金属、镜面的表现尤为适合。
  * 由于漫反射部分与Lambert模型是一致的，因此，如果不指定镜面反射系数，而只设定漫反射，其效果与Lambert是相同的
  * specular：指定镜面反射系数作说明
  * shininess：属性控制光照模型中的 n 值，当 shininess 值越大时，高光的光斑越小，默认值为30。
* MeshNormalMaterial：法向材质可以将材质的颜色设置为其法向量的方向，有时候对于调试很有帮助。

纹理贴图
* 单张图像应用于长方体：自动应用到六个面上
* 六张图像应用于长方体：使用 MeshFaceMaterial 传入 material 数组
* 通过 wrapS 和 wrapT 设置重复，`repeat.set` 设置重复次数

### 纹理
问题坐标：[0 ,0] 代表左上点，[1, 1] 为右下点

完美情况下，纹理是在 1:1 的比率下显示在屏幕上，这意味着纹理中的每像素都将占用屏幕上的一像素。这种情况下不会有毛边现象。

真实的 3D 程序中，纹理几乎不会以它的自然分辨率来呈现。我们将这种情况称为纹理放大或纹理缩小，这依赖于纹理是否有一个比屏幕显示空间更小或更大的分辨率。

WebGL 提供了两种过滤方式
* NEAREST：使用该纹理过滤模式总是返回像素中心最接近采样点的那个像素颜色。使用这个方式纹理经常看起来有断处和毛边。NEAREST 可以在 MIN 和 MAG 模式中
* LINEAR：使用该纹理过滤模式将得到中心点离着采样点最近的四个像素的颜色平均值

纹理缠绕
* CLAMP_TO_EDGE：这种缠绕模式将纹理坐标超过 1 的降为 1，低于 0 的升为 0，之中将值夹在 0-1 之间
* REPEAT：简单的忽略纹理坐标的整数部分。对于在 0-1 范围之外的纹理坐标将创建出重复的可视效果
* MIRRORED_REPEAT：如果纹理坐标的整数部分是偶数，处理方式与 REPEAT 模式相同。如果纹理坐标的整数部分是奇数，得到的结果是 1 减去小数部分。（镜像重复）

Three.js 封装
* Texture
  * image 贴在表面的图片
  * mapping 使用默认方式即可，一般是 uvmapping，意味着使用纹理坐标
  * wrapS 水平缠绕方式
  * wrapT 竖值缠绕方式
  * magFilter 纹理放大时的过滤方式
  * minFilter 纹理缩小时的过滤方式
  * format 纹理颜色格式 RGB 或 RGBA
* CanvasTexture
* VideoTexture

## 着色器
着色器是屏幕上呈现画面之前的最后一步，用它可以对先前渲染的结果做修改，包括对颜色、位置等等信息的修改，甚至可以对先前渲染的结果做后处理，实现高级的渲染效果。

着色器是一段在 GPU 中执行的接近 C 语言的代码，顶点着色器对于每个顶点调用一次，片元着色器对于每个片元调用一次。

## 常用图形
开发常用图形
* BoxGeometry
  * width、height、depth：可以简单理解成长宽高
  * 长宽高的 segments 片段数目
* CircleGeometry
  * radius 半径
  * segments
  * thetaStart 起始角度
  * thetaLength 弧度大小
* ExcludeGeometry 拉伸图形
  * shape 图形
  * option 配置
  * 配置：steps 沿着路径的节点数目
  * 配置：excludePath 拉伸路径
* 更多直接看 doc

Geometry 提供 vertices、faces、uvs 的属性操作的是普通数组，BufferGeometry 直接操作的是类型数组，将类型数组作为 Attribute 来管理，从速度上来说 BufferGeometry 更快，Geometry 内部会将以上属性转化成类型数组传给 GPU，从类的方法来说，两者除了操作自身私有属性的方法不同，对几何图形的操作的方法接口一致

## WebGL 点线面
WebGL 没有图形的概念，只有点和索引组成的三角片

点和索引：WebGL 对图形有一种标准的处理方式，与我们拥有的表面的复杂性和顶点个数无关，只有两种基础的数据类型来表达 3D 物体的几何形状：Vertices 和 Indices，也就是顶点和索引

Vertices：代表 3D 物体的拐点，每个顶点用 3 个数字来表达 x/y/z，WebGL 中没有提供 API 来将独立的顶点传递到渲染管线中，因此需要将所有的顶点放在数组当中，然后通过这个数组来构造一个 WebGL 顶点缓存区（Vertices buffer）

Indices：索引是在一个给定的 3D 场景中所有顶点的数字标识，索引告诉 WebGL 如何有序的链接顶点生成一个表面。和顶点一样，索引也是存储在数组中，然后使用WebGL 索引缓存区传递给 WebGL 的渲染管线

有两种 WebGL 缓存区来描述和处理几何图形
* 包含顶点数据的缓存区：Vertex Buffer Objects（VBO）
* 包含索引数据的缓存区：Index Buffer Objects（IBO）

存在另一种表现形式，不用索引数据，直接使用顶点数组，同时表示出点之间的关系，但由于会存在图形公用顶点的情况，因此数据会有冗余

渲染管线
* 顶点着色器
* 片元着色器

WebGL 的渲染管线，JavaScript 数组通过类型数组传递到缓存区，缓存去传递到 GPU，经过顶点着色器确定点位置，顶点颜色等，然后进入片元着色器为其中的每个像素进行着色

WebGL 渲染流程
1. 获取 WebGL 上下文
2. 初始化着色器程序
3. 初始化缓存区
4. 绘制场景

Three 对渲染管线的封装，BufferGeometry 绘制三角形，设置三个重要的 attribute 数据
* 顶点 position
* 法线 normal：光照模型的渲染
* 颜色 color

## 光照原理
现实生活中我们能看见物体是因为它们反射光，所有的物体根据它们的位置和与光源的相对距离反射的光是不同的，物体表面的法线代表表面的方向决定反射光的反向，表面的材料决定多少强度的光会被反射

光源：光源可以具有位置也可以只具有方向。当光源的位置能够影响场景的照亮时它就是点光源。方向光源指的是无论它的位置在哪都将对场景产生相同的光亮效果，如太阳光，这类光源也叫平行光。点光源通常用一个场景中的点来建模，而平行光通常用向量来代表它的方向，为了简便计算，通常用单位向量

法线：法线是垂直于我们想要照亮的物体表面的向量。法线代表表面的的方向，因此它们为光源和物体的交互建模中具有决定性作用

如何确定一个三角形的法线呢？
1. 确定三角形的两边向量，两个向量确定一个面
2. 两向量叉乘计算出该面法线向量

材料：WebGL 中的物体的材料需要结合它的颜色、纹理等多个参数来建模。材料颜色通常用 RGB 表示，材料的纹理与被匹配在物体表面的图像有关，为表面匹配图像的过程叫做纹理贴图

Goraud 插值：Goraud 插值方法在顶点着色器中计算最终颜色。顶点法线在这里的计算中使用，然后顶点的最终颜色使用 varying 变量传递到片元着色器中。由于 varying 变量在渲染管道中会被自动进行插值，每一个片元的最终颜色是由包含它的封闭三角形的三个顶点颜色决定的

Phong 插值：Phong 插值在片元着色器中计算出最终颜色。每个顶点法线通过 varying 变量沿着顶点着色器传递到片元着色器中。因为 varying 类型的插值机制被包含在管线中，所以每一个片元都有自己的法线，然后片元法线在片元着色器中来计算出最终的颜色。

Lambertian 反射模型：Lambertian 反射常用于计算机图形学中为漫反射建模，漫反射指的是入射光朝多个角度发射而不是只朝一个角度反射（镜面反射）。该条件下光照模型遵循余弦反射模型。Lambertian 反射通常使用表面法线和光照方向的负向量的点乘积，然后得到的结果乘以材料颜色和光源颜色。

Phong 反射模型：在 Phong 反射模型的描述中，表面反射光由三部分组成：环境光 + 漫反射 + 镜面反射

Three.js 的封装
* Light：所有光源的基类
* AmbientLight：周围环境光只有颜色，没有位置和方向
* DirectionalLight：方向光只有方向和颜色，没有位置，position 属性代表向
* PointLight：从一个点向周围发射光线，光照强度随距离衰减，position 代表位置
* SpotLight 聚光灯
* RectAreaLight：矩形区域光源，可以用来模拟透光窗户或条形灯

## ELSL 着色器语言
存储限定符
* attribute
  * 只存在于顶点着色器
  * 用于保存顶点属性数据，如位置、法线、颜色等
* uniform
  * 依次渲染中始终保持不变的量
  * 可以存在于顶点着色器和片元着色器中
  * 如果存在于两种着色器中，则变量名必须保持一致
* varying
  * 在顶点着色器和片元着色器之间传递插值数据
  * 两种着色器中声明的变量名需要保持一致

变量类型
* 基本变量类型：bool、int、float
* 向量类型：vec2、vec3……
* 矩阵类型：mt2、mt3、mt4
* 纹理类型：sampler2D、samplerCube

向量元祖
* {x,y,z,w}
* {r,g,b,a}
* {s,t,p,q} 纹理坐标

操作符和函数
* 数字运算
* dot(x,y) 点乘
* cross(x,y) 叉乘
* matrixCompMult(mat x,mat y) 矩阵相乘
* normalize(x) 向量标准化
* reflect(t,n) 根据向量 t 求出关于法线 n 的反射向量

Three.js 对着色器的封装
* WebGLProgram
* WebGLShader
* shaders 目录

ShaderMaterial：Three.js 暴露给开发者的着色器底层封装类，可以通过直接编写着色器来实现 Three.js 未提供的效果，灵活性高，难度大

## WebGL 矩阵
空间变换工具：矩阵
* 加/减：简单的各位置相加减
* 数乘：均乘以该数
* 转置：行变列
* 乘法：m * n 和 n * p 的乘积是一个 m * p 矩阵
* 逆矩阵：AB = BA = E

WebGL 使用的是列向量。

平移和旋转的先后顺序，当矩阵相乘时，在最右边的是第一个与向量相乘的，所以应该从右往左读这个乘法。因此先旋转后平移的矩阵操作是 TRV。因为矩阵乘法不遵循交换率，因此顺序很重要。

因此在组合矩阵时，建议先缩放操作，然后是旋转，最后才是位移，否则他们会消极的互相影响

## 光线投射
点击拾取基本原理
* 屏幕坐标转 ndc 坐标（[-1, 1]）
* ndc 坐标转 3D 坐标
* 构造射线
* 依次判断每个物体保包络球是否与射线相交
* 依次判断每个物体的表面是否与射线相交

RayCaster：Three.js 封装的用来做射线检测的类，通常用它来做点击拾取等需要射线检测的场景
* new THREE.Raycaster
* raycaster.setFromCamera(ndc, camera)
* raycaster.intersectObjects(objects)

返回结果
* distance：相机距离相交点具体
* face：与射线相交的物体的第一个表面
* faceIndex：与射线相交的物体的第一个表面的索引
* object：相交物体
* point：射线与物体相交点
* uv：相交点的纹理坐标

## 扩展
天空盒效果
* 六张简单的图片实现天空的效果和场景背景效果
* 本质是立方体模型，需要前后左右上下天上 6 个不同的图片作为贴图

Three 内置 ImageUtils 提供了 loadTexture 函数用来加载贴图

背景音乐：直接使用 audio 标签即可

Object3D 函数解释
* add：添加对象到这个对象的子级，被添加对象坐标变换变成相对该对象的局部坐标
* attach：将 object 作为子级来添加到该对象中，同时保持该object 的世界变换。
* clone：返回物体的克隆
* copy：复制给定对象到该对象中

## 性能
释放内存：dispose 函数 -- 有待深入研究

针对大规模的建筑群，可以将不很重要的建筑进行 merge，这样可以大大的提高渲染效率。

废置对象目标：几何体（不仅仅是 Mesh）、材质（Material）、纹理（Texture）、渲染目标、Scene、其他项：(来自 example 目录类，比如控制器和后期处理过程)

原则：如果存在 dispose 函数，就应当在清理的时候使用它

你可能需要知道：
1. 对于 mesh 清除，它的 geometry 和 material 并不会自动清除
2. 非 Group 对象 children 也是可能有值的，比如调用 add/attach 函数
3. traverse 会迭代自身以及子子孙孙，从上到下，从左到右
4. material 可能是数组
5. 检查 material 上是否存在 texture

> 经实践，dispose 只是清除 three 中对象的引用，自身对于 geometry、material 等引用也必须切断（赋空或 delete 表达式），否则无效

## 资料
* [Three.js入门指南](http://www.ituring.com.cn/book/miniarticle/48067)
* [一篇文章弄懂THREE.js中的各种矩阵关系](https://juejin.im/post/5a0872d4f265da43062a4156)
* [场景图](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-scene-graph.html)
* [Three.js Cleanup](https://threejsfundamentals.org/threejs/lessons/threejs-cleanup.html)