/**
 * 适配器模式：将一个类的接口转换成另一个接口，以满足用户需求
 */

// 不同代码库（jQuery）适配器
window.A = A = jQuery

// 参数适配器，方法需要传递多个参数，但是记住参数的顺序是很困难的，因此通常以一个参数对象的方式传入，那么如果一些参数必须传入，一些参数有默认值呢
// 此时我们就可以使用适配器来适配传入的这个参数对象

function doSomeThing(obj) {
    var _adapter = {
        name: '',
        title: '',
        age: ''
    }
    for(var i in _adapter) {
        _adapter[i] = obj[i] || _adapter[i]
    }
    // 或者 extend(_adapter, obj) 此时可能会多添加参数
    // ……
}


// 数据适配 服务端数据适配 主要是将数据转换成我们需要的格式或者字段，我们称为数据适配器