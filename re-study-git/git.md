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
