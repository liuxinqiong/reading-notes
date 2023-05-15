/**
 * 备忘录模式：缓存函数的使用
 * 应用十分常见：比如换肤设置，MVC的M部分
 * 主要是对现有的数据或状态做缓存，为将来某个时刻使用或恢复做准备
 */

// 分页场景，如果切换到已经访问过的分页，是否可以使用缓存呢，答案是肯定的

var Page = function () {
    var cache = {}
    return function (page, fn) {
        if (cache[page]) {
            showPage(page, cache[page])
            fn && fn()
        } else {
            ajax(function(res) {
                if(res.errNo == 0) {
                    showPage(page, res.data)
                    cache[page] = res.data
                    fn && fn()
                }
            })
        }
    }
}

// 重复性的请求不进增加了服务端的压力，而且造成了浏览器对请求数据的等待，进而影响用户体验
// 当数据量过大时，会严重占用系统提供的惜缘，此时对缓存器的缓存策略优化是很有必要的，复用率低的数据缓存下来是不值得的