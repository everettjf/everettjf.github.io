---
layout: post
title: "iOS应用启动性能优化资料"
categories:
  - doc
tags:
  - doc
comments: true
---

发现好资料就整理到这里，*随时更新，最后一次更新2018年8月6日*

<!-- more -->


# WWDC

1. Optimizing App Startup Time
    
    必看官方资料，从底层到上层 <https://developer.apple.com/videos/play/wwdc2016/406/>
    
2. App Startup Time: Past, Present, and Future
    
    dyld层面的优化 <https://developer.apple.com/videos/play/wwdc2017/413/>
    
3. Optimizing I/O for Performance and Battery Life
    
    IO是启动性能的重要影响部分 <https://developer.apple.com/videos/play/wwdc2016/719/>
    
4. Practical Approaches to Great App Performance
    
    现场一步一步解决性能问题 <https://developer.apple.com/videos/play/wwdc2018/407/>
    
5. Using Time Profiler in Instruments
    
    TimeProfiler是必备好帮手 <https://developer.apple.com/videos/play/wwdc2016/418/>
    
6. High Performance Auto Layout
    
    App首页如果是AutoLayout的，那么以后看来不是问题了 <https://developer.apple.com/videos/play/wwdc2018/220/>
    
7. Core Image: Performance, Prototyping, and Python
    
    首页当然也有大量的图片，了解Core Image <https://developer.apple.com/videos/play/wwdc2018/719/>

# 文章

**以下文章仅仅是收集，各家之谈，不要全信，也不要反对，各有道理，学习思路即可。**

1. 即刻技术团队：iOS app 启动速度研究实践
    
    地址 <https://zhuanlan.zhihu.com/p/38183046?from=1086193010&wm=3333_2001&weiboauthoruid=1690182120>
    学习思路。

2. iOS Dynamic Framework 对App启动时间影响实测
    
    <https://www.jianshu.com/p/3263009e9228>
    动态库的测试。可知：启动过程中尽量不要加载动态库了。

3. Optimizing Facebook for iOS start time
    
    <https://code.fb.com/ios/optimizing-facebook-for-ios-start-time/>
    Facebook的思路。虽然Facebook的启动很慢。
    
4. Bugly: iOS App 启动性能优化
    
    <https://mp.weixin.qq.com/s/Kf3EbDIUuf0aWVT-UCEmbA>
    这篇文章最后透露了一个很给力的思路。强烈推荐仔细看文章最后。
    
5. 今日头条iOS客户端启动速度优化
    
    <https://techblog.toutiao.com/2017/01/17/iosspeed/>
    文章开头的信息很多，但减少代码量，貌似很难行得通。
    
6. 如何精确度量 iOS App 的启动时间
    
    <https://www.jianshu.com/p/c14987eee107>
    文章的思路可参考。

7. 优化 App 的启动时间
    
    <http://yulingtianxia.com/blog/2016/10/30/Optimizing-App-Startup-Time/>
    主要是对WWDC的笔记，但仍然很给力。南萧玉，北子棋。这篇文章就是南萧玉所作。
    
8. 手淘iOS性能优化探索
    
    <https://github.com/izhangxb/GMTC/blob/master/%E5%85%A8%E7%90%83%E7%A7%BB%E5%8A%A8%E6%8A%80%E6%9C%AF%E5%A4%A7%E4%BC%9AGMTC%202017%20PPT/%E6%89%8B%E6%B7%98iOS%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8E%A2%E7%B4%A2%20.pdf>
    这是GMTC 2017手机淘宝专家的技术分享，可以参考。

9. iOS应用启动性能优化(1)-premain
    
    <https://everettjf.github.io/2018/05/26/ios-app-launch-performance-part1/>
    仅仅是pre-main阶段的思路。作者说有后续的文章，但很久没动静了，不知道在搞什么。

10. Hook所有+load方法
    
    一种 hook objective c +load 的方法 <https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/>
    
    Hook所有+load方法（包括Category）
 <https://everettjf.github.io/2018/08/19/ios-hook-really-all-load/>
    
11. 一种 hook C++ static initializers 的方法
    
    <https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/>
    这篇文章的hook方法，有较大的可能是我首创，强烈推荐。手淘的分享中也提了这个方法。

12. 一种延迟 premain code 的方法
    
    <https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/>
    通过学习Facebook的App中特有的section（参考文章 <https://everettjf.github.io/2016/08/20/facebook-explore-section-fbinjectable/> ），发现的一种思路。

    
# 工具

1. TimeProfiler
    
    都知道是啥。
    
2. AppleTrace
    
    <https://github.com/everettjf/AppleTrace>
    使用 HookZz hook了objc_msgSend，会有较大性能损耗，但可根据相对比例来知道大概的耗时占比。另外也手动定义开始结尾生成chrome tracing。
    
3. DTrace
    
    只能用于模拟器。使用方法可参考这本书：Advanced Apple Debugging & Reverse Engineering <https://store.raywenderlich.com/products/advanced-apple-debugging-and-reverse-engineering>
    
4. Xcode 环境变量
    
    DYLD_PRINT_STATISTIC 及其他类似环境变量 <https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/DynamicLibraries/100-Articles/LoggingDynamicLoaderEvents.html>

# 代码

1. FastImageCache
    
    <https://github.com/path/FastImageCache>
    优化图片加载的速度。空间换时间。


# 偏门古董

1. Code Size Performance Guidelines
    
    <https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/MachOOverview.html>
    页面最下面提出的思路很好，但文章是gcc时代的了。有没有clang时代对应的呢。
    Improving Locality of Reference <https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/ImprovingLocality.html#//apple_ref/doc/uid/20001862-CJBJFIDD>

# 书籍

1. Pro iOS Apps Performance Optimization
    
    貌似比较古老，仅参考。
    
2. iOS and macOS Performance Tuning
    
    很细致，我正在看。有中文翻译版。
    
3. High Performance iOS Apps
    
    有中文翻译版。




# 总结

上面的文章我都看过，或者至少是正在看，总结下来，辅助大家优化启动性能。

另外，根据这几年的经验，我发现：如果一个人闷声造车，很容易陷入困境无法自拔（或许是对我这种普通人来说，对天才另说）。有交流才有进步。因此，我创建了一个订阅号（准确的说是又创建了，原来那个没有写什么文章就注销了），计划**每周至少一篇**分享一些性能优化方面的小知识点（不一定是新发现的，很大概率是网上已经有的）。以求让订阅号专注于**性能优化**方面。

如果读者有兴趣，可以关注下，任何问题欢迎交流（公众号内会有微信群），不同于现在有些收费文章或者群，目前或者未来没有任何计划收费，主要是我还太菜哈，只想多多交流，共同进步。

![bukuzao](https://everettjf.github.io/images/fun.jpg)


