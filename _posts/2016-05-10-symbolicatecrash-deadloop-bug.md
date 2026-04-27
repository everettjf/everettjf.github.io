---
layout: post
title: symbolicatecrash deadloop bug
categories: Skill
comments: true
---






# 背景

[去年写过一篇文章](https://everettjf.github.io/2015/09/09/ios-plcrashreporter)，里面讲了如何使用symbolicatecrash工具符号化崩溃信息。

当时基于这个方法，给公司的产品实现了一个自动符号化崩溃信息的小系统。

- App获取崩溃信息后，打包上传到公司收集崩溃的服务器。
- Python脚本定时获取崩溃，并在内网Jenkins服务器上找到对应版本的符号文件。
- 最后符号化后，汇总到数据库中。
- Web方便查询，按模块、版本、堆栈等汇总。方便查找崩溃原因，及跟踪崩溃趋势。
<!-- more -->

# 问题

然而，一直有个问题，symbolicatecrash在分析某些崩溃（大概崩溃总数的1/3）时会出现`CPU 100%，且永远不结束` 的情况。（永远不结束，是猜测，因为跑过好几次一晚上，最后只能结束进程）。symbolicatecrash是Perl脚本，perl进程CPU占用一直100%。

猜测应该是这个perl脚本的问题，但各种搜索竟然没有找到结果。

临时解决办法：分析崩溃超过15s就结束这个分析进程。[也就有了这个博客](https://everettjf.github.io/2016/01/29/python27-subprocess-timeout)

然而这样解决会导致只能分析出大约2/3的崩溃。问题很严重，不过也忍了。

# 解决

这小半年过去了，想来再试着解决下。

同事[发现一篇文章](http://blog.csdn.net/lucky_06/article/details/48805227
) ，激动的马上拿来试试。（文章是9月底写的，大概正好是我放弃查找的时候……）

> 这是由于xcode提供的symbolicatecrash对于重复image的日志会出现死循环。

## 修改symbolicatecrash文件

---

Xcode7.2 及以前：
/Applications/Xcode.app/Contents/SharedFrameworks/DTDeviceKitBase.framework/Versions/A/Resources/symbolicatecrash

Xcode 7.3
/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/symbolicatecrash

参考：<https://forums.developer.apple.com/thread/43489>

---

将以下代码：

``` perl

                # add ourselves to that chain
                $images{$nextIDKey}{nextID} = $image{base};

                # and store under the key we just recorded
                $bundlename = $bundlename . $image{base};

```

替换为：

``` perl

            if ($image{uuid} ne $images{$bundlename}{uuid}) {

                # add ourselves to that chain
                $images{$nextIDKey}{nextID} = $image{base};

                # and store under the key we just recorded
                $bundlename = $bundlename . $image{base};
```


于是就解决了。不知苹果为什么不修改这个问题。       

# 总结

要有钻研到底的精神。
