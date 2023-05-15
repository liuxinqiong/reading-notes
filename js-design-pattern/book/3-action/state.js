/**
 * 状态模式：当一个对象内部状态发生改变时，会导致其行为的改变
 * 作用：解决程序中臃肿的分支判断语句，将每个分支转化为一种状态独立出来，方便每种状态的管理又不至于每次执行时遍历所有分支
 */

// 这样的代码，是不是很熟悉
function showResult(result) {
    if(result === 0) {

    } else if(result === 1) {

    } else if(result === 2) {

    } else if(result === 3) {

    }
}

// 转换为状态对象
var ResultState = (function() {
    var States = {
        state0: function() {

        },
        state1: function() {

        },
        state2: function() {

        },
        state3: function() {

        },
    }
    function show(result) {
        States['state'+result] && States['state'+result]()
    }
    return {
        show: show
    }
})()

// 这样一来我们就可以这样使用
ResultState.show(3)

// 对于状态模式，主要目的就是将条件判断的不同结果转换为状态对象的内部状态

// 来一个复杂例子，超级玛丽，每个动作是可以组合的，如果我们采用条件判断的方式，无疑就陷入深渊了
function changeMarry(action1, action2) {
    if(action1 === 'shoot') {

    } else if(action1 === 'jump') {

    } else if(action1 === 'move' && action2 === 'shoot') {

    } else if(action1 === 'jump' && action2 === 'shoot') {

    }
}

// 状态的转换
var MarryState = function() {
    var _currentState = {},
    states = {
        jump: function() {},
        move: function() {},
        shoot: function() {},
        squat: function() {}
    }

    var Action = {
        changeState: function() {
            // 组合动作
            var arg = arguments
            // 重置内部状态
            _currentState = {}
            if(arg.length) {
                for(var  i = 0, len = arg.length; i < len; i++) {
                    _currentState[arg[i]] = true
                }
            }
            return this
        },
        goes() {
            for(var i in _currentState) {
                states[i] && states[i]()
            }
            // 链式调用
            return this
        }
    }

    return {
        change: Action.changeStatem,
        goes: Action.goes
    }
}

// 具体使用
MarryState().change('jump', 'shoot').goes().change('shoot').goes()

new MarryState().change('jump', 'shoot').goes().change('shoot').goes()

// 书上说第一种方式只能自己使用，如果别人使用的时候可能会修改状态类内部的状态，更安全的方式时实例化一下这个状态类，这样使用的是用状态类的一个复制。？？？这里实在有点理解不了！