---
layout: post
title: "iOS App Reverse Engineering Resources"
tags:
  - iOS
  - development
  - mobile

comments: true
---


> Haven't reverse engineered Apps for a long time, recently have some needs to see how other Apps implement things, want to review. Also these two years several commonly used tools have changed, some new tools emerged. This article summarizes basic App reverse engineering methods, tools and some books. Will try to update this article when there are new discoveries.

<!-- more -->

# Environment

## Hardware

1. iPhone or iPad with iOS system
2. MacBook etc. with macOS system

## Jailbreak

Whether phone can be jailbroken can be determined through this website: <https://canijailbreak.com/> Jailbreak software also has links to download.

![](/media/15238902335157.jpg)

## Tools


### frida

Official site <https://www.frida.re/>

> Dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers. Inject your own scripts into black box processes. Hook any function, spy on crypto APIs or trace private application code, no source code needed. Edit, hit save, and instantly see the results. All without compilation steps or program restarts.

### cycript

<http://www.cycript.org/>
> Cycript allows developers to explore and modify running applications on either iOS or Mac OS X using a hybrid of Objective-C++ and JavaScript syntax through an interactive console that features syntax highlighting and tab completion.

### chisel (lldb script)

<https://github.com/facebook/chisel>

> Chisel is a collection of LLDB commands to assist debugging iOS apps.

Most commonly used are `pview` and `pvc` commands. All supported commands can reference Wiki: <https://github.com/facebook/chisel/wiki> .

### MonkeyDev

<https://github.com/AloneMonkey/MonkeyDev>

> Upgrade of original iOSOpenDev, non-jailbreak plugin development integration tool!
1. Can use Xcode to develop CaptainHook Tweak, Logos Tweak and Command-line Tool, develop plugins on jailbroken devices, this is migration and improvement of original iOSOpenDev functionality.
2. Just drag in a decrypted app, automatically integrate class-dump, restore-symbol, Reveal, Cycript and injected dynamic library and re-sign install to non-jailbroken device.
3. Support debugging self-written dynamic libraries and third-party Apps
4. Support integrating SDK and non-jailbreak plugins through CocoaPods for third-party apps, simply put is building a non-jailbreak plugin store through CocoaPods.

New force, born in 2017. Already essential tool for analyzing closed-source apps.


### passionfruit

<https://github.com/chaitin/passionfruit>

Based on frida development, essential for reverse engineering, can easily see various information of third-party apps.

* Cross plarform web GUI!
* Also supports non-jailbroken device (see Non-jailbroken device).
* List all url schemes.
* Check signature entitlements.
* List human readable app meta info (Info.plist).
* Capture screenshot.
* Checksec: see if target app is encrypted, and has enabled PIE, ARC and stack canary.
* App sandbox file browser. Directly preview images, SQLite databases and plist files on device. You can always download the file for further investigation.
* etc.

![](/media/15238939581774.png)

### objection

<https://github.com/sensepost/objection>

Toolset based on frida.

> objection is a runtime mobile exploration toolkit, powered by Frida. It was built with the aim of helping assess mobile applications and their security posture without the need for a jailbroken or rooted mobile device.

### theos

<https://github.com/theos/theos>

Provides various reverse engineering development templates and tools.

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

Can dump apps very conveniently. Can replace Clutch. 

> pull decrypted ipa from jailbreak device


#### Clutch

<https://github.com/KJCracks/Clutch>

> Fast iOS executable dumper

#### dumpdecrypted 

<https://github.com/AloneMonkey/dumpdecrypted>

Added dump dynamic library functionality on original basis.

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

Essential tool

### Hopper

Lightweight decompiler

### Flex

<https://github.com/Flipboard/FLEX>

### Others

strings, nm, weak_classdump

<http://iphonedevwiki.net/index.php/Reverse_Engineering_Tools>





# Books


## iOS App Reverse Engineering
Chinese: <http://item.jd.com/11670145.html>
English: <https://github.com/iosre/iOSAppReverseEngineering>

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
Chinese <https://item.jd.com/12166962.html>
![](/media/15238974244634.jpg)

## Beginner's Guide to Exploitation on ARM 

<http://zygosec.com/Products/>
![](/media/15238974543754.jpg)

## *OSInternals

- Volume I - User Mode
- Volume III - Security & Insecurity

Rumor says Volume II will come out this fall (2018).

<http://newosxbook.com/>

![](/media/15241510739720.jpg)



# Resources


## Anti-debugging Resources, Hook Detection

AttackingBYODEnterpriseMobileSecuritySolutions

- <http://7xibfi.com1.z0.glb.clouddn.com/uploads/default/original/2X/2/2a09f6db6d0f0a0cbefdfddf545cbc3c0fdcce8e.pdf>
- <https://www.blackhat.com/docs/us-16/materials/us-16-Tan-Bad-For-Enterprise-Attacking-BYOD-Enterprise-Mobile-Security-Solutions.pdf>
- <http://iosre.com/t/topic/8179>
- <https://sushi2k.gitbooks.io/the-owasp-mobile-security-testing-guide/content/0x06j-Testing-Resiliency-Against-Reverse-Engineering.html>

## OWASP Mobile Security Testing Guide
<https://www.gitbook.com/book/b-mueller/the-owasp-mobile-security-testing-guide>

## iOS Security Wiki

<https://legacy.gitbook.com/book/wizardforcel/ios-sec-wiki/details>
<http://security.ios-wiki.com>

## Others

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

## Security Introduction Articles
<https://www.fuzzysecurity.com/tutorials.html>

## PWN Introduction
<http://pwnable.kr/>

## IoT Security AzeriaLabs
<https://azeria-labs.com/writing-arm-shellcode/>

## ARM Assembly iOS Debugging Advanced
<https://zhuanlan.zhihu.com/c_142064221>

# Forums

<http://iosre.com>

