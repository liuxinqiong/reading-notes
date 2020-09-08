React batch update

最近开发中，碰到个很奇怪的问题，导致出现了意料之外的 bug，在异步中多个调用 setUpdater，会导致组件 re-render 多次，而且每次调用 setUpdater 都会导致组件同步 re-render，且 useEffect 也会同步执行，从而代码流程不符合预期。

## 现象
正常的 event 事件是没有问题的，多次

## 结论
