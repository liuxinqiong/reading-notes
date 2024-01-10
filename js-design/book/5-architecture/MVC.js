/**
 * 模型、视图、控制器，用一种将业务逻辑、数据、视图分离的方式组织架构代码
 */

$(function() {
    var MVC = MVC || {}
    MVC.model = function() {
        var M = {}
        M.data = {}
        M.conf = {}
        return {
            getData(m) {
                return M.data[m]
            },
            getConf(c) {
                return M.conf[c]
            },
            setData(m, v) {
                M.data[m] = v
                return this
            },
            setConf(c, v) {
                M.conf[c] = v
                return this
            }
        }
    } ();
    MVC.view = function() {
        var M  = MVC.model;
        var V = {
            // 提供模板，根据M的数据渲染出指定模板的一系列函数
        }
        return function(v) {
            V[v]()
        }
    } ();
    MVC.ctrl = function() {
        var M = MVC.model;
        var V = MVC.view;
        var C = {
            // 调用View提供的函数
            // 交互逻辑，可能需要用到M和V
        };
    } ();
})

// 执行控制器 创建即执行
var C = {
    initSlideBar: function(){} ()
}
// 遍历执行
for(var i in C) {
    C[i] && C[i]()
}

// 视图层创建页面时需要用到数据层内的数据，使得数据层和模型层耦合在一起，这样降低了视图创建的灵活性和复用性