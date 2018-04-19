---
layout: post
title: "iOS应用逆向工程资料汇总"
categories:
  - 逆向
tags:
  - 逆向
comments: true
---


> 又是很久不逆向App了，近期有点需求需要看看其他App怎么实现的，想来复习一下。以及这两年也有若干常用工具发生了变化，产生了一些新的工具。这篇文章总结下基础的App逆向的方法、工具和一些书籍。以后有新的发现也会尽量更新到这篇文章。

<!-- more -->

# 环境

## 硬件

1. iOS系统的iPhone或iPad
2. macOS系统的MacBook等

## 越狱

手机是否可以越狱可通过这个网站来确定： <https://canijailbreak.com/> 越狱用的软件也有链接可下载。

![](/media/15238902335157.jpg)

## 工具


### frida

官网 <https://www.frida.re/>

> Dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers. Inject your own scripts into black box processes. Hook any function, spy on crypto APIs or trace private application code, no source code needed. Edit, hit save, and instantly see the results. All without compilation steps or program restarts.

### cycript

<http://www.cycript.org/ >
> Cycript allows developers to explore and modify running applications on either iOS or Mac OS X using a hybrid of Objective-C++ and JavaScript syntax through an interactive console that features syntax highlighting and tab completion.

### chisel (lldb script)

<https://github.com/facebook/chisel>

> Chisel is a collection of LLDB commands to assist debugging iOS apps.

最常用的就是`pview`和`pvc`两个命令了。 所有支持的命令可以参考Wiki：<https://github.com/facebook/chisel/wiki> 。

### MonkeyDev

<https://github.com/AloneMonkey/MonkeyDev>

> 原有iOSOpenDev的升级，非越狱插件开发集成神器！
1. 可以使用Xcode开发CaptainHook Tweak、Logos Tweak 和 Command-line Tool，在越狱机器开发插件，这是原来iOSOpenDev功能的迁移和改进。
2. 只需拖入一个砸壳应用，自动集成class-dump、restore-symbol、Reveal、Cycript和注入的动态库并重签名安装到非越狱机器。
3. 支持调试自己编写的动态库和第三方App
4. 支持通过CocoaPods第三方应用集成SDK以及非越狱插件，简单来说就是通过CocoaPods搭建了一个非越狱插件商店。

新生力量，诞生于2017年。已经是分析闭源应用的必备工具。


### passionfruit

<https://github.com/chaitin/passionfruit>

基于frida开发，逆向必备，可以很容易看到第三方应用的各类信息。

* Cross plarform web GUI!
* Also supports non-jailbroken device (see Non-jailbroken device).
* List all url schemes.
* Check signature entitlements.
* List human readable app meta info (Info.plist).
* Capture screenshot.
* Checksec: see if target app is encrypted, and has enabled PIE, ARC and stack canary.
* App sandbox file browser. Directly preview images, SQLite databases and plist files on device. You can always download the file for further investigation.
* 等等

![](/media/15238939581774.png)

### objection

<https://github.com/sensepost/objection>

基于frida的工具集。

> objection is a runtime mobile exploration toolkit, powered by Frida. It was built with the aim of helping assess mobile applications and their security posture without the need for a jailbroken or rooted mobile device.

### theos

<https://github.com/theos/theos>

提供了各类逆向开发的模板及工具。

> A cross-platform suite of tools for building and deploying software for iOS and other platforms.

### HookZz

<https://github.com/jmpews/HookZz>

> a hook framework for arm/arm64/ios/android

### AppleTrace

<https://github.com/everettjf/AppleTrace>

> Objective C message tracing tool for iOS/macOS based on HookZz

![](https://camo.githubusercontent.com/7991cda34b6822b4fc1339cc5f4deb0257d41723/68747470733a2f2f657665726574746a662e6769746875622e696f2f73747566662f6170706c6574726163652f6170706c6574726163652e676966)

### dump
#### frida-ios-dump

<https://github.com/AloneMonkey/frida-ios-dump>

可以很方便的dump应用。可替代 Clutch。 

> pull decrypted ipa from jailbreak device


#### Clutch

<https://github.com/KJCracks/Clutch>

> Fast iOS executable dumper

#### dumpdecrypted 

<https://github.com/AloneMonkey/dumpdecrypted>

在原版的基础上增加了dump 动态库的功能。

> Dumps decrypted mach-o files from encrypted applications、framework or app extensions.

### dump class

> Generate Objective-C headers from Mach-O files.

#### class-dump/class-dump-z/classdump-dyld

- <https://github.com/nygard/class-dump>
- <https://code.google.com/archive/p/networkpx/wikis/class_dump_z.wiki>
- <https://github.com/limneos/classdump-dyld>

#### swift class dump

- <https://github.com/BlueCocoa/class-dump/>
- <https://github.com/Maximus-/class-dump-swift>

### Hikari 

<https://github.com/HikariObfuscator/Hikari>

### Reveal

<https://revealapp.com/>

### IDA

神器

### Hopper

轻量级反编译

### Flex

<https://github.com/Flipboard/FLEX>

### 其他

strings、nm、weak_classdump

<http://iphonedevwiki.net/index.php/Reverse_Engineering_Tools>





# 书籍


## iOS应用逆向工程
中文：<http://item.jd.com/11670145.html>
英文：<https://github.com/iosre/iOSAppReverseEngineering>

![](/media/15238973309470.jpg)

## Hacking iOS Applications
<http://iosre.com/t/hacking-ios-applications/8014>
![](/media/15238972865910.jpg)

## security.ios-wiki.com
<https://wizardforcel.gitbooks.io/ios-sec-wiki/>

## Advanced Apple Debugging & Reverse Engineering
<https://store.raywenderlich.com/products/advanced-apple-debugging-and-reverse-engineering>
![](/media/15238973574830.jpg)

## Reverse Engineering for Beginners

<https://beginners.re/>
中文 <https://item.jd.com/12166962.html>
![](/media/15238974244634.jpg)

## Beginner's Guide to Exploitation on ARM 

<http://zygosec.com/Products/>
![](/media/15238974543754.jpg)

# 资料


## 反调试资料、Hook检测

AttackingBYODEnterpriseMobileSecuritySolutions

- <http://7xibfi.com1.z0.glb.clouddn.com/uploads/default/original/2X/2/2a09f6db6d0f0a0cbefdfddf545cbc3c0fdcce8e.pdf>
- <https://www.blackhat.com/docs/us-16/materials/us-16-Tan-Bad-For-Enterprise-Attacking-BYOD-Enterprise-Mobile-Security-Solutions.pdf>
- <http://iosre.com/t/topic/8179>
- <https://sushi2k.gitbooks.io/the-owasp-mobile-security-testing-guide/content/0x06j-Testing-Resiliency-Against-Reverse-Engineering.html>

## OWASP Mobile Security Testing Guide
<https://www.gitbook.com/book/b-mueller/the-owasp-mobile-security-testing-guide>

## iOS 安全 Wiki

<https://legacy.gitbook.com/book/wizardforcel/ios-sec-wiki/details>
<http://security.ios-wiki.com>

## 其他

<http://iphonedevwiki.net/>
<http://www.cydiasubstrate.com/>
<https://www.theiphonewiki.com/>

<https://github.com/michalmalik/osx-re-101>
<https://github.com/kpwn/iOSRE>
<https://github.com/pandazheng/IosHackStudy>

<http://www.droidsec.cn/category/ios%e5%ae%89%e5%85%a8%e6%94%bb%e9%98%b2/>

<https://github.com/nygard>
<https://github.com/saurik>


# PWN

## 安全类入门文章
<https://www.fuzzysecurity.com/tutorials.html>

## 入门pwn
<http://pwnable.kr/>

## Iot安全 AzeriaLabs
<https://azeria-labs.com/writing-arm-shellcode/>

## ARM汇编 iOS调试进阶
<https://zhuanlan.zhihu.com/c_142064221>

# 论坛

<http://iosre.com>

