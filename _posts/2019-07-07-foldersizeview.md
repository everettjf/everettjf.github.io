---
layout: post
title: "FolderSizeView: A Tool to Visualize Folder Space Usage with a TreeMap"
title_zh: "FolderSizeView：用 TreeMap 直观展示文件夹空间占用的工具"
lang_original: zh
categories:
  - 工具
tags:
  - 工具
comments: true
---

FolderSizeView can use a TreeMap to display the proportion of file sizes within a folder.

![](/media/15624354225784.jpg){:width="318" height="260"}


## Background

There's often a need to analyze the size that files take up within a folder (for example, analyzing a mobile app's installation package size). For a long time, [GrandPerspective](http://grandperspectiv.sourceforge.net/) basically met this need, but while using it I often wished I could see the `parent-child relationship of folders`. FolderSizeView solves this small need.


<!-- more -->

## System Support

macOS and Windows

## Download

[GitHub download link](https://github.com/foldersizeview/foldersizeview.github.io/releases)


## How to Use

Step one, open the software

![](/media/15624354676264.jpg){:width="453" height="289"}


Step two, drop the folder you want to analyze in

For example, if I drop Wechat.app in, it displays as shown below.

![](/media/15624355630220.jpg){:width="1057" height="736"}

## Options

Via the menu `Action->Group by file extension` you can enable grouping by file type. As shown below:

![](/media/15626040281694.jpg){:width="1600" height="1208"}

Via the menu `Action->Sunburst Mode` you can display it with a sunburst chart (in most cases the TreeMap chart is good enough; the sunburst chart doesn't display well when there are a lot of files). As shown below:

![](/media/15626040706222.jpg){:width="1600" height="1309"}



## Source Code

~~Nope, hehe.~~

It's available now: <https://github.com/foldersizeview/foldersizeview>

## Note

The current version was developed quickly. `Traversing the folder is done recursively on the main thread, so if the folder has too much content, it will generally crash`. But for everyday analysis of an app's installation package and the like, there's no problem.


## Summary

Too simple — the article is finished already.


---

Welcome to subscribe :)

![](/images/fun.png)





<!--ZH-->

FolderSizeView可以使用TreeMap方式展示一个文件夹内文件大小的占比情况。

![](/media/15624354225784.jpg){:width="318" height="260"}


## 背景

经常有分析一个文件夹内文件占用大小的需求（例如分析移动App的安装包大小），一直以来 [GrandPerspective](http://grandperspectiv.sourceforge.net/) 基本满足了这个需求，但使用时时常希望能看到`文件夹的父子关系`，FolderSizeView就解决了这个小需求。


<!-- more -->

## 系统支持

macOS和Windows

## 下载地址


[GitHub下载地址](https://github.com/foldersizeview/foldersizeview.github.io/releases)


## 使用方法

第一步打开软件

![](/media/15624354676264.jpg){:width="453" height="289"}


第二步把要分析的文件夹扔进去

例如我把Wechat.app扔进去，则展示如下图了。

![](/media/15624355630220.jpg){:width="1057" height="736"}

## 选项

通过菜单`Action->Group by file extension`可开启通过文件类型分组。如下图：

![](/media/15626040281694.jpg){:width="1600" height="1208"}

通过菜单`Action->Sunburst Mode`，可使用旭日图展示（一般情况下TreeMap图就足够了，旭日图在文件很多的情况下显示效果不好）。如下图：

![](/media/15626040706222.jpg){:width="1600" height="1309"}



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





