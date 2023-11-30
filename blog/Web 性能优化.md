## 背景
我们如何才能知道我们在性能方面所处的真正水平，以及我们的性能瓶颈到底是什么呢？它是巨大的JavaScript文件、缓慢的Web字体传输、繁重的图像、还是缓慢的渲染？是否值得去研究 Tree-Shaking、作用域提升、代码拆分，以及所有奇特的加载模式，包括交叉点观察器做懒加载、服务器推送、客户端提示、HTTP/2、service workers 或者说 edge workers？而且，最重要的是，我们该从哪里开始做性能优化，以及我们应该如何建立长期的关注性能的团队文化？

## 如何度量
Synthetic Testing：多个用户、多个网络环境、甚至多个地理环境下的多个时间的多次测量，从而得到相对准确的结果。

市面工具
* Page Speed Test
* Lighthouse

RUM - Real User Monitoring 真实用户数据检测：网站插入一段脚本，收集用户浏览器、操作系统、页面加载时间等相关信息

哪些指标是最重要的
* TTFB（Time To First Byte）
* Start Render
* First CPU Idle：第一次 CPU 空闲时间，还有个类似指标即 Time To Interactive（TTI）

作为一个性能报表，你可能更多的想要看到问题在哪而不是大家平均加载速度怎样，因此常见的性能统计表有一下三个方法
* 平均值
* 中位值：排序后，在总样本 1/2 处所在的性能数据
* 第 95 百分位值：排序后，找出第 95% 处的数据，通常这个数据是整个数据集中垫底的数据，既能帮你方法问题所在还能让你体验到用户群中最弱势的用户感受

> 你对系统某处性能的优化对系统整体的作用取决于该处在系统中的重要性以及你提升了多大。

## 相关优化
资源优化
* 使用 Brotli 进行纯文本压缩
* 使用响应式图像和 WebP
* 图像是否经过适当优化
  * 压缩、调整大小和处理图像
  * 对图片和 Iframe 进行懒加载，可以使用混合懒加载
* 视频是否经过适当优化
  * 尽量避免适用 gif 动画
* 网络字体是否经过优化
* 使用 tree-shaking、scope hoisting 和 code-splitting
* 能否将 JavaScript 抽离到 Web Worker
* 能否将频繁执行的功能抽离到 WebAssembly

构建优化
* 使用针对目标 JavaScript 引擎的优化
  * 脚本流允许 async 或 defer scripts 在单独的后台线程上进行解析
* 客户端渲染还是服务器端渲染？都需要！
  * 完全由服务器端渲染（SSR）
  * 静态SSR（SSR）
  * 带有 (Re)Hydration 的服务端渲染（SSR + CSR）
  * 使用 Next.js（React）或 Nuxt.js（Vue）也可以立即获得完整的服务器渲染体验。
  * 使用渐进 (Re)Hydration 进行流式服务器端渲染（SSR + CSR）
  * 三方同构渲染：在三个位置使用相同的代码渲染，在服务器上，在 DOM 中或在 service worker 中。
  * 客户端预渲染：Gatsby、VuePress
* 始终倾向于自行托管第三方资源
  * 出于安全性考虑，为了避免产生指纹，浏览器已实现了分区缓存，使用公共 CDN 不会自动提高性能。
* 限制第三方脚本的影响
* 正确设置HTTP缓存报文头
  * 仔细检查 expires、max-age、cache-control 和其他 HTTP 缓存报文头是否已正确设置
  * 确保没有发送不必要的报头
  * 确保报文中包含有用的安全和性能相关报文头

传输优化
* 您是否对所有的 JavaScript 库进行了异步加载
* 使用 IntersectionObserver 和优先级提示（priority hints）懒加载耗性能的组件
* 渐进加载图片
* 您发送了关键 CSS 吗
* 尝试重新组合您的 CSS 规则
* 您会流式化响应吗
* 考虑让组件具有可连接性
* 考虑让你的组件对设备内存敏感
* 预热连接以加速传输
  * dns-prefetch 可以在后台执行 DNS 查找
  * preconnect 控制浏览器在后台启动连接握手（DNS, TCP, TLS）
  * prefetch 要求浏览器请求一个资源
  * preload 预加载资源且不执行
* 使用 service worker 做缓存和网络降级
* 优化渲染性能
  * will-change 通知浏览器哪些元素和属性将会改变
* 你优化过渲染体验吗
  * 在加载资源时，我们可以试着总是走在客户的前面一步，这样虽然后台处理了很多事情，但用户体验仍然迅速
  * 为了保持客户的关注，我们可以尝试骨架屏幕，而不是展示加载中的一个指示器
  * 添加过渡/动画，并在没有更多优化的情况下欺骗用户体验
* 你是否防止了布局改变和重新绘制
  * 在可感知的性能领域中，其中一种更具破坏性的体验可能是布局转移，或者说是回流

网络与 http/2
* 启用 OCSP stapling 了吗
  * 通过在服务器上启用 OCSP stapling，可以加快 TLS 握手的速度
* 适配 IPv6 了吗
* 确保所有资源都在 HTTP/2 上运行
* 正确地部署 HTTP/2
* 您的服务器和 CDN 支持 HTTP/2 吗
* 您的服务器和 CDN 是否支持基于 QUIC 的 HTTP（HTTP/3）
* 正在使用 HPACK 压缩吗
* 确保您服务器的安全性是“无懈可击”的

## 参考文章
* [2020前端性能优化清单之一](https://mp.weixin.qq.com/s/iIbm1pVPYsOvpAeAjVziiQ)
* [2020前端性能优化清单之二](https://mp.weixin.qq.com/s/Y2osbl9CZggA0poci9rv3w)
* [2020前端性能优化清单之三](https://mp.weixin.qq.com/s/ohCDUyo8xqtKhYfbSs5wuQ)
* [2020前端性能优化清单之四](https://mp.weixin.qq.com/s/i5fNnTnmfAx7CufC00oaKQ)
* [2020前端性能优化清单之五](https://mp.weixin.qq.com/s/VDARTCShm0KivV_ouYvVGA)
* [2020前端性能优化清单之六](https://mp.weixin.qq.com/s/GHUMw2RFK-sXklJTPqoMdg)
* [Web页面全链路性能优化指南](https://mp.weixin.qq.com/s/IZEjbVbBmPlMGRw0fpyl_Q)