---
layout: post
title: "The iOSBlog.cc Website: Origins, Goals, and Reflections on an iOS Blog Curation"
title_zh: "iOSBlog.cc 网站：iOS 博客精选的由来、目标与反思"
lang_original: zh
categories: Essay
comments: true
---



Update on May 19, 2016: The "iOS Blog Picks" app is done, and has been renamed [Tomato Read](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader). (App names on the App Store can't contain Apple's product trademarks, so it can't contain "iOS".)


# Current Status

Warning: This post is fairly long-winded, but maybe it can offer something.

Not long ago, I once again narrowed the scope of an idea I'd had for a long time, and finally produced the website [http://iosblog.cc](http://iosblog.cc).

**iOS Blog Picks**'s goal is to collect the blogs of various iOS developers, big and small, along with a small selection of classic articles and tutorial series.

The website uses Python's Django framework, with MySQL as the database. Source code at [https://github.com/everettjf/TomatoRead/](https://github.com/everettjf/TomatoRead/)
<!-- more -->

Components:

1. Web: that is, what you see at <http://iosblog.cc>
2. Chrome extension: a Chrome extension plugin that helps maintainers add websites.
3. iOS client (to be developed): provides blog subscriptions and viewing of websites on mobile.

As an iOS programmer, this counts as **full-stack**. Relying on my foundation building websites with ASP back in college, learning Django was relatively easy. Of these three components, the first two that are done are not my strong suit; the third, undeveloped one is what I'm good at at work.

I'm about to start developing the third part. The goal is to make it the first work I publish to the App Store since I started learning iOS development.


# History

The seemingly simple <http://iosblog.cc> has a very long history. This history fully reflects my lack of experience developing personal projects, or rather, fully reflects how hard it is to turn a seemingly simple idea into reality (here the difficulty is perhaps mainly because realizing my idea was outside my familiar skill set).

See here: <https://github.com/everettjf/TomatoRead/releases>

- June 2015: I developed the first version using Golang's Beego. The database used ssdb. A new-to-me language, a new-to-me database. The idea at the time was: build a multi-user website/blog system. Additionally, the frontend used AngularJS, also new to me.
- August 2015: Before coming to Beijing, I rewrote a version using PHP's Laravel framework. (During those three months—May, June, July—I'd quit my job and was at home practicing freelancing, but happened not to take on any gigs; instead I "collaborated" with someone who wanted to start a company, building a photography O2O platform. At the time, to make it easy for others to join later, I chose PHP for development. This choice later proved correct: when I came to Beijing for work and handed it off to someone else, PHP probably made it easy to find someone to take it over.) (My brief stint of freelancing didn't really let me experience true freelancing; I just experienced the first step of starting a company.)
- November 2015: Although I'd come to Beijing to do iOS development, I "foolishly" still wanted to realize this idea, and rewrote it again using Flask, with MongoDB as the database (thinking back now, was I possessed back then, was my brain water-logged, playing around experiencing all sorts of tech, wasting heaps of my youth). I also made a little record: [here](https://everettjf.github.io/2015/11/05/mostlikelink-beta-publish). At this point I named it: <http://mostlike.link>, the most-liked link.
- Still November, end of the month: I renamed it again to **Snowflake Link** <http://snows.link>, (a little lesson: you'll always think of a better domain name—until you've finally settled on it, better not buy a domain). This time it supported multi-user registration (sign up with a GitHub account), and everyone could use the Chrome plugin (also uploaded to the Chrome store) to add links. This version counts as a fairly full-featured version, basically with no problems for general use. And it was published on V2EX, where everyone still gave a lot of encouragement. [See here](http://www.v2ex.com/t/240956). This time on V2EX I met [wantline](http://www.v2ex.com/member/wantline); our ideas were very similar, so we collaborated.
- December: I discussed the idea with wantline and the team.
- January 2016: redeveloped it. This time, learning from past lessons, I decided to use Python, a language I was more familiar with, plus the more mature framework Django, plus MySQL.
- Mid-March 2016: After on-and-off development and discussion, [https://admire.so](https://admire.so) went live. In February, I felt that if Admire included both design and iOS, it would be neither fish nor fowl—not focused enough. Also, the new design required remaking the websites' large icons, which meant I didn't have enough time to maintain each site's icon. So I decided that Admire would focus on design. Meanwhile, I took a very early version of the code (roughly late January), and after some simple modifications it became iOS Blog Picks [http://iosblog.cc](http://iosblog.cc). Because this version is older and quite simple—Admire had since made a large number of changes and added new features—and to give this "ancient" repo of mine a home at <https://github.com/everettjf/TomatoRead>, I decided to open-source this code. (The code quality isn't good; it's only for beginners to get a rough idea of the approach.)


# Reflections

A seemingly simple idea, yet developed over so long, and in the end still not realized—just seemingly walking on the right path.

- Do you want to quickly realize the idea, or try out new tech?
- To quickly realize the idea, choose mature tech and frameworks.
- Want to try new stuff? Then go ahead and tinker.
- Think more, design more—don't start writing code right away.
- Keep the idea simple; think about how to realize the idea's core functionality in the simplest way.
- Trim the idea; cut out the things that aren't key or core.
- The tech to realize the idea is best one you're good at.
- Are you sure you want to invest a lot of spare time? Are you sure?


# The Future

## Admire

A lot of time in the future will go into developing Admire, gradually folding the original idea in in a more appropriate way. (Don't forget the original intention.)


## iOS Blog Picks

Focus on iOS blogs, with ongoing day-to-day maintenance.
The iOS client will be tried first, to experiment. I'll strive to ship the first version as soon as possible.

<!--ZH-->



2016年5月19日补充：《iOS博客精选》App已经完成，并重命名为 [番茄阅读](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader)。(AppStore中App命名不能包含Apple公司的产品商标，因此不能包含iOS)


# 近况

Warning:本篇博客较为啰嗦，但或许能提供些什么。

前不久又将很久之前的想法缩小了开发范围，最终产出了 [http://iosblog.cc](http://iosblog.cc) 这个网站。

**iOS博客精选** ，目标是收集各种iOS开发大小牛的博客，附带收集少量经典文章及系列教程。

网站使用Python的Django框架，数据库为MySQL。源码见 [https://github.com/everettjf/TomatoRead/](https://github.com/everettjf/TomatoRead/)
<!-- more -->

组成部分：

1. Web：也就是看到的 <http://iosblog.cc>
2. Chrome 扩展：辅助维护人员添加网站的 Chrome扩展插件。
3. iOS客户端（即将开发）：提供博客订阅及网址手机端的查看。

作为一名iOS程序猿，这也算是**全栈**了。依靠大学时期ASP制作网站的底子，学起Django来还算轻松。这3个组成部分，已经完成的前两部分都不是我擅长的，未开发的第三部分是我工作中擅长的。

马上开始第三部分开发，目标是作为我学习iOS开发以来的第一个上架AppStore的作品。


# 历史

看似简单的 <http://iosblog.cc> ，有个很冗长的历史，这个历史充分体现了我对开发个人作品的经验不足，或者说充分体现了一个看似简单的想法变为现实的艰难过程（这里艰难或许主要原因在于我的想法的实现在我的熟悉的技能栈之外）。

见这里 <https://github.com/everettjf/TomatoRead/releases>

- 2015年6月份，使用Golang的Beego开发了第一个版本。数据库使用了ssdb。尝鲜的语言，尝鲜的数据库。这时的想法是：实现多人的网址博客系统。另外，前端使用了AngularJS，也是尝鲜。
- 2015年8月份，来北京之前，改为PHP的Laravel框架重构了一版本。（5、6、7这三个月，裸辞在家，实践自由职业，但恰好没有接任何单子，反而与一位想创业者”合作“，在实现一个摄影O2O平台，当时为了后期容易其他人员加入，选择了PHP开发。这个选择后来证明是正确的，我来北京工作，交接给了他人，或许PHP很容易找到交接的人）（短暂的自由职业，其实没有尝试到真正的自由职业，只是体验了下创业的第一步）
- 2015年11月份，虽然来到北京做了iOS开发，还是”愚昧“的要实现这个想法，使用Flask又重写了一遍，数据库使用了MongoDB（想在想想我那时是不是着魔了，脑子进水了，体验各种技术玩呢啊，耗费了大把青春）。还做了个小记录：[这里](https://everettjf.github.io/2015/11/05/mostlikelink-beta-publish)。这时起名：<http://mostlike.link> ，最喜欢的链接。
- 仍然是11月份，月底，又改名 **雪花链接** <http://snows.link，（小经验：域名总会想到更好的，没到最后想好还是先不要买域名了）。这次支持了多人注册（GitHub账号注册），每个人可以使用Chrome插件（也上传到Chrome商店）添加链接。这个版本算是功能较全的版本，基本使用已经没有问题。且发布到了V2EX上，大家还是给了很多鼓励。[见这里](http://www.v2ex.com/t/240956)。这次在V2EX上，认识了> [wantline](http://www.v2ex.com/member/wantline) ，我们想法十分相似，于是合作。
- 12月份，与wantline及团队沟通想法。
- 2016年1月重新开发，这次吸取以前的教训，决定使用我更熟悉的Python语言，以及更成熟的框架Django，以及MySQL。
- 2016年3月中旬，经过断断续续的开发、交流。钦慕 [https://admire.so](https://admire.so) 上线。2月份时，觉得钦慕如果包含设计与iOS，有点不伦不类，不够专一。且由于新的设计要求重新制作网站的大图标，导致我没有那么多时间去维护每个网站的图标。于是决定 钦慕 专注于设计。而我获取了一份很早的代码（大概是1月底），经过简单的改造 成为 iOS博客精选 [http://iosblog.cc](http://iosblog.cc) ，这由于这个版本较老，而且很简单，钦慕之后已经做了大量的修改和新特性增加，且为了让我这个“古老”的仓库有个归宿 <https://github.com/everettjf/TomatoRead> ， 决定将此代码开源。（代码质量不好，仅供初学者了解大概思路）


# 反思

一个看似简单的想法，却前后开发了这么久，却最终还没有实现，只是看似走在了正确的道路上。

- 是要快速实现想法，还是要尝鲜新技术
- 快速实现想法，那就选择成熟的技术、框架
- 尝鲜？那就折腾去吧
- 多想，多设计，不要一上来就写代码
- 想法要从简，想想怎么以最简单的方式实现想法的核心功能
- 精简想法，去掉那些不关键、不核心的东西
- 想法的实现技术最好是自己擅长的
- 确定要投入大量的业余时间吗，确定吗？


# 未来

## 钦慕

未来大量时间会投入到钦慕的开发中，逐渐将最初的想法以更合适的方式融入。（不忘初心）


## iOS博客精选

专注于iOS博客，日常不断维护。
iOS客户端会首先尝试开发，试错。力争尽快上线第一个版本。
