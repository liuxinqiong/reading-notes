前端 UI 规范

## 前言
考虑到不同版本之间（哪怕是小版本更新）还是会有些许差别，因此前端组目前将 UI 框架的版本限定如下（2020.12.18）
* antd@4.3.5
* antd-design/icons@4.2.2

> 如果后续需要更新 antd 版本，则需要所有组同步更新，并修复可能的错误

## 主题定制
修改原则：
* 如果 `antd/es/styles/themes/default.less` 提供了定制的变量，则优先选择此方式修改
* 如果上述方式目的达不到，则通过全局样式覆盖的方式，具体见 `xkui/styles/antd.less` 文件（应尽可能少，因为 antd 的迭代可能会改变 className 名称，导致无效。同时也不利于维护）

## 同步规则
xkui 下 styles 目录结构
```shell
├── antd.less          # antd 全局样式覆盖
├── antdThemeConfig.js # antd 样式变量的覆盖
├── base.less          # 限定字体族、滚动条等基础样式
├── media.less         # 媒体查询工具，用于设置响应式
├── mixins.less        # 常用的工具：比如溢出省略号、清除浮动等
├── reset.less         # 用于抹平不同浏览器之间的差异
├── variables.less     # 规范定义的变量
├── global.less        # 汇总了对外输出的全局性样式，目前包括 antd.less/base.less/reset.less
```

相关命名规则
* 颜色相关：object-[status]-color-[desc]-[mode]-[index]
* 大小相关：object-[lg|md|base|sm|xs|xss]

## 各项目使用规则
各项目组跟进的大致步骤如下
1. 移除项目根目录自身的 antdThemeConfig.js（如果有的话），在 config-overrides.js 中引用 `xkui/styles/antdThemeConfig` 文件，赋值给 modifyVars 属性
2. 移除项目 styles 下的 `antd.less/base.less/reset.less` 三个文件，在 `global.less` 下 `@import '~xkui/styles/global.less';` 即可
   * 针对 antd.less 文件注意自身项目是否有特殊的样式覆盖，如果有，请走上面的修改原则
3. 根据下面更新内容，对变量进行一下同步（**如果项目组有优先级更高的任务，可先把这一步做完，不然会报错**）

关于项目自身的 styles 下的文件解释
* global.less：全部样式文件，1. 引用 xkui 下的 `global.less` 文件 2. 和其他自身项目需要的样式
* mixins.less：1. 引用 xkui 下的 `mixins.less` 文件 2. 和其他自身项目需要用到的样式（可以多思考下，是否具有通用性呢，考虑是否可以移到 xkui 下）
* variables.less：1. 引用 xkui 下的 `variables.less` 文件 2. 和其他项目自身需要的变量

> 建议 xkui 下的 styles 文件只被项目下的 styles 下文件引用。项目日常开发组件需要用到比如 variable/mixins，都引用项目下的 styles 文件

## 更新内容

### 2020.12.21
* 移除 @info-color，改成直接使用 @primary-color
* 移除 @font-color-content-white，改成使用 @font-color-content-dark
* 移除 @light-bg/@light-hover-bg/@light-active-bg，改成使用 @bg-color/@bg-hover-color/@bg-active-color
* 移除 @light-white-bg/@light-white-bg2，改成使用 @bg-color-dark/@bg-color-dark-2
* 移除 @font-size-base，改成使用 @xk-font-size-base（@font-size-base 被打包时魔改成 12）
* 移除 @border-radius-md 和 @border-radius-xs 圆角
  * @border-radius-md 改用 @border-radius-base
  * @border-radius-xs 改用 @border-radius-sm
* 单行元素高度
  * 移除 @header-height/@list-item-height/@form-item-height，直接改用 @height-base: 32px
* 移除 @box-shadow-layout/@box-shadow-layout-left，改用 @box-shadow-right/@box-shadow-left

强调下阴影
* 下阴影是最常见的阴影，规范定义了三个下阴影
  * @box-shadow-sm：常显的元素，鼠标 hover 上去加的阴影，如卡片悬浮
  * @box-shadow：非常显元素，与基准面的关系是展开并更跟随，如下拉面板
  * @box-shadow-lg：物体的运动和其他层级没有关联，如对话框
* 主要阴影：主要场景有：导航栏、工具栏、抽屉等。
  * @box-shadow-up：比如顶部导航栏
  * @box-shadow-down：比如底部导航栏
  * @box-shadow-left：比如右侧抽屉
  * @box-shadow-right：比如左侧抽屉