## 知识总结

理解的关键

1. 流编辑器：逐行执行命令
2. 记住几个动作：a c d i p s
3. 按照语法规则，根据需求书写匹配规则，执行指定动作

> 参数 -i 执行写入操作

## Mac

在 Mac 下测试时，发现有些语法不符合预期，手动安装 gsed

```shell
brew install gnu-sed
alias sed=gsed
```

## 相关实践

基于当前目录下的 config-linux.yaml 做实践

删除 config.yaml 中的 data service:及下方的 url 这两行

```shell
sed -e '/data_service:/,+1d'  config-linux.yaml
```

将 ai_service:中的 location 的两个路径从/models/… 改为/xkmodels/…

```shell
sed -e '/ai_service:/,/^\s*$/s/models/xkmodels/g' config-linux.yaml
```

把所有的空行变为 ########外加一行空行

```shell
sed -e '/^\s*$/c########\n' config-linux.yaml
```

## 学习资料
* [sed, a stream editor](https://www.gnu.org/software/sed/manual/sed.html)
* [Understanding how sed works](https://www.youtube.com/watch?v=l0mKlIswojA&t=90s)