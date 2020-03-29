---
layout: post
title: "探索?WhatsApp应用名称中的隐藏符号"
categories:
  - 探索
tags:
  - unicode
comments: true
---

欢迎大家观看这期的“走近科学之WhatsApp神秘符号”～

<!-- more -->


## 案发现场

大概半年甚至更久之前，在使用frida-ios-dump时，偶然发现WhatsApp这个应用的名称有点奇怪。

> frida-ios-dump 是一款越狱iOS上的App砸壳工具（也可以列出iOS的应用列表）。
> 地址：https://github.com/AloneMonkey/frida-ios-dump

仔细看下图的WhatsApp：
![](/media/15855012198617.jpg)

WhatsApp的名称左侧对齐与其他App不同。

... 多少次匆匆擦肩而过 ... 多少次视如不存在 ...

知道今天我终于好奇了一次，想看看这里为什么没有对齐。


## 开始

砸，砸一下试试。

```
python dump.py net.whatsapp.WhatsApp
```

砸完，如下图。出现个问号。`?WhatsApp.ipa`，问号是什么。

![](/media/15855017374127.jpg)

准备`mv`到其他文件夹研究下，就在此刻...

![](/media/15855018704881.jpg)

神秘字符`\342\200\216`出现了，正好奇着...

## 一搜

随手一搜 ... 还真搜到了 :)

![](/media/15855020124999.jpg)

> https://graphemica.com/200E

打开一看，还真有含义咧～ `left-to-right mark` 

![](/media/15855021218820.jpg)

## 真相大白

Wikipedia也有解释

> The left-to-right mark (LRM) is a control character (an invisible formatting character) used in computerized typesetting (including word processing in a program like Microsoft Word) of text that contains a mixture of left-to-right text (such as English or Russian) and right-to-left text (such as Arabic, Persian or Hebrew). It is used to set the way adjacent characters are grouped with respect to text direction.

> https://en.wikipedia.org/wiki/Left-to-right_mark

贴个翻译：

> 左至右符号（Left-to-right mark,LRM）是一种控制字符，或者说是不可见的排版符号。用于计算机的双向文稿排版中。

我再大白话说一句。Left-to-right mark 是个不可见的符号，用来在 `从右向左`的排版语言（例如阿拉伯语）中包含`从左向右`的文字。

下图的例子就比较清晰了：在使用了LRM符号后，阿拉伯语（从右向左）中包含了显示的`C++`（从左向右）。

![](/media/15855024011241.jpg)


## 扩展阅读

有 `Left-to-right mark`，也有 `Right-to-left mark`。

> https://en.wikipedia.org/wiki/Right-to-left_mark


## 进一步

把WhatsApp的`Info.plist`文件拿出来看一眼，似乎没什么特别。

![](/media/15855026225466.jpg)

用二进制编辑器看一下。

![](/media/15855027112567.jpg)

`\342\200\216` 就是 `0xE2 0x80 0x8E (e2808e)`

![](/media/15855027969727.jpg)


这样在代码中获取 `CFBundleDisplayName` 并与其他本地化的语言拼接后，就能保证WhatsApp的顺序从左至右了。

---

很有趣 :)

---

一个人探索这些偏底层的技术细节，独乐乐不如众乐乐，大家一起探索一起交流。创建了一个群，群内已经有300多位盆友，氛围还真不错。已经不能扫码加了，如需加入，加我微信 everettjf，备注：加群。

抖音团队招iOS开发，初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ），`北京、深圳`可以直接来我的部门，`上海`可以推荐到同事部门。工作内容就是`抖音、TikTok iOS App的业务、性能、稳定性等方方面面`的开发。`入职后的方向看你的兴趣`。

如果不好意思联系我，可以直接扫描下面的二维码选择职位投递。

![](/media/15814340338261.jpg)


---

写文章挺耗时间，点一下「在看」啦 :)