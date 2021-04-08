## 简介
ODA：Open Design Alliance

ODA 优势
* 多文件格式
* 网页端渲染模型
* 图纸批注与标签
* 图纸测量
  * 两点之间距离
  * 某个多边形区域的面积
  * 某个角度大小
  * 为了适应用户的习惯，测量时可以捕捉端点、中点、垂足及线条。
* 图层列表与管理
* ……

## VisualizeJS
ODA 提供的用于浏览端可视化的库。

VisualizeJS
* 渲染 Open Cloud 解析后的图形
* getVisualizeLibInst 获取实例
  * urlMemFile：Visualize.js.wasm 文件
  * TOTAL_MEMORY：所需的浏览器内存量
* visualizeLibInstance
  * postRun：准备就绪回调
  * canvas：执行用于绘制的 canvas 对象
  * getOverlayController
  * getViewer
* Viewer：单实例类
  * resize
  * update
  * addEmbeddedFile
  * appendFileWrapper
  * createBlock、createLayer、createLocalDatabase、createModel、createRasterImage、createTextStyle、createVisualStyle
  * findXXX
* 插件机制
  * OdaViewerPlugin：集成平移、缩放、镜头控制等
  * OdaSlicePlanePlugin：切面
  * OdaMeasuringPlugin：测量工具
  * OdaWorkerTransportPlugin

常用类：
* Entity：表示图形单元，通过 layer 属性关联具体的 layer
* Block：多个 Entity 组成一个 Model，有点 Template 的味道
* Layer：主要用于管理该图层下的 Entity
* Model：有点分类管理 Entity 的味道
* Device：可以用于创建 view 对象，添加多个 view 实例
* View：拆分视窗

如何读取文件并显示
1. 上传文件到服务端得到一个 fileId
2. 使用 fileId 创建一个从文件中解析图形的任务，得到 jobId
3. 根据 jobId 轮训任务状态，直到任务完成
4. 使用 viewer api 直接渲染图形数据

一下几个图形的区别
* Shell：外壳，第一个参数表示所有的顶点坐标，第二份参数比较复杂，第一个表示面的顶点数量，后面接的参数是各个顶点的下标
* ColoredShape：彩色平面，会填充颜色，参数格式和上面一样
* Mesh：网格化，指定行列数，顶点数和顶点坐标
* Grid：网格线，从原点出发，指向给定的两个点坐标作为向量，再通过两个数指定两个向量沿方向重复多少次来绘制一张网格

使用示例
```js
entityPtr.appendShell([-2, 0, 0, 2, 0, 0, 2, 2, 0, -2, 2, 0], [3, 0, 1, 2, 3, 2, 3, 0])

entityPtr.appendColoredShape([-2, 0, 0, 2, 0, 0, 2, 2, 0, -2, 2, 0], [3, 0, 1, 2, 3, 2, 3, 0])

entityPtr.appendMesh(3, 3, 9, [-2, 2, 0, 0, 2, 0, 2, 2, 0, -2, 0, 0, 0, 0, 0, 2, 0, 0, -2, -2, 0, 0, -2, 0, 2, -2, 0])

entityPtr.appendGrid([0, 0, 0], [-2, 2, 0], [2, 2, 0], 4, 3, 1)
```

已知问题（开始时间：2021年1月19号）
1. polygon 没有 getPoints 方法：fixed
2. setColor 对于 block 不生效：不算是 ODA 的 bug，在 Cad 中，颜色比较复杂
3. getSnapPoint 对于 block 不生效

### 颜色问题
我有个需求需要将原始的 Cad 文件渲染为底图，统一将颜色修改为灰色。一开始简单的通过遍历所有 Layer 的方式，通过修改 Layer 的颜色来达到目的，但总是会有一部分颜色修改不成功。

后面实际把玩了一下 AutoCad 后，发现颜色比想象的要复杂一下，Cad 颜色的设置有如下三种方式
* byLayer
* byBlock
* bySelf

我通过修改 Layer 颜色的方式，只能影响到 byLayer 的对象颜色，对于 byBlock 和 bySelf 的，就改变不了。