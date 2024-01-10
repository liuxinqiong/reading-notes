/**
 * 简单工厂模式：由一个工厂对象决定创建某一种产品对象类的实例
 * 解决问题：暴露的对象过多的问题，提供一个统一的创建入口，有利于屏蔽细节，类似与收货员与商品关系
 */

 var popFactory = function(name) {
    switch(name) {
        case 'alert':
            return new Alert()
        case 'confirm':
            return new Comfirm()
        case 'prompt':
            return new Prompt()
    }
}

// 如果待创建的对象有很多相似的东西，可以进一步优化：相似东西提取，不相似东西针对性处理

function createPop(type, text) {
    var o = new Object()
    o.show = function() {}
    if(type === 'alert') {
        // 处理差异
    }
    if(type === 'confirm') {

    }
    if(type === 'prompt') {

    }
    return o
}

// 缺点：每次我们增加一个对象，需要动两处代码，能否解耦