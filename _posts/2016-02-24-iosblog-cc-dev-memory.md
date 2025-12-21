---
layout: post
title: iOS Blog Selection - Origin, Mission and Reflection
categories: Essay
comments: true
---



Added on May 19, 2016: The "iOS Blog Selection" App has been completed and renamed to [Tomato Read](https://everettjf.github.io/2016/05/13/how-to-write-a-simple-feed-reader). (App names in AppStore cannot contain Apple company product trademarks, so cannot contain iOS)


# Recent Status

Warning: This blog post is quite verbose, but might provide something.

Not long ago, I narrowed down the development scope of a long-held idea and finally produced the website [http://iosblog.cc](http://iosblog.cc).

**iOS Blog Selection**, goal is to collect blogs from various iOS development experts, along with collecting a small amount of classic articles and series tutorials.

Website uses Python's Django framework, database is MySQL. Source code at [https://github.com/everettjf/TomatoRead/](https://github.com/everettjf/TomatoRead/)
<!-- more -->

Components:

1. Web: That is <http://iosblog.cc>
2. Chrome Extension: Chrome extension plugin to assist maintainers in adding websites.
3. iOS Client (to be developed): Provides blog subscription and website viewing on mobile.

As an iOS programmer, this is considered **full-stack**. Relying on the foundation of making websites with ASP in college, learning Django was relatively easy. Of these 3 components, the first two parts that are completed are not my strengths, the third part not yet developed is what I'm good at in work.

Starting the third part development soon, goal is to be my first AppStore-listed work since learning iOS development.


# History

The seemingly simple <http://iosblog.cc> has a very lengthy history, which fully reflects my lack of experience in developing personal works, or fully reflects the difficult process of turning a seemingly simple idea into reality (the difficulty here is perhaps mainly because the implementation of my idea is outside my familiar skill stack).

See here <https://github.com/everettjf/TomatoRead/releases>

- June 2015, used Golang's Beego to develop the first version. Database used ssdb. New language, new database. The idea at this time was: implement a multi-user URL blog system. Also, frontend used AngularJS, also new.
- August 2015, before coming to Beijing, changed to PHP's Laravel framework and refactored a version. (May, June, July these three months, quit job at home, practiced freelancing, but happened to not take any orders, instead "cooperated" with someone who wanted to start a business, implementing a photography O2O platform. At that time, to make it easier for other people to join later, chose PHP development. This choice later proved correct, I came to Beijing to work, handed it over to others, perhaps PHP is easy to find people to hand over to) (Brief freelancing, actually didn't experience real freelancing, just experienced the first step of entrepreneurship)
- November 2015, although came to Beijing doing iOS development, still "foolishly" wanted to implement this idea, used Flask to rewrite again, database used MongoDB (thinking about it now, was I possessed then, brain dead, experiencing various technologies for fun, wasted a lot of youth). Also made a small record: [here](https://everettjf.github.io/2015/11/05/mostlikelink-beta-publish). At this time named: <http://mostlike.link>, favorite links.
- Still November, end of month, renamed again to **Snow Links** <http://snows.link, (Tip: domain names always think of better ones, don't buy domain names until you've thought it through). This version supported multi-user registration (GitHub account registration), each person could use Chrome plugin (also uploaded to Chrome store) to add links. This version was relatively feature-complete, basic usage was no problem. And published to V2EX, everyone gave a lot of encouragement. [See here](http://www.v2ex.com/t/240956). This time on V2EX, met [wantline](http://www.v2ex.com/member/wantline), our ideas were very similar, so we cooperated.
- December, communicated ideas with wantline and team.
- January 2016, redeveloped, this time learned from previous lessons, decided to use Python which I'm more familiar with, and more mature framework Django, and MySQL.
- Mid-March 2016, after intermittent development and communication. Admire [https://admire.so](https://admire.so) went online. In February, felt that if Admire included both design and iOS, it was a bit neither here nor there, not focused enough. And because new design requirements required remaking the website's large icons, I didn't have that much time to maintain each website's icons. So decided Admire focuses on design. And I got a very early copy of the code (around end of January), after simple modification became iOS Blog Selection [http://iosblog.cc](http://iosblog.cc). Because this version is older and very simple, and Admire has already made a lot of modifications and new features, and to give this "ancient" repository a home <https://github.com/everettjf/TomatoRead>, decided to open source this code. (Code quality is not good, only for beginners to understand the general idea)


# Reflection

A seemingly simple idea, but developed for so long, and still hasn't been fully realized, just seems to be on the right path.

- Should quickly implement ideas, or try new technologies
- Quickly implement ideas, then choose mature technologies and frameworks
- Try new things? Then go ahead and experiment
- Think more, design more, don't start writing code immediately
- Ideas should be simplified, think about how to implement the core functionality of the idea in the simplest way
- Streamline ideas, remove those non-critical, non-core things
- The technology to implement ideas is best what you're good at
- Are you sure you want to invest a lot of spare time? Are you sure?


# Future

## Admire

Will invest a lot of time in Admire's development in the future, gradually integrate the original idea in a more appropriate way. (Don't forget the original intention)


## iOS Blog Selection

Focus on iOS blogs, continuously maintain daily.
iOS client will be tried first, trial and error. Strive to launch the first version as soon as possible.


