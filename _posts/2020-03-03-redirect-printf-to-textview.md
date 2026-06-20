---
layout: post
title: "Redirecting iOS Standard Output to a UITextView"
title_zh: "将 iOS 标准输出重定向到 UITextView"
lang_original: zh
categories:
  - stdout
tags:
  - redirect
  - stdout
  - stderr
comments: true
---

I came across a pretty interesting piece of code: an iOS project that redirects the content printed by printf into a UITextView.

<!-- more -->

After extracting the code, it's actually quite simple.



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

Then you use it in the ViewController roughly like this:


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


After running it, printf output goes into the UITextView.


![](/media/15832504339122.jpg){:width="329" height="144"}




There's really not much to explain about how it works — the C library provides the support itself.

```
    setvbuf(stdout, 0, _IOLBF, 0); // stdout: line-buffered
    setvbuf(stderr, 0, _IONBF, 0); // stderr: unbuffered
```


These two functions set standard output to "line-buffered" and "unbuffered" respectively. In other words, content going into stdout and stderr is output either by line or directly. This way the UITextView receives it in a more timely manner.


---

Writing fluff pieces is just relaxing and fun~ As long as it's interesting~

---

If you like it, follow the official account to show your support:

![](/images/fun.png)

<!--ZH-->


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


![](/media/15832504339122.jpg){:width="329" height="144"}




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

![](/images/fun.png)