---
layout: post
title: 转行iOS五个月总结
categories: Skill
comments: true
---






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


