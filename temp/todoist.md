TODO LIST
* maptalks 升级问题与场景优化
* frontend_utils 整理（主要是 info 使用 utils）
* 多 workspace 研究

紧急
* info 优化需求
* 镜像日照增加间距检测项
* 优化：Form 表单自动提交和弹窗确认按钮交互方式
* 表单一开始就开启校验
* 首页模型展示
* 属性区修改 + 指南针
* 权限控制组件
* 图层
  * 锁定还能选中吗
  * 隐藏的选中效果淡一些

headers
* referer
* host
* origin

经典地图
* 瓦片服务：http://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20200604&from=jsapi2_0
* 支持的子域名：subdomains [0, 1, 2, 3]
* styles 参数可配置内置主题

自定义地图
* 瓦片服务：http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20200604&scale=1&ak={ak}&styles={styleJSONParseString}
* 支持的子域名：subdomains [0, 1, 2]
* styles 为自定义主题的 JSON 配置进行 encode 之后的字符串
* 可以配置 customid 参数

卫星图
* 瓦片服务：http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20200604
* 支持的子域名：subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]


```js
[
    {
        "featureType": "poilabel",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "featureType": "manmade",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    }
]
```