---
layout: post
title: "FolderSizeView 更好用一点的TreeMap展示文件夹内容的工具"
categories:
  - 工具
tags:
  - 工具
comments: true
---

FolderSizeView可以使用TreeMap方式展示一个文件夹内文件大小的占比情况。

![](/media/15624354225784.jpg)


## 背景

经常有分析一个文件夹内文件占用大小的需求（例如分析移动App的安装包大小），一直以来 [GrandPerspective](http://grandperspectiv.sourceforge.net/) 基本满足了这个需求，但使用时时常希望能看到`文件夹的父子关系`，FolderSizeView就解决了这个小需求。


<!-- more -->


## 下载地址

- 目前支持macOS
- Windows也可以支持，就看有没有人提出这个需求吧

[GitHub下载地址](https://github.com/foldersizeview/foldersizeview.github.io/releases)

[百度网盘下载地址](https://pan.baidu.com/s/1Z3liMYEQo844Kgjpmc3vEA)


## 使用方法

第一步打开软件

![](/media/15624354676264.jpg)


第二步把要分析的文件夹扔进去

例如我把Wechat.app扔进去，则展示如下图了。

![](/media/15624355630220.jpg)


## 源码

木有，嘿嘿。

## 补充

目前0.1版本是周末快速开发出的，遍历文件夹都是在主线程递归实现，文件夹内容太多的话，一般是要崩溃滴。但日常分析个App的安装包啥的，都木有问题。

## 总结

太简单了，文章也写完了。

如有需要交流这个软件，关注订阅号`首先很有趣`，点击菜单`Folder`加群。

> 再补充下，有哪位大佬知道微信订阅号怎么加留言啊～文章都是单向输出，长此以往，不是办法呀。为了解决交流的问题，以后部分文章也会发到知乎上，地址 zhihu.com/people/bukuzao 

---

欢迎订阅 :)

![](/images/fun.jpg)





