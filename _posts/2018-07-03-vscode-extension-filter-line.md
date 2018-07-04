---
layout: post
title: "VSCode Extension Filter Line"
categories:
  - 工具
tags:
  - vscode
  - filterline
  - log
comments: true
---



For English article , please visit [here](https://medium.com/@everettjf/vscode-extension-filter-line-ec4250c49a92)



# 背景

日常工作中排查问题少不了看客户端日志。日志采集上来后，又要瞪大眼睛仔细看日志中的关键信息，有些问题还不是某一行日志可以判断出原因的，需要针对多行日志找线索。


<!-- more -->


# 脚本

这种情况下就逐渐写了一些脚本来过滤日志，例如把下面的日志：

![](/media/15306869648275.jpg)


通过正则匹配，翻译成下面这样：

![](/media/15306873603934.jpg)

这样就通俗易懂了，过滤后一眼就看出问题时间。缓解了眼部压力，生活美好了很多。

# 怎么是vscode

这两年看日志，从最初的TextWrangler到sublime到emacs到vim到atom，各种都使用了一遍，直到后来发现vscode打开大文件很流畅，就一直使用vscode了。

# vscode插件

最近把日常翻译的脚本通用化，写了一个vscode 插件 `Filter Line`，分享给大家使用。

插件支持根据单个字符串、单个正则、以及更为灵活的配置文件来逐行过滤、翻译日志。

参考动图：

![byconfigfile.gif](https://github.com/everettjf/vscode-filter-line/raw/master/img/byconfigfile.gif)


## 安装插件

1. 下载vscode，https://code.visualstudio.com/
2. 搜索插件，点击Install

![](/media/15306870660262.png)


3. 安装完成后，点击Reload。

##  使用

打开一个文件夹，例如 ~/log2eoml 文件夹，把日志log.txt放到这个文件夹中。可以直接参考这个[demo](https://github.com/everettjf/vscode-filter-line/raw/master/demo.zip)，解压后把demo/log2eoml文件夹拖拽到vscode中。

1、打开log2eoml文件夹，并打开foo.log
![](/media/15306872946057.jpg)


2、运行 command+shift+p ，输入 filter line by config file （或者filter config），选择 `Filter Line By Config File` ，如下图。

![](/media/15306873091127.jpg)

3、回车，就生成了新的文件foo.log.filterline.log ，并自动打开了。这里就是过滤、翻译好的日志。
![](/media/15306873359780.jpg)


# 原理

打开 log2eoml/.vscode/filterline.eoml文件，

![](/media/15306874281185.jpg)

配置文件格式很简单：

1. type是general，指通用类型。
2. prefix 是匹配前缀的正则表达式。这里就是为了匹配每一行的时间、线程等信息。
![](/media/15306874523111.jpg)


3. rules是过滤、翻译（替换）的规则。
4. src是匹配的正则。dest是要替换成什么的字符串。
5. tag 是匹配到时，输出中增加的前缀。某些特殊行，例如闪退，可以明显的加个emoji图标。
6. flag是全局的标记。例如app进入后台，则在所有行都加个标记，会前台时取消这个标记。
7. until 是匹配到某行时，后面紧跟的几行连续输出原始内容，直到某一行匹配正则表达式。

# 更多格式

filterline.eoml是一种格式，还可以使用filterline.json。例如[这个文件](https://github.com/everettjf/vscode-filter-line/blob/master/demo/log2json/.vscode/filterline.json) 。

eoml是自创的一个简单格式，主要是为了解决json中正则表达式还需要转义的问题。

更多日志过滤的demo，可以参考 <https://github.com/everettjf/vscode-filter-line/tree/master/demo>

更多信息可以参考 <https://github.com/everettjf/vscode-filter-line>

# 结语

日志的翻译（替换）节省了大量排查问题的时间，过去的时间让我更快的定位了问题。相信也能加快大家定位问题的时间。

还可以缓解眼部疲劳～～

