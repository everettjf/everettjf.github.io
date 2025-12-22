---
layout: post
title: symbolicatecrash Deadloop Bug
tags:
  - assembly
  - symbol
  - obfuscation
  - C
  - low-level

comments: true
---



# Background

[Wrote an article last year](https://everettjf.github.io/2015/09/09/ios-plcrashreporter), which explained how to use the symbolicatecrash tool to symbolicate crash information.

At that time, based on this method, implemented a small system for automatically symbolizing crash information for the company's product.

- After App gets crash information, packages and uploads to company's crash collection server.
- Python script periodically gets crashes, and finds corresponding version's symbol files on internal Jenkins server.
- Finally after symbolization, aggregates into database.
- Web for convenient querying, aggregated by module, version, stack, etc. Convenient for finding crash causes and tracking crash trends.
<!-- more -->

# Problem

However, there's always been a problem. symbolicatecrash when analyzing certain crashes (about 1/3 of total crashes) will have `CPU 100%, and never finish` situation. (Never finish is a guess, because ran several times overnight, finally had to kill the process). symbolicatecrash is a Perl script, perl process CPU usage stays at 100%.

Guessed it should be this perl script's problem, but searched everywhere and couldn't find results.

Temporary workaround: If crash analysis exceeds 15s, kill this analysis process. [Hence this blog](https://everettjf.github.io/2016/01/29/python27-subprocess-timeout)

However, this solution causes only about 2/3 of crashes to be analyzed. Problem is serious, but endured it.

# Solution

Half a year passed, thought to try solving it again.

Colleague [found an article](http://blog.csdn.net/lucky_06/article/details/48805227
), excitedly tried it immediately. (Article was written in late September, probably right when I gave up searching...)

> This is because xcode's provided symbolicatecrash will deadloop on logs with duplicate images.

## Modify symbolicatecrash File

---

Xcode 7.2 and earlier:
/Applications/Xcode.app/Contents/SharedFrameworks/DTDeviceKitBase.framework/Versions/A/Resources/symbolicatecrash

Xcode 7.3
/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/symbolicatecrash

Reference: <https://forums.developer.apple.com/thread/43489>

---

Replace the following code:

``` perl

                # add ourselves to that chain
                $images{$nextIDKey}{nextID} = $image{base};

                # and store under the key we just recorded
                $bundlename = $bundlename . $image{base};

```

With:

``` perl

            if ($image{uuid} ne $images{$bundlename}{uuid}) {

                # add ourselves to that chain
                $images{$nextIDKey}{nextID} = $image{base};

                # and store under the key we just recorded
                $bundlename = $bundlename . $image{base};
```


And it's solved. Don't know why Apple doesn't fix this issue.       

# Summary

Need the spirit to research thoroughly.
