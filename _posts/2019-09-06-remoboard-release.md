---
layout: post
title: "远程输入法发布啦，用电脑给手机打字"
categories:
  - 产品
tags:
  - 工具
comments: true
---


`远程输入法` （Remote Keyboard 或 Remoboard ）是一个输入法应用，可以实现`使用电脑给手机打字`。它包含`电脑端`和`手机端`两部分，输入时，电脑端先通过IP地址或者蓝牙连接手机端，然后在电脑端的应用中打字，文字会被发送到手机端，手机端的输入法完成模拟输入。

简单来说，这样「打字更快」。手机端支持iOS和Android，电脑端支持macOS和Windows。

<!-- more -->

![](/media/15682174633090.jpg)


通常情况下我们并不需要远程输入，但可能在以下场景中，远程输入法可以帮上忙：

## 场景

场景一：

一款应用只有手机版本，没有电脑版本（或者不想购买电脑版本哈），而这个应用的使用需要「大量的文字输入工作」。

1. 例如iOS平台的DayOne日记应用，我购买了iOS版本但不想购买macOS版本了，平时就可以用远程输入法来写日记。
2. 又例如微信聊天，很多公司的工作电脑是不让安装微信电脑端的，此时用远程输入法可以加快聊天。（快点聊完，快点回到工作）（对我来说，偶尔会有网友私聊问问题，简短的文字又不能表述清楚，我是想回答又不想回答，有了远程输入法，就能快速打字啦）
3. 搭配Android平台优秀的文本写作应用「纯纯写作」，也是可以加快写作的速度。

场景二：

手机端有不少优秀的`编程环境`，例如JSBox、Pythonista，以及最近新出的Robomaster（使用Python控制RoboMaster S1），使用远程输入法，可以比较方便的完成手机端编程。


## 下载地址

手机端

- iOS [AppStore](https://apps.apple.com/cn/app/id1474458879)
- Android [酷安](https://www.coolapk.com/apk/241412) 或 [Google PlayStore](https://play.google.com/store/apps/details?id=com.everettjf.remoboard)

电脑端

- macOS [GitHubRelease](https://github.com/remoboard/remoboard.github.io/releases) 或 [百度云](https://pan.baidu.com/s/1F0LpkM4FJeYssJXmRGb6kA)
- Windows [GitHubRelease](https://github.com/remoboard/remoboard.github.io/releases) 或 [百度云](https://pan.baidu.com/s/1F0LpkM4FJeYssJXmRGb6kA)


## 使用方法

由于手机端有iOS和Android，电脑端有macOS和Windows。因此使用组合有四种，`iOS+macOS` /`iOS+Windows` / `Android+macOS` / `Android+Windows`。由于使用方式基本一样，这里就主要以`iOS/Android+macOS`为例讲解，其他组合的使用方法可以类推。


### 手机端安装

（1）从上文的手机端下载地址，下载应用。

（2）对输入法进行配置。

iOS平台：

打开 `设置>通用>键盘>键盘>添加新键盘`，选择`远程输入法`。
![](/media/15677896500296.jpg)
添加后，再次点击远程输入法，启用`允许完全访问`
![](/media/15677897187196.jpg)

Android平台：

打开应用后，点击`启用输入法`，然后在下一界面启用。
![](/media/15677897747263.jpg)
![](/media/15677897792986.jpg)


### 电脑端安装

macOS端：

在 [这里](https://github.com/remoboard/remoboard.github.io/releases) 下载 `RemoboardMac.zip`

![](/media/15677898790466.jpg)

解压 RemoboardMac.zip，双击 Remoboard.dmg ，把Remoboard.app拖入Applications。

![](/media/15682472458141.jpg)

Windows端：

在 [这里](https://github.com/remoboard/remoboard.github.io/releases) 下载 `RemoboardWindows.zip`

解压后，双击安装，安装完成后电脑桌面会有快捷方式。

### iOS使用

提前注意哈：`为了简化上手步骤，先确保手机和电脑都连接到了Wi-Fi`


(1) 在手机上，打开任意可以输入文字的应用，长按左下角切换到远程输入法

![](/media/15677900349799.jpg)

现在，远程输入法会显示一个`连接码，以及IP地址`。

![](/media/15677901020861.jpg)

(2) 打开macOS上的远程输入法

![](/media/15677901643408.jpg)


输入法手机上显示的连接码, 然后点击「连接」. 如果一切正常，则连接成功。如果连接失败，请检查手机和电脑是否连接在同一个内网中（电脑可以ping通手机的IP地址）。

![](/media/15677902102892.jpg)

对应的手机上会显示 已连接，打字啦 :)

### Android使用

(1) Android在输入时，切换到远程输入法。
![](/media/15677903289940.jpg)

同样显示连接码，在电脑端输入连接即可。

![](/media/15677903674581.jpg)

(2) 打开macOS上的远程输入法

![](/media/15677901643408.jpg)


输入法手机上显示的连接码, 然后点击「连接」. 如果一切正常，则连接成功。如果连接失败，请检查手机和电脑是否连接在同一个内网中（电脑可以ping通手机的IP地址）。

![](/media/15677902102892.jpg)


## 官网

好了，基本功能就这些了。还有一些`玩法`和`配置`，可见下文。

这是官网教程 [https://remoboard.app/zhcn/](https://remoboard.app/zhcn/)


## 输入模式

![](/media/15677904928723.jpg)

(1) 标准输入模式

这种模式下可以输入「一行文字」，然后「按回车发送」。
![](/media/15677905088388.jpg)

(2) 多行输入模式

这种模式下，可以「输入或粘贴多行文字」，「点击按钮」发送。
![](/media/15677905197719.jpg)


(3) 即时输入模式（编程模式）

这种模式下，文字会边打边发送，很适合一些手机端的编程应用。个人认为这个模式还是比较有意思的，可能会适合`JSBox`或`纯纯写作`这样的应用。

![](/media/15677905271431.jpg)


## 连接模式

![](/media/15677905465471.jpg)

有两种连接模式：

(1) 连接码或IP地址模式。（连接码本质上是IP地址的另一个表示方式）

(2) 蓝牙模式。（目前可能不够稳定，有问题重启电脑端，基本够用哈）

通常情况下，连接码就足够了，但可能在一些公司的内网，由于安全策略的配置，手机和电脑相互不能连接（ping不通），这时候就可以使用蓝牙模式。


## 免费

是的，目前所有功能免费。

虽然开发耗费了我挺多时间，但自我感觉仍然是小众需求，到底有多少人需要这个应用，我也无法估计。因此决定目前所有功能免费。如果未来有新增特殊功能，可能考虑内购方式。



## 开发计划

（1）易用性：目前闪退还是偶尔出现，尤其是Android和Windows端，未来我会随着自己的使用，逐渐完善和优化。

（2）WEB连接模式：有些场合不太方便下载电脑端，因此可以考虑手机作为一个小型WEB服务器，需要远程输入时，访问手机的WEB服务器来发送文字。这也是一个有趣的实现远程输入的方法。

（3）双向传输消息：目前仅「电脑向手机发送文字」，未来可能考虑「反过来」实现一些有趣的功能。


## 历史

去年我开发了一个[USBKeyboard](https://everettjf.github.io/2018/10/22/qvkeyboard-release/)，这个输入法需要手机和电脑通过「USB」连接才可以输入，当时就有网友说能否支持「无线输入」，于是断断续续今年就开发了这个「远程输入法」。

最近又恰逢我学习Android开发，因此iOS/Android/macOS/Windows四个平台就都支持了。

## 反馈

可以邮件到 everettjf@live.com 反馈问题，或者关注微信订阅号「首先很有趣」，发送「远程输入」加群交流。

![](/media/15677909543642.jpg)


