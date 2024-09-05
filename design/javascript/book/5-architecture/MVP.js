/**
 * MVP：模型（Model）- 视图（View） - 管理器（Presenter）
 * View层不直接引用Model层内的数据，而是通过Presenter层实现对Model层内的数据访问，即所有层次的交互都发生在Precenter层中。
 * 目的：将视图层和数据层解耦，统一交由控制器层管理.
 * 管理层：管理数据，UI视图创建，交互逻辑，动画特效等，将管理层强大起来，数据层只提供数据，视图层只负责创建视图模板，他们业务独立且单一
 * 本质：将MVC中V的部分功能转移到P中
 */

~(function(window){
    var MVP = function(modName, pst, data) {
        MVP.model.setData(modName, data)
        MVP.presenter.add(modName, pst)
    }
    MVP.model = function() {
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
    }()
    MVP.view = function() {
        // 将参数字符串转换成期望模板
        return function(str) {
            return html
        }
    }
    MVP.presenter = function() {
        var V = MVP.view;
        var M = MVP.model;
        var C = {
            // 
        }
        return {
            init: function() {
                for(var i in C) {
                    C[i] && C[i]()
                }
            },
            add: function(modName, pst) {
                C[modName] = pst;
                return this
            }
        }
    }
    window.MVP = MVP
})(window)

// 分组的replace正则处理
function getHtml() {
    return str.replace(/(\w+)=(\w+)/, function(match, $1, $2){
        //...
    })
}

// 模块化开发
F.module('lib/MVP', function() {
    var MVP = function(){}
    // ...
    return MVP
})