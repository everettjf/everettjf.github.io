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

大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.jpg)