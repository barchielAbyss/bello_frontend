# bello_frontend

## 说明

本项目使用 git submodule + lerna 管理的 基于 qiankun 的微前端项目

如果对以上知识点不了解，请先阅读`学习资料`的相关模块先建立起初步认知

### 项目基础文件结构说明

```bash
- packages # 公共依赖/组件
- projects # 所有子项目
```

## Start up

安装相关依赖

```bash
yarn setup # lerna bootstrap
```

### 子项目开发

使用 `git clone` 本项目下来的之后，你会发现 `projects` 内的子项目都是空文件，这个时候你需要把子项目的代码下载才可以方便开发。当然你也可以单独的 `git clone` 子项目进行开发，但是这样会没那么方便，也享受不了集合开发的方便性

```bash
git submodule init # 初始化子项目
git submodule update projects/subapp_vue_demo # 这是拉取某一个子项目
```

上面命令中的 `projects/subapp_vue_demo` 这个名字请看 `.gitmodules` 文件，所有的子项目单独下载时的名字都在里面

```bash
git submodule update # 下载所有的子项目
```

不太建议下载所有的子项目的操作，因为不是所有的子项目你都需要关注，而且你会等到慌

### 启动子项目

不要 `cd` 到子项目的文件夹内运行命令启动，会有依赖关系的混淆问题，建议在项目根目录下运行

```bash
yarn workspace subapp_vue_demo serve
```

`subapp_vue_demo` 为项目名，是你想启动的子项目里面的 `package.json` 内的 `name`

#### 平时开发时如果想拉取所有子项目的更新时可以用

```bash
git submodule foreach git pull
```

#### 添加新的 git submodule

```bash
git submodule add git@github.com:threfo/subapp_vue_demo.git projects/subapp_vue_demo
```

上面命令的 `git@github.com:threfo/subapp_vue_demo.git` 为仓库地址，`projects/subapp_vue_demo` 为储存路径，这里我们约定所有的子项目都存放在 `projects` 文件夹中

然后需要在根目录的 `package.json` 内添加

```json
{
  "workspaces": {
    ...
    "nohoist": [
      ...
      "subapp_vue_demo/**"
    ]
  }
}
```

`subapp_vue_demo` 为项目名，是你新加入子项目里面的 `package.json` 内的 `name`

所以为了更方便前面 `git submodule add` 时的 `projects/*` 定义文件夹的时的文件夹名最好也是和 `package.json` 内的 `name` 一致

### 公共组件/包开发

#### 添加 `packages` 项

```bash
lerna create packages-name #packages-name 要添加的 package 名字
```

`packages-name` 建议带 `bello-` 前缀

#### 添加 `packages` 内的依赖

```bash
lerna add lodash --scope=qs #添加 lodash 到 qs
```

注意 `lerna add` 只能一个一个依赖添加，`--scope=` 不指定则全部都添加

`--scope=` 后的指定的包不是文件夹名字，而是里面的 `package.json` 内的 `name`

### 发布 packages

```bash
yarn lp
```

如果是需要更新已发布的包，可以手动修改包内的 `package.json` 的 `version`，然后执行上面的命令就好啦

发布权限 找 晓辉在 npm 的 belloai group 中把你添加进去

### 学习资料

- [如何在大型项目中使用 Git 子模块开发(必读)](https://juejin.cn/post/6844903746166587405)
- [Git 中 submodule 的使用](https://zhuanlan.zhihu.com/p/87053283)
- [git-submodule 官方文档](https://git-scm.com/docs/git-submodule)
- [使用 Lerna 构建项目](https://github.com/ThomasLiu/mfe_showcase/blob/leason_1_lerna/doc/leason_1_lerna.md)
- [用 GitHub Actions 实现自动发布 NPM 包](https://www.jianshu.com/p/fe4691bab958)
- [从 0 构建自己的脚手架/CLI 知识体系（万字）](https://juejin.cn/post/6966119324478079007)
- [基于 Yarn WorkSpace + Lerna + OrangeCI 搭建 Typescript Monorepo 项目实践](https://cloud.tencent.com/developer/article/1659352)

### API

- [Lerna 指令大全](http://www.febeacon.com/lerna-docs-zh-cn/routes/commands/)
