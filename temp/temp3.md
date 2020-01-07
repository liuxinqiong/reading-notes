添加子仓库
```shell
git submodule add <main_project_url>
```

仓库中会新增 `.gitmodules` 文件用来记录子仓库信息

git clone 仓库时，可以通过 `--recurse-submodules` 拉去所有的子仓库代码，否则不会自动拉取
```shell
git clone --recurse-submodules <main_project_url>
```

如果 clone 时没有添加该仓库，执行如下命令，这过程中会用到上面提到的 url 和 head 索引
```shell
git submodule update --init --recursive
```

删除 submodule
1. 删除 `.gitmodules` 文件
2. 删除 `.git/config` 对应部分
3. 删除 `.git/modules/` 对应部分