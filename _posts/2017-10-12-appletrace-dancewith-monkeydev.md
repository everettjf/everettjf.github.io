---
layout: post
title: "AppleTrace Paired with MonkeyDev to Trace Any App"
title_zh: "AppleTrace 搭配 MonkeyDev Trace 任意 App"
lang_original: zh
categories:
  - Tool
tags:
  - Tool
comments: true
---

AppleTrace paired with MonkeyDev can trace any App

(Related article: <https://everettjf.github.io/2017/09/21/appletrace/> )

# Result Demo:

![appletrace](http://everettjf.github.io/stuff/appletrace/appletrace.gif)

<!-- more -->

# Environment:
arm64 (only in the arm64 environment)

# Tools:

- MonkeyDev <https://github.com/AloneMonkey/MonkeyDev>
- AppleTrace <https://github.com/everettjf/AppleTrace>

# Steps:

1. First, use MonkeyDev to create a MonkeyApp
2. Create a new Podfile

    ```
    source '<https://github.com/AloneMonkey/MonkeyDevSpecs.git'>
    use_frameworks!
    target 'WeChatAppleTraceDylib' do
         pod 'AppleTrace'
    end
    ```
3. Put the third-party App's ipa into the Target directory specified by MonkeyDev.
4. Run
5. Copy the appletracedata directory out of the sandbox's Library directory
6. Following the steps in the README at <https://github.com/everettjf/AppleTrace>, you can generate trace.html

# Result

<https://github.com/everettjf/Yolo/raw/master/WeChatAppleTrace/Result/WeChatStartup.zip>

Unzip the zip file above, open trace.html, and press the keys w a s d to zoom and move, just like playing CS, right?

<!--ZH-->

AppleTrace搭配MonkeyDev可实现Trace任意App

(关联文章：<https://everettjf.github.io/2017/09/21/appletrace/> )

# 结果演示：

![appletrace](http://everettjf.github.io/stuff/appletrace/appletrace.gif)

<!-- more -->

# 环境：
arm64（仅在arm64环境下）

# 工具：

- MonkeyDev <https://github.com/AloneMonkey/MonkeyDev>
- AppleTrace <https://github.com/everettjf/AppleTrace>

# 步骤：

1. 首先使用MonkeyDev创建MonkeyApp
2. 新建Podfile

    ```
    source '<https://github.com/AloneMonkey/MonkeyDevSpecs.git'>
    use_frameworks!
    target 'WeChatAppleTraceDylib' do
         pod 'AppleTrace'
    end
    ```
3. 把第三方App的ipa放入 MonkeyDev指定的Target目录中。
4. 运行
5. 从沙盒 Library目录中复制出 appletracedata目录
6. 按照 <https://github.com/everettjf/AppleTrace> README中的步骤可生成 trace.html

# 结果

<https://github.com/everettjf/Yolo/raw/master/WeChatAppleTrace/Result/WeChatStartup.zip>

解压上面的zip文件，打开trace.html，按快捷键 w a s d 可缩放移动，就像在玩 CS，是吧。
