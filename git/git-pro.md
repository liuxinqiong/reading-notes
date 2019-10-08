Git 高阶操作

## checkout 身兼多职
checkout 身兼多职
* 分支相关操作
* 恢复文件之到之前的某个状态

> 使用 -- 来告诉 Git 你是想恢复文件而不是切换分支

恢复文件肯定有 source（从哪里恢复）和 target（恢复到哪里去），checkout 的 target 就是指你的工作目录，source 可从暂存目录往工作目录里恢复文件，也可以从 repo 里的各个 commit 记录里往工作目录恢复文件。比如从某个 commit 中恢复
```shell
git checkout 9fc9896 test.txt
```

> 可以使用各种快捷方式来引用各个 commit，比如 HEAD，分支名称代表所在分支的最新 commit

总结 checkout 常用操作
* 分支相关操作：`git checkout 分支名/commit hash` 切换到相应的分支或 commit，加上 `-b` 参数则会创建分支并切换过去
* 恢复文件相关操作：`git checkout [分支名/commit hash/HEAD快捷方式] -- 文件名` 恢复指定分支的最新commit或指定 commit 或快捷方式指向的 commit 的文件到工作目录，若省略中间的参数，则
  * 暂存区有内容且暂存区内容与工作目录不同，则恢复暂存区的状态到工作目录
  * 暂存区无内容，则恢复 HEAD（最新的 commit）的状态到工作目录

## 真的了解 diff 吗
diff 命令用于比较任意两个状态的差别，语法为：`git diff source target`，比较的结果其实是以 target 为基准的，也就是说 target 相比于 source 有了哪些变化

如果只给出一个参数，则这个参数为 source，target 默认为当前工作目录。

如果两个参数都省略，那么默认 source 为暂存目录，默认 target 为工作目录。

如果我想比较暂存目录和各个 commit 怎么整呢，使用如下命令
```shell
git diff --cached 分支名/commit hash/HEAD快捷方式
```

## reset
版本控制最大的好处就是可以方便的找到以前的版本并恢复。

恢复也有 source 和 target 的概念，这里的 source 肯定就是各个 commit（包含分支名和快捷方式），而 target 根据不同的参数可能是暂存目录或工作目录或两者同时都是 target。默认的 source 就是当前所在分支的最新 commit。

git reset 支持的参数
* `--mixed`：默认值，将指定的 source 的提交内容放回暂存区，工作目录保持不变，target 是暂存目录，当前 commit 不变
* `--soft`：将恢复前所在的 commit 的文件状态恢复到暂存区，当前最新 commit 为参数中的 commit，只改变暂存目录，不改变工作目录，当前 commit 改变。
* `--hard`：不管当前处于什么状态，直接将工作目录恢复到指定 commit 的状态，清空暂存区域，暂存目录和工作目录同时被改变，当前 commit 改变。

## 参考
* [Git笔记(一)——[commit, checkout]](http://pinkyjie.com/2014/08/02/git-notes-part-1/)
* [Git笔记(二)——[diff, reset]](http://pinkyjie.com/2014/08/02/git-notes-part-2/)