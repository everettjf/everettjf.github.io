---
layout: post
title: "One-Year Summary of Switching from Windows to iOS Development"
title_zh: "Windows 转 iOS 开发一年总结"
lang_original: zh
categories: Essay
comments: true
---








Since I started iOS development on March 15 last year (2015), minus the 3 months in the middle as a full-time stay-at-home dad (and part-time O2O photography startup) (from May 10 to August 12), today (June 26, 2016) it has been a little over a year.

Last November I wrote a [5-month summary of switching from C++ to iOS development](https://everettjf.github.io/2015/11/18/the-past-4-months-ios-develop-for-me), listing the knowledge I learned over nearly 5 months, and also making some plans.

This article continues from that one. Let me summarize what I learned over the last 6 months (from last December to today).

<!-- more -->


# Getting Started

From late November to early December last year, I tinkered for a long time and finally implemented an old idea (using flask+mongodb). [Snowflake Bookmark](https://everettjf.github.io/2015/12/13/snows_link_tutorial) went live. But unfortunately, it was both simple and cumbersome, with no good experience — it only fulfilled half of a sentiment. Later the site was shut down and evolved into [TomatoRead](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader) and [Admire design navigation](https://admire.so).

Having settled this little sentiment, I focused fully on learning iOS.


# Reverse Engineering

From late November to late December, I spent nearly a month of evenings (the kid usually doesn't sleep until 11pm, so I tinkered until one or two am) studying the book *iOS App Reverse Engineering*, and at the end of the year produced an [Alipay voice-saving Tweak](https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver), and also wrote [development notes](https://everettjf.github.io/2015/12/29/tweak-for-alipay-wallet-chat-voice-save).

In 2014 I was still working on security software similar to 360 Antivirus. At that time I carefully read and worked through the book *Practical Malware Analysis*, but didn't study further — I only stayed at the book's examples and simple analysis. Since my job was still business-focused, when customers reported problematic PE files, assembly was my weak point, so I mostly analyzed in Kingsoft FireEye and other tools, and didn't carefully analyze the assembly code myself.

Maybe with this foundation, now looking at iOS app reverse engineering, and because of Objective-C's dynamic mechanism, basic reverse engineering is relatively easy to learn. I went through almost all the examples in the book one by one.


Later, due to the need to develop an IM client at work, I reverse-engineered the implementations of WeChat and many other apps. Among them I also [summarized the workflow for reverse-engineering WeChat's message screen](https://everettjf.github.io/2016/06/19/reverse-explore-wechat-message-design).


# Studying Source Code

I sometimes overdo the tinkering. To study source code I even spent a lot of precious spare time writing an Xcode plugin, [XSourceNote](https://everettjf.github.io/2016/02/16/xsourcenote-dev). The idea was good, but the experience wasn't great — it was just barely usable. Using this plugin I wrote a few source-reading notes.

- UITableView-FDTemplateLayoutCell study notes
- YYCache study notes
- SDWebImage study notes
- YYWebImage study notes

I should reflect here: I learned too little, and the plugin was completely unnecessary to make.
**Spending time on low-priority things is something to reflect on.**


# Books

- iOS App Reverse Engineering
- iOS Application Security Attack and Defense
- Obscure Topics In Cocoa & Objective-C
- CFHipster
- iOS Core Animation Advanced Technique

Besides iOS-related books, I also bought the three-volume *Math for Programmers*; the first one was simpler and I've finished it. The second and third are already in my task queue.

I learned about OpenCV. To implement AR Rubik's cube solving. In the end at the segmentfault hackathon 2016 Beijing I made a simple Rubik's cube solving assistant App. [Source](https://github.com/xfteam/xfrubiks).


# Shipped App

From Snowflake Bookmark to iOS Blog Picks, to the current App *TomatoRead* — a naive idea wanting to be realized always has to go through this process.
I realized this little dream. I have an App I shipped myself. [The *TomatoRead* development summary is here](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader).



# Documentation

Many blog articles don't systematically explain a piece of knowledge; I should still spend more time reading the official docs. **Systematic, comprehensive learning is more effective learning.**

- CoreData Programming Guide
- Thread Programming Guide
	- RunLoop detail
- Concurrency Programming Guide
	- nsoperation
	- dispatch queue
	- dispatch sources
- App Programming Guide
- and several lightweight Guides

# Blog Articles

Along with my daily work, articles I felt were good were all bookmarked in *TomatoRead*, and also placed at this [web address](http://iosblog.cc/a/2/).


# Work Content Summary

Thinking about my main work content since coming to Beijing:

- Continuous integration
	- Jenkins + fastlane (gym sign and ruby script)
- Crash collection and analysis
	- symbol download issues
	- plcrashreporter
	- [symbolicatecrash bug fix](https://everettjf.github.io/2016/05/10/symbolicatecrash-deadloop-bug)
	- python scheduled parsing, flask display
- Chat room
	- NSAttributedString
- IAP
- IM
	- message storage
	- message queue
	- message display
	- image preview
- Live streaming
	- gift animations


# Next-Step Plans

In priority order:

- YYModel vs Mantle
	- why is the efficiency difference so large
- Reactive Cocoa
	- usage
	- dig into the source
- Design patterns
	- AOP
- Componentization
	- componentization solutions
- AsyncDisplayKit
	- async UI
- Performance
	- learn the Instruments Guide
	- translate
- Low-level
	- study class-dump source, learn the Mach-O file format, myclass-dump

I can interleave WWDC study. Finishing the above plan should be fast (depending on how thoroughly I study, of course); the rest of the time I'll study various open-source repos.



# Summary

- Time flies: half a year passed quickly. There's never enough time.
- Priority: priority is very important, especially when "the more you know, the more you don't know."

**You can go slow, but follow priorities. Don't always study introductory material for new knowledge; at least keep going deeper in one area.**


<!--ZH-->








自去年（2015年）3月15日开始iOS开发以来，去掉中间3个月的全职奶爸（兼职O2O摄影创业）（5月10日至8月12日），到今天（2016年6月26日）已经1年多一点。

去年11月份写过一篇 [C++转iOS开发5个月总结](https://everettjf.github.io/2015/11/18/the-past-4-months-ios-develop-for-me) ，罗列了在接近5个月的时间内学习的知识，也做了一些计划。

本篇文章就接着上篇继续。总结下最近6个月（去年12月至今天）的学习情况。

<!-- more -->


# 起步

去年11月底至12月初，折腾了好久终于把之前的一个想法实现了（使用flask+mongodb）。[雪花书签](https://everettjf.github.io/2015/12/13/snows_link_tutorial) 上线运行。但可惜，简单又麻烦、无体验，只是实现了半个情怀。后来网站关闭，改版进化为 [番茄阅读](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader) 和 [钦慕设计导航](https://admire.so) 。

了结了这个小情怀，就专心投入iOS学习中。


# 逆向

11月底开始，至12月底，几乎一个月的晚上时间（孩子一般11点才睡觉，我就折腾到一两点）用来学习《iOS应用逆向工程》这本书，最终年底产出一个 [支付宝语音保存Tweak](https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver) ，也写了[开发笔记](https://everettjf.github.io/2015/12/29/tweak-for-alipay-wallet-chat-voice-save)。

2014年我还在做类似360杀毒的安全软件，那时把《病毒分析实战》这本书仔细的边读边做了一遍，但没进一步学习，仅停留在了书中的例子和简单的分析上。由于工作仍然是以业务为主，客户上报了有问题的PE文件，汇编是我的弱势，更多是在金山火眼等其他工具中分析，自己并没有去仔细分析汇编代码。

或许有这个基础，现在看iOS应用的逆向，且由于Objective C的动态机制，基础的逆向学习起来就比较容易。把这本书几乎所有例子逐个走了一遍。


后来由于工作开发IM客户端的需要，逆向了微信等好多App的实现。其中微信消息界面的逆向也[简单总结了下流程](https://everettjf.github.io/2016/06/19/reverse-explore-wechat-message-design)。


# 源码学习

我有时有点折腾，为了学习源码还耗了大量宝贵业余时间写了个Xcode插件 [XSourceNote](https://everettjf.github.io/2016/02/16/xsourcenote-dev)。想法是好的，但使用起来体验并不是很好，仅能凑合用。用这个插件写了几篇源码阅读笔记。

- UITableView-FDTemplateLayoutCell 学习笔记
- YYCache 学习笔记
- SDWebImage 学习笔记
- YYWebImage学习笔记

这里要反思下，学习的太少，插件完全没必要做。
**耗费时间去做低优先级的事情，这个是需要反思的**


# 书

- iOS应用逆向工程
- iOS应用安全攻防实战
- Obscure Topics In Cocoa & Objective-C
- CFHipster
- iOS Core Animation Advanced Technique

除了iOS相关的书籍，还买了《程序员的数学》三本书，第一本简单点，已经看完。二三本已经加入任务队列。

了解了OpenCV。为了实现AR还原魔方。最终在segmentfault hackathon 2016 Beijing上做了个简单的魔方还原辅助的App。[源码](https://github.com/xfteam/xfrubiks)。


# 上线App

从雪花书签到iOS博客精选，到现在的App《番茄阅读》，天真的想法的想要实现，总要经历这个过程。
实现了这个小梦想。有个自己上线的App。[《番茄阅读》开发总结在这里](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader)。



# 文档

很多博客文章不会系统的讲解某一知识，还是应该更多时间投入到看官方文档中。**系统、全面的学习才是更有效的学习**

- CoreData Programming Guide
- Thread Programming Guide
	- RunLoop detail
- Concurrency Programming Guide
	- nsoperation
	- dispatch queue
	- dispatch sources
- App Programming Guide
- 等若干轻量级Guide

# 博客文章

随着日常工作，感觉不错的文章都收藏在了《番茄阅读》中，也放在了这个[web地址](http://iosblog.cc/a/2/)。


# 工作内容总结

想想自己来北京后的主要工作内容：

- 持续集成
	- Jenkins + fastlane (gym sign and ruby script)
- 崩溃收集与分析
	- 符号下载问题
	- plcrashreporter
	- [symboliccrash的bug修复](https://everettjf.github.io/2016/05/10/symbolicatecrash-deadloop-bug)
	- python 定时解析，flask展示
- 聊天室
	- NSAttributedString
- IAP
- IM
	- 消息存储
	- 消息队列
	- 消息展示
	- 图片预览
- 直播
	- 礼物动画


# 下一步计划

优先级先后排列：

- YYModel vs Mantle
	- 效率的区别为何这么大
- Reactive Cocoa
	- 使用
	- 深入源码
- 设计模式
	- AOP
- 组件化
	- 组件化方案
- AsyncDisplayKit
	- 异步UI
- 性能
	- 学习 Instruments Guide
	- 翻译
- 底层
	- class-dump源码学习，Mach-O文件格式学习，myclass-dump

可穿插学习WWDC。完成以上计划应该会很快（当然看学习的细致程度），其他时间多学习各种开源repo。



# 总结

- 时间匆匆而过：半年的时间过得很快。时间总是不够用。
- 优先级：优先级很重要，尤其是“知道的越多，不知道的越多”的时候。

**可以走的慢，但要按照优先级。不要总学新知识的入门资料，至少要在某一个方面继续学习。**


