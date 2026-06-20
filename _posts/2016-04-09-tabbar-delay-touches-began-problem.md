---
layout: post
title: "Analyzing Delayed touchesBegan on a Secondary Page Inside the TabBar Area"
title_zh: "TabBar 区域内二级页面 touchesBegan 被延迟调用问题分析"
lang_original: zh
categories: Skill
comments: true
---






# Problem

Recently I was developing a WeChat-style "send voice message" feature. The ViewControllers were structured like this:

TabBarController -> Navigation Controller -> Session View Controller -> Message View Controller

- SessionViewController implements the session (conversation) list page
- MessageViewController implements the message list page

<!-- more -->

On the session list page, tapping a conversation pushes to the message list page while hiding the TabBar. The relevant code is:

```
    MessageViewController *vc = [[MessageViewController alloc]init];
    vc.hidesBottomBarWhenPushed = YES;
    [self.navigationController pushViewController:vc animated:YES];

```


At the very bottom of MessageViewController (the TabBar position), there's a view for recording voice. This view responds to touch-down events:

```

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touches began");
    
    [super touchesBegan:touches withEvent:event];
}
```

However, `touchesBegan` is not called immediately when the finger touches down; instead it's only called after the finger lifts up or moves.

# Solution

Set MessageViewController's `self.navigationController.interactivePopGestureRecognizer.delaysTouchesBegan` to NO.

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

# Similar Questions

 - <https://segmentfault.com/q/1010000002490506>



# Related Issue

There's a similar question on Stack Overflow:

 - <http://stackoverflow.com/questions/22285861/uibutton-touch-down-action-not-called-when-touch-down-but-called-when-touch-move>

 
The reason is similar to the following:


> Because a scroll view has no scroll bars, it must know whether a touch signals an intent to scroll versus an intent to track a subview in the content. To make this determination, it temporarily intercepts a touch-down event by starting a timer and, before the timer fires, seeing if the touching finger makes any movement. If the timer fires without a significant change in position, the scroll view sends tracking events to the touched subview of the content view. If the user then drags their finger far enough before the timer elapses, the scroll view cancels any tracking in the subview and performs the scrolling itself. Subclasses can override the touchesShouldBegin:withEvent:inContentView:, pagingEnabled, and touchesShouldCancelInContentView: methods (which are called by the scroll view) to affect how the scroll view handles scrolling gestures.

# Summary

The delay happens because the gesture recognizer needs to figure out whether you intend to scroll or just tap.



<!--ZH-->

# 问题

最近开发类似微信发语音的功能，ViewController 如下：

TabBarController -> Navigation Controller -> Session View Controller -> Message View Controller

- SessionViewController 实现会话列表页面
- MessageViewController 实现消息列表页面

<!-- more -->

在会话列表页面点击某一会话，会隐藏TabBar的方式Push到消息列表页面。相关代码如下：

```
    MessageViewController *vc = [[MessageViewController alloc]init];
    vc.hidesBottomBarWhenPushed = YES;
    [self.navigationController pushViewController:vc animated:YES];

```


在MessageViewController最下面（TabBar位置）放置录音的View。此View响应按下时间：

```

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touches began");
    
    [super touchesBegan:touches withEvent:event];
}
```

然而，touchesBegan在手指按下时并不能马上得到调用，而是在手指抬起或者移动后才能被调用。

# 解决办法

设置MessageViewController的self.navigationController.interactivePopGestureRecognizer.delaysTouchesBegan为NO。

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

# 同类问题

 - <https://segmentfault.com/q/1010000002490506>



# 类似问题

Stackoverflow 有类似问题 

 - <http://stackoverflow.com/questions/22285861/uibutton-touch-down-action-not-called-when-touch-down-but-called-when-touch-move>

 
类似原因如下：


> Because a scroll view has no scroll bars, it must know whether a touch signals an intent to scroll versus an intent to track a subview in the content. To make this determination, it temporarily intercepts a touch-down event by starting a timer and, before the timer fires, seeing if the touching finger makes any movement. If the timer fires without a significant change in position, the scroll view sends tracking events to the touched subview of the content view. If the user then drags their finger far enough before the timer elapses, the scroll view cancels any tracking in the subview and performs the scrolling itself. Subclasses can override the touchesShouldBegin:withEvent:inContentView:, pagingEnabled, and touchesShouldCancelInContentView: methods (which are called by the scroll view) to affect how the scroll view handles scrolling gestures.

# 总结

delay的原因是由于手势需要知道是要滑动还是仅仅点击。
