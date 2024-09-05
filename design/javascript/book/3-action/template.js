/**
 * 模板方法模式：父类定义一组操作算法骨架，而将一些实现步骤延迟到子类中，使得子类可以不改变父类的算法结构的同时可重新定义算法中的某些实现步骤
 */

// 归一化，比如弹出框归一化，实际项目中弹出框是有多重样式的，他们之间有不同，又有相同之处，这里我们就可以抽象出一个父类模板出来

// 基本提示框
var Alert = function(data) {
    if(!data) {
        return
    }
    this.content = data.content
    this.panel = document.createElement('div')
    this.contentNode = document.createElement('p')
    this.confirmBtn = document.createElement('span')
    this.closeBtn = document.createElement('b')
    // ……为元素设置基本样式
    this.panel.className = 'alert'
    this.closeBtn.className = 'a-close'
    this.confirmBtn.className = 'a-confirm'
    this.confirmBtn.innerHTML = data.confirm || '确认'
    this.contentNode.innerHTML = this.content
    this.success = data.success || function() {}
    this.fail = data.fail || function() {}
}

// 方法
Alert.prototype = {
    init: function() {
        this.panel.appendChild(this.closeBtn)
        this.panel.appendChild(this.contentNode)
        this.panel.appendChild(this.confirmBtn)
        document.body.appendChild(this.panel)
        this.bindEvent()
        this.show()
    },
    bindEvent: function() {
        var me = this
        this.closeBtn.onclick = function() {
            me.fail()
            me.hide()
        }
        this.confirmBtn.onclick = function() {
            me.success()
            me.show()
        }
    },
    hide: function() {
        this.panel.style.display = 'none'
    },
    show: function() {
        this.panel.style.display = 'block'
    }
}

// 有了这个提示框后，想扩展其他类型弹层就来的简单多了，比如确认按钮在右侧
var RightAlert = function() {
    Alert.call(this, data)
    this.confirmBtn.className = this.confirmBtn.className + ' right'
}

RightAlert.prototype = new Alert()

// 比如我们需要标题提示框
var TitleAlert = function(data) {
    Alert.call(this, data)
    this.title = data.title
    this.titleNode = document.createElement('h3')
    this.titleNode.innerHTML = this.title
}

TitleAlert.prototype = new Alert()
TitleAlert.prototype.init = function() {
    this.panel.insertBefore(this.titleNode, this.panel.firstChild)
    Alert.prototype.init.call(this)
}

// 继承类也可以作为模板类。比如我们需要一个带有取消按钮的标题提示框，我们继承已有的标题提示框即可，这样一来，扩展是不是就来的很方便

// 总结：这样实现的提示框，不仅功能结构统一，而且日后有集体变更的需求，只需要修改一处，是不是美滋滋

// 模板方法模式不仅在我们归一化组件时可用，有时候创建页面的时候也很常用，比如我们创建页面导航，三类导航样式有所同有所不同

// 模板替换
function formatString(str, data) {
    return str.replace(/\{#(\w+)#\}/g, function(match, key) {
        return typeof data[key] === undefined ? '' : data[key]
    })
}

// 基本导航类
var Nav = function(data) {
    this.item = '<a href="{#href#}" title="{#title#}">{#name#}</a>'
    this.html = ''
    for(var i = 0, len = data.length; i < len; i++) {
        this.html += formatString(this.item, data[i])
    }
    return this.html
}

// 此时如果需要带有链接的导航，可以这么做
var LinkNav= function(data) {
    var tpl = '<span>{#link#}</span>'
    for(var i = data.length -1; i >= 0; i--) {
        data[i].name += data[i].name + formatString(tpl, data[i])
    }
    return Nav.call(this, data)
}