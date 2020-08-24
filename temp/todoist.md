TODO LIST
* maptalks 升级问题与场景优化
* frontend_utils 整理（主要是 info 使用 utils）
* 多 workspace，monorepo 研究
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

FormList 表单校验？

相机切换
* 球坐标

React 不缓存：可以给元素添加 key，当 key 发生变化时，则不缓存

nginx 代理静态资源后，错误提示 ERR_CONTENT_LENGTH_MISMATCH
* 原因：nginx 会缓存大文件到 proxy_temp 目录中，主进程在读取缓存的时候由于权限问题而无法访问
* 解决：通过 sudo chmod -R 777 /usr/local/var/run/nginx/* 打开权限即可

three.js 截图
* preserveDrawingBuffer
* premultipliedAlpha
* https://threejsfundamentals.org/threejs/lessons/threejs-tips.html
* 竟然和大小相关

WebSocket 连接自动关闭？

stomp
* http://jmesnil.net/stomp-websocket/doc/
* https://www.npmjs.com/package/@stomp/stompjs
* https://stomp-js.github.io/api-docs/latest/classes/Client.html
* https://stomp-js.github.io/guide/stompjs/using-stompjs-v5.html
