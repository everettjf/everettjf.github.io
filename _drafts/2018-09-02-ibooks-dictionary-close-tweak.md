---
layout: post
title: "ibooks dictionary close tweak"
categories:
  - 
tags:
  - 
comments: true
---



<!-- more -->



![](/media/15358613467616.jpg)



![](/media/15358614774660.jpg)

![](/media/15358615263059.jpg)

```
   + <BKLookupViewController 0x102a05800>, state: appeared, view: <UILayoutContainerView 0x11827eec0>, presented with: <_UIOverFullscreenPresentationController 0x11827ce60>
   |    | <DDParsecRemoteCollectionViewController 0x102a1f800>, state: appeared, view: <_UISizeTrackingView 0x117a27c80>`
```

```
#import <DataDetectorsUI/DDParsecCollectionViewController.h>

@interface BKLookupViewController : DDParsecCollectionViewController
{
}

- (void)p_setDarkThemeEnabled:(_Bool)arg1;
- (void)updateForTheme:(id)arg1;

@end


```

<https://github.com/nst/iOS-Runtime-Headers/blob/master/PrivateFrameworks/DataDetectorsUI.framework/DDParsecCollectionViewController.h>






