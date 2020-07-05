---
layout: post
title: "重定向标准输出"
categories:
  - stdout
tags:
  - redirect
  - stdout
  - stderr
comments: true
---

看到一处代码挺有意思，iOS项目中把printf打印的内容重定向到了UITextView中。

<!-- more -->

代码抽出来后，挺简单。



```
#include <stdlib.h>
#include <stdio.h>

static print_cbk_t gPrintFunc;

static int stdout_redirect(void* prefix, const char* buffer, int size)
{
    if (gPrintFunc)
        gPrintFunc(buffer, size);
    return size;
}

void set_redirect_output(print_cbk_t f)
{
    gPrintFunc = f;

    setvbuf(stdout, 0, _IOLBF, 0); // stdout: line-buffered
    setvbuf(stderr, 0, _IONBF, 0); // stderr: unbuffered

    stdout->_write = stdout_redirect;
    stderr->_write = stdout_redirect;
}

```

然后在ViewController中类似如下使用：


```

static UITextView *sTextView = nil;

static void current_output(const char* buff, int len) {
    NSString *text = [sTextView text];
    text = [text stringByAppendingFormat:@"%s",buff];
    [sTextView setText:text];
}

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextView *textView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    sTextView = self.textView;
    
    set_redirect_output(current_output);
        
    printf("hello\n");
    printf("hello\n");
    printf("hello\n");
    printf("hello\n");

}
@end
```


运行后，printf就到了UITextView中。


![](/media/15832504339122.jpg)




原理似乎也没啥可讲的，本身c库就提供支持。

```
    setvbuf(stdout, 0, _IOLBF, 0); // stdout: line-buffered
    setvbuf(stderr, 0, _IONBF, 0); // stderr: unbuffered
```

然后这两个函数把标准输出设置为“按行缓冲”和“不缓冲”。也就是进入stdout和stderr的内容都按行或直接输出。这样UITextView就接收到的比较及时了。


---

水文写起来就是轻松愉快啊~ 有趣就好~

---

大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.jpg)