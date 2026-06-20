---
layout: post
title: "Exploring the Hidden Character (LRM) in WhatsApp's App Name"
title_zh: "探索 WhatsApp 应用名称中的隐藏字符（LRM）"
lang_original: zh
categories:
  - 探索
tags:
  - unicode
comments: true
---

Welcome to this episode of "Approaching Science: The Mysterious Symbol of WhatsApp"~

<!-- more -->


## The Crime Scene

About half a year ago, maybe even longer, while using frida-ios-dump, I accidentally noticed that the WhatsApp app's name looked a bit odd.

> frida-ios-dump is a tool for decrypting (de-shelling) apps on jailbroken iOS (it can also list iOS apps).
> Link: https://github.com/AloneMonkey/frida-ios-dump

Take a close look at WhatsApp in the image below:
![](/media/15855012198617.jpg){:width="371" height="121"}

WhatsApp's name is aligned on the left differently from the other apps.

... how many times have I hurried past it ... how many times have I treated it as if it didn't exist ...

Until today, I finally got curious for once and wanted to see why it wasn't aligned here.


## Getting Started

De-shell it, let's de-shell it and try.

```
python dump.py net.whatsapp.WhatsApp
```

After de-shelling, it looks like the image below. There's a question mark. `?WhatsApp.ipa` — what is that question mark?

![](/media/15855017374127.jpg){:width="237" height="86"}

I was about to `mv` it to another folder to study it, and at that very moment...

![](/media/15855018704881.jpg){:width="456" height="81"}

The mysterious character `\342\200\216` appeared. Just as I was getting curious...

## A Quick Search

Did a casual search ... and actually found it :)

![](/media/15855020124999.jpg){:width="725" height="183"}

> https://graphemica.com/200E

Opening it up, it actually has a meaning~ `left-to-right mark` 

![](/media/15855021218820.jpg){:width="920" height="376"}

## The Truth Revealed

Wikipedia also explains it:

> The left-to-right mark (LRM) is a control character (an invisible formatting character) used in computerized typesetting (including word processing in a program like Microsoft Word) of text that contains a mixture of left-to-right text (such as English or Russian) and right-to-left text (such as Arabic, Persian or Hebrew). It is used to set the way adjacent characters are grouped with respect to text direction.

> https://en.wikipedia.org/wiki/Left-to-right_mark

Here's a translation:

> The left-to-right mark (LRM) is a control character, or an invisible typesetting character. It is used in computerized bidirectional document typesetting.

Let me put it even more plainly. The left-to-right mark is an invisible character used to include `left-to-right` text within a `right-to-left` typesetting language (such as Arabic).

The example in the image below makes it clearer: after using the LRM, the displayed `C++` (left-to-right) is included within Arabic (right-to-left).

![](/media/15855024011241.jpg){:width="792" height="236"}


## Further Reading

There's a `Left-to-right mark`, and there's also a `Right-to-left mark`.

> https://en.wikipedia.org/wiki/Right-to-left_mark


## Going Further

Pulling out WhatsApp's `Info.plist` file and taking a look, there doesn't seem to be anything special.

![](/media/15855026225466.jpg){:width="487" height="115"}

Let's look at it with a binary editor.

![](/media/15855027112567.jpg){:width="617" height="134"}

`\342\200\216` is `0xE2 0x80 0x8E (e2808e)`

![](/media/15855027969727.jpg){:width="880" height="444"}


This way, when the code fetches `CFBundleDisplayName` and concatenates it with other localized languages, it can ensure WhatsApp's order is left-to-right.

---

Pretty interesting :)

If you like it, follow the official account to show your support:

![](/images/fun.png)

<!--ZH-->


欢迎大家观看这期的“走近科学之WhatsApp神秘符号”～

<!-- more -->


## 案发现场

大概半年甚至更久之前，在使用frida-ios-dump时，偶然发现WhatsApp这个应用的名称有点奇怪。

> frida-ios-dump 是一款越狱iOS上的App砸壳工具（也可以列出iOS的应用列表）。
> 地址：https://github.com/AloneMonkey/frida-ios-dump

仔细看下图的WhatsApp：
![](/media/15855012198617.jpg){:width="371" height="121"}

WhatsApp的名称左侧对齐与其他App不同。

... 多少次匆匆擦肩而过 ... 多少次视如不存在 ...

直到今天我终于好奇了一次，想看看这里为什么没有对齐。


## 开始

砸，砸一下试试。

```
python dump.py net.whatsapp.WhatsApp
```

砸完，如下图。出现个问号。`?WhatsApp.ipa`，问号是什么。

![](/media/15855017374127.jpg){:width="237" height="86"}

准备`mv`到其他文件夹研究下，就在此刻...

![](/media/15855018704881.jpg){:width="456" height="81"}

神秘字符`\342\200\216`出现了，正好奇着...

## 一搜

随手一搜 ... 还真搜到了 :)

![](/media/15855020124999.jpg){:width="725" height="183"}

> https://graphemica.com/200E

打开一看，还真有含义咧～ `left-to-right mark` 

![](/media/15855021218820.jpg){:width="920" height="376"}

## 真相大白

Wikipedia也有解释

> The left-to-right mark (LRM) is a control character (an invisible formatting character) used in computerized typesetting (including word processing in a program like Microsoft Word) of text that contains a mixture of left-to-right text (such as English or Russian) and right-to-left text (such as Arabic, Persian or Hebrew). It is used to set the way adjacent characters are grouped with respect to text direction.

> https://en.wikipedia.org/wiki/Left-to-right_mark

贴个翻译：

> 左至右符号（Left-to-right mark,LRM）是一种控制字符，或者说是不可见的排版符号。用于计算机的双向文稿排版中。

我再大白话说一句。Left-to-right mark 是个不可见的符号，用来在 `从右向左`的排版语言（例如阿拉伯语）中包含`从左向右`的文字。

下图的例子就比较清晰了：在使用了LRM符号后，阿拉伯语（从右向左）中包含了显示的`C++`（从左向右）。

![](/media/15855024011241.jpg){:width="792" height="236"}


## 扩展阅读

有 `Left-to-right mark`，也有 `Right-to-left mark`。

> https://en.wikipedia.org/wiki/Right-to-left_mark


## 进一步

把WhatsApp的`Info.plist`文件拿出来看一眼，似乎没什么特别。

![](/media/15855026225466.jpg){:width="487" height="115"}

用二进制编辑器看一下。

![](/media/15855027112567.jpg){:width="617" height="134"}

`\342\200\216` 就是 `0xE2 0x80 0x8E (e2808e)`

![](/media/15855027969727.jpg){:width="880" height="444"}


这样在代码中获取 `CFBundleDisplayName` 并与其他本地化的语言拼接后，就能保证WhatsApp的顺序从左至右了。

---

很有趣 :)

大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.png)