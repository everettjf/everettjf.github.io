---
layout: post
title: "os_signpost API Introduction"
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---

os_signpost API is a lightweight code performance analysis tool newly added in iOS12, can collect data and visualize. Official words are The os_signpost APIs let clients add lightweight instrumentation to code for collection and visualization by performance analysis tooling.


<!-- more -->

# Background

Code-level performance analysis, most intuitive way is to mark start and end of a code segment, then calculate time consumption. Like below:

```
    CFTimeInterval begin = CACurrentMediaTime();
    // do something
    CFTimeInterval end = CACurrentMediaTime();
    NSLog(@"cost = %@",(end - begin));
```

However if code logic is complex, has sequential relationships, exists multiple threads, etc., just marking a small code segment is not so intuitive.

Thus AppleTrace (https://github.com/everettjf/AppleTrace) was born, or catapult (https://github.com/catapult-project/catapult), or Chrome's built-in chrome://tracing functionality. Below is AppleTrace example.

![](/media/15341742547529.jpg)

iOS12 Apple team paying more attention to performance also discovered importance of intuitive display (better experience), developed os_signpost API. First encountered this API from WWDC: Measuring Performance Using Logging <https://developer.apple.com/videos/play/wwdc2018/405>, recommend watching. os_signpost API can work with Instruments tool, display visualization effects.

Below is simple first look, finally can see this effect:

![](/media/15341765204665.jpg)


# Environment

Need Xcode10 beta version, currently when writing this article, latest version is:
![](/media/15341739659116.jpg)


# First Look

*This article only introduces C usage method, swift is similar and WWDC uses swift language to explain.*

First include header file

```
#include <os/signpost.h>
```

Code is simple, three steps, as below:

```
    // Step one, create a log object
    os_log_t log = os_log_create("com.everettjf.sample.signpost", "hellosignpost");
    
    // Create os_signpost ID
    os_signpost_id_t spid = os_signpost_id_generate(log);
    
    // Mark start and end
    os_signpost_interval_begin(log, spid, "task");
    doSomethingShort();
    os_signpost_interval_end(log, spid, "task");
```


Open Instruments, can choose an empty template.

![](/media/15341751377471.jpg)

Then click top right add, find os_signpost.

![](/media/15341752218903.jpg)

Drag to left,

![](/media/15341752615381.jpg)

Click top left red circle (Start) can see below.

![](/media/15341750449814.jpg)


# API Explanation

- os_log_create first parameter is reverse DNS format ID, second parameter is category (Category below in figure above). Can create different log objects, display different Categories in figure above.
- os_signpost_id_generate generates an ID. Similar methods are os_signpost_id_make_with_id and os_signpost_id_make_with_pointer, mainly for identifying matching relationship of a start and end.
- os_signpost_interval_begin and os_signpost_interval_end mark start and end. Third parameter is name given to this period. Fourth parameter onwards are printf-like format parameters.


# More First Look

Below more complex, use this code:

```
    
    os_log_t log = os_log_create("com.everettjf.sample.signpost", "thread");
    os_signpost_id_t spid = os_signpost_id_generate(log);
    
    dispatch_queue_t queue1 = dispatch_queue_create("com.everettjf.test1", DISPATCH_QUEUE_SERIAL);
    dispatch_queue_t queue2 = dispatch_queue_create("com.everettjf.test2", DISPATCH_QUEUE_SERIAL);
    
    for(int i = 0; i < 10; i++){
        dispatch_async(queue1, ^{
            doSomethingOther();
            os_signpost_interval_begin(log, spid, "task", "infobegin%d", i);
            doSomethingShort();
            os_signpost_interval_end(log, spid, "task","infoend%d",i);
        });
        
        dispatch_async(queue2, ^{
            doSomethingOther();
            os_signpost_interval_begin(log, spid, "task2","info");
            doSomethingLong();
            os_signpost_interval_end(log, spid, "task2");
        });
    }
    
```

Can see this.

![](/media/15341756915127.jpg)


# Point Of Interest

Can also add some points of interest,

```
    os_log_t loginterest = os_log_create("com.everettjf.sample.signpost", OS_LOG_CATEGORY_POINTS_OF_INTEREST);
    os_signpost_id_t spidinterest = os_signpost_id_generate(loginterest);
    
    //...
    
    os_signpost_event_emit(loginterest, spidinterest, "alive");
```

As Points below.

![](/media/15341766999075.jpg)


# Code

Code reference: <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/SignPostSample/SignPostSample/AppDelegate.m>

# Summary

First look, relax, quite fun, os_signpost API will definitely be good partner for performance analysts in future.

Future with dark theme, really cool.

![](/media/15341777359950.jpg)

Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)


