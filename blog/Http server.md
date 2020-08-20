Http Server 1.0：单进程
Http Server 2.0：多进程，进程切换成本高
Http Server 3.0：Select 模型
  * Http Server 告诉操作系统内核，需要等待什么东西（File Descriptor List），然后阻塞，如果事情发生了，再把 Http Server 唤醒做事情
  * 抛弃了一个 Socket 对应一个进程的模式，使用一个进程就可以处理所有的 Socket 了
Http Server 4.0：epoll 模型
  * Select 模型每次把 Http Server 唤醒时，Http Server 需要遍历所有的 fd，但实际情况，很多 Socket 并不活跃，比如 1000 多个中可能只有几十个需要真正处理，在 Select 模型中不得不查看所有的 socket fd，但实际情况，很多
  * epoll 模型和 Select 模型类似，但内核只会告知那些可以读写的 socket fd，只需要处理那些 ready 的 socket 即可
