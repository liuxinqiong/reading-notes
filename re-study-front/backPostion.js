/**
 * 多页应用回退，回到之前浏览位置
 * 单页应用处理就比较简单了，因为通常前一个页面的 DOM 依旧保留在内存中，仅仅是没有显示而已
 */
!(function(window, undefined) {
    var location = window.location.href
    var position = Object.create(null)
    window.addEventListener('scroll', function(e) {
        // 找到滚动元素
        var target = e.target

        var scrollTop = target.scrollTop
        var scrollLeft = target.scrollLeft
    }, true)


    function backPosition(element, scrollTop, scrollLeft) {
        element.scrollTo(scrollTop, scrollLeft)
    }

    // 如何找到元素

    // 如何知道页面所有 ajax 请求完

    // 如果页面分页

    // 呜呜感觉好复杂
})(window)