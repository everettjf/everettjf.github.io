---
layout: post
title: One Year Summary After Switching from Windows to iOS Development
categories: Essay
comments: true
---



Since starting iOS development on March 15 last year (2015), removing the 3 months in between as full-time stay-at-home dad (part-time O2O photography startup) (May 10 to August 12), to today (June 26, 2016) it's been a bit over 1 year.

Last November wrote an article [5 Months Summary After Switching from C++ to iOS Development](https://everettjf.github.io/2015/11/18/the-past-4-months-ios-develop-for-me) , listed knowledge learned in nearly 5 months, also made some plans.

This article continues from the previous one. Summarizes learning situation in the past 6 months (last December to today).

<!-- more -->


# Starting

Late November to early December last year, struggled for a long time finally implemented a previous idea (using flask+mongodb). [Snow Bookmarks](https://everettjf.github.io/2015/12/13/snows_link_tutorial) went online and ran. But unfortunately, simple yet troublesome, no UX, only implemented half a sentiment. Later website closed, evolved into [Tomato Read](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader) and [Admire Design Navigation](https://admire.so) .

After finishing this small sentiment, focused on iOS learning.


# Reverse Engineering

Started late November, until late December, almost a month of evening time (child usually sleeps at 11, I tinkered until 1-2am) used to learn "iOS Application Reverse Engineering" this book, finally produced an [Alipay Voice Save Tweak](https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver) at year end, also wrote [development notes](https://everettjf.github.io/2015/12/29/tweak-for-alipay-wallet-chat-voice-save).

In 2014 I was still doing security software similar to 360 Antivirus, at that time carefully read and did "Virus Analysis Practice" this book, but didn't learn further, only stayed at examples in the book and simple analysis. Since work was still mainly business, when customers reported problematic PE files, assembly was my weakness, more analyzed in Jinshan FireEye and other tools, didn't carefully analyze assembly code myself.

Perhaps with this foundation, now looking at iOS application reverse engineering, and because Objective C's dynamic mechanism, basic reverse engineering is relatively easy to learn. Went through almost all examples in this book one by one.


Later due to work developing IM client needs, reverse engineered WeChat and many other Apps' implementations. WeChat message interface reverse engineering also [briefly summarized the process](https://everettjf.github.io/2016/06/19/reverse-explore-wechat-message-design).


# Source Code Learning

I sometimes tinker a bit, to learn source code spent a lot of precious spare time writing an Xcode plugin [XSourceNote](https://everettjf.github.io/2016/02/16/xsourcenote-dev). Idea was good, but UX when using isn't very good, only barely usable. Used this plugin to write several source code reading notes.

- UITableView-FDTemplateLayoutCell learning notes
- YYCache learning notes
- SDWebImage learning notes
- YYWebImage learning notes

Here need to reflect, learned too little, plugin completely unnecessary.
**Spending time on low priority things, this needs reflection**


# Books

- iOS Application Reverse Engineering
- iOS Application Security Attack and Defense
- Obscure Topics In Cocoa & Objective-C
- CFHipster
- iOS Core Animation Advanced Technique

Besides iOS related books, also bought "Mathematics for Programmers" three books, first one is simpler, already finished. Second and third already added to task queue.

Learned about OpenCV. To implement AR Rubik's cube restoration. Finally at segmentfault hackathon 2016 Beijing made a simple Rubik's cube restoration assistant App. [Source code](https://github.com/xfteam/xfrubiks).


# Launched App

From Snow Bookmarks to iOS Blog Selection, to current App "Tomato Read", naive ideas wanting to implement, always go through this process.
Implemented this small dream. Have my own launched App. ["Tomato Read" development summary here](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader).



# Documentation

Many blog articles don't systematically explain certain knowledge, should invest more time in reading official documentation. **Systematic, comprehensive learning is more effective learning**

- CoreData Programming Guide
- Thread Programming Guide
	- RunLoop detail
- Concurrency Programming Guide
	- nsoperation
	- dispatch queue
	- dispatch sources
- App Programming Guide
- Several lightweight Guides

# Blog Articles

As daily work progresses, articles that feel good are all bookmarked in "Tomato Read", also placed at this [web address](http://iosblog.cc/a/2/).


# Work Content Summary

Think about main work content after coming to Beijing:

- Continuous Integration
	- Jenkins + fastlane (gym sign and ruby script)
- Crash Collection and Analysis
	- Symbol download issues
	- plcrashreporter
	- [symboliccrash bug fix](https://everettjf.github.io/2016/05/10/symbolicatecrash-deadloop-bug)
	- python periodic parsing, flask display
- Chat Room
	- NSAttributedString
- IAP
- IM
	- Message storage
	- Message queue
	- Message display
	- Image preview
- Live Streaming
	- Gift animation


# Next Steps Plan

Prioritized:

- YYModel vs Mantle
	- Why is efficiency difference so large
- Reactive Cocoa
	- Usage
	- Deep dive into source code
- Design Patterns
	- AOP
- Componentization
	- Componentization solutions
- AsyncDisplayKit
	- Async UI
- Performance
	- Learn Instruments Guide
	- Translation
- Low Level
	- class-dump source code learning, Mach-O file format learning, myclass-dump

Can intersperse learning WWDC. Completing above plans should be quick (of course depends on learning depth), other time learn various open source repos.



# Summary

- Time flies: Half a year passes quickly. Time is never enough.
- Priorities: Priorities are important, especially when "the more you know, the more you don't know".

**Can go slow, but follow priorities. Don't always learn entry materials for new knowledge, at least continue learning in one aspect.**


