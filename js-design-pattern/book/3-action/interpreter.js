/**
 * 解释器模式
 */

var Interpreter = (function(){
    function getSublingName(node) {
        if(node.previousSibling) {
            var name = '',
                count = 1,
                nodeName = node.nodeName,
                sibling = node.previousSibling
            while(sibling) {
                if(sibling.nodeType == 1 && sibling.nodeType === node.nodeType && sibling.nodeName) {
                    if(nodeName == sibling.nodeName) {
                        name += ++count
                    } else {
                        count = 1
                        name += '|' + sibling.nodeName.toUpperCase()
                    }
                }
                sibling = sibling.previousSibling
            }
            return name
        } else {
            return ''
        }
    }

    function test(node, wrap) {
        var path = [],
            wrap = wrap || document
        if(node.parentNode !== wrap) {
            // path = arguments.callee(node.parentNode, wrap) // 等同于递归
            path = test(node.parentNode, wrap)
            console.log(path)
        } else {
            if(wrap.nodeType == 1) {
                path.push(wrap.nodeName.toUpperCase())
            }
        }
        var sublingsNames = getSublingName(node)
        if(node.nodeType == 1) {
            path.push(node.nodeName.toUpperCase() + sublingsNames)
        }
        return path
    }

    return test
})()


var path = Interpreter(document.getElementById('span7'))

console.log(path.join('>'))