---
layout: post
title: "AppleTrace with MonkeyDev"
categories:
  - Tools
tags:
  - appletrace
  - tracing
  - performance
  - iOS
  - tools

comments: true
---

AppleTrace with MonkeyDev can Trace any App

(Related article: <https://everettjf.github.io/2017/09/21/appletrace/> )

# Result Demo:

![appletrace](http://everettjf.github.io/stuff/appletrace/appletrace.gif)

<!-- more -->

# Environment:
arm64 (only in arm64 environment)

# Tools:

- MonkeyDev <https://github.com/AloneMonkey/MonkeyDev>
- AppleTrace <https://github.com/everettjf/AppleTrace>

# Steps:

1. First use MonkeyDev to create MonkeyApp
2. Create Podfile

    ```
    source '<https://github.com/AloneMonkey/MonkeyDevSpecs.git'>
    use_frameworks!
    target 'WeChatAppleTraceDylib' do
         pod 'AppleTrace'
    end
    ```
3. Put third-party App's ipa into MonkeyDev specified Target directory.
4. Run
5. Copy appletracedata directory from sandbox Library directory
6. Follow steps in <https://github.com/everettjf/AppleTrace> README can generate trace.html

# Result

<https://github.com/everettjf/Yolo/raw/master/WeChatAppleTrace/Result/WeChatStartup.zip>

Extract zip file above, open trace.html, press shortcut keys w a s d to zoom and move, just like playing CS, right.
