---
layout: post
title: "谁是App版本帝"
categories:
  - 工具
tags:
  - 工具
  - 娱乐
comments: true
---

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

欢迎关注订阅号《首先很有趣》：
![](/images/fun.jpg)


