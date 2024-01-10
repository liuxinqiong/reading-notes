/**
 * 工厂方法模式
 * 解决简单工厂模式新增需求需要修改两处的问题
 * 将创建对象的积累放在工厂方法类的原型中即可
 */

 var Factory = function(type, content) {
    if(this instanceof Factory) {
        return new this[type](content)
    } else {
        return new Factory(type, content)
    }
 }

 Factory.prototype = {
     Java: function() {

     },
     JavaScript: function() {

     }
 }

 // 这样一来新增需求，只需要在原型中新增即可