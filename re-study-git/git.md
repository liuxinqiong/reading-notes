## 发展
VCS（version control system）出现以前
1. 目录拷贝区分不同版本
2. 公共文件容易被覆盖
3. 成员沟通成本很高，代码集成效率低下

集中式 VCS
1. 集中的版本管理服务器
2. 具备文件版本管理和分支管理能力
3. 客户端必须时刻和服务器连接

分布式 VCS
1. 服务器和客户端均有完整的版本库
2. 脱离服务端，客户端照样可以管理版本
3. 查看历史和版本比较等多数操作，都不需要访问服务器，比集中式更能提高版本管理效率

## git 基础
官网（git-scm.com）中可以找到基础的[中文教程](https://git-scm.com/book/zh/v2)

最小配置，配置 user 信息，目的就是提交可追溯
```shell
git config --global user.name 'your_name'
git config --global user.email 'your_email'
```

除了配置 global 外，还可以配置 local 和 system。可以通过 list 参数显示配置
```shell
git config --list --local # 只对某一个仓库有效
git config --list --global # 所有仓库有效
git config --list --system # 对系统所有登录的用户有效
```

> --local 参数必须在特定仓库下才能执行

建立 git 仓库，两种场景
* 把已有的项目代码纳入 git 管理：git init
* 新建的项目直接用 git 管理: git init your_project，会在当前路径下创建和项目名称同名的文件夹

暂存区的目的：字面理解就是暂时存着，还不是一个正式的提交。比如你写了一个方案A，此时你可以提交到暂存区，然后继续写方案B，后来发现方案A更合适，此时可以用暂存区的内容替换工作区内容。

git add 命令
* git add file
* git add filename
* git add -u

文件重命名，推荐使用 git 提供的命令：git mv old_name new_name。因为这样可以比直接使用 mv 的方式要简单，后者还需要手动 add 步骤，但前者直接是 add 之后的状态。

git log 常用参数，注意：参数通常可以搭配使用
* 无参：查看当前分支的历史
* 加上分支名称：表示查看指定分支的历史
* --all：查看所有分支的历史
* --graph：查看图形化历史
* --oneline：查看单行的简洁历史
* -n + number：查看最近的指定number条数的历史
* 更多：git help --web log 打开网页版指南

> 参数一个中划线还是两个中划线规律：单字母一个中划线，否则两个中划线

git branch -v 查看本地分支信息，-av 查看远程和本地的所有分支信息

图形化查看版本演进：通过 gitk 命令打开图形界面

.git 目录常用文件或目录有
* HEAD 文件：内容是 refs/heads/current_branch_name
* config 文件：存放本地相关的配置信息
* refs 文件夹（本质内容是 hash 值的存储）
  * heads：分支信息
  * remotes：远程信息
  * tags：标签信息
* objects
  * 双字符松散文件：文件夹名称 + 内部文件名构成 hash 值
  * pack 打包文件
* log：操作日志

git cat-file -t hash 查看类型（commit、tag、tree、blob）

git cat-file -p hash 查看内容

commit、tree、blob 关系
* 一个 commit 对应一个 tree（tree 表示当时这个 commit 下项目文件目录和文件的快照）
* tree 里面可以包含 tree（因为目录也是树）
* blob 只和文件内容相关，和文件名无关

分离头指针（detached HEAD）：直接 git checkout commitID，就会提示你处在分离头指针的状态，因为没有和任何分支进行关联，仅仅是基于某个 commit。此时你可以做一些尝试性的修改，如果觉得可行，可以提交他们。你也可以通过另一个 checkout 从而丢弃在这种状态下做的所有提交。

> git 很聪明，当你在分离头指针的状态下做了提交，此时切换到其他分支，会给你个友情提示，会提示有提交没有关联到任何分支，如果你觉得是有用的，你可以通过创建一个分支保留他们，命令为：git branch new-branch-name commitID；否则过段时间，会被 git 清理。

创建新分支：git checkout -b branch-name。默认值基于当前分支的最近一次提交，或者你可以指定具体哪个分支，也可以是哪次提交。

HEAD 正常都是指向某分支的最近一个 commit，在分离头指针的情况下，直接指向某个 commit。

通过 HEAD 可以帮助我们实现简写。比如我们要 diff 两次提交。git diff commitIDA commitIDB。但是 commitID 通常需要自己额外去找，此时我们就可以使用 HEAD。如下：
```shell
git diff HEAD HEAD^ # HEAD 的父亲
git diff HEAD HEAD^^ # 父亲的父亲
git diff HEAD HEAD~1 # 往前第一次提交
```

如果修改最新 commit 的 message：git commit --amend。本质上不只是修改 message，而是会创建一个将暂存区的内容生成一个 commit，再将当前最新的 commit 替换成新生成的那一个。

如何修改老旧 commit 的 message：git rebase -i commitID（很关键，这是被修改的 commit 的父 id），然后按照交互操作（选择 reword）即可。

> 这种操作仅限在没提交到远程分支的情况下，如果已提交，不建议如此操作，因为会影响到团队的其他成员

思考为何 rebase -i 会分离头指针呢？因为 git rebase 的工作就是利用的分离头指针，rebase 意味着基于新 base 的 commit 来变更部分 commits。处理的时候把 HEAD 指向 base 的 commit，此时如果该 commit 没有对应的 branch，就会处于分离头指针状态，然后重新一个一个生成新的 commit，当 rebase 创建完最后一个 commit 后，结束分离头状态，git 让变基完成的分支名指向 HEAD。

怎么把连续的多个 commit 整理成一个 commit 呢？同样使用 git rebase -i commitID，交互操作选择 squash 模式将指定的 commit 合并 pick 的 commit 中。

怎么把间隔的几个 commit 整理成一个 commit 呢？同样使用 git rebase -i commitID，其实和处理连续的类似，只不过我们要手动将不连续的调整成连续的，同样使用 squash 模式。

> 我们知道变基ID的选择是我们要修改的前一个，如果我们要修改最开始的祖先ID该如何处理呢。此时我们可以手动 pick ID 来达到目的。

如果有多个分支的情况下，我们对其中某个分支进行了变基整理，因此对于当前分支而言，之前很多 commit 都没有了，此时基于之前 commit 创建的 branch 和 tag 该如何自处呢？此时就有可能出现多个独立的树结构出来。

如何比较暂存区和 HEAD 所含文件的差异：git diff --cached 或者 git diff --staged。

如何比较工作区和暂存区所含文件的差异：git diff 默认功能，git diff -- filename 只对指定文件看差异。

> -- 是为了让 git 命令读取命令参数的时候消除歧义用的，双连字符后面的是路径和文件

如何让暂存区的文件恢复成和HEAD的一样：git reset HEAD，会把暂存区所有文件取消掉，如果需要指定某一个，在后面添加文件即可

如何让工作区的文件恢复为和暂存区一样：git checkout -- file

如何消除最近的几次提交：git reset --hard commitID（想回退到的指定状态的commit）

如何查看不同提交的指定文件的差异：git diff commitID1 commitID2 path-of-filename

git reset 三个参数
* --soft：只是把 HEAD 指向的 commit 恢复到你指定的 commit，暂存区和工作区不变
* --hard：把HEAD、暂存区和工作区修改为你指定的 commit 的时候的文件状态
* --mixed：默认参数，把HEAD、暂存区修改为你指定的 commit 的时候的文件状态，工作区保持不变

正确删除文件的方式：和重命名类似，git 有内置命令，使用 git rm 即可。

加塞紧急任务：使用 git stash 会将当前工作区和暂存区存储起来，恢复到当前 HEAD 的状态。然后你可以在此基础上新建 bug 修复分支，完毕后就可以通过 apply 或 pop 恢复现场。

指定不需要 git 管理的文件注意点
* 是否加`/`的差别，有的话表示该文件夹下所有文件都不纳入管理，但如果存在同名文件，则会纳入管理。如果没有则均不会纳入管理。
* 如果提交 commit 后，想忽略一些已经提交的文件，需要通过 git rm --cached name_of_file 的方式删除掉 git 仓库里面无需跟踪的文件。

Git 备份成本地或远程仓库，通过 git remote add name remote_url 的方式进行关联，后面我们就可以通过 push 进行同步，这里看常用的传输协议
* 本地协议1 /path/to/repo.git 哑协议
* 本地协议2 file:///path/to/repo.git 智能协议
* http/https https://git-server.com:port/path/to/repo.git 常见的智能协议
* ssh 协议 user@git-server.com:path/to/repo.git 工作中最常用的智能协议

哑协议和智能协议区别
* 哑协议传输进度不可见，智能协议传输可见
* 智能协议传输速度比哑协议块

## GitHub
GitHub 配置公私钥（mac）
1. 检查是否已经有公私钥：ls -al ~/.ssh，没有则创建
2. ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
3. 将公钥配置在 GitHub 的 SSH and GPG keys 中

> 添加公私钥的好处就是 push 代码的时候能够智能识别用户，无需额外输入用户名和密码

本地仓库同步到远程
* git remote add name remote_url
* git push name --all（all 表示推送所有分支，name 为 origin 才可缺省）

通常我们建立远程仓库的时候，可能预先就有文件了，比如readme.md、.gitignore 或 LICENCE，此时本地和远程同步，往往会遇到问题，因为本地和远程是没有上下游关系的，是互相独立的版本树，直接 git merge 会报错。我们可以先通过 git fetch，然后再单独执行 git merge 操作查看哪个步骤报错（git pull 等同于 git fetch + git merge），此时可以通过 git merge --allow-unrelated-histories origin/master 来达到合并目的。

git clone remote_url：默认使用远程项目名作为本地文件夹名称，如果需要自行指定名称，直接在后面加上即可。

如果远程有新的分支，默认本地是没有的，因此需要基于远程分支建立本地分支，这个基于很关键，不然就等同于在本地建议一个分支。命令：git checkout -b local-branch-name remote-branch-name
