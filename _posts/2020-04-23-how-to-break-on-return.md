---
layout: post
title: "如何断点到函数的return"
categories:
  - lldb
tags:
  - lldb
  - return
  - breakpoint
comments: true
---

昨天群友问了个问题：有一个代码行很多的复杂函数，内部有很多return，单步调试很慢，如何快速找到哪一行return了？

<!-- more -->

例如代码：

```
void foo() {
    int i = arc4random() %100;
    
    if (i > 30) {
        if (i < 40) {
            return;
        }
        if (i > 77) {
            return;
        }
        if (i < 66) {
            return;
        }
    }
    
    switch (i) {
        case 0:
            return;
        case 1:
            return;
        case 2:
            return;
        case 3:
            return;
        case 4:
            return;
        default:
            return;
    }
}

int main(int argc, const char * argv[]) {
    foo();
    return 0;
}

```

假设foo是个很长很复杂有很多return的函数，如何知道是通过哪一行return的呢？

可以使用lldb的断点

```
breakpoint set -p return
或者
br set -p return
```

首先在foo第一行加断点

![](/media/15875739886610.jpg)

断点触发后，控制台输入 `br set -p return`
![](/media/15875740456070.jpg)

然后continue，就会断点到函数return的那一行了。

![](/media/15875741244090.jpg)


很有趣~

---

一个人探索这些偏底层的技术细节，独乐乐不如众乐乐，大家一起探索一起交流。创建了一个群，群内已经有450多位盆友，氛围还不错。如需加入，加我微信 everettjf，备注：加群。（群马上500人了，接下来怎么办...)

抖音基础技术团队 iOS HC 开放啦。初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ），`北京、深圳`可以直接来我的部门，`上海`可以推荐到同事部门。工作内容就是`iOS 抖音、TikTok 的架构、性能、稳定性等方方面面`的工作。

