Rob Pike's 5 Rules of Programming
* Rule 1：你无法判断一个程序将在哪里花费它的时间。瓶颈会出现在令人惊讶的地方，所以在你证明瓶颈在哪里之前，不要试图猜测并进行速度优化。
* Rule 2：测量。在测量之前不要进行速度调优，即使这样也不要进行调优，除非代码的一部分压倒了其他部分
* Rule 3：当 n 很小时，高级算法会很慢，而 n 通常很小。高级算法有很大的常数。除非你知道 n 通常会很大，否则不要太高级。(即使 n 变大了，也要先用规则 2。)
* Rule 4：高级的算法比简单的算法更有漏洞，而且更难实现。使用简单的算法和数据结构
* Rule 5：数据占主导地位，如果你选择了正确的数据结构并且组织得很好，算法几乎总是不言自明的，数据结构，而不是算法，是编程的核心。

Conclusion
* Premature optimization is the root of all evil.
* When in doubt, use brute force.
* KISS design philosophy.
* Write stupid code that uses smart objects.