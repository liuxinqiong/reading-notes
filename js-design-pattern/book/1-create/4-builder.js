/**
 * 建造者模式
 * 复杂对象的构建层和表示层分离，更关心的创建的过程
 * 整体对象类拆分，实现复用，但是也增加了结构的复杂性
 */

 // 模块1
function Human(param) {

}

function Named(name) {

}

function Work(word) {

}

var Person = function(name, work) {
    var _person = new Human()
    _person.name = new Named(name)
    _person.work = new Work(work)
    return _person
}