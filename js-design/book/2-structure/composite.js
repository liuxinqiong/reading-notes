/**
 * 组合模式：将对象组合成树形结构以表示『部分整体』的层次结构。
 * 组合模式使得用户对单个对象和组合对象的使用具有一致性
 * 整体就是对部分的组合，这样就简化了复杂的整体，通过不同的部分组合又丰富了整体
 * 具体要求：接口统一，在JavaScript中可以通过继承同一个虚拟类来实现
 */

 function News() {
    this.children = []
    this.element = null
 }

 News.prototype = {
     constructor: News,
     init: function() {
        throw new Error('请重写你的方法')
     },
     add: function() {
        throw new Error('请重写你的方法')
     },
     getElement: function() {
        throw new Error('请重写你的方法')
     }
 }

 // 这里解释一下，通常虚拟类时定义而不是实现的，在虚拟类中构造函数中定义两个变量，为了简化子类，因为所有子类本就需要继承这两个变量

 // 这里例子很抽象。我需要好好品一下，以上是基类（base），组合类（新闻容器，新闻项，新闻组），成员类（新闻）

 // 表单中的应用，在页面中，组合模式更常用在创建表单上

 var form = new FormItem('FormItem', document.body)
 form.add(new FieldsetIten('','')).add(
     new Group().add(new LabelItem()).add(new InputItem()).add(new SpanItem())
 ).add(
    new Group().add(new LabelItem()).add(new InputItem()).add(new SpanItem())
 )