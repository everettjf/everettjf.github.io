---
layout: post
title: "Generating a Framework Dependency Graph for a CocoaPods Project"
title_zh: "为 CocoaPods 工程生成 Framework 依赖关系图"
lang_original: zh
categories:
  - Skill
tags:
  - tool
  - podspec
  - cocoapods
  - graphviz
comments: true
---



# Generate a Framework Dependency Graph from podspec

Code:

<https://github.com/everettjf/Yolo/tree/master/PodspecDependencyGraph>

<!-- more -->

Steps:

1. sh prepare.sh  or  brew install graphviz

2. Some es6 syntax is used, so you may need the latest version of node (mine is 7.8.0).

3. Usage

```
sh gen.sh <起始framework名称> <podspec目录>
```

4. Example

```
sh gen.sh TomatoRead /Users/everettjf/specsdev
```

Open the tred.dot.svg file in the directory with Chrome and you'll see the whole tree.

<!--ZH-->



# 根据podspec生成framework的依赖关系graph

代码：

<https://github.com/everettjf/Yolo/tree/master/PodspecDependencyGraph>

<!-- more -->

步骤：

1. sh prepare.sh  或者 brew install graphviz

2. 用到一些es6的语法，可能需要node最新版本（我是7.8.0）。

3. 用法

```
sh gen.sh <起始framework名称> <podspec目录>
```

4. 例子

```
sh gen.sh TomatoRead /Users/everettjf/specsdev
```

用chrome打开 目录下的tred.dot.svg文件就可以看到整棵树了。
