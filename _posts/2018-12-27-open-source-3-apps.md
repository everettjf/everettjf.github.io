---
layout: post
title: "年底了，开源3个小应用"
categories:
  - 开源
tags:
  - 开源
comments: true
---

![](/media/15459608773004.jpg)


眨眼2018年底了，这一年我离开了曾经以为不会离开的蚂蚁金服，从1月份一时不冷静寻求转岗失败，到4月份纠结要不要离职，到拒掉头条的offer，再到7月底入职美团，以及到现在还没转正（6个月试用期），感觉一年都在飘荡。或许某个名人说过“现实总是以各种方式推动着你成长”。

在这段时间断断续续的空闲时间里，实现了一些“突如其来”的“伪需求”想法。既然是“伪需求”，那就开源了吧，万一是有益于大家的呢。

<!-- more -->

# Code Friend

Code Friend 是一款Xcode Extension，提供了JavaScript的接口，用户可基于这个App简单快捷开发出Xcode插件工具。

为什么开发这个工具？为了练手JavaScriptCore。

- 详细介绍：<https://everettjf.github.io/2018/11/13/codefriend-tutorial/>
- 官方地址：<https://qvcodefriend.github.io/>
- Mac App Store 地址：<https://itunes.apple.com/cn/app/code-friend/id1441249580>
- 代码：<https://github.com/qvcodefriend/CodeFriend>


# USB Keyboard

USB Keyboard 是一个输入法应用，通过USB连接iPhone到Mac后，可以实现在Mac端打字，iPhone上输入。

为什么开发这个工具？看到了peertalk这个库，同时在不想使用macOS客户端的前提下，还想微信打字快一点。

- 详细介绍：<https://everettjf.github.io/2018/10/22/qvkeyboard-release/>
- App Store：<https://itunes.apple.com/cn/app/qvkeyboard/id1439106456>
- 代码：<https://github.com/everettjf/USBKeyboard>

# woza

我砸，是一个越狱iOS的砸壳工具，类似clutch、dump-decrypted。是AloneMonkey开发的frida-ios-dump的node版本。使用 TypeScript开发的。

另外，woza-desktop 是woza的桌面版本，实现了“点点鼠标就能砸壳”的目的，使用Electron、React开发。

开发这个工具的目的是为了练手前端知识。

代码：

- <https://github.com/woza-lab/woza>
- <https://github.com/woza-lab/woza-desktop>

当然这两个工具目前还需要依赖iproxy和scp命令，未来版本会移除这两个依赖，仅需要依赖frida即可实现砸壳。


# 总结

每个工具都经历了一个完整阶段，从想法，到设计，到开发，到上架，到宣传，到开源，都为此付出了一些经历，也得到了很多收获。

这一年，我的业余时间支配方式，逐渐从“钻研驱动”转化为“需求驱动”，过去总是在追求各种深入的原理，结果很少能转化为某项成果。现在从有想法开始，为了实现这个想法，再进行各种原理探索，探索的结果能立刻推动想法的实现。


加油⛽️ :)


---

Emmmmm...广告时间到...


欢迎关注订阅号《首先很有趣》：
![](/images/fun.jpg)

