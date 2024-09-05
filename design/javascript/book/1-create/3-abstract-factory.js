/**
 * 抽象工厂模式
 * 抽象类：定义一个产品簇，并声明一些必备的方法，如果子类没有去重写，则会报错
 * 总结：有点可悲，带看能看懂，应用场景有点抽象
 */

 // JavaScript是没有抽象类结构的，但由于其灵活性，我们可以模拟抽象类
 var Car = function() {}
 Car.prototype = {
     getPrice() {
        return new Error('抽象方法不能调用')
     },
     getSpeed() {
        return new Error('抽象方法不能调用')
     }
 }

 // 场景：在大型应用中，总会有子类继承父类，这些父类会定义一些必要方法，但没有具体的实现

 var VehicleFactory = function(subType, superType) {
    if(typeof VehicleFactory[superType] === 'function') {
        function F(){}
        F.prototype = new VehicleFactory[superType]()
        subType.constructor = subType
        // 为啥不直接 new VehicleFactory[superType]()，而是用一种中转函数
        subType.prototype = new F()
    } else {
        throw new Error('未创建该抽象类')
    }
 }

 // 抽象工厂是个方法不需要实例化对象，故只需要一份，因此直接为抽象工厂添加类的属性即可，举个例子

 VehicleFactory.Car = function() {
     this.type = 'car'
 }
 VehicleFactory.Car.prototype = {
     getPrice() {
        return new Error('抽象方法不能调用')
     },
     getSpeed() {
        return new Error('抽象方法不能调用')
     }
 }

 // 如果需要具体的汽车呢
 var BMW = function(price, speed) {
     this.price = price
     this.speed = speed
 }

 VehicleFactory(BMW, 'Car')

 // 重写函数
 BMW.prototype.getPrice = function() {}
 BMW.prototype.getSpeed = function() {}

 // 抽象工厂模式是设计模式中最抽象的一种，也是创建模式中唯一一种抽象化创建模式