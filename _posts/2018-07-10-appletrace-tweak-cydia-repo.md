---
layout: post
title: "使用 Cydia 安装 AppleTrace Tweak"
categories:
  - 工具
tags:
  - appletrace
  - tweak
comments: true
---

在cydia中添加cydia repo `http://7we.win/cydia/` ，可以安装AppleTraceLoader，然后可以更方便的trace任何一个app的objc_msgSend了。

<!-- more -->


# 安装

越狱手机打开 `http://7we.win/cydia/` ， 点击 `Add to Cydia`，刷新后搜索 `AppleTraceLoader` 安装即可。

![](/media/15316426709626.jpg)

# 配置

打开 设置->AppleTrace，可以选择trace哪个app。
![](/media/15316427520641.jpg)

![](/media/15316427818554.jpg)


选择后，重新启动选择的App，就会在对应App的目录下生成`appletracedata`目录了。

参考AppleTrace <https://github.com/everettjf/AppleTrace> 的文档就可以生成trace的html文件了。

# Cydia Repo 的搭建

这里使用了GitHub Pages搭建的Cydia Repo。地址如下：

https://github.com/crcgen

参考 AloneMonkey 的Cydia Repo <https://github.com/AloneMonkey/cydiarepo>


# 还可以有个UI界面

使用frida的js接口，配合Electron可以开发个界面更方便的获取appletracedata，不过此事不重要不紧急，就不投入时间倒腾啦。

