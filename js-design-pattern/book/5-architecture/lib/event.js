F.module('lib/event',['lib/dom'], function(dom) {
    console.log(dom)
    var events = {
        on: function(id, type, fn) {
            dom.g(id)['on' + type] = fn
        }
    }
    return events
})