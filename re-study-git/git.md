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

git branch -v 查看分支信息

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

如何修改老旧 commit 的 message：git rebase -i commitID（很关键，这是被修改的 commit 的父 id）