---
layout: post
title: "iBooks Dictionary Interface Close Button"
categories:
  - Skill
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---


Subway time always use iBooks to read e-books, too many unknown words, also like using iBooks' built-in long press word click Look Up (query) button to look up words. Also because used to holding phone with left hand, right hand holding subway handle... After looking up word, close button is at top right. This article simply explains how to add a "Done" button at bottom left. As below:

![screen](/media/screen.jpg)

So I look up words more frequently.

<!-- more -->

# Environment

- Jailbroken iOS (screenshots below didn't use iOS11.3.1 jailbroken two days ago, but all are universal)

# Steps

## View iBooks Basic Information

Using passionfruit, easily see. iBooks executable file path and name.

![](/media/15358613467616.jpg)

## Find Dictionary ViewController

Using cycript find BKLookupViewController.

![](/media/15359889155719.jpg)

![](/media/15358615263059.jpg)

```
   + <BKLookupViewController 0x102a05800>, state: appeared, view: <UILayoutContainerView 0x11827eec0>, presented with: <_UIOverFullscreenPresentationController 0x11827ce60>
   |    | <DDParsecRemoteCollectionViewController 0x102a1f800>, state: appeared, view: <_UISizeTrackingView 0x117a27c80>`
```

## class-dump

scp copy out executable file iBooks and dynamic libraries in Frameworks folder, `class-dump -S -s -H iBooks -o ibooksheader` dump headers, can see BKLookupViewController inherits from DDParsecCollectionViewController. BKLookupViewController itself doesn't have many methods, then look at this class DDParsecCollectionViewController.


```
#import <DataDetectorsUI/DDParsecCollectionViewController.h>

@interface BKLookupViewController : DDParsecCollectionViewController
{
}

- (void)p_setDarkThemeEnabled:(_Bool)arg1;
- (void)updateForTheme:(id)arg1;

@end
```

However DDParsecCollectionViewController can't be found in dynamic libraries in Frameworks. Search, turns out is private library DataDetectorsUI.framework.

Header file already has ready-made.

<https://github.com/nst/iOS-Runtime-Headers/blob/master/PrivateFrameworks/DataDetectorsUI.framework/DDParsecCollectionViewController.h>

Glance, can hook this viewWillAppear.

![](/media/15359892415400.jpg)



## MonkeyDev

MonkeyDev greatly facilitates jailbreak development, create a CaptainHook Tweak project.
![](/media/15359891883821.jpg)

When viewWillAppear, add a UIButton at bottom left, event can call DDParsecCollectionViewController's method doneButtonPressed.

Code reference: <https://github.com/everettjf/iBooksLookUpCloser/blob/master/ibookslookupcloser/ibookslookupcloser.mm>

Note Other Linker Flags add `-undefined dynamic_lookup`.

## Publish to bigboss


<http://thebigboss.org/hosting-repository-cydia/submit-your-app> Follow prompts upload.

24-48 hours will be approved.

This is introduction:
<http://moreinfo.thebigboss.org/moreinfo/depiction.php?file=ibookslookupcloserDp>

This is download count:
<http://apt.thebigboss.org/stats.php?dev=everettjf>
![](/media/15359897424719.jpg)

# Source Code

<https://github.com/everettjf/iBooksLookUpCloser>


# Summary

This article doesn't have much relationship with performance optimization, but always feel reverse engineering and performance optimization are neighbors, mutually influence.

Very beginner, but solved own needs, very happy.

Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)




