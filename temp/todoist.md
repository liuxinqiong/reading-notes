TODO LIST
* maptalks 升级问题与场景优化
* frontend_utils 整理（主要是 info 使用 utils）
* 多 workspace，monorepo 研究
* ant design 主题定制与变量修改问题
* MaterialHelper 内存释放问题
* 请求竞态控制
* 权限控制组件
* 左右侧面板隐藏

紧急
* 镜像日照增加间距检测项
* 表单一开始就开启校验
* 官网首页：焦距和阴影问题

FormList 表单校验？

React 不缓存：可以给元素添加 key，当 key 发生变化时，则不缓存

nginx 代理静态资源后，错误提示 ERR_CONTENT_LENGTH_MISMATCH
* 原因：nginx 会缓存大文件到 proxy_temp 目录中，主进程在读取缓存的时候由于权限问题而无法访问
* 解决：通过 sudo chmod -R 777 /usr/local/var/run/nginx/* 打开权限即可

WebSocket 连接自动关闭？

stomp
* http://jmesnil.net/stomp-websocket/doc/
* https://www.npmjs.com/package/@stomp/stompjs
* https://stomp-js.github.io/api-docs/latest/classes/Client.html
* https://stomp-js.github.io/guide/stompjs/using-stompjs-v5.html

react batch
* https://stackoverflow.com/questions/53574614/multiple-calls-to-state-updater-from-usestate-in-component-causes-multiple-re-re
* http://blog.vjeux.com/2013/javascript/react-performance.html
* https://github.com/facebook/react/issues/14259
* https://react-redux.js.org/api/batch
* https://dmitripavlutin.com/react-hooks-stale-closures/#comments
* https://dmitripavlutin.com/simple-explanation-of-javascript-closures/
* https://www.jianshu.com/p/cc96b807f996
* https://codesandbox.io/s/react-hooks-batch-update-tqqq6?file=/src/Test.tsx

React 组件测试
* hooks 测试：@testing-library/react-hooks
* 组件很小而且仅依赖 props 时，是最容易测试的情况，但事情可能不会那么理想，通常组件还会依赖
  * redux store
  * context
  * even react router
* https://react-hooks-testing-library.com/usage/advanced-hooks
* https://jestjs.io/docs/en/asynchronous
* https://testing-library.com/docs/dom-testing-library/api-async#waitfor
* https://redux.js.org/recipes/writing-tests