---
layout: post
title: "Releasing the Command-Line Version of the filterline Log Filtering Tool"
title_zh: "日志过滤工具 filterline 命令行版本发布"
lang_original: zh
categories:
  - 工具
tags:
  - filterline
comments: true
---

After developing the VSCode Extension <https://github.com/everettjf/vscode-filter-line>, it saved me a lot of the time I always spend reading logs to troubleshoot at work, and I wanted to share it with everyone. But everyone has their own habits and favorite editor. So, should I develop a SublimeText plugin? A Vim plugin? An Atom plugin? After thinking it over and over, I decided to just make a command-line version.

<!-- more -->

# Code

https://github.com/everettjf/filterline


# Installation

```
npm install -g filterline
```

# Usage

```
filterline <filepath>
```

# Config File Lookup Order

For example, running this command

```
filterline /Users/everettjf/log/demo/log0eoml/foo.log
```

will look for the config file in the following order

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

For the config file format, see <https://github.com/everettjf/vscode-filter-line>


# Done

Everyone can use it now~




<!--ZH-->

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
