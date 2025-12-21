---
layout: post
title: "Nanoscope Basic Usage"
categories:
  - Performance Optimization
tags:
  - Tool
  - Android
comments: true
---

For App performance optimization, always hoped for a tool that can accurately record time consumption of various methods App executes within specified time.

For iOS platform, can use [everettjf](https://everettjf.github.io) classmate's [AppleTrace](https://github.com/everettjf/AppleTrace) based on [HookZz](https://github.com/jmpews/HookZz), or if you work at Meituan, can use internal Trace tool Caesium (external network can search "Caesium iOS startup time monitoring").

For Android platform, seems various Trace tools are more numerous, CPU Profiler, traceview, systrace, nanoscope, etc., etc.


<!-- more -->

This article simply explains basic usage of Uber's open source nanoscope.

# Official Introduction

- [Introducing Nanoscope: An Extremely Accurate Method Tracing Tool for Android](https://eng.uber.com/nanoscope/)
- [GitHub Nanoscope](https://github.com/uber/nanoscope)

# Pros and Cons

Compared to other trace tools, nanoscope has more accurate precision, very small impact on App performance. But needs to flash firmware, and currently only supports Nexus 6P this one model.


# Usage

## Step One, Install nanoscope

```
brew tap uber/nanoscope
brew install nanoscope
```

## Step Two, Flash Firmware

1. Prepare a Nexus 6P phone (Taobao 400RMB)
2. Open "Developer Options"
3. Allow "USB Debugging",
4. Connect to computer.
5. Set command line (or router) scientific internet access.
5. Then execute command below.

```
nanoscope flash
```

If lucky, directly prompts success.

If unlucky like me, then Google based on error message. Here might have [reference 1](https://android.stackexchange.com/questions/203173/flashing-nexus-5-factory-image-fails-on-writing-userdata)

## Step Three, Usage

After phone boots. Usage very simple, two usages:

```
nanoscope start
nanoscope start --package=com.example.app
```

For example I want to trace my demoapp's startup process, package id is `com.everettjf.hellonanoscope`, then I directly run on macOS command line:

```
nanoscope start --package=com.everettjf.hellonanoscope
```

Then open this demo app on phone, after app startup completes, press Enter, everything done, too simple.


![](/media/15536133178358.jpg)

At this time automatically opens an html, contains various trace information.

![](/media/15536134370424.jpg)


This way can learn Android App's startup process, here even includes system Framework Java layer call content.


# Example

Download [this file](https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/android/nanoscope_sample_html.zip), parsing is html above.
Can press letters `w a s d`, zoom in/out to view time consumption.


# Summary

Android's open source brought lots of "folk" useful tools. Compared to iOS's hard-to-use Time Profiler, Android's various development assistance tools in development, much more friendly.

---

Interesting :)

Welcome to follow subscription account "Client Technology Review":
![](/images/fun.png)
