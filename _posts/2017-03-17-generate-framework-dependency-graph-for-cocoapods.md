---
layout: post
title: "生成CocoaPods的依赖图"
categories:
  - Skill
tags:
  - tool
  - podspec
  - cocoapods
  - graphviz
comments: true
---



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




