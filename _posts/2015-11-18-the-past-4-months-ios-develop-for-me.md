---
layout: post
title: "A Summary of Five Months Switching to iOS Development"
title_zh: "转行 iOS 五个月总结"
lang_original: zh
categories: Skill
comments: true
---




# Rambling
Around August 5th I suddenly made the decision to come work in Beijing. When I was getting the lay of the land from a classmate in Beijing, his company happened to be short-staffed. I came for an interview on the 7th, and reported for work first thing in the morning on the 13th. I do have a bit of a fate with iOS development: from mid-March to early May I did less than 2 months of iOS development at a small company in Jinan (the interview was originally for Android, but after I came on board iOS was more urgently needed; I figured since I'd just switched careers either was fine, so I started doing iOS. Later, my classmate's company in Beijing also wanted me to do Android initially — I had a soft spot for Android back then with the idea of being able to study the Android source code someday — but my classmate's company was also short on iOS, so it was settled this way).

(Thinking about it now, switching to iOS development is also related to my being a bit lost. Mobile development, penetration testing, machine learning — I had invested quite a lot of time into all three directions and couldn't make up my mind, so I just went with whichever job I could land. (Perhaps the people interviewing me could tell which direction suited me, ha. Hmm, thinking about it now, I really was being irresponsible about my own future. But later when I think about it again, I can only say I was lucky, or that this direction really does suit me.))
<!-- more -->

- Mid-March to early May, nearly two months.
(In between, I spent two months dreaming about an O2O startup; when I woke from the dream it was already August.)
- August 13th to today (November 18th), a little over 3 months.

Five months in total. I feel like I've become a beginner at iOS development. Let me summarize, and at the end also make some plans.

# Preface

I developed client software in C++ on Windows for 5 years. I like reading books and trusting them in my spare time, and in the 5th year I thought about crossing over to something new. I came across a book called "MacTalk: Programming Life"... and from then on I stepped through Apple's door.

This article mainly summarizes how, over these 5 months, I went from Windows C++ development to iOS development.

# Preparation

### Information

- "MacTalk: Programming Life" gave me my first real understanding of Apple (before that I only knew Jobs). (I bought this book in 2014.)

### Hardware

- MacBook Pro 15-inch, not the top spec — I bought the Hong Kong version from a small low-profile Apple shop. (My company now uses a 13-inch + external monitor, and I feel the 13-inch is pretty good too.) (Bought in late 2014.)
- iPhone 4S, a used one I bought for 700 yuan on Xianyu. (I'd never used an Apple product before, and bought it to familiarize myself with operating the iOS system.) (Bought after I started doing iOS development in March 2015.)
- A mouse. In the early days you still need a mouse, otherwise it's hard to get used to. As I gradually got used to the trackpad, I rarely used the mouse.


### Software

- Xcode, installed via the App Store.
- To set up a Mac development environment, I recommend reading this article [https://aaaaaashu.gitbooks.io/mac-dev-setup/content/](https://aaaaaashu.gitbooks.io/mac-dev-setup/content/).

# Learning

## Phase One: Fundamentals

This phase took about a week. Any problem I ran into could be quickly found via Baidu.

### 1. "Start Developing iOS Apps Today"
The English is Start Developing iOS Apps Today.

First I read this official tutorial — a hands-on, step-by-step tutorial. I followed along as I read, and after finishing my confidence soared.

### 2. "Programming in Objective-C"
I read the fourth edition, and over about two days I browsed it from start to finish. For the classes and Foundation parts I wrote some example programs along with it to get familiar with the syntax.

### 3. "iOS Development Guide: From Zero to App Store"
I read the second edition. Although the steps in the book are very detailed, I quickly browsed it from start to finish. For the first few chapters I picked some examples and completed them step by step. Once I was familiar with the development routine, I followed along to build out the small projects in the later chapters. It took roughly 3 or 4 days. After that, it was developing and reading the book at the same time.

### 4. Building UI with iOS Code
This was mainly from reading this article: [http://www.cocoachina.com/bbs/read.php?tid=131516](http://www.cocoachina.com/bbs/read.php?tid=131516)

## Phase Two: Really Starting Development
This phase, all told, was the longest, roughly more than 4 months.

### 5. Mastering Controls
- UITableView
- UIScrollView

### 6. CocoaPods
- Basic usage

### 7. Getting Familiar with a Few Common Libraries

These libraries are basically must-haves for development.

- AFNetworking, a famous networking library
- Masonry, convenient hand-written Auto Layout
- MBProgressHUD, waiting progress
- MJRefresh, pull-to-refresh
- JSONKit, JSON parsing
- SDWebImage, asynchronous image loading

### 8. A Few Concepts
- GCD
- KVC/KVO
- MVC
- NSCoping
- NSCoding
- Categories of developer accounts
- Development certificates, distribution certificates, push certificates
- Provisioning profiles

### 9. Xcode Plugins
First install the plugin manager [http://alcatraz.io/](http://alcatraz.io/)

- FuzzyAutocomplete, fuzzy matching for code autocomplete
- XToDo, find TODO markers in code
- KSImageNamed, preview images while writing `[UIImage imageNamed:]` in code
- XVim, VIM mode
- VVDocumenter-Xcode, press `///` to generate comments
- XBookmark, bookmark feature (I'm used to the bookmark feature, a habit from when I used Visual Studio)
- ColorSenseRainbow, conveniently preview colors in code

### 10. A Few Books
- "Pro iOS Development" — supplements concepts, a reference book.
- "Advanced iOS Development" — not many pages, but very practical.
- "Effective Objective-C 2.0" — a little classic

### 11. Frequently Used Websites
- Code4App
- CocoaChina
- GitHub


## Phase Three: Going Deeper

Given an app's requirements, you can confidently say there's no problem. You should further deepen and strengthen your knowledge.

### 12. Crash Capture and Analysis
- PLCrashReporter
- Analyzing crashes
- Understanding crashes [https://developer.apple.com/library/ios/technotes/tn2151/_index.html](https://developer.apple.com/library/ios/technotes/tn2151/_index.html)
- Symbolication method [http://wufawei.com/2014/03/symbolicating-ios-crash-logs/](http://wufawei.com/2014/03/symbolicating-ios-crash-logs/)

### 13. Continuous Integration
- fastlane is a collection of tools for all kinds of iOS development workflows, even automatic app screenshots.
- fir.im nicely solves in-house app distribution. When the boss wants to see the latest app in development, just give him a link and you're done.
- Jenkins, a powerful continuous integration system, works with fastlane and fir.im to conveniently automate the entire packaging and upload process.

### 14. CocoaPods
- How to create your own library

### 15. Some Deeper Concepts
- Method Swizzling: I used to do Windows Hook, and Objective-C has it too — concepts are always similar.
- Message forwarding mechanism
- Toll-Free Bridging
- Associated objects
- Bitcode
- Objective C++

### 16. Source Code Study
- Masonry
- UITableViewCell-Auto...
- MBProgressHUD
- MJRefresh
- When you see a nice effect, if there's source code, take a look

### 17. Unit Testing
- Specta/Expecta
- Kiwi

### 18. MVVM
- ReactiveCocoa

### 19. A Few Books
- "The Tao of Objective-C Programming" — mainly to learn the ideas. Haven't finished it yet.
- "Talking About Mobile App Testing: A Testing Guide for Android and iOS Apps" — reflecting on development from a testing perspective.
- "Pro Multithreading and Memory Management for iOS and OS X with ARC"

### 20. Articles
- Hiring a reliable iOS dev [http://blog.sunnyxx.com/2015/07/04/ios-interview/](http://blog.sunnyxx.com/2015/07/04/ios-interview/)
- Answers [https://github.com/ChenYilong/iOSInterviewQuestions](https://github.com/ChenYilong/iOSInterviewQuestions)

## Phase Four
This phase is my plan. Over the past 5 years I've always worked on security products, and I've always had a soft spot for security. Now that I'm doing iOS development, it definitely can't be left out. The books are already bought and waiting for me to read.

### 21. Keep Going Deeper
- All kinds of special effects
- All kinds of animations
- All kinds of UIs

### 22. Security
- "iOS App Reverse Engineering"
- "Hacking and Securing iOS Applications"
- "Mac OS X and iOS Internals"


# Summary
The above is my iOS learning experience over these few months. There may be omissions. I'm sharing it with everyone, hoping it can help other peers switching from C++ to iOS.

If there's anything incorrect, please point it out.


<!--ZH-->




# 啰嗦
8月5号左右突然做出了来北京工作的决定，给北京同学了解情况时正好同学公司缺人，7号来面试了下，13号一早就来报到了。自己与iOS开发还是有些缘分，3月中旬到5月初在济南一家小公司做了不到2个月的iOS开发（当初面试是做Android，但近来后iOS更急需，我想我这刚转行都可以啦，就开始做了iOS；后来北京同学这开始也想做Android（抱着以后能学习学习Android源码的想法那时对Android情有独钟），不过同学这也是缺少iOS，于是就这样定了吧）。

（现在想来，转为开发iOS，也与我有些迷茫有关系。移动开发、渗透测试、机器学习，三个自己都投入过不少时间的方向，拿不定主意，就看找到哪个工作了。（或许面试我的人能看出我是否适合那个方向哈，不错现在想想真是对自己的未来不负责任，后来再想，只能说自己运气好或者这个方向真的适合我））。
<!-- more -->

- 3月中旬到5月初，接近两个月时间。
（中间两个月做梦O2O创业去了，梦醒后就8月份了）
- 8月13号到今天（11月18日），3个月多点。

总共5个月了，感觉自己iOS开发算是入门了，总结总结，最后也计划计划。

# 前言

在 Windows 平台用 C++ 开发了 5 年客户端，平时喜欢看书且信书，第5年了就想着跨界一下，看到一本《MacTalk人生元编程》……从此迈入了 Apple 的大门。

此文主要总结下，我这5个月如何从 Windows C++ 开发转到 iOS 开发。

# 准备

### 信息

- 《MacTalk人生元编程》，让我对 Apple 有了第一次认识（以前只知道乔布斯）。（这本书我是2014年买的）

### 硬件

- MacBook Pro 15寸 非顶配，我是从小闷的水果店买的港版。（现在公司用的13寸+外接显示器，感觉13寸也不错。）（2014年底购买）
- iPhone 4S，从闲鱼上700块钱买了的二手的。（从来没有用过Apple的产品，为了让自己熟悉iOS系统的操作）（2015年3月份开始做iOS开发后买的）
- 鼠标。前期还是配个鼠标，否则不习惯。慢慢习惯了触摸板就很少用鼠标了。


### 软件

- Xcode，使用AppStore安装。
- 搭建一个Mac开发环境，推荐看这个文章 [https://aaaaaashu.gitbooks.io/mac-dev-setup/content/](https://aaaaaashu.gitbooks.io/mac-dev-setup/content/)。

# 学习

## 第一阶段：基础

这个阶段大概用了一个星期，遇到的问题百度都能很快找出来。

### 1. 《马上着手开发 iOS 应用程序》
英文是 Start Developing iOS Apps Today。

首先看了这份官方提供的教程，手把手教程。边看边做，完成后信心大增。

### 2. 《Objective-C 程序设计》
我看的第四版，大概两天的时间，从头到尾浏览了一遍。类和Foundation部分照着写了一些例子程序熟悉语法。

### 3. 《iOS开发指南：从零基础到AppStore上架》
看的第二版。书中虽然步骤很详细，从头到尾看快速浏览了一遍，前几章的挑了一些例子，一步一步完成了，熟悉了开发套路后，后面章节的小项目，跟着做出来。大概花费了3、4天时间。之后就是边开发边看书了。

### 4. iOS代码写界面
主要是看的这篇文章，[http://www.cocoachina.com/bbs/read.php?tid=131516](http://www.cocoachina.com/bbs/read.php?tid=131516)

## 第二阶段：真正开始开发
这个阶段前后加起来算是最长时间，大概4个多月吧。

### 5. 熟练控件
- UITableView
- UIScrollView

### 6. CocoaPods
- 基本使用

### 7. 熟悉常用的几个库

这些库基本上都是开发必用的了。

- AFNetworking 很出名的网络库
- Masonry 方便的手写自动布局
- MBProgressHUD 等待进度
- MJRefresh 下拉刷新
- JSONKit JSON解析
- SDWebImage 异步加载图片

### 8. 几个概念
- GCD
- KVC/KVO
- MVC
- NSCoping
- NSCoding
- 开发者账号的类别
- 开发证书、生产证书、推送证书
- 描述文件

### 9. Xcode插件
先安装插件管理器 [http://alcatraz.io/](http://alcatraz.io/)

- FuzzyAutocomplete 代码自动完成的模糊匹配
- XToDo 查找代码中的TODO标记
- KSImageNamed 代码中写`[UIImage imageNamed:]`时可预览图片
- XVim VIM模式
- VVDocumenter-Xcode 按`///`产生注释
- XBookmark 书签功能（我习惯用书签功能，以前用VisualStudio时的习惯）
- ColorSenseRainbow 代码中方便预览颜色

### 10. 几本书
- 《精通iOS开发》 补充概念，工具书。
- 《iOS开发进阶》 页数不多，但很实用。
- 《Effective Objective-C 2.0》 小经典

### 11. 常用网站
- Code4App
- CocoaChina
- GitHub


## 第三阶段：深入

给一个App的需求，自己能自信的说没问题了。应该进一步深入的强化下自己的知识了。

### 12. 崩溃获取及分析
- PLCrashReporter
- 分析崩溃
- 理解崩溃 [https://developer.apple.com/library/ios/technotes/tn2151/_index.html](https://developer.apple.com/library/ios/technotes/tn2151/_index.html)
- 符号化方法 [http://wufawei.com/2014/03/symbolicating-ios-crash-logs/](http://wufawei.com/2014/03/symbolicating-ios-crash-logs/)

### 13. 持续集成
- fastlane 是一个工具集合，各种iOS开发的流程，甚至App自动截图。
- fir.im 很好的解决了App内测分发。老板想看看最新开发中的App，给他一个链接就OK了。
- Jenkins 强大的持续集成系统，配合 fastlane 和 fir.im 方便的自动化整个打包、上传过程。

### 14. CocoaPods
- 如何自己创建库

### 15. 一些更深一步的概念
- Method Swizzing ：以前做Windows Hook，Objective-C也有啊，概念总是相似的。
- 消息转发机制 
- Toll-Free Bridging
- 关联对象
- Bitcode
- Objective C++

### 16. 源码学习
- Masonry
- UITableViewCell-Auto...
- MBProgressHUD
- MJRefresh
- 看到一些不错的效果，有源码就看一看

### 17. 单元测试
- Specta/Expecta
- Kiwi

### 18. MVVM
- ReactiveCocoa

### 19. 几本书
- 《Objective-C编程之道》主要是学习思想。还没看完。
- 《大话移动APP测试，Android与iOS应用测试指南》从测试的角度反思下开发。
- 《Objective-C 高级编程：iOS与OS X多线程和内存管理》

### 20. 文章
- 招聘一个靠谱的iOS [http://blog.sunnyxx.com/2015/07/04/ios-interview/](http://blog.sunnyxx.com/2015/07/04/ios-interview/)
- 答案 [https://github.com/ChenYilong/iOSInterviewQuestions](https://github.com/ChenYilong/iOSInterviewQuestions)

## 第四阶段
这一阶段是我的计划。过去5年自己一直做安全产品，对安全总是情有独钟，现在做iOS开发了，肯定不能少。书已经买好等着我看啦。

### 21. 继续深入
- 各种特效
- 各种动画
- 各种界面

### 22. 安全
- 《iOS应用逆向工程》
- 《iOS应用安全攻防实战》
- 《深入解析Mac OS X & iOS操作系统》


# 总结
以上是我这几个月的iOS学习经历，可能有遗漏，分享给大家，希望能帮助到其他C++转iOS的同行们。

如有不正确的地方，请指正。

