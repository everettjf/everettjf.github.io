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

## 系统支持

macOS和Windows

## 下载地址


[GitHub下载地址](https://github.com/foldersizeview/foldersizeview.github.io/releases)


## 使用方法

第一步打开软件

![](/media/15624354676264.jpg)


第二步把要分析的文件夹扔进去

例如我把Wechat.app扔进去，则展示如下图了。

![](/media/15624355630220.jpg)

## 选项

通过菜单`Action->Group by file extension`可开启通过文件类型分组。如下图：

![](/media/15626040281694.jpg)

通过菜单`Action->Sunburst Mode`，可使用旭日图展示（一般情况下TreeMap图就足够了，旭日图在文件很多的情况下显示效果不好）。如下图：

![](/media/15626040706222.jpg)



## 源码

~~木有，嘿嘿。~~

有了 <https://github.com/foldersizeview/foldersizeview>

## 补充

目前版本是快速开发出的，`遍历文件夹都是在主线程递归实现，文件夹内容太多的话，一般是要崩溃滴`。但日常分析个App的安装包啥的，都木有问题。


## 总结

太简单了，文章也写完了。


---

欢迎订阅 :)

![](/images/fun.png)





