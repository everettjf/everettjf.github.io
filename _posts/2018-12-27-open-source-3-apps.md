---
layout: post
title: "Year-End: Open-Sourcing 3 Little Apps"
title_zh: "年底了，开源 3 个小应用"
lang_original: zh
categories:
  - 开源
tags:
  - 开源
comments: true
---

![](/media/15459608773004.jpg)

During this period (the second half of 2018), in my scattered bits of spare time, I implemented some "out-of-the-blue" "pseudo-needs" ideas. Since they're "pseudo-needs", I might as well open-source them — maybe they'll turn out to be useful to someone.

<!-- more -->

# Code Friend

Code Friend is an Xcode Extension that provides a JavaScript interface, so users can quickly and easily develop Xcode plugin tools based on this app.

Why did I develop this tool? To practice with JavaScriptCore.

- Detailed introduction: <https://everettjf.github.io/2018/11/13/codefriend-tutorial/>
- Official site: <https://qvcodefriend.github.io/>
- Mac App Store: <https://itunes.apple.com/cn/app/code-friend/id1441249580>
- Code: <https://github.com/qvcodefriend/CodeFriend>


# USB Keyboard

USB Keyboard is an input method app. After connecting your iPhone to a Mac via USB, you can type on the Mac and have it appear on the iPhone.

Why did I develop this tool? I saw the peertalk library, and at the same time I wanted to type faster in WeChat without using the macOS client.

- Detailed introduction: <https://everettjf.github.io/2018/10/22/qvkeyboard-release/>
- App Store: <https://itunes.apple.com/cn/app/qvkeyboard/id1439106456>
- Code: <https://github.com/everettjf/USBKeyboard>

# woza

woza ("Wo Za", meaning "I crack") is an iOS jailbreak decryption tool, similar to clutch and dump-decrypted. It's a node version of AloneMonkey's frida-ios-dump, developed in TypeScript.

In addition, woza-desktop is the desktop version of woza, which achieves the goal of "decrypting with just a few mouse clicks", developed with Electron and React.

The purpose of developing this tool was to practice front-end knowledge.

Code:

- <https://github.com/woza-lab/woza>
- <https://github.com/woza-lab/woza-desktop>

Of course, these two tools currently still depend on the iproxy and scp commands. Future versions will remove these two dependencies, requiring only frida to perform decryption.


# Summary

Each tool went through a complete cycle — from idea, to design, to development, to publishing, to promotion, to open-sourcing. I put some effort into each, and gained a lot too.

This year, the way I spend my spare time has gradually shifted from "research-driven" to "need-driven". In the past I was always chasing all kinds of deep principles, but the results rarely translated into any concrete output. Now I start from an idea, and in order to realize that idea I then explore various principles, and the results of that exploration can immediately push the idea toward realization.


Keep it up ⛽️ :)


---

Emmmmm... ad time...


Welcome to follow the official account "Client Tech Review":
![](/images/fun.png)

<!--ZH-->

![](/media/15459608773004.jpg)

在这段时间（2018年下半年）断断续续的空闲时间里，实现了一些“突如其来”的“伪需求”想法。既然是“伪需求”，那就开源了吧，万一是有益于大家的呢。

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


欢迎关注订阅号「客户端技术评论」：
![](/images/fun.png)
