TODO LIST
* maptalks 升级问题与场景优化
* frontend_utils 整理（主要是 info 使用 utils）
* 多 workspace 研究
* ant design 主题定制与变量修改问题
* MaterialHelper 内存释放问题
* 请求竞态控制
* 权限控制组件
* 左右侧面板隐藏
* 选取相同：楼型、生成和绘制分开

紧急
* 镜像日照增加间距检测项
* 表单一开始就开启校验
* 楼型替换
* 首页：焦距和阴影问题
* 关闭 source-map + 监控

mouseEvent.stopImmediatePropagation();

umijs

运行时配置
* patchRoutes：动态修改路由，请求服务端根据响应动态更新路由
* render：复写 render 函数，比如用于渲染之前做权限校验
* onRouteChange：初始加载和路由切换时有一些事情，比如埋点统计

plugin：@umijs/plugin-qiankun

编译提速
* 配置 externals
* 减少补丁尺寸
* 调整 splitChunks 策略，减少整体尺寸
* 调整 SourceMap 生成方式
* 替换压缩器为 esbuild - 实验性特性