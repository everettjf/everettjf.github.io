---
layout: post
title: In-App Purchase一个坑和一个未解答问题
categories: Skill
comments: true
---






# 背景

产品类似QQ，有QQ币。必须集成In-App Purchase, 怎么解释都不行。

# 坑

- 当创建的产品被拒绝时，SKProduct 的 localizeTitle是nil。这多数情况足够让程序崩溃。
<!-- more -->

# 小经验

- 产品的语言描述，不要出现价格（价格要从price中获取）。详细描述要写的详细一些，进入App后，从哪里点击能进入到购买页面，点击哪个按钮可以购买当前产品，购买后效果如何。
- 苹果的产品审核与App审核是不同的人。
- 苹果的电话通知与产品或App审核是不同的人。
- 苹果的电话通知是用中文。
- 苹果会拿iPad测试iPhone的App。
- 由于产品被拒绝后，localizeTitle为nil导致程序崩溃，苹果审核人员是不知道这个原因的，他们只会说测试过很多设备，总是崩溃，崩溃的程序是不能通过审核的。
- 提交审核的电话一定要正确，苹果是会打电话的。

# 还未找到明确解答的问题

多账号App的IAP支付失败的一种情况的处理。
见这两个提问：

- http://stackoverflow.com/questions/34872020/apple-in-app-purchase-how-to-detect-the-owner-of-the-payment-in-an-multi-user
- https://segmentfault.com/q/1010000004320362

*有时间找到解决办法后，再补充到这里*

# 服务端小经验

- Apple服务器验证凭据返回的信息是可靠的，可以从这里获取购买的产品ID、数量、价格等。
- 如果为了更安全，可以与客户端上传的再比较一次。
- 凭据中有可能包含多个产品。（可能上次有网络异常等问题，导致凭据中包含多个产品）。
- 服务端要仔细看文档，验证凭据返回的json中有的字段是数组（array）。


