---
layout: post
title: "USB Keyboard 通过macOS给iOS打字的输入法应用"
categories:
  - 产品
tags:
  - 作品
comments: true
---

*USB Keyboard 原名 QVKeyboard，改名或许是为了更容易记录和搜索*

USB Keyboard 是一个输入法应用，通过USB连接iPhone到Mac后，可以实现在Mac端打字，iPhone上输入。

<!-- more -->

# 场景

我遇到了下面两种场景：

1. 经常需要在微信上和别人聊技术，但很多技术的内容又要打好多字，手机打字实在不习惯。某些情况下，电脑又不适合或者不想安装微信的Mac端。想快速聊完，快速干活儿。
2. Day One是个不错的App，购买了手机端，但有时候想写的内容多的时候，又是觉得手机打字太麻烦。

于是我找了一些现成的App，要么太贵，要么配对太复杂，要么不稳定，要么不支持中文。直到有一天逛GitHub看到一个古老的库PeerTalk。通过连接USB线可以立即实现配对，省去了输入IP、查找蓝牙等配对的过程，可谓是简单直接迅速。


# 环境

目前USB Keyboard移动端只有iOS，PC端只有macOS。未来可能会根据需要适配Android和Windows平台。

# 安装

iOS App : 
1. <https://itunes.apple.com/cn/app/qvkeyboard/id1439106456>
2. 搜索 `qvkb` 或 `usbkeyboard` 或 `qvkeyboard` 都可以到。

![](/media/15402514895616.jpg)
![](/media/15402515094809.jpg)
![](/media/15402515243124.jpg)


macOS Client : 

1. GitHub <https://github.com/qvkeyboard/qvkeyboard/releases>
2. 百度云 <https://pan.baidu.com/s/1lRPMJcy22oSSiUDhM5yyAw>

![](/media/15402511097109.jpg)


# 使用方法

1. iOS上USB Keyboard安装后，打开“设置 - 通用 - 键盘 - 键盘 - 添加新键盘“，在”第三方键盘“区域点击”USB Keyboard“。
2. 再次点击USB Keyboard，点击”允许完全访问“，然后”允许“。
3. 打开任意一个app可输入文字的界面，切换输入法到USB Keyboard。
4. 现在键盘会如下显示：
![](/media/15402274921197.jpg)
5. 打开macOS端
图标如下：
![](/media/15402510498645.jpg)

打开后界面如下：
![](/media/15402275665008.jpg)
6. 此时iOS和macOS如果连接成功，会都显示 🌈Ready for type:)

![](/media/15402289330298.jpg)

7. 可以在输入框打字啦。回车就会发送。Enjoy it :)


# 两种输入模式

- 单行模式：单行模式下回车就会发送。一般适用于聊天等。
- 多行模式：多行模式下，需要⌘↩才发送。一般适用于粘贴大量的文字到朋友圈等。

# 快捷键

macOS客户端下面三个按钮有快捷键，目前还没有界面上的提示：

- Delete （删除键）: ⌥⌫
- Return （回车）: ⌥↩
- Send to iPhone （发送当前内容到iPhone）: ⌘↩

# Delete键

当文本框内容为空时，继续按`Delete`键，也会发送`Delete`到iOS。

# 隐私

由于需要和Mac端通讯，必须启用“允许完全访问”。但对于输入法来说，如果允许完全访问了，那就不可避免的带来安全隐患。虽然我啥也没做，但信任的存在就引入了人的因素。

# 原理

其实原理很简单，见开源库 <https://github.com/rsms/peertalk>

# 代码

Emmm...这次不开源了。

# 总结

审核过程由于涉及多个端配合，还专门录了个视频，放在了 <https://youtu.be/-vr_rHpgwAM> ，很菜的口语哈。

开发如此简单的App也挺耗费时间的，所以以后还是多多支持一些独立开发者啦。另外为了开发这个App，快一个月没有更新订阅号了，现在终于发布了，下一步继续学习和分享啦。


欢迎关注订阅号《首先很有趣》：
![](/images/fun.jpg)


