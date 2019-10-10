你可能不知道的 Git 操作

介绍一些相对进阶的操作和命令的细节。

<!-- more -->

## checkout 身兼多职
checkout 身兼多职
* 分支相关操作
* 恢复文件之到之前的某个状态

> 使用 -- 来告诉 Git 你是想恢复文件而不是切换分支

恢复文件肯定有 source（从哪里恢复）和 target（恢复到哪里去），checkout 的 target 就是指你的工作目录，source 可从暂存目录往工作目录里恢复文件，也可以从仓库里的各个 commit 记录里往工作目录恢复文件。比如从某个 commit 中恢复
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
* `--mixed`：默认参数，把HEAD、暂存区修改为你指定的 commit 的时候的文件状态，工作区不变（commit 之间差异 + 暂存区新增内容 + 工作区新增内容保存在工作区）
* `--soft`：只是把 HEAD 指向的 commit 恢复到你指定的 commit，暂存区和工作区不变（commit 之间差异作为提交内容保存在暂存区，暂存区有新增内容则保持原样，工作区有新增内容同样保持原样）
* `--hard`：把HEAD、暂存区和工作区修改为你指定的 commit 的时候的文件状态

## cherry-pick
cherry-pick 其实在工作中还挺常用的，一种常见的场景就是，比如我在 A 分支做了几次 commit 以后，发现其实我并不应该在 A 分支上工作，应该在 B 分支上工作，这时就需要将这些 commit 从 A 分支复制到 B 分支去了
```shell
# 目前在 B 分支，需要从 A 分支复制
git cherry-pick commitId1 commitId2 ……
# 此时 B 分支具备指定 commit 的内容，但此时 A 分支还是有对应 commit 的内容，如果需要删除，则切换分支 A，使用 reset 即可
```

## merge & rebase
merge 语法：`git merge 目标分支`

理解 Fast-forward：是合并的一种类型，当当前分支（master）是目标分支（branch）的祖先 commit 时会发生这种“Fast-forward”合并，其实可以理解为 HEAD 指针指向的快速移动。不会产生新的 commit 记录。

如果当前分支不是目标分支的祖先 commit 节点，则其实是做的三方合并，除了这两个分支的最新 commit 以外，另外一个是这两个分支的共同祖先 commit 点。这种情况下如果没有冲突的话会自动生成一个 merge 的 commit，如果有冲突则手动解决后还是会有一个 merge 的 commit。

首先需要明确的是 git rebase 有很多牛逼的功能，其“交互模式”可以让你干很多事，通过 `-i` 实现，比如
* 调整 commit 顺序
* 合并 commit
* 删除 commit
* 修改 message

Git Merge 和 Git Rebase 目的相同，它们都是把不同分支的提交合并到一起。虽然最终目的是一致的，但是其过程却颇为不同。

很多博客会将 rebase 和 merge 一起讨论，主要原因是 rebase 可以实现 merge 的功能，同时 history 看上去更好看（rebase 不会产生多余的 commit，并且保持直线），比如在 master 分支上执行 `git rebase branch2` 流程如下
1. 先找到两个分支的共同祖先 commit 节点
2. 然后把 master 分支上这个节点的儿子节点全部“应用”到 branch2 分支上

> 一般我们把别的分支合并到 master 时用 merge，而把 master 合并到别的分支时会用到 rebase

## HEAD^ vs HEAD~
HEAD 指向当前分支的最近一个 commit，当我们需要通过 checkout 或 reset 找到之前某个 commit 的状态时，通常需要找到对应的 commit id，但 id 通常是 hash 值，不便于记忆，那没有快捷的方式进行索引呢，答案就是 HEAD 配合 `^` 和 `~` 使用了。

首先要理解什么叫做父提交，通常一个 commit 至少有一个父提交，也就是你的上一个 commit，你需要知道的是，在 merge 的情况下，你会有多个父提交，比如 git merge br1 br2 br3，注意这里的顺序很重要，此时你会有三个父提交，一次是 br1、b2、br3 分支上最新的 commit。

理解了父提交的概念，再来看两者的含义
* `^` 代表父提交，当一个提交有多个父提交时，可以在后面跟上一个数字，表示第几个父提交，`^` 相当于 `^1`
* `~<n>` 相当于连续的 n 个 `^`

## 参考
* [Git笔记(一)——[commit, checkout]](http://pinkyjie.com/2014/08/02/git-notes-part-1/)
* [Git笔记(二)——[diff, reset]](http://pinkyjie.com/2014/08/02/git-notes-part-2/)
* [Git笔记(三)——[cherry-pick, merge, rebase]](http://pinkyjie.com/2014/08/10/git-notes-part-3/)