---
layout: post
title: "Redirect Standard Output"
categories:
  - stdout
tags:
  - redirect
  - stdout
  - stderr
comments: true
---

Saw code quite interesting, iOS project redirects printf printed content to UITextView.

<!-- more -->

Code extracted, quite simple.




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

Then in ViewController use similar to below:


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


After running, printf goes to UITextView.


![](/media/15832504339122.jpg)




Principle seems nothing to explain, C library itself provides support.

```
    setvbuf(stdout, 0, _IOLBF, 0); // stdout: line-buffered
    setvbuf(stderr, 0, _IONBF, 0); // stderr: unbuffered
```

Then these two functions set standard output to "line-buffered" and "unbuffered". That is content entering stdout and stderr all output by line or directly. This way UITextView receives more timely.


---

Writing water articles is relaxed and pleasant~ Interesting is good~

---

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)
