---
layout: post
title: "LLDB Breakpoint All UIPasteboard Methods"
categories:
  - lldb
tags:
  - iOS14
  - lldb
  - debugging
  - iOS
  - UIPasteboard

comments: true
---

iOS14 added a privacy protection feature, when current App reads content other Apps copied to clipboard, will have a brief prompt. As below:
![-w431](/media/15930990964673.jpg)


Can breakpoint all UIPasteboard methods to check all clipboard-related behaviors in App.

Breakpoint all UIPasteboard methods can use command below:

```
breakpoint set -r '\[UIPasteboard .*\]$'
```

First breakpoint at main, then input above command in lldb terminal.

![-w728](/media/15930999653054.jpg)

(Figure above only screenshotted part of UIPasteboard methods)


## Summary

Hmm, everyone try～ Will discover besides our own calls, system also occasionally triggers UIPasteboard related calls.

Very interesting～
