---
layout: post
title: Facebook iOS Client - Section fbsessiongks
categories:
  - iOS Development
tags:
  - iOS
  - development
  - mobile

comments: true
---
---
 
# Phenomenon
 
 MachOView viewing Facebook's executable file, found FBInjectable and fbsessiongks data segments, this article explores fbsessiongks data segment's generation and usage.
 
![](/media/14717181531082.jpg)
<!-- more -->


# Generation

Reference previous article about FBInjectable.


# Initial Exploration

fbsessiongks partial content:

```
@["ios_share_extension_hashtags_enabled","ios_share_extension_mentions_disabled","ios_share_extension_360_upload_enabled","ios_share_extension_delegate_cleanup","ios_hemingway_limit_sections","aldrin_qr_code_experiment","ios_set_badge_count_on_init","ios_side_feed_show_newsfeed_units_gk","fb_app_zero_rating","fb_app_zero_rating_bad_url_errors","ios_zero_rating_header_request","ios_checkpoints_logged_in_blocking","uber_app_integration","nearby_friends_self_view","ios_nearby_friends_dashboard_invite","ios_nf_replace_pls_with_message","ios_nearby_friends_profile_style","nearby_friends_dashboard_checkins_hometown","nearby_friends_self_view","ios_nearby_friends_dashboard_reaction","ios_friends_nearby_bookmark_alert","ios_friends_nearby_bookmark_upsell","ios_nearby_friends_inv
....omitting...

```


# Simple Conclusion

Experimental feature switches. gks is Gate Keepers abbreviation. For testing assistance.

Facebook employee mentions Gate Keepers: (search gate keeper in article)
<https://www.facebook.com/notes/facebook-engineering/building-and-testing-at-facebook/10151004157328920/>

Different from FBInjectable, here features are all experimental, and all are BOOL type (FBInjectable has specific configuration functionality, can provide detailed parameter values). Has dedicated FBExperimentManager class to manage, statistics, report various logs.


# Related Methods

```
void * +[FBFeatureGatingConfigFactory applicationSpecificFeatureGatingConfig](void * self, void * _cmd) {

+[FBExperimentGatekeepers allSessionGatekeeperKeys]
+[FBExperimentManager _getSupportedConfigurationsFromPolicy:]:
-[FBExperimentManager initWithPolicy:experimentDiskFetcher:jsonOverrides:mobileConfigContextManager:]:
```

# Summary

**Specific exploration process similar to previous article [Exploring Facebook iOS Client - Section FBInjectable](https://everettjf.github.io/2016/08/15/facebook-explore-section-fbinjectable)**

**Demo will supplement when there's time**

