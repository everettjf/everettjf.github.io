---
layout: post
title: "\"App Version God\": A Little App for Querying an App's Historical Versions"
title_zh: "「App 版本帝」：查询 App 历史版本的小应用"
lang_original: zh
categories:
  - 工具
tags:
  - 工具
  - 娱乐
comments: true
---

From an app's release cadence you can get a glimpse of the operational state of the team behind it, and to some extent how much that team cares about app quality and user experience. So this article takes everyone on a look at the release situation of those "excellent" apps.


<!-- more -->

# Data

## Version Records

Apple's App Store website lets you get an app's historical version release records. For example, Douyin:
https://itunes.apple.com/cn/app/id1142110895

![](/media/15500700541354.jpg)

## Top Apps

"Excellent" apps are naturally the top-ranked ones. iResearch's index provides a ranking, but you can't conveniently get the corresponding App Store link (the id in the link above).
Qimai Data provides an "App Leaderboard", so let's look at the release cadence of the apps on the "China App Store Free Chart". The link is as follows:

https://www.qimai.cn/rank/index/brand/free/country/cn/genre/36/device/iphone

The great thing is you can export directly, and it includes the id. I only want to look at apps, not games.

# Scraping

scrapy is a Python scraping framework with a long history, simple and easy to use.
Official site: https://scrapy.org
Getting started: https://docs.scrapy.org/en/latest/intro/tutorial.html

After finishing the getting-started guide you can get going right away.

Using the id, construct each app's App Store URL,
https://itunes.apple.com/cn/app/id1142110895
and scrape out all the version records.

https://github.com/everettjf/chatterbox/tree/master/spider/data/20190213/appinfo

![](/media/15500757845904.jpg)

![](/media/15500757964452.jpg)


# Analysis

Once you have the data, everything is easy. Write a few scripts.

https://github.com/everettjf/chatterbox/blob/master/spider/rank.py

This script provides four sorting methods:

```
python rank.py version-count data/20190213/appinfo
python rank.py days-per-version data/20190213/appinfo
python rank.py days-per-version-last-6-month data/20190213/appinfo
python rank.py emergency-release-count data/20190213/appinfo
```

## Number of Releases

From the results we learn that the App Store keeps at most 25 version records.
![](/media/15500763017603.jpg)

## Average Days per Version

Counting all version records, how many days per version (the average interval between versions in days).
It seems the release cycles really are quite short — Xiaohongshu 4 days, Pinduoduo 5 days, Kuaishou 6 days, Zhihu 7 days, etc. My compatriots must be working hard.
Alipay 27 days, WeChat 21 days, Taobao 20 days, Didi 11 days, Xianyu 13 days.

![](/media/15500765126911.jpg)

## Average Days per Version Over the Past 6 Months

Many apps are at 7-8 days per version.

![](/media/15500767020644.jpg)

## Emergency Releases

If we count an interval of <=1 day between two releases, we can find the number of emergency releases across all recorded version records.

Kuaishou, Sogou Input Method, and Outlook all had 3-5 emergency releases.


![](/media/15500769306033.jpg)




# Summary

The rhythms of different apps really do vary quite a lot~

So who is the Version God...

The scraping code is at
https://github.com/everettjf/chatterbox

The data can be found at
https://github.com/everettjf/chatterbox/tree/master/spider/result

---

Yeah, interesting :)

Welcome to follow the official account "Client Tech Review":
![](/images/fun.png)


<!--ZH-->

从App的发版周期些许可以看到App背后团队的运作状态，也些许体现了团队对App质量、用户体验的把控程度。那么本文带领大家一起看看那些“优秀”的App的发版情况。


<!-- more -->

# 数据

## 版本记录

苹果AppStore网站可以获取到App的历史版本发布记录。例如抖音：
https://itunes.apple.com/cn/app/id1142110895

![](/media/15500700541354.jpg)

## Top App

“优秀”的App自然是排名靠前的App，艾瑞指数提供了一个排名，但无法方便的获取到对应的AppStore的链接（上面链接中的id）。
七麦数据提供了”App榜单“，那么我们就看下”中国 App Store 免费榜“上的App的版本发布周期。链接如下：

https://www.qimai.cn/rank/index/brand/free/country/cn/genre/36/device/iphone

给力的是可以直接导出，而且包含id。我只想看应用，不看游戏。

# 爬虫

scrapy是一个Python的爬虫框架，历史悠久，简单易用。
官网： https://scrapy.org
入门： https://docs.scrapy.org/en/latest/intro/tutorial.html

看完入门就可以立即上手了。

通过id构造出每个App的App Store网址，
https://itunes.apple.com/cn/app/id1142110895
爬出所有的版本记录。

https://github.com/everettjf/chatterbox/tree/master/spider/data/20190213/appinfo

![](/media/15500757845904.jpg)

![](/media/15500757964452.jpg)


# 分析

有了数据，那一切都好说了。写点脚本。

https://github.com/everettjf/chatterbox/blob/master/spider/rank.py

这个脚本提供了四种排序方法：

```
python rank.py version-count data/20190213/appinfo
python rank.py days-per-version data/20190213/appinfo
python rank.py days-per-version-last-6-month data/20190213/appinfo
python rank.py emergency-release-count data/20190213/appinfo
```

## 发版次数

从结果可知，AppStore上最多保留25个版本记录。
![](/media/15500763017603.jpg)

## 平均多少天发一个版本

把所有版本记录都计算在内，多少天发一个版本（版本间平均间隔多少天）
看来发版本的周期还真挺短的，小红书4天、拼多多5天、快手6天、知乎7天等等，想必同胞们很辛苦。
支付宝27天、微信21天、淘宝20天、滴滴11天、闲鱼13天。

![](/media/15500765126911.jpg)

## 过去6个月平均多少天发一个版本

很多App在7、8天一个版本。

![](/media/15500767020644.jpg)

## 紧急发版本


如果以两次发版本间隔<=1天来计算，在所有记录的版本记录中查找紧急发版本的次数。

快手、搜狗输入法、Outlook 都有3-5次的紧急发版本。


![](/media/15500769306033.jpg)




# 总结

不同App的节奏还真是差别挺大～

那么谁是版本帝……

爬虫代码见
https://github.com/everettjf/chatterbox

数据可见
https://github.com/everettjf/chatterbox/tree/master/spider/result

---

嗯，有趣 :)

欢迎关注订阅号「客户端技术评论」：
![](/images/fun.png)

