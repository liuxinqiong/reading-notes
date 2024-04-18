了解 ShaderMaterial 自定义着色器

three.js 中提供的 ShaderMaterial 给了开发者通过 GLSL 编写内置 materials 之外的效果。

<!-- more -->

## RawShaderMaterial vs ShaderMaterial
RawShaderMaterial vs ShaderMaterial
* RawShaderMaterial 不会自动添加内置的 uniforms 和 attributes
* ShaderMaterial 会自动内置的 attributes 和 uniforms，因此可以省略部分声明

#include 机制
* 开始以为是 glsl 语法，实际上是 three.js 尝试引入的模块机制
* 在 WebGLProgram 模块中对 #include 指令进行解析，配合 ShaderChunk 对象进行解析

## 语言基础
着色器语言基础
* GPU 的渲染流程中，顶点着色器代码先执行处理顶点，得到一系列片元，然后再执行片元着色器代码处理片元。
* 常量 const、结构体 struct
* 数据类型
  * 基本类型：int/uint/float/double/bool
  * 引用类型：vec2/vec3/vec4/mat2/mat3/mat4
  * 纹理类型：sampler2D、samplerCube
* 舍弃片元 discard
* 支持数组类型，但仅支持一维数组
* 预处理
  * #define 宏定义
  * #include 一个着色器文件中引入另一个着色器文件
  * #ifdef/#ifndef/#endif 约束作用代码范围
  * #if/#endif

## 变量类型
三种类型的变量
* attribute 和 uniform 关键字的目的主要是为了 javascript 语言可以通过相关的 WebGL API 把一些数据传递给着色器
* attribute：只可以在顶点着色器中访问，与每个顶点关联的变量，比如顶点位置，顶点法向量数据和顶点颜色（position/normal/uv）
* uniform：可通过顶点和片元着色器访问，所有顶点都具有相同值的变量
  * 比如光源的位置数据、方向数据、颜色数据
  * 比如顶点变换的模型矩阵、视图矩阵
* varying：顶点着色器传递到片元着色器的变量

## 内置变量
WebGL 内置变量-顶点着色器
* gl_PointSize：点渲染模式，方形点区域渲染像素大小
* gl_Position：vec4(x, y, z, w) 顶点坐标位置，`逐顶点`概念
* gl_Color：顶点主颜色
* gl_Normal：顶点法线值

WebGL 内置变量-片元着色器
* gl_FragColor：vec4(r, g, b, a) 片元颜色值，`逐片元`概念，所有片元可以使用同一个颜色值，也可能不是同一个颜色值，可以通过特定算法计算或者纹理像素采样
* gl_FragCoord：只读，片元的像素坐标，当前渲染的像素在画布内的坐标，左上角是 [0,0]，右下角是 [width,height]
* gl_PointCoord：vec2(x, y) 点渲染模式对应点像素坐标
  * 点渲染模式中会将顶点渲染为一个方形区域
  * 点精灵的二维空间坐标范围在 (0.0, 0.0) 到 (1.0, 1.0) 之间，仅用于点图元和点精灵开启的情况下
  * 一个顶点渲染为一个方形区域，每个方形区域可以以方形区域的左上角建立一个直角坐标系，然后使用内置变量 gl_PointCoord 描述每个方形区域中像素或者说片元的坐标
* gl_FrontFacing：用于判断 fragment 是否属于 front-facing，primitive，只读 bool
* gl_FragDepth：输出变量，我们可以使用它来在着色器内设置片段的深度值，如果着色器没有写入值到 gl_FragDepth，它会自动取用 gl_FragCoord.z 的值。在写入 gl_FragDepth 时，你就需要考虑到它所带来的性能影响。

容易搞混的坐标系
* uv：左下角是 [0, 0]，右上角是 [1, 1]
* FragCoord：左上角是 [0,0]，右下角是 [width, height]
* PointCoord：左上角是 [0, 0]，右下角是 [1.0, 1.0]

## 内置函数
常用内置函数有
* 角度函数 radians/degree
* 三角函数 sin/cos/tan/asin/acos/atan
* 指数函数 pow/exp/log/exp2/log2/sqrt
* 通用函数 abs/min/max/mod/sign/floor/ceil/clamp
  * mix 线性内插：mix(colorA, colorB, weight)，两种颜色混合，其中 weight 代表 B 的权重，1-weight 代表 A 的权重。
  * step 步进函数：step(a, b)，当 b>a 时返回 1，当 a>b 时返回 0
  * smoothstep(edge0, edge1, x) 当 edge0 < x < edge1 时，smoothstep() 在 0 和 1 之间执行平滑埃尔米特插值。
  * fract 取小数部分
  * lerp(a, b, x)：当 x=0 时返回 a，当 x=1 时返回 b，否则返回 ab 的差值
* 几何函数 length/distance/dot/cross/normalize/reflect/faceforward
  * reflect：返回一个向量相对于某个法向量的反射向量
* 矢量函数 lessThan/lessThanEqual/greaterThan/greaterThanEqual/equal/notEqual/any/all/not
* 矩阵函数 matrixCmpMult 逐元素乘法
  * 注意：不是按照线性代数中的矩阵乘法规则执行的，如果是线性代数中矩阵乘法规则，直接使用乘法符号 `*` 就可以，即 `x*y`
  * 内置矩阵函数 matrixCompMult() 的运算规则是同行同列的元素相乘，也就是 `x[i][j]` 和 `y[i][j]` 相乘
* 纹理查询函数
  * texture2D 在二维纹理中获取纹素
  * textureCube 从立方体纹理中获取纹素

长宽适配。在分辨率长宽不等的情况下，将坐标系映射为等边，映射后原先较长的一边其自变量会变大。举例：将一个正方形图贴在一个长方形上，此时图会被拉升，进行适配后则可以维持图片比例不变。
```js
uv.x *= u_resolution.x / u_resolution.y;
```

两个 step 或 smoothstep 相减，可以用来划线
```js
#version 300 es
precision highp float;
out vec4 FragColor;
uniform vec2 resolution;
void main() {
  vec2 st = gl_FragCoord.xy / resolution;
  vec2 center = vec2(0.5);
  float d = length(st - center);
  FragColor.rgb = (smoothstep(d - 0.015, d, 0.2) - smoothstep(d, d + 0.015, 0.18)) * vec3(1.0);
  FragColor.a = 1.0;
}
```

## 相关技巧
距离场构图法，最核心的思路是要定义一个形状的距离场，通俗来说，就是定义整个画布空间中每个像素点的距离值。

如果要绘制一条连续曲线，我们可以取相邻的三个点 A、B、C 采样，计算 P 点到这三个点构成的两条线段 AB 和 AC 的距离，取距离短的作为 P 到曲线的距离。

通过 `st = mix(vec2(-10, -10), vec2(10, 10), st);` 来扩大坐标系的区间，将坐标系从 `(0,0),(1,1)` 扩大到了 `(-10,-10),(10,10)`，这也是一种常用的数学技巧，可以牢记。

通过 `gl_FragCoord.xy / resolution` 可以将坐标值“归一”（即将值限制到 0~1 区间，这是一种在写着色器的时候经常使用的数学技巧）

网格技巧：将 uv 拉升 n 倍后取小数部分，处理后的 uv 会变成每个网格内的局部坐标，这个被广泛使用。

三角形绘制：定义点到三角形的距离为点到三角形三条边距离中最短的一条边的距离。

如果要在画布上绘制多个相同图形，不必一一绘制每一个图形，要我们有一些数学手段可以运用。
* 可以扩大 st 或 d 的值，然后对它取小数部分
* 这是两种不同的重复效果

入门教程
* [充分理解WebGL（一）](https://juejin.cn/post/7098256201661546532)
* [基于three.js实现一个粒子系统](https://juejin.cn/post/6844904161574649870)

## 简单示例
通常物体走的固有变换是
```js
void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}
```

片元颜色示例：根据位置设置渐变色
```js
void main() {
  // 片元沿着x方向渐变
  gl_FragColor = vec4(gl_FragCoord.x / 500.0 * 1.0, 1.0, 0.0, 1.0);
}
```

纹理采样
```js
// 接收插值后的纹理坐标
varying vec2 v_TexCoord;
// 纹理图片像素数据
uniform sampler2D u_Sampler;
void main() {
  // 采集纹素，逐片元赋值像素值
  gl_FragColor = texture2D(u_Sampler,v _TexCoord);
}
```

gl_PointCoord 应用案例：`gl.POINTS` 绘制模式点默认渲染效果是方形区域，通过下面片元着色器代码设置可以把默认渲染效果更改为圆形区域。
```js
precision lowp float;// 所有float类型数据的精度是lowp
void main() {
  // 计算方形区域每个片元距离方形几何中心的距离
  // gl.POINTS 模式点渲染的方形区域，方形中心是 0.5,0.5，左上角是坐标原点，右下角是 1.0,1.0
  float r = distance(gl_PointCoord, vec2(0.5, 0.5));
  //根据距离设置片元
  if(r < 0.5){
    // 方形区域片元距离几何中心半径小于0.5，像素颜色设置红色
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    // 方形区域距离几何中心半径不小于0.5的片元剪裁舍弃掉：
    discard;
  }
}
```

SpriteMaterial 中 sizeAttenuation 实现原理
```js
void main() {
  // ……
  vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );

	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
  // vertex shader 中
  #ifndef USE_SIZEATTENUATION
    bool isPerspective = isPerspectiveMatrix( projectionMatrix );

    if ( isPerspective ) scale *= - mvPosition.z;
  #endif

  vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
  // ……
}
```

关键代码 `scale *= - mvPosition.z;` 为什么是合理的？注意，一个是 ifdef 一个是 ifndef。

对比 PointsMaterial 实现
```js
void main() {
  gl_PointSize = size;

	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
    // 离得越远，则 scale/-mvPosition.z 越小，从而实现衰减效果
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
}
```

有意思：由于 step 返回值总是为 0 和 1，因此可以通过加、减、乘实现位运算，smoothstep 会出现中间值，此处不考虑。下面例子就是使用减法，实现组合 Circle 的方式绘制一张脸
```js
float Circle(vec2 uv, vec2 o, float r, float blur) {
  return smoothstep(r, r - blur, distance(uv, o));
}

float Face(vec2 uv, vec2 o) {
  float c = Circle(uv, vec2(.0, .0), 0.5, 0.01);
  c -= Circle(uv, vec2(-.2, -.2), 0.2, 0.01);
  c -= Circle(uv, vec2(.2, .2), 0.2, 0.01);
  return c;
}
```

总结常用函数：fract、mix、step、smoothstep、伪随机

## 扩展
取样器 sampler2D
* 该关键字声明一种取样器类型变量，简单说该变量对应纹理图片的像素数据，需要使用 uniform 关键字进行修饰
* 提供内置函数 texture2D 可以从纹理图像提取像素值，赋值给内置变量 gl.FragColor
  * 参数1：sampler
  * 参数2：uv 纹理贴图的 UV 坐标
  * 参数3：k 可选参数，添加偏差

TODO
* 理解 uniform 传递 resolution 的作用
* 理解 sizeAttenuation 实现原理
  * false 所有粒子都将拥有一样的尺寸，无论距离多远，参考 LineMaterial resolution 实现
  * true 粒子大小将取决于相机远近

