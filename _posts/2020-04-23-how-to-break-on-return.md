---
layout: post
title: "How to Breakpoint at Function's return"
tags:
  - lldb
  - debugging
  - breakpoint
  - iOS
  - return

comments: true
---

Has a complex function with many code lines, internally has many returns, step debugging very slow, how to quickly find which line returned?

<!-- more -->

For example code:

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

Assume foo is a very long complex function with many returns, how to know which line returned?

Can use lldb's breakpoint

```
breakpoint set -p return
or
br set -p return
```

First add breakpoint at foo's first line

![](/media/15875739886610.jpg)

After breakpoint triggers, console input `br set -p return`
![](/media/15875740456070.jpg)

Then continue, will breakpoint at function's return line.

![](/media/15875741244090.jpg)


Very interesting~

---

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)
