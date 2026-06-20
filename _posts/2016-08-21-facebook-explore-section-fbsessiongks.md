---
layout: post
title: "Exploring Facebook's iOS Client - The FBSessionGKs Section"
title_zh: "探索 Facebook iOS 客户端 - Section FBSessionGKs"
lang_original: zh
categories: Skill
comments: true
---
 



---
 
# Observation
 
 Viewing Facebook's executable with MachOView, I found the FBInjectable and fbsessiongks data sections. This article explores the creation and purpose of the fbsessiongks data section.
 
![](/media/14717181531082.jpg)
<!-- more -->


# Creation

Refer to the previous article about FBInjectable.


# Initial Exploration

Part of fbsessiongks's content is as follows:

```
@["ios_share_extension_hashtags_enabled","ios_share_extension_mentions_disabled","ios_share_extension_360_upload_enabled","ios_share_extension_delegate_cleanup","ios_hemingway_limit_sections","aldrin_qr_code_experiment","ios_set_badge_count_on_init","ios_side_feed_show_newsfeed_units_gk","fb_app_zero_rating","fb_app_zero_rating_bad_url_errors","ios_zero_rating_header_request","ios_checkpoints_logged_in_blocking","uber_app_integration","nearby_friends_self_view","ios_nearby_friends_dashboard_invite","ios_nf_replace_pls_with_message","ios_nearby_friends_profile_style","nearby_friends_dashboard_checkins_hometown","nearby_friends_self_view","ios_nearby_friends_dashboard_reaction","ios_friends_nearby_bookmark_alert","ios_friends_nearby_bookmark_upsell","ios_nearby_friends_inv
....省略...

```


# Simple Conclusion

Experimental feature switches. gks is short for Gate Keepers. Used to assist testing.

A Facebook engineer mentioned Gate Keepers: (search the article for gate keeper)
<https://www.facebook.com/notes/facebook-engineering/building-and-testing-at-facebook/10151004157328920/>

Unlike FBInjectable, the features here are all experimental and are all just BOOL types (FBInjectable has concrete configuration features and can provide detailed parameter values). There's a dedicated FBExperimentManager class to manage, collect statistics, and report various logs.


# Related Methods

```
void * +[FBFeatureGatingConfigFactory applicationSpecificFeatureGatingConfig](void * self, void * _cmd) {

+[FBExperimentGatekeepers allSessionGatekeeperKeys]
+[FBExperimentManager _getSupportedConfigurationsFromPolicy:]:
-[FBExperimentManager initWithPolicy:experimentDiskFetcher:jsonOverrides:mobileConfigContextManager:]:
```

# Summary

**The specific exploration process is similar to the previous article [Exploring Facebook's iOS Client - The FBInjectable Section](https://everettjf.github.io/2016/08/15/facebook-explore-section-fbinjectable)**

**I'll add a Demo when I have time.**


<!--ZH-->
 



---
 
# 现象
 
 MachOView查看Facebook的可执行文件，发现 FBInjectable 和 fbsessiongks 的数据段，这篇文章就探索下 fbsessiongks 数据段的产生与用途。
 
![](/media/14717181531082.jpg)
<!-- more -->


# 产生

参考上一篇关于FBInjectable的文章。


# 初步探索

fbsessiongks的部分内容如下：

```
@["ios_share_extension_hashtags_enabled","ios_share_extension_mentions_disabled","ios_share_extension_360_upload_enabled","ios_share_extension_delegate_cleanup","ios_hemingway_limit_sections","aldrin_qr_code_experiment","ios_set_badge_count_on_init","ios_side_feed_show_newsfeed_units_gk","fb_app_zero_rating","fb_app_zero_rating_bad_url_errors","ios_zero_rating_header_request","ios_checkpoints_logged_in_blocking","uber_app_integration","nearby_friends_self_view","ios_nearby_friends_dashboard_invite","ios_nf_replace_pls_with_message","ios_nearby_friends_profile_style","nearby_friends_dashboard_checkins_hometown","nearby_friends_self_view","ios_nearby_friends_dashboard_reaction","ios_friends_nearby_bookmark_alert","ios_friends_nearby_bookmark_upsell","ios_nearby_friends_inv
....省略...

```


# 简单结论

实验性质的功能开关。gks 为 Gate Keepers 缩写。为了辅助测试。

Facebook 员工提到Gate Keepers：（文章中搜索gate keeper）
<https://www.facebook.com/notes/facebook-engineering/building-and-testing-at-facebook/10151004157328920/>

与FBInjectable不同的是，这里的功能都是具有实验性质，且都只是BOOL类型（FBInjectable是有具体的配置功能，可提供详细的参数数值）。有专门的FBExperimentManager类管理、统计、上报各种日志。


# 相关方法

```
void * +[FBFeatureGatingConfigFactory applicationSpecificFeatureGatingConfig](void * self, void * _cmd) {

+[FBExperimentGatekeepers allSessionGatekeeperKeys]
+[FBExperimentManager _getSupportedConfigurationsFromPolicy:]:
-[FBExperimentManager initWithPolicy:experimentDiskFetcher:jsonOverrides:mobileConfigContextManager:]:
```

# 总结

**具体探索过程类似上一篇文章 [探索 Facebook iOS 客户端 - Section FBInjectable](https://everettjf.github.io/2016/08/15/facebook-explore-section-fbinjectable)**

**Demo有时间再补充啦**


