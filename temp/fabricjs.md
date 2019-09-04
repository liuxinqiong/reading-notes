fabric.js 是可以简化 canvas 编写的 js 库，提供 canvas 缺少的对象模型，以及一个SVG解析器，一个交互层，以及一整套其他必不可少的工具。

基本步骤
1. 创建fabric的canvas对象
2. 创建fabric的各种对象，包括：rect，circle，line，image等
3. 将创建好的对象添加到canvas
4. 可以对每一个fabric对象使用动画，克隆，修改属性，事件监听，碰撞检测等。修改属性需及时渲染canvas才能展示出效果

fabric.Canvas：用来管理内部所有的对象
* 传入元素 id，返回对应实例
* 第二个参数为 options，支持配置背景色或图像、裁剪、高度、宽度、是否互动等。也可以调用 setXXX 函数进行设置
* add(object) 函数添加对象
* insertAt(object,index) 添加
* moveTo(object,index) 移动
* item(index) 访问指定下标对象
* getObjects() 获取所有对象
* remove(object) 删除指定对象
* forEachObject 循环遍历 
* isEmpty() 判断是否空画板
* size() 画板元素个数
* contains(object) 查询是否包含某个元素
* clear() 清空
* renderAll() 重绘
* requestRenderAll() 请求重新渲染
* rendercanvas() 重绘画板
* getCenter().top/left 获取中心坐标
* setCursor() 设置手势图标
* dispose() 释放
* getSelectionContext()获取选中的context
* getSelectionElement()获取选中的元素
* getActiveObject() 获取选中的对象
* getActiveObjects() 获取选中的多个对象
* discardActiveObject()取消当前选中对象 

7 种基础形状
* fabric.Line：直线
* fabric.Ellipse
* fabric.Circle：圆
* fabric.Rect：矩形
* fabric.Triangle：三角形
* fabric.Polygon
* fabric.Polyline

大多数对象从根 fabric.Object 继承

操作对象：set 赋值，支持 k-v、对象形式，支持链式调用。get 获取，支持传入 key 形式和 getXXX 形式。
* 改变定位：top，left
* 尺寸：width，height
* 渲染：fill, opacity, stroke, strokeWidth
* 缩放和旋转：scaleX, scaleY, angle
* 翻转：flipX，flipY
* 歪斜：skewX，skewY

left 和 top 是每种 Object 都有的属性，至于它到底指图形中哪一个点的坐标，由 originX 和 originY 这组参数决定。
* originX 三种可选值：left,center, right
* originY 三种可选值：top, center, bottom

互动属性
* selectable 是否可以选中

图像
* fabric.Image：指定 IMG 元素来创建实例
* fabric.Image.fromURL：通过 URL 来创建
* fabric.Image.filters 图片滤镜

路径与 Group
* fabric.Path 创建更复杂，丰富的形状
* 对于更复杂的图形，可能需要使用像 fabric.loadSVGFromString 或 fabric.loadSVGFromURL 方法来加载整个 SVG 文件,然后让 Fabric 的 SVG 解析器完成对所有 SVG 元素的遍历和创建相应的 Path 对象的工作。

动画：这个无敌强
* object.animate(key, value, options)
* options 可以指定from、duration、onChange、onComplete 、easing 

进阶函数
* fabric.util.cos
* fabric.util.sin
* fabric.util.drawDashedLine 绘制虚线
* toDatalessJSON() 画板信息序列化成最小的json
* toJSON() 画板信息序列化成json

颜色相关
* fabric.Color：十六进制，RGB 或 RGBA 颜色
* 转换：toHex 将颜色实例转换为十六进制表示。 toRgb 可以转换为 RGB，toRgba 转换为带 Alpha 通道的 RGB。
* 叠加：overlayWith
* 转换为灰度：toGrayscale

渐变：object.setGradient(attr, options)

文本
* fabric.Text(text, options)
* fontFamily
* fontSize
* fontWeight
* textDecoration
* shadow
* fontStyle
* textAlign
* lineHeight
* textBackgroundColor

事件
* mouse:down/mouse:move/mouse:up
* before:selection:cleared/selection:created/selection:cleared
* object:added/object:modified/object:selected/object:moving/object:scaling/object:rotate/object:removed
* after:render
* Fabric将进一步提升事件系统，并允许您将侦听器直接附加到canvas画布中的对象上，书写省略 object 即可

## 资料
* [fabric.js和高级画板](https://blog.csdn.net/sufu1065/article/details/80116758)