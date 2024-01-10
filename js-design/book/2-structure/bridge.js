/**
 * 桥接模式：在系统沿着多个维度变化的同时，又不增加其复杂度并已达到解耦
 */

// 写代码还是要多思考，注意对相同逻辑做抽象提取处理，这样会让代码更简洁，重用率也会更大，可读性更强

// 对于事件的桥接方法，我们可以使用匿名函数来代替

// 先抽象提取出共用部分，然后将实现与抽象通过桥接方法链接在一起，来实现解耦的作用

// 多元化对象：抽象出不同对象之间共有的特性，然后用抽象出来的类组合实现更多的类，比如游戏中的球和人，都有运动单元，都有色彩绘制，因此可以进一步抽象

function Speed(x, y) {
    this.x = x
    this.y = y
}

Speed.prototype.run = function() {
    console.log('')
} 

function Color(cl) {
    this.color = cl
}

Color.prototype.draw = function() {
    console.log('')    
}

function Speak(wd) {
    this.word = wd
}

Speak.prototype.say = function() {
    console.log('')        
}

// 此时我们创建球
function Ball(x, y, c) {
    this.speed = new Speed(x, y)
    this.color = new Color(c)
}

Ball.prototype.init = function() {
    this.speed.run()
    this.color.draw()
}

// 创建人类
function People(x, y, f) {
    this.speed = new Speed(x, y)
    this.font = new Speak(f)
}

Ball.prototype.init = function() {
    this.speed.run()
    this.font.say()
}

// 总结：通过桥接模式，我们可以将元素的事件与业务逻辑之间解耦，同时我们可以更灵活的创建一个对象