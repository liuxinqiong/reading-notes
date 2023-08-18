了解 ShaderMaterial 自定义着色器

three.js 中提供的 ShaderMaterial 给了开发者通过 GLSL 编写内置 materials 之外的效果。

<!-- more -->

## RawShaderMaterial vs ShaderMaterial
RawShaderMaterial vs ShaderMaterial
* RawShaderMaterial 不会自动添加内置的 uniforms 和 attributes
* ShaderMaterial 会自动内置的 attributes 和 uniforms，因此可以省略部分声明

## 语言基础
着色器语言基础
* GPU 的渲染流程中，顶点着色器代码先执行处理顶点，得到一系列片元，然后再执行片元着色器代码处理片元。
* 数据类型
  * 基本类型：int/float/bool
  * 引用类型：vec2/vec3/vec4/mat2/mat3/mat4
* 常量：const
* 结构体 struct
* 内置函数：同内置变量一样，不用声明，可以直接调用
  * 三角函数：radians、degrees、sin、cos、tan、asin、acos、atan
  * 几何函数：length、dot、cross、distance、normalize
  * 指数函数：pow、log、sqrt、…
  * 通用函数：max、min、abs、sign、floor、ceil、clamp、…
  * 向量关系函数
* discard 舍弃片元
* 支持数组类型，但仅支持一维数组
* 预处理
  * #define 宏定义
  * #include 一个着色器文件中引入另一个着色器文件
  * #ifdef/#endif 约束作用代码范围
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
WebGL 内置变量
* gl_PointSize float 点渲染模式，方形点区域渲染像素大小
* gl_Position vec4(x, y, z, w) 顶点坐标位置，`逐顶点`概念
* gl_FragColor vec4(r, g, b, a) 片元颜色值，`逐片元`概念，所有片元可以使用同一个颜色值，也可能不是同一个颜色值，可以通过特定算法计算或者纹理像素采样。
* gl_FragCoord vec2(x, y) 片元坐标，单位像素
  * 表示在 canvas 画布上渲染的所有片元或者说像素坐标，坐标原点在画布的左下角，x水平向右，y竖直向上，通过 x/y 属性可分别访问横纵坐标
* gl_PointCoord vec2(x, y) 点渲染模式对应点像素坐标
  * 点渲染模式中会将顶点渲染为一个方形区域
  * 一个顶点渲染为一个方形区域，每个方形区域可以以方形区域的左上角建立一个直角坐标系，然后使用内置变量 gl_PointCoord 描述每个方形区域中像素或者说片元的坐标

## 简单示例
片元颜色示例：根据位置设置渐变色
```glsl
void main() {
  // 片元沿着x方向渐变
  gl_FragColor = vec4(gl_FragCoord.x/500.0*1.0,1.0,0.0,1.0);
}
```

纹理采样
```glsl
// 接收插值后的纹理坐标
varying vec2 v_TexCoord;
// 纹理图片像素数据
uniform sampler2D u_Sampler;
void main() {
  // 采集纹素，逐片元赋值像素值
  gl_FragColor = texture2D(u_Sampler,v_TexCoord);
}
```

gl_PointCoord 应用案例：`gl.POINTS` 绘制模式点默认渲染效果是方形区域，通过下面片元着色器代码设置可以把默认渲染效果更改为圆形区域。
```glsl
precision lowp float;// 所有float类型数据的精度是lowp
void main() {
  // 计算方形区域每个片元距离方形几何中心的距离
  // gl.POINTS 模式点渲染的方形区域，方形中心是 0.5,0.5，左上角是坐标原点，右下角是 1.0,1.0
  float r = distance(gl_PointCoord, vec2(0.5, 0.5));
  //根据距离设置片元
  if(r < 0.5){
    // 方形区域片元距离几何中心半径小于0.5，像素颜色设置红色
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  } else {
    // 方形区域距离几何中心半径不小于0.5的片元剪裁舍弃掉：
    discard;
  }
}
```

TODO: 实现特定像素大小的线，参考 LineMaterial resolution 实现

## 扩展
取样器 sampler2D
* 该关键字声明一种取样器类型变量，简单说该变量对应纹理图片的像素数据，需要使用 uniform 关键字进行修饰
* 提供内置函数 texture2D 可以从纹理图像提取像素值，赋值给内置变量 gl.FragColor
  * 参数1-sampler
  * 参数2-uv 纹理贴图的 UV 坐标
  * 参数3-k 可选参数，添加偏差

WebGLRenderTarget（离屏渲染）
* renderer.render 方法如果指定了 WebGLRenderTarget，则渲染图像结果保存到该对象，不会显示在 canvas 上
* renderer.render 方法如果没有指定渲染目标，渲染结果会直接显示到 canvas 画布上
* 自身的 texture 属性可以获得 WebGL 渲染器的渲染结果，可以作为材质对象属性 map 的值