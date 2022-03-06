---
layout: post
title: "vscode扩展pubspec依赖快速打开文档"
categories:
  - 扩展
tags:
  - vscode
comments: true
---


最近初步学习了下 Flutter （https://flutter.dev/）。


在学习一些开源代码的过程中发现一个小小需求：pubspec.yaml 中有很多 dependencies ，初学者很多都不熟悉，需要逐个复制到 https://pub.dartlang.org/ 搜索查询文档。


想来可以开发一个vscode插件，在对应的package name旁边加个按钮，我只需要 click 一下。（啊，是不是太懒了）

<!-- more -->


于是今天就开发了这样一个vscode extension：

Pubspec Dependency Search

![](/media/15528243123320.jpg)


安装扩展后，当打开 pubspec.yaml 时，扩展会查找 dependencies 和 dev_dependencies ，并在每个依赖上面加一行字（链接）。例如： Search flutter in Dart Packages 。

![](/media/15528243493141.jpg)

点击后就可以打开Dart Packages来查找。

![](/media/15528243710418.jpg)


安装地址：

<https://marketplace.visualstudio.com/items?itemName=everettjf.pubspec-dependency-search>

源码：

<https://github.com/everettjf/vscode-pubspec-dependency-search>


原理：

1. 原理很简单，vscode扩展解析pubspec.yaml 中的 dependencies 后， 通过 CodeLensProvider 告诉vscode要加入链接的位置。
2. 链接就是拼凑出 url ： https://pub.dartlang.org/packages?q=flutter 使用浏览器打开。



---



补充几个最近整理的Flutter学习资料：



1. 快速熟悉Dart语言 https://www.dartlang.org/guides/language/language-tour 
2. 快速过一遍文档 https://flutter.dev/docs/development/ui/widgets-intro
3. Cookbook例子操作一遍 https://flutter.dev/docs/cookbook
4. Flutter实战 https://book.flutterchina.club/



然后就开始上手实现你的想法吧～别忘了安装vscode扩展 Pubspec Dependency Search 哦。



---


嗯，有趣 :)

欢迎关注订阅号「客户端技术评论」：
![](/images/fun.png)




