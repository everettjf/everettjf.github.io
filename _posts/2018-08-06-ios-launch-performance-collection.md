---
layout: post
title: "iOS App Launch Performance Resources"
categories:
  - iOS Development
tags:
  - iOS
  - development
  - mobile

comments: true
---

Found good resources, organize here, *updated anytime, last update August 19, 2018*

<!-- more -->


# WWDC

1. Optimizing App Startup Time
    
    Must-see official resource, from low-level to high-level <https://developer.apple.com/videos/play/wwdc2016/406/>
    
2. App Startup Time: Past, Present, and Future
    
    dyld-level optimization <https://developer.apple.com/videos/play/wwdc2017/413/>
    
3. Optimizing I/O for Performance and Battery Life
    
    IO is important impact part of startup performance <https://developer.apple.com/videos/play/wwdc2016/719/>
    
4. Practical Approaches to Great App Performance
    
    On-site step by step solving performance problems <https://developer.apple.com/videos/play/wwdc2018/407/>
    
5. Using Time Profiler in Instruments
    
    TimeProfiler is essential good helper <https://developer.apple.com/videos/play/wwdc2016/418/>
    
6. High Performance Auto Layout
    
    If App home page uses AutoLayout, then in future seems not a problem <https://developer.apple.com/videos/play/wwdc2018/220/>
    
7. Core Image: Performance, Prototyping, and Python
    
    Home page of course also has lots of images, understand Core Image <https://developer.apple.com/videos/play/wwdc2018/719/>

# Articles

**Below articles are just collection, various opinions, don't fully believe, don't oppose, each has reason, learn ideas.**

1. Jike Tech Team: iOS app startup speed research practice
    
    Address <https://zhuanlan.zhihu.com/p/38183046?from=1086193010&wm=3333_2001&weiboauthoruid=1690182120>
    Learn ideas.
    
2. iOS Dynamic Framework Impact on App Startup Time Actual Test
    
    <https://www.jianshu.com/p/3263009e9228>
    Dynamic library testing. Can know: try not to load dynamic libraries during startup.
    
3. Optimizing Facebook for iOS start time
    
    <https://code.fb.com/ios/optimizing-facebook-for-ios-start-time/>
    Facebook's ideas. Although Facebook's startup is very slow.
    
4. Bugly: iOS App Launch Performance Optimization
    
    <https://mp.weixin.qq.com/s/Kf3EbDIUuf0aWVT-UCEmbA>
    This article finally reveals a very powerful idea. Strongly recommend carefully reading article end.
    
5. Toutiao iOS Client Startup Speed Optimization
    
    <https://techblog.toutiao.com/2017/01/17/iosspeed/>
    Article beginning has lots of information, but reducing code amount, seems hard to implement.
    
6. How to Precisely Measure iOS App's Startup Time
    
    <https://www.jianshu.com/p/c14987eee107>
    Article's ideas can reference.
    
7. Optimizing App's Startup Time
    
    <http://yulingtianxia.com/blog/2016/10/30/Optimizing-App-Startup-Time/>
    Mainly notes on WWDC, but still very powerful. South Xiaoyu, North Ziqi. This article is by South Xiaoyu.
    
8. Taobao iOS Performance Optimization Exploration
    
    <https://github.com/izhangxb/GMTC/blob/master/%E5%85%A8%E7%90%83%E7%A7%BB%E5%8A%A8%E6%8A%80%E6%9C%AF%E5%A4%A7%E4%BC%9AGMTC%202017%20PPT/%E6%89%8B%E6%B7%98iOS%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8E%A2%E7%B4%A2%20.pdf>
    This is GMTC 2017 Taobao expert's technical sharing, can reference.
    
9. iOS App Launch Performance Optimization (1) - premain
    
    <https://everettjf.github.io/2018/05/26/ios-app-launch-performance-part1/>
    Only premain stage ideas. Author says has follow-up articles, but no movement for long time, don't know what's going on.
    
10. Hook All +load Methods
    
    A method to hook objective c +load <https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/>
    
    Hook All +load Methods (Including Category)
 <https://everettjf.github.io/2018/08/19/ios-hook-really-all-load/>
    
11. A Method to Hook C++ Static Initializers
    
    <https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/>
    This article's hook method, has high possibility I created it first, strongly recommend. Taobao's sharing also mentioned this method.
    
12. A Method to Delay premain Code
    
    <https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/>
    Through learning Facebook's App's unique section (reference article <https://everettjf.github.io/2016/08/20/facebook-explore-section-fbinjectable/> ), discovered idea.
    
    

# Tools

1. TimeProfiler
    
    Everyone knows what it is.
    
2. AppleTrace
    
    <https://github.com/everettjf/AppleTrace>
    Using HookZz hooked objc_msgSend, will have large performance cost, but can know approximate time consumption ratio based on relative proportion. Also manually define start and end to generate chrome tracing.
    
3. DTrace
    
    Can only be used on simulator. Usage method can reference this book: Advanced Apple Debugging & Reverse Engineering <https://store.raywenderlich.com/products/advanced-apple-debugging-and-reverse-engineering>
    
4. Xcode Environment Variables
    
    DYLD_PRINT_STATISTIC and other similar environment variables <https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/DynamicLibraries/100-Articles/LoggingDynamicLoaderEvents.html>

# Code

1. FastImageCache
    
    <https://github.com/path/FastImageCache>
    Optimize image loading speed. Space for time.
    

# Obscure Antiques

1. Code Size Performance Guidelines
    
    <https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/MachOOverview.html>
    Page bottom's ideas are good, but article is from gcc era. Is there corresponding for clang era?
    Improving Locality of Reference <https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/ImprovingLocality.html#//apple_ref/doc/uid/20001862-CJBJFIDD>

# Books

1. Pro iOS Apps Performance Optimization
    
    Seems relatively old, only reference.
    
2. iOS and macOS Performance Tuning
    
    Very detailed, I'm reading. Has Chinese translation.
    
3. High Performance iOS Apps
    
    Has Chinese translation.



# Summary

Above articles I've all read, or at least reading, summarize here, assist everyone optimizing startup performance.
