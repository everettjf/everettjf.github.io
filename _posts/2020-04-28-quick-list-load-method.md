---
layout: post
title: "如何快速列出App的所有+load方法"
categories:
  - lldb
tags:
  - lldb
  - load
  - breakpoint
comments: true
---


`Objective C +load` 方法是个神奇又邪恶的方法。

<!-- more -->

- 当新手得到它时，会惊讶于它的神奇。
- 当高手得到它时，会沉迷其中无法自拔。
- 当老手得到它时，会惊恐于它的邪恶。

多数大型App都已经或者正在想办法去摆脱它。那么，如果快速看到你的App中有多少+load方法，看看中毒有多深。

假设如下场景：

一天你在愉快的用Xcode调试程序，

打开Xcode，按下F5，

突然，你想看一下App中的+load方法有多少？

点击一下Pause，然后输入

```
br s -r "\+\[.+ load\]$"
```

![-w352](/media/15880051383019.jpg)

然后输入

```
br list
```

![-w930](/media/15880052076002.jpg)


或许你会惊讶，原来我的App中+load这么多（或者少）


## 原理

使用了lldb的breakpoint命令。

![-w576](/media/15880053337758.jpg)

```
br s -r "正则"
就是 
breakpoint set -r "正则"
```

通过正则匹配符号设置断点。

## 小问题

那么想想，如果这些+load方法中的代码出现了crash，你的crash监控（bugly等等）能监控到吗？

当然得到的90%的回答是：不会Crash的。

让我想起了特朗普的一句话：我的"代码"很完美。

哈哈 :)

## 总结

很有趣:)

哎，我好菜，我要去学习《基于桥的全量方法Hook》了

http://satanwoo.github.io/2020/04/26/TrampolineHookOpenSource/

---

大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.png)
