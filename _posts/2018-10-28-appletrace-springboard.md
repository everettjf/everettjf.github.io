---
layout: post
title: "SpringBoard Analysis Using AppleTrace"
categories:
  - Tool
tags:
  - Exploration
comments: true
---

Previous "Preliminary Exploration of LaunchScreen" used IDA and lldb to explore part of SpringBoard. This article uses AppleTrace to preliminarily explore SpringBoard. AppleTrace currently uses HookZz to inline hook objc_msgSend. Can be used to analyze each Objective C method's time consumption, and call relationships.

<!-- more -->

# Background

AppleTrace is a "performance" analysis tool developed (or called assembled) in spare time around September last year (2017). "Performance" is in quotes, because original intent was to use for performance analysis, but due to large impact on performance, results can only be used for reference. Or can be used to analyze relative time consumption between methods.

Previously wrote three articles:

1. AppleTrace Performance Analysis Tool: <https://everettjf.github.io/2017/09/21/appletrace/>
2. AppleTrace with MonkeyDev Trace Any App: <https://everettjf.github.io/2017/10/12/appletrace-dancewith-monkeydev/>
3. Install AppleTrace Tweak Using Cydia: <https://everettjf.github.io/2018/07/10/appletrace-tweak-cydia-repo/>

*Wow, actually wrote three articles, AppleTrace really can make up numbers*

Previous "Preliminary Exploration of LaunchScreen" used IDA and lldb to explore part of SpringBoard. This article very simply introduces how to use AppleTrace to explore SpringBoard.

Address: <https://github.com/everettjf/AppleTrace> .

Of course reason for writing this article is because, AppleTrace always treated catapult and hookzz as submodules, but because catapult repository too large, causes initial download and branch switching wait time too long; hookzz's interface changes too frequent, each time updating hookzz need to change code. So today deleted these two submodules, found a usable hookzz code, put code directly into repository.


# How to Do

1. Use MonkeyDev to create Tweak project (for example CaptainHookTweak)
![](/media/15407405728323.jpg)
2. Drag AppleTrace's objc_msgSend hook related files in

![](/media/15407406419494.jpg)


3. After configuring IP address, cmd+r can install to jailbroken phone.

4. After SpringBoard restarts will automatically record all Objective C method calls.

5. Open directory `/var/mobile/Library/appletracedata`, due to SpringBoard's permission special nature, Library directory location is here.

![](/media/15407408143752.jpg)


6. Copy out these files.

Copy methods many. For example can `tar -zcvf x.tar.gz appletracedata/` then `scp` out.


7. Use AppleTrace's merge.py script process into `trace.json` file.

Chrome browser open `chrome://tracing`, drag `trace.json` in.

![](/media/15407410472870.jpg)


# What Else

Since current code will (try to) actively filter some "non-current executable file" methods, currently see basically all classes starting with `SB`.


![](/media/15407411728754.jpg)


*Really full screen of SB :) Very refreshing*

Next step can expand scope, don't filter or filter less. Specific code see:

<https://github.com/everettjf/AppleTrace/blob/master/appletrace/appletrace/src/objc/hook_objc_msgSend.m>

Above SpringBoard's trace.json see: <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/stuff/appletracedata.tar.gz>


# Other Apps

SpringBoard we can Trace, other Apps even more can. Can reference past articles, how to Trace any App.


# Summary

This article is very short, mainly advertise that AppleTrace is also an exploration tool, very interesting.

