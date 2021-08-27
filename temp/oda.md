CadRecognizer 组件

## ODA
ODA 全称为 OpenDesign alliance，为我司购买的用于读取 CAD 文件（主要是突破 dwg 格式限制）数据的套件。

对于前端而言比较常用的文档地址如下
* [Forum:Web](https://forum.opendesign.com/forumdisplay.php?45-Web)：官网论坛，实在搞不懂地方，可以在这里讨论
* [cloud doc](https://cloud.opendesign.com/docs/index.html#/overview)：web 端官网文档
* [cloud examples](https://cloud.opendesign.com/docs//examples.html)：简单的例子，能让你有个初步的了解
* [git websdk](https://gitlab.opendesign.com/oda/websdk)：源码 Git 仓库

## ODA 升级
这个对于后端而言是一个比较辛苦的事情，但对于前端而言就十分简单了，只需要找到对应版本的 Visualize.js、Visualize.js.wasm 和 OdaViewerPlugin.js 上传到指定的 OSS 地址即可。具体配置见 CadRecognizer/config.ts。

具体资源可以从这里获得：[Release](https://www.opendesign.com/odoutgoing/Releases)

## 背景介绍
之前的智能 Cad 识别存在很多限制，比如
* 只能上传 dxf 格式，但市面主流格式是 dwg 格式
* 由于用户上传图纸的不规范，纯粹的智能语义识别无法满足很多特殊情况，导致识别结果并不如人意，且用户不知道错在哪里，从而导致体验不佳

## 功能介绍
为了解决智能 Cad 的困境，于是就有了 CadRecognizer 组件，提供如下功能
* 支持用户上传 dwg、dxf 等 Cad 文件，渲染内容作为底图
* 可选的智能语义接入，在智能语义的结果上支持用户进行修正，以及根据底图进行捕捉绘制新的语义
* 与具体业务解耦，通过配置的方式指定需要识别的语义，已经对应的语义参数录入
* 支持对于最终语义数据进行合法性校验，给予不同程度的提示，比如警告和错误

## 实现描述
与后端交互的时序图如下
TODO:补充一张图片

## 对接单体组新需求
本地对接单体组需求的迭代计划
* 通用参数录入功能
  * 后端 config 接口增加类似 globalProperties 即可，配置格式等同于语义识别元素属性配置
  * 前端 ConditionTool 增加对于该参数的判断，如果存在则使用 tab 组件进行暂时
* 增加根据图层方式进行批量指定功能
  * 后端新增对于每个语义数据所属的 layerName 字段
  * 组件增加 enableTools 参数，类型数组，可选值有：'pick' | 'draw' | 'pick-layer'，默认值 ['pick' | 'draw']
* 增加 ODA 视图功能
* 增加暗黑主题（optional）

至于回到单体应用的底图绘制以及捕捉：单体应用使用 Cad 解析出得到 raw geometry 数据使用 fabric 自行绘制。