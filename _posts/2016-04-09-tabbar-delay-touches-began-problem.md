---
layout: post
title: TabBar位置的二级页面touchesBegan被延迟调用
categories: Skill
comments: true
---






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



