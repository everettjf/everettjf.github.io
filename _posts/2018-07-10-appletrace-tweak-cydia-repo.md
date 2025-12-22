---
layout: post
title: "AppleTrace Tweak Installation via Cydia"
tags:
  - appletrace
  - tracing
  - performance
  - iOS
  - tools

comments: true
---

Add cydia repo `http://7we.win/cydia/` in cydia, can install AppleTraceLoader, then can more conveniently trace any app's objc_msgSend.

<!-- more -->


# Installation

Jailbroken phone open `http://7we.win/cydia/` , click `Add to Cydia`, after refresh search `AppleTraceLoader` install.

![](/media/15316426709626.jpg)

# Configuration

Open Settings->AppleTrace, can choose which app to trace.
![](/media/15316427520641.jpg)

![](/media/15316427818554.jpg)


After selection, restart selected App, will generate `appletracedata` directory in corresponding App's directory.

Reference AppleTrace <https://github.com/everettjf/AppleTrace> documentation can generate trace's html file.

# Cydia Repo Setup

Here used GitHub Pages to set up Cydia Repo. Address:

https://github.com/crcgen

Reference AloneMonkey's Cydia Repo <https://github.com/AloneMonkey/cydiarepo>


# Can Also Have a UI Interface

Using frida's js interface, with Electron can develop an interface to more conveniently get appletracedata, but this is not important not urgent, won't invest time to tinker.
