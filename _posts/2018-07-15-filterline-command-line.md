---
layout: post
title: "filterline 命令行版本"
categories:
  - 工具
tags:
  - filterline
comments: true
---

开发了VSCode Extension <https://github.com/everettjf/vscode-filter-line> 后，节省了大量我工作中总要看日志排查问题的时间，也想分享给大家使用。但每个人都有自己习惯和喜欢的编辑器。于是，要不要开发个SublimeText插件？Vim插件？Atom插件？想来想去，干脆做成命令行版本的。

<!-- more -->

# 代码

https://github.com/everettjf/filterline


# 安装

```
npm install -g filterline
```

# 使用

```
filterline <filepath>
```

# 配置文件查找顺序

例如执行这个命令

```
filterline /Users/everettjf/log/demo/log0eoml/foo.log
```

会按照下面的顺序查找配置文件

```
  '/Users/everettjf/log/demo/log0eoml/filterline.eoml',
  '/Users/everettjf/log/demo/log0eoml/filterline.json',
  '/Users/everettjf/log/demo/log0eoml/.vscode/filterline.eoml',
  '/Users/everettjf/log/demo/log0eoml/.vscode/filterline.json',

  '/Users/everettjf/log/demo/filterline.eoml',
  '/Users/everettjf/log/demo/filterline.json',
  '/Users/everettjf/log/demo/.vscode/filterline.eoml',
  '/Users/everettjf/log/demo/.vscode/filterline.json',

  '/Users/everettjf/log/filterline.eoml',
  '/Users/everettjf/log/filterline.json',
  '/Users/everettjf/log/.vscode/filterline.eoml',
  '/Users/everettjf/log/.vscode/filterline.json' 
```

配置文件的格式见 <https://github.com/everettjf/vscode-filter-line>


# 好了

所有人都可以用了～




