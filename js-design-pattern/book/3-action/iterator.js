/**
 * 迭代器模式：在不暴露对象内部结构的同时，可以顺序的访问聚合对象内部的元素
 * 程序中的循环是一种利器，但有时一遍又一遍的重复性循环却让代码显得臃肿不堪，有没有一种优雅的方式呢
 */

// 例子：迭代dom元素
var Iterator = function(items, container) {
    var container = container && document.getElementById(container) || document,
        items = container.getElementByTagName(items)
        length = items.length
        index = 0,
        splice = [].splice
    return {
        first() {
            index = 0
            return items[index]
        },
        last() {
            index = length - 1
            return items[index]
        },
        pre() {
            if(--index > 0) {
                return items[index]
            } else {
                index = 0
                return null
            }
        },
        next() {
            if(++index < length) {
                return items[index]
            } else {
                index = length - 1
                return null
            }
        },
        get(num) {
            index = num >= 0 ? num % length : num % length + length
            return items[index]
        },
        dealEach(fn) {
            // 第二个参数开始为回调函数中参数
            var args = splice.call(arguments, i)
            for(var i = 0; i < length; i++) {
                fn.apply(items[i], args)
            }
        },
        dealItem(num, fn) {
            fn.apply(this.get(num), splice(arguments, 2))
        },
        exclusive(num, allFn, numFn) {
            this.dealEach(allFn)
            if(Object.prototype.toString.call(num) === "[Object Array]") {
                for(var i = 0, len = num.length; i < len; i++) {
                    this.dealItem(num[i], numFn)
                }
            } else {
                this.dealItem(num, numFn)
            }
        }
    }
}

// 有了上述迭代器之后，我们就可以对外屏蔽并不美观的for循环，迭代器在日常开发中十分常见

// 数组迭代器
var eachArray = function(arr, fn) {
    var i = 0,
        len = arr.length;
    for(; i < len; i++) {
        if(fn.call(arr[i], i, arr) === false) {
            break
        }
    }
}

// 对象迭代器
var eachObject = function(obj, fn) {
    for(var i in obj) {
        if(fn.call(obj[i], i, obj) === false) {
            break
        }
    }
}

// 同步变量迭代器，用不解决 A.b.c 表达式取值与赋值操作在中间环节有空时的保存
AGetter = function(key) {
    if(!A) {
        return undefined
    }
    var result = A
    key = key.split('.')
    for(var i = 0; i < key.length; i++) {
        if(result[key[i]] !== undefined) {
            result = result[key[i]]
        } else {
            return undefined
        }
    }
    return result
}

ASetter = function(key, val) {
    if(!A) {
        return false
    }
    var result = A
    key = key.split('.')
    for(var i = 0; i < key.length - 1; i ++) {
        if(result[key[i]] === undefined) {
            result[key[i]] = {}
        }
        if(!(result[key[i]] instanceof Object)) {
            throw new Error('A.' + key.splice(0, i + 1).join('.') + 'is not Object')
            return false
        }
        result = result[key[i]]
    }
    return result[key[i]] = val
} 

// 分支循环嵌套问题，优化for循环，比如用canvas处理图片像素
function dealImage(t, x, y, w, h, a) {
    var canvasData = ctx.getImageData(x, y, w, h)
    var data = canvasData.data
    // 遍历每组像素数据（4个像素分别代表rgba）
    for(var i = 0; i < data.length; i += 4) {
        switch(t) {
            case 'red': 
                data[i + 1] = 0
                data[i + 2] = 0
                data[i + 3] = a
            case 'green':
                data[i] = 0
                data[i + 2] = 0
                data[i + 3] = a
            case 'blue':
                data[i] = 0
                data[i + 1] = 0
                data[i + 3] = a
            case 'gray':
                var num = parseInt((data[i] + data[i + 1] + data[ i + 2]) / 3)
                data[i] = num
                data[i + 1] = num
                data[i + 2] = num
                data[i + 3] = a
        }
    }
}

// 上述方式有个巨大的问题就是每次遍历都要进行一次分支判断，造成了巨大的不必要消耗，我们可以通过策略模式和迭代器模式优化
function dealImage(t, x, y, w, h, a) {
    var canvasData = ctx.getImageData(x, y, w, h)
    var data = canvasData.data
    var Deal = function() {
        var method = {
            'default': function(i) {
                return method['gray'][i]
            },
            'red': function(i) {
                data[i + 1] = 0
                data[i + 2] = 0
                data[i + 3] = a
            },
            'gray': function(i) {
                var num = parseInt((data[i] + data[i + 1] + data[ i + 2]) / 3)
                data[i] = data[i + 1] = data[i + 2] = parseInt((data[i] + data[i + 1] + data[ i + 2]) / 3)
                data[i + 3] = a
            }
        }
        return function(type) {
            return method[type] || method['default']
        }
    }
    function eachData(fn) {
        for(var i = 0; i < data.length; i += 4) {
            fn(i)
        }
    }
    eachData(Deal(t))
    ctx.putImageData(canvasData, width + x, y)
}

// 迭代器是优化循环语句的一种可行方案，使得程序清晰易读