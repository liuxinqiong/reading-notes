## 如何度量
Synthetic Testing - 实验数据测量

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

## 参考文章
* [2020前端性能优化清单之一](https://mp.weixin.qq.com/s/iIbm1pVPYsOvpAeAjVziiQ)
* [2020前端性能优化清单之二](https://mp.weixin.qq.com/s/Y2osbl9CZggA0poci9rv3w)
* [2020前端性能优化清单之三](https://mp.weixin.qq.com/s/ohCDUyo8xqtKhYfbSs5wuQ)
* [2020前端性能优化清单之四](https://mp.weixin.qq.com/s/i5fNnTnmfAx7CufC00oaKQ)
* [2020前端性能优化清单之五](https://mp.weixin.qq.com/s/VDARTCShm0KivV_ouYvVGA)
* [2020前端性能优化清单之六](https://mp.weixin.qq.com/s/GHUMw2RFK-sXklJTPqoMdg)