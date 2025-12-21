---
layout: post
title: "Close System Dictionary Interface in iOS"
categories:
  - Reverse Engineering
tags:
  - Reverse Engineering
comments: true
---


Apps in iOS also have multi-process architecture, and started from iOS6, just Apple has been using it themselves.

# Need Source

Day after iBooksLookUpCloser published to bigboss, a foreign friend sent email, asked me to look at this reddit question from a month ago <https://www.reddit.com/r/jailbreak/comments/95vjgd/request_please_some_one_fulfill_this_request_pull/?st=JLMLKHHM&sh=093359ff> .

About iBooksLookUpCloser reference previous article <https://everettjf.github.io/2018/09/03/ibooks-dictionary-close-tweak/> .

<!-- more -->

Very clear, want to implement pull down to close. I instantly felt "this idea is good, much better experience than adding Done button at bottom left". As shown below.

![](/media/15364165356473.jpg)


At the time without thinking replied:

![](/media/15364173953971.jpg)



# Remote View Controller

iBooks opens dictionary interface, cycript view VC, as below:

![6F59426B-EFD3-42E7-A5E4-8FE94C702](/media/6F59426B-EFD3-42E7-A5E4-8FE94C702C71.png)

Still see DDParsecRemoteCollectionViewController this class. This class is a private class.

<https://github.com/nst/iOS-Runtime-Headers/blob/master/PrivateFrameworks/DataDetectorsUI.framework/DDParsecRemoteCollectionViewController.h>

Can see definition:

```
@interface DDParsecRemoteCollectionViewController : _UIRemoteViewController <DDParsecHostVCInterface> {

```

What is _UIRemoteViewController? Search seems only found these three 2012 articles:

<https://oleb.net/blog/2012/10/remote-view-controllers-in-ios-6/>

![](/media/15364176746020.jpg)


Turns out Apple implemented this remote process ViewController mechanism as early as iOS6. Quite similar to Android multi-process mechanism, like WeChat Mini Program's Android multi-process architecture. Presumably current WKWebView is also similar mechanism.

Just like this, I discovered reply was too early (showed off too early).

![](/media/15364178167505.jpg)

# Find Target Process

Through "iOS App Reverse Engineering" a certain expert's hint, said "remember this class contains remote process's ID". Suddenly enlightened, since is multi-process architecture, such natural thing, why didn't think of it at the time.

In _UIRemoteViewController found these two properties.

<https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/_UIRemoteViewController.h>

```
@property (nonatomic, readonly) NSString *serviceBundleIdentifier;
@property (nonatomic, readonly) int serviceProcessIdentifier;
```

Print out, aha.

![F8740182-41AA-44EA-828C-92C3ADD3BAD1](/media/F8740182-41AA-44EA-828C-92C3ADD3BAD1.png)

Aha, bundle id `com.apple.datadetectors.DDActionsService`

Open another shell, `ps aux` indeed found this process.

![A2E75283-F257-4C05-8E8A-73E1AD3D70A9](/media/A2E75283-F257-4C05-8E8A-73E1AD3D70A9.png)

# Target Shifted to New Process

At this point, our dynamic library needs to inject into new process DDActionsService. Modify tweak's injection bundle id to `com.apple.datadetectors.DDActionsService` .

Since is another process, brings a new benefit. Hooked this one process, then iBooks and Safari and other Apps using this process service all indirectly added this "pull down to close" functionality.

Hmm good, interesting, continue.

# Find Dictionary Home Page

Since this process has no keyWindow, above method of printing VC tree is invalid. But there's always a way.

First immediately scp out a copy, see what's going on, class-dump.

![](/media/15364185280989.jpg)

Many Protocols, real effective classes not many, then just hook a few to see which class is dictionary's home page. Using MonkeyDev's Logos Tweak (or CaptainHook Tweak) , finally discovered `DDParsecTableViewController` is home page.

```
#import <UIKit/UITableViewController.h>

@interface DDParsecTableViewController : UITableViewController
{
}

- (void)loadView;

@end
```

Look at header file, confirm is a UITableViewController subclass.


# Find delegate

Then to implement pull down to close, roughly need to know "touch down, move, release" three times, UITableViewDelegate implements UIScrollViewDelegate , UIScrollViewDelegate has three events we need.

Then need to find UITableViewController's tableView's delegate. Since not convenient to quickly get VC stack through keyWindow in cycript, then first through hook DDParsecTableViewController's viewWillAppear event (or viewDidAppear and other events), print DDParsecTableViewController's self address.

```
NSLog(@"%p",self);
```

Know address, then cycript quickly find delegate

![E4EE9916-9961-46D8-99C7-C1F0668C7EDF](/media/E4EE9916-9961-46D8-99C7-C1F0668C7EDF.png)

Found DDParsecServiceCollectionViewController this class is close to completion.

```
- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView{
- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset{

- (void)scrollViewDidScroll:(UIScrollView *)scrollView;
```

Respectively through hook or category method, add pull down to close logic code. Finally implemented.

# Complete

Specific code reference:

<https://github.com/everettjf/DictionaryPullDownToClose/blob/master/DictionaryPullDownToClose/DictionaryPullDownToClose.mm>

# Implementation Effect Video

Couldn't find how to share Weibo video, also put on Twitter <https://twitter.com/everettjf/status/1038359512384585729>

# Upload to bigboss

Estimate September 10, 2018 can search DictionaryPullDownToClose in cydia's bigboss source.

# Summary

1. World always has people with same needs as you.
2. Perhaps they have better implementation methods.
3. Work hard to find.
4. If can't find, either this need has no value, or is priceless.

Above four items are pure nonsense.

Implemented this functionality, using iBooks or Safari to read English is more pleasant, happy.


Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)
