前端 UI 规范

## 前言
考虑到不同版本之间（哪怕是小版本更新）还是会有些许差别，因此前端组目前将 UI 框架的版本限定如下（2020.12.18）
* antd@4.3.5
* antd-design/icons@4.2.2

> 如果后续需要更新 antd 版本，则需要所有组同步更新，并修复可能的错误

## 主题定制
修改原则：
* 如果 antd/es/styles/themes/default.less 提供了定制的变量，则优先选择此方式修改
* 如果上述方式目的达不到，则通过全局样式覆盖的方式，具体见 xkui/styles/antd.less 文件（应尽可能少，因为 antd 的迭代可能会改变 classNames 名称，导致无效。同时也不利于维护）

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

## 各项目使用规则
