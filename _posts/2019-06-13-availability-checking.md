---
layout: post
title: "Exploring Availability Checking Internal Implementation"
categories:
  - Principles
tags:
  - Principles
comments: true
---

This article step by step explores `@avaliable`'s essence.

[WWDC 2017: What's New in LLVM](https://developer.apple.com/videos/play/wwdc2017/411/) Apple introduced a new API availability checking method, using `@avaliable` and similar syntax. Details see this document [Marking API Availability in Objective-C
](https://developer.apple.com/documentation/swift/objective-c_and_c_code_customization/marking_api_availability_in_objective-c)

<!-- more -->

Among them `@available()` can be used in conditional statements, as below:

```
if (@available(iOS 11, *)) {
    // Use iOS 11 APIs.
} else {
    // Alternative code for earlier versions of iOS.
}
```

Believe this is also most familiar to everyone, then what is `@avaliable`?


## Simplest Example

We create a new iOS project, then in AppDelegate call code below:

```
void test_available() {
    if (@available(iOS 11, *)) {
        // Use iOS 11 APIs.
        NSLog(@"ios11");
    } else {
        // Alternative code for earlier versions of iOS.
        NSLog(@"ios other");
    }
}
```

Example code [see here](https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/avaliabletest/avaliabletest/AppDelegate.m)

## Reverse to See

After compilation (simulator is fine), use Hopper to open generated executable, find this test_available, as shown:

![](/media/15604434575850.jpg)

Look at decompiled pseudo code:
![](/media/15604436909250.jpg)

Can see called `___isOSVersionAtLeast` this function, `0xb` is `iOS 11`, estimate following two `0x0` are second and third version digits.

Then Hopper finds this function,

![](/media/15604441390827.jpg)

At a glance, guess roughly in `dispatch_once` got current system version, then assigned to `_GlobalMajor`, `_GlobalMinor` and `_GlobalSubminor` three global variables.

Then how does `dispatch_once` get system version? Hopper's disassembled pseudo code seems can't see what `block` executed. Switch to assembly code view, can see:

![](/media/15604447370360.jpg)


Here called `_parseSystemVersionPList` function, continue looking at this function:
![](/media/15604448185191.jpg)

![](/media/15604451451816.jpg)


![](/media/15604449285315.jpg)


See operation on this file `/System/Library/CoreServices/SystemVersion.plist`, and there's a `fopen`. Then run Xcode, breakpoint at this fopen.

![](/media/15604452404549.jpg)

This file path:

```
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/Library/CoreSimulator/Profiles/Runtimes/iOS.simruntime/Contents/Resources/RuntimeRoot/System/Library/CoreServices/SystemVersion.plist
```

We open to see,

![](/media/15604453014853.jpg)

Then understand, finally is accessing this file, get `ProductVersion` in it, and through `sscanf` parse out three `_GlobalMajor`, `_GlobalMinor` and `_GlobalSubminor` three values.


> sscanf so old, seeing it, seems back to year just learned C language.


## Stage Summary

From current analysis, `@available(iOS 11, *)` finally becomes following pseudo code:

```
_GlobalMajor
_GlobalMinor
_GlobalSubminor

void _parseSystemVersionPList() {
    char *path = ".../System/Library/CoreServices/SystemVersion.plist";
    fp = fopen(path)
    read from fp
    parse ProductVersion
    sscanf into _GlobalMajor,_GlobalMinor,_GlobalSubminor
}

BOOL ___isOSVersionAtLeast(major,minor,subminor) {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _parseSystemVersionPList();     
    });
    return compare major,minor,subminor with _GlobalMajor,_GlobalMinor,_GlobalSubminor
}
```

## How Clang Handles


Related code we search from `https://github.com/llvm-mirror/clang/`,

AST for representing avaliable: `AvailabilitySpec`.

https://github.com/llvm-mirror/clang/blob/master/include/clang/AST/Availability.h

![](/media/15604461673229.jpg)

Also found code for creating function,

![](/media/15604462205628.jpg)


Specifically I'm not too familiar with llvm, won't elaborate (also can't say), interested search yourself.


## Summary Again

Understanding this essence, using in future will be more confident. Very interesting.

---

Welcome to subscribe :)

![](/images/fun.png)




