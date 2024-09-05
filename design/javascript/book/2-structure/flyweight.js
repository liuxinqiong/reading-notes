/**
 * 享元模式：支持大量细粒度的对象，避免对象间拥有相同内容造成多余的开销
 * 目的：提高程序的执行效率与系统的性能。因此在大型系统开发中应用比较广泛
 */

 // 享元对象
 var FlyWeight = (function() {
    var created = []
    function create() {
        var dom = document.createElement('div')
        document.getElementById('container').appendChild(dom)
        created.push(dom)
        return dom
    }
    return {
        getDiv: function() {
            if(created.length < 5) {
                return create()
            } else {
                var div = created.shift()
                created.push(div)
                return div
            }
        }
    }
 })()

 // 如上函数，我们就可以复用dom元素，在分页中就很常用

 // 享元动作，对不同对象之间相似的东西近一步抽象，我们要善于观察提取相似可共享的数据与方法来优化我们的应用
