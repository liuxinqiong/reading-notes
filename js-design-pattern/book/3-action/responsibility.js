/**
 * 职责链模式：通过职责链上的多个对象对分解请求流程，实现请求子在多个对象之间传递，直到最后一个对象完成请求的处理
 * 感觉就是分解需求，对于高耦合的代码进一步抽象和细分
 * 方便对每个阶段对象进行单元测试
 */

var sendData = function(data, dealType, dom) {
    // ...
    dealData(dealType, dom)
}

var dealData = function(dealType, dom) {
    create(dom)
}

var create = function(dom) {

}

// 单元测试：针对你所写的程序中的每个独立单元在不同种环境下进行的逻辑测试
