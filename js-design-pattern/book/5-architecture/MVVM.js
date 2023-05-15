/**
 * 视图的逆袭：MVVM模式：模型（Model） - 视图（View） - 视图模型（VM是模式的核心）
 * 为视图层量身定做一套视图模型，并在视图模型中创建属性和方法，为视图层绑定数据并实现交互
 * 思考：能否直接通过HTML创建视图实现复杂页面的需求呢，视图反过来控制管理器实现组件的需求
 */

//  <div class="first" data-bind="type: 'slide', data: demo1">

// 通过自定义属性data-bind为元素绑定JavaScript行为
// 视图V层的元素是要被视图模型VM监听

// 屏蔽压缩报错
~(function() {
    var window = this || (0, eval)('this')
    var VM = function(){
        var Method = {
            progressBar() {

            },
            slider() {

            }
        }
        function getBindData(dom) {
            var data = dom.getAttribute('data-bind')
            // 自定义属性bind-data转换为对象
            return !!data && (new Function("return ({" + data + "})"))()
        }
        return function() {
            var doms = document.body.getElementsByTagName('*'),
                ctx = null;
            for(var i = 0; i < doms.length; i++) {
                ctx = getBindData(doms[i])
                ctx.type && Method[ctx.type] && Method[ctx.type](doms[i], ctx)
            }
        }
    }();
    window.VM = VM
})()

window.onload = function() {
    VM()
}