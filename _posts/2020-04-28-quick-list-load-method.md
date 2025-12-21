---
layout: post
title: "How to Quickly List All +load Methods in App"
categories:
  - lldb
tags:
  - lldb
  - load
  - breakpoint
comments: true
---


`Objective C +load` method is a magical and evil method.

<!-- more -->

- When beginners get it, will be amazed by its magic.
- When experts get it, will be addicted unable to extricate.
- When veterans get it, will be terrified by its evil.

Most large Apps already or are trying to get rid of it. Then, how to quickly see how many +load methods in your App, see how deep the poison.

Assume scenario below:

One day you happily debugging program with Xcode,

Open Xcode, press F5,

Suddenly, you want to see how many +load methods in App?

Click Pause, then input

```
br s -r "\+\[.+ load\]$"
```

![-w352](/media/15880051383019.jpg)

Then input

```
br list
```

![-w930](/media/15880052076002.jpg)


Perhaps you'll be surprised, turns out my App has so many (or few) +load methods


## Principle

Used lldb's breakpoint command.

![-w576](/media/15880053337758.jpg)

```
br s -r "regex"
is 
breakpoint set -r "regex"
```

Set breakpoint through regex matching symbols.

## Small Question

Then think, if code in these +load methods crashes, can your crash monitoring (bugly, etc.) monitor it?

Of course 90% answer is: Won't Crash.

Makes me think of Trump's words: My "code" is perfect.

Haha :)

## Summary

Very interesting:)

Ah, I'm so inexperienced, I need to learn "Bridge-based Full Method Hook" now

http://satanwoo.github.io/2020/04/26/TrampolineHookOpenSource/

---

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)
