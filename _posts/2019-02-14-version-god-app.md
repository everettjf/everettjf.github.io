---
layout: post
title: "App Version Comparison Tool"
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---

From App's release cycle can somewhat see App's behind-the-scenes team's operational status, also somewhat reflects team's control over App quality and user experience. Then this article leads everyone to see those "excellent" Apps' release situations.


<!-- more -->

# Data

## Version Records

Apple AppStore website can get App's historical version release records. For example Douyin:
https://itunes.apple.com/cn/app/id1142110895

![](/media/15500700541354.jpg)

## Top App

"Excellent" Apps are naturally top-ranked Apps, iResearch Index provides a ranking, but can't conveniently get corresponding AppStore links (id in link above).
Qimai Data provides "App Rankings", then we look at "China App Store Free Rankings" Apps' version release cycles. Link:

https://www.qimai.cn/rank/index/brand/free/country/cn/genre/36/device/iphone

Great thing is can directly export, and includes id. I only want to see apps, not games.

# Crawler

scrapy is a Python crawler framework, long history, simple and easy to use.
Official site: https://scrapy.org
Getting started: https://docs.scrapy.org/en/latest/intro/tutorial.html

After reading getting started can immediately start.

Through id construct each App's App Store URL,
https://itunes.apple.com/cn/app/id1142110895
Crawl all version records.

https://github.com/everettjf/chatterbox/tree/master/spider/data/20190213/appinfo

![](/media/15500757845904.jpg)

![](/media/15500757964452.jpg)


# Analysis

With data, everything is easy. Write some scripts.

https://github.com/everettjf/chatterbox/blob/master/spider/rank.py

This script provides four sorting methods:

```
python rank.py version-count data/20190213/appinfo
python rank.py days-per-version data/20190213/appinfo
python rank.py days-per-version-last-6-month data/20190213/appinfo
python rank.py emergency-release-count data/20190213/appinfo
```

## Release Count

From results can know, AppStore keeps at most 25 version records.
![](/media/15500763017603.jpg)

## Average Days Per Version

Calculate all version records, how many days per version (average interval between versions in days)
Looks like release cycle is really short, Xiaohongshu 4 days, Pinduoduo 5 days, Kuaishou 6 days, Zhihu 7 days, etc., presumably colleagues work very hard.
Alipay 27 days, WeChat 21 days, Taobao 20 days, Didi 11 days, Xianyu 13 days.

![](/media/15500765126911.jpg)

## Average Days Per Version in Past 6 Months

Many Apps at 7, 8 days per version.

![](/media/15500767020644.jpg)

## Emergency Releases


If calculated as two releases interval <= 1 day, search emergency release count in all recorded version records.

Kuaishou, Sogou Input, Outlook all have 3-5 emergency releases.


![](/media/15500769306033.jpg)




# Summary

Different Apps' rhythms really vary quite a bit～

Then who is the version king...

Crawler code see
https://github.com/everettjf/chatterbox

Data see
https://github.com/everettjf/chatterbox/tree/master/spider/result

---

Hmm, interesting :)

Welcome to follow subscription account "Client Technology Review":
![](/images/fun.png)


