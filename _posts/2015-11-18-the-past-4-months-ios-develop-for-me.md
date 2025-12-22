---
layout: post
title: 5 Months iOS Development Summary
categories:
  - iOS Development
tags:
  - iOS
  - development
  - mobile

comments: true
---



# Preface
Around August 5th, I suddenly made the decision to come to Beijing to work. When I asked a Beijing classmate about the situation, his company happened to need people. I came for an interview on the 7th, and reported for work early on the 13th. I have some connection with iOS development. From mid-March to early May, I did less than 2 months of iOS development at a small company in Jinan (originally interviewed for Android, but iOS was more urgently needed after joining. I thought since I just switched, I could do it, so I started doing iOS. Later, my Beijing classmate's company also wanted to do Android initially (with the idea of learning Android source code later, I was particularly fond of Android then), but they also needed iOS, so it was decided).

(Now thinking about it, switching to iOS development also had something to do with my confusion. Mobile development, penetration testing, machine learning—three directions I had invested considerable time in, couldn't decide, so I just went with whichever job I found. (Perhaps the interviewer could see if I was suitable for that direction. Now thinking about it, I was really irresponsible about my future. Later thinking, I can only say I was lucky or this direction really suited me)).
<!-- more -->

- Mid-March to early May, nearly two months.
(In between, I spent two months dreaming about O2O entrepreneurship, woke up and it was August)
- August 13th to today (November 18th), a bit over 3 months.

Total 5 months, I feel I've gotten started with iOS development. Let me summarize, and finally plan.

# Introduction

I developed clients on Windows using C++ for 5 years. I usually like reading books and believe in them. In the 5th year, I wanted to cross over, saw a book "MacTalk: Life Meta Programming"... and thus entered the world of Apple.

This article mainly summarizes how I switched from Windows C++ development to iOS development in these 5 months.

# Preparation

### Information

- "MacTalk: Life Meta Programming" gave me my first understanding of Apple (previously only knew about Jobs). (I bought this book in 2014)

### Hardware

- MacBook Pro 15-inch, not top spec, bought Hong Kong version from a small fruit store. (Now using 13-inch + external monitor at company, feels 13-inch is also good.) (Purchased end of 2014)
- iPhone 4S, bought second-hand for 700 yuan from Xianyu. (Never used Apple products before, to familiarize myself with iOS system operations) (Bought after starting iOS development in March 2015)
- Mouse. Early on still needed a mouse, otherwise not used to it. Gradually got used to trackpad and rarely use mouse now.


### Software

- Xcode, installed via AppStore.
- Set up a Mac development environment, recommend this article [https://aaaaaashu.gitbooks.io/mac-dev-setup/content/](https://aaaaaashu.gitbooks.io/mac-dev-setup/content/).

# Learning

## Phase 1: Basics

This phase took about a week, problems encountered could be quickly found via Baidu.

### 1. "Start Developing iOS Apps Today"
English is Start Developing iOS Apps Today.

First read this official tutorial, a step-by-step tutorial. Read and did it, felt much more confident after completion.

### 2. "Programming in Objective-C"
I read the 4th edition, took about two days, browsed from start to finish. Wrote some example programs for classes and Foundation parts to familiarize with syntax.

### 3. "iOS Development Guide: From Zero to App Store"
Read the 2nd edition. Although the book has detailed steps, I quickly browsed from start to finish. Did some examples from the first few chapters step by step. After familiarizing with the development routine, I followed along with the small projects in later chapters. Took about 3-4 days. After that, it was developing while reading.

### 4. Writing UI in iOS Code
Mainly read this article, [http://www.cocoachina.com/bbs/read.php?tid=131516](http://www.cocoachina.com/bbs/read.php?tid=131516)

## Phase 2: Actually Start Developing
This phase was the longest, about 4+ months total.

### 5. Master Controls
- UITableView
- UIScrollView

### 6. CocoaPods
- Basic usage

### 7. Familiarize with Common Libraries

These libraries are basically essential for development.

- AFNetworking, very famous networking library
- Masonry, convenient manual auto layout
- MBProgressHUD, loading progress
- MJRefresh, pull to refresh
- JSONKit, JSON parsing
- SDWebImage, async image loading

### 8. Several Concepts
- GCD
- KVC/KVO
- MVC
- NSCopying
- NSCoding
- Developer account categories
- Development certificate, production certificate, push certificate
- Provisioning profiles

### 9. Xcode Plugins
First install plugin manager [http://alcatraz.io/](http://alcatraz.io/)

- FuzzyAutocomplete, fuzzy matching for code autocomplete
- XToDo, find TODO markers in code
- KSImageNamed, preview images when writing `[UIImage imageNamed:]` in code
- XVim, VIM mode
- VVDocumenter-Xcode, press `///` to generate comments
- XBookmark, bookmark functionality (I'm used to bookmark feature, habit from Visual Studio)
- ColorSenseRainbow, convenient color preview in code

### 10. Several Books
- "Beginning iOS Development" supplement concepts, reference book.
- "iOS Development Advanced" not many pages, but very practical.
- "Effective Objective-C 2.0" small classic

### 11. Common Websites
- Code4App
- CocoaChina
- GitHub


## Phase 3: Deep Dive

Given an App requirement, I can confidently say no problem. Should further deepen and strengthen my knowledge.

### 12. Crash Collection and Analysis
- PLCrashReporter
- Analyze crashes
- Understand crashes [https://developer.apple.com/library/ios/technotes/tn2151/_index.html](https://developer.apple.com/library/ios/technotes/tn2151/_index.html)
- Symbolication methods [http://wufawei.com/2014/03/symbolicating-ios-crash-logs/](http://wufawei.com/2014/03/symbolicating-ios-crash-logs/)

### 13. Continuous Integration
- fastlane is a tool collection, various iOS development workflows, even automatic App screenshots.
- fir.im solves App internal testing distribution very well. Boss wants to see the latest App in development, just give him a link.
- Jenkins, powerful continuous integration system, works with fastlane and fir.im to conveniently automate the entire packaging and upload process.

### 14. CocoaPods
- How to create your own library

### 15. Some Deeper Concepts
- Method Swizzling: previously did Windows Hook, Objective-C has it too, concepts are always similar.
- Message forwarding mechanism
- Toll-Free Bridging
- Associated objects
- Bitcode
- Objective C++

### 16. Source Code Learning
- Masonry
- UITableViewCell-Auto...
- MBProgressHUD
- MJRefresh
- When I see some nice effects, I look at the source code if available

### 17. Unit Testing
- Specta/Expecta
- Kiwi

### 18. MVVM
- ReactiveCocoa

### 19. Several Books
- "Objective-C Programming: The Big Nerd Ranch Guide" mainly learning ideas. Haven't finished yet.
- "Mobile App Testing Guide: Android and iOS Application Testing" reflect on development from testing perspective.
- "Pro Multithreading and Memory Management for iOS and OS X"

### 20. Articles
- Hiring a reliable iOS developer [http://blog.sunnyxx.com/2015/07/04/ios-interview/](http://blog.sunnyxx.com/2015/07/04/ios-interview/)
- Answers [https://github.com/ChenYilong/iOSInterviewQuestions](https://github.com/ChenYilong/iOSInterviewQuestions)

## Phase 4
This phase is my plan. I've been doing security products for the past 5 years, always had a special fondness for security. Now doing iOS development, definitely can't miss it. Books are already bought waiting for me to read.

### 21. Continue Deep Dive
- Various effects
- Various animations
- Various interfaces

### 22. Security
- "iOS Application Reverse Engineering"
- "iOS Application Security Attack and Defense"
- "Mac OS X and iOS Internals: To the Apple's Core"


# Summary
The above is my iOS learning experience over these months, may have omissions, sharing with everyone, hoping to help other C++ developers switching to iOS.

If there are any incorrect points, please correct me.

