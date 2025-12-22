---
layout: post
title: TabBar touchesBegan Delayed Call
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---



# Problem

Recently developing voice messaging functionality similar to WeChat, ViewController structure as follows:

TabBarController -> Navigation Controller -> Session View Controller -> Message View Controller

- SessionViewController implements session list page
- MessageViewController implements message list page

<!-- more -->

Clicking a session in the session list page will push to the message list page with TabBar hidden. Related code:

```
    MessageViewController *vc = [[MessageViewController alloc]init];
    vc.hidesBottomBarWhenPushed = YES;
    [self.navigationController pushViewController:vc animated:YES];

```


Place a recording View at the bottom of MessageViewController (TabBar position). This View responds to touch down:

```

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touches began");
    
    [super touchesBegan:touches withEvent:event];
}
```

However, touchesBegan cannot be called immediately when finger presses down, but only after finger lifts or moves.

# Solution

Set MessageViewController's self.navigationController.interactivePopGestureRecognizer.delaysTouchesBegan to NO.

```
-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];    
    self.navigationController.interactivePopGestureRecognizer.delaysTouchesBegan = NO;
}

- (void)viewDidDisappear:(BOOL)animated{
    [super viewDidDisappear:animated];
    
    self.navigationController.interactivePopGestureRecognizer.delaysTouchesBegan = _savedDelaysTouchBegan;
}

```

# Similar Problems

 - <https://segmentfault.com/q/1010000002490506>



# Related Issues

Stackoverflow has similar issues 

 - <http://stackoverflow.com/questions/22285861/uibutton-touch-down-action-not-called-when-touch-down-but-called-when-touch-move>

 
Similar reasons:

> Because a scroll view has no scroll bars, it must know whether a touch signals an intent to scroll versus an intent to track a subview in the content. To make this determination, it temporarily intercepts a touch-down event by starting a timer and, before the timer fires, seeing if the touching finger makes any movement. If the timer fires without a significant change in position, the scroll view sends tracking events to the touched subview of the content view. If the user then drags their finger far enough before the timer elapses, the scroll view cancels any tracking in the subview and performs the scrolling itself. Subclasses can override the touchesShouldBegin:withEvent:inContentView:, pagingEnabled, and touchesShouldCancelInContentView: methods (which are called by the scroll view) to affect how the scroll view handles scrolling gestures.

# Summary

The delay is because gestures need to know whether to scroll or just tap.



