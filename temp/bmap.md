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