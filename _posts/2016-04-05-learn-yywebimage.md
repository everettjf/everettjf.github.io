---
layout: post
title: YYWebImage note
categories: Skill
comments: true
---





# Basic Information
 - Name : YYWebImage
 - Site : <https://github.com/ibireme/YYWebImage>
 - Repo : <https://github.com/ibireme/YYWebImage>
 - Revision : c97ef715462aa8f94ecaa55564aa4514cc39ae89
 - Description : 
YYKit 组件之一。新出炉的WebImage。

<!-- more -->

# Global Note


# File Notes

## 0. YYImageCache.m

 - Path : /YYWebImage/YYImageCache.m
 - Line : 47 - 55
 - Note : 

``` c
- (NSUInteger)imageCost:(UIImage *)image {
    CGImageRef cgImage = image.CGImage;
    if (!cgImage) return 1;
    CGFloat height = CGImageGetHeight(cgImage);
    size_t bytesPerRow = CGImageGetBytesPerRow(cgImage);
    NSUInteger cost = bytesPerRow * height;
    if (cost == 0) cost = 1;
    return cost;
}
```


CGImageGetHeight 和 CGImageGetBytesPerRow。


## 1. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 27 - 41
 - Note : 

``` c

/// Returns nil in App Extension.
static UIApplication *_YYSharedApplication() {
    static BOOL isAppExtension = NO;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class cls = NSClassFromString(@"UIApplication");
        if(!cls || ![cls respondsToSelector:@selector(sharedApplication)]) isAppExtension = YES;
        if ([[[NSBundle mainBundle] bundlePath] hasSuffix:@".appex"]) isAppExtension = YES;
    });
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"
    return isAppExtension ? nil : [UIApplication performSelector:@selector(sharedApplication)];
#pragma clang diagnostic pop
}
```


appex : Share Extension 。 iOS8 新增功能。


## 2. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 71 - 89
 - Note : 

``` c
static NSMutableSet *URLBlacklist;
static dispatch_semaphore_t URLBlacklistLock;

static void URLBlacklistInit() {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        URLBlacklist = [NSMutableSet new];
        URLBlacklistLock = dispatch_semaphore_create(1);
    });
}

static BOOL URLBlackListContains(NSURL *url) {
    if (!url || url == (id)[NSNull null]) return NO;
    URLBlacklistInit();
    dispatch_semaphore_wait(URLBlacklistLock, DISPATCH_TIME_FOREVER);
    BOOL contains = [URLBlacklist containsObject:url];
    dispatch_semaphore_signal(URLBlacklistLock);
    return contains;
}
```


dispatch_semaphore_xxx 系列。这里竟然用了静态变量。不过文件内有效，无所谓了。


## 3. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 100 - 159
 - Note : 

``` c
/// A proxy used to hold a weak object.
@interface _YYWebImageWeakProxy : NSProxy
@property (nonatomic, weak, readonly) id target;
- (instancetype)initWithTarget:(id)target;
+ (instancetype)proxyWithTarget:(id)target;
@end

@implementation _YYWebImageWeakProxy
- (instancetype)initWithTarget:(id)target {
    _target = target;
    return self;
}
+ (instancetype)proxyWithTarget:(id)target {
    return [[_YYWebImageWeakProxy alloc] initWithTarget:target];
}
- (id)forwardingTargetForSelector:(SEL)selector {
    return _target;
}
- (void)forwardInvocation:(NSInvocation *)invocation {
    void *null = NULL;
    [invocation setReturnValue:&null];
}
- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector {
    return [NSObject instanceMethodSignatureForSelector:@selector(init)];
}
- (BOOL)respondsToSelector:(SEL)aSelector {
    return [_target respondsToSelector:aSelector];
}
- (BOOL)isEqual:(id)object {
    return [_target isEqual:object];
}
- (NSUInteger)hash {
    return [_target hash];
}
- (Class)superclass {
    return [_target superclass];
}
- (Class)class {
    return [_target class];
}
- (BOOL)isKindOfClass:(Class)aClass {
    return [_target isKindOfClass:aClass];
}
- (BOOL)isMemberOfClass:(Class)aClass {
    return [_target isMemberOfClass:aClass];
}
- (BOOL)conformsToProtocol:(Protocol *)aProtocol {
    return [_target conformsToProtocol:aProtocol];
}
- (BOOL)isProxy {
    return YES;
}
- (NSString *)description {
    return [_target description];
}
- (NSString *)debugDescription {
    return [_target debugDescription];
}
@end
```


NSProxy 协议，实现了NSObject协议


## 4. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 190 - 198
 - Note : 

``` c
/// Network thread entry point.
+ (void)_networkThreadMain:(id)object {
    @autoreleasepool {
        [[NSThread currentThread] setName:@"com.ibireme.webimage.request"];
        NSRunLoop *runLoop = [NSRunLoop currentRunLoop];
        [runLoop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];
        [runLoop run];
    }
}
```


网络线程。 给NSURLConnection使用的。


## 5. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 214 - 240
 - Note : 

``` c
/// Global image queue, used for image reading and decoding.
+ (dispatch_queue_t)_imageQueue {
    #define MAX_QUEUE_COUNT 16
    static int queueCount;
    static dispatch_queue_t queues[MAX_QUEUE_COUNT];
    static dispatch_once_t onceToken;
    static int32_t counter = 0;
    dispatch_once(&onceToken, ^{
        queueCount = (int)[NSProcessInfo processInfo].activeProcessorCount;
        queueCount = queueCount < 1 ? 1 : queueCount > MAX_QUEUE_COUNT ? MAX_QUEUE_COUNT : queueCount;
        if ([UIDevice currentDevice].systemVersion.floatValue >= 8.0) {
            for (NSUInteger i = 0; i < queueCount; i++) {
                dispatch_queue_attr_t attr = dispatch_queue_attr_make_with_qos_class(DISPATCH_QUEUE_SERIAL, QOS_CLASS_UTILITY, 0);
                queues[i] = dispatch_queue_create("com.ibireme.image.decode", attr);
            }
        } else {
            for (NSUInteger i = 0; i < queueCount; i++) {
                queues[i] = dispatch_queue_create("com.ibireme.image.decode", DISPATCH_QUEUE_SERIAL);
                dispatch_set_target_queue(queues[i], dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0));
            }
        }
    });
    int32_t cur = OSAtomicIncrement32(&counter);
    if (cur < 0) cur = -cur;
    return queues[(cur) % queueCount];
    #undef MAX_QUEUE_COUNT
}
```


iOS 8 以下使用dispatch_set_target_queue设置优先级。

创建活跃处理器个数的队列。并逐个选取队列。

    int32_t cur = OSAtomicIncrement32(&counter); 原子增。


## 6. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 341 - 341
 - Note : 

``` c
                        [self performSelector:@selector(_startRequest:) onThread:[self.class _networkThread] withObject:nil waitUntilDone:NO];
```


在指定的线程上发起请求。


## 7. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 366 - 371
 - Note : 

``` c
        if (_request.URL.isFileURL) {
            NSArray *keys = @[NSURLFileSizeKey];
            NSDictionary *attr = [_request.URL resourceValuesForKeys:keys error:nil];
            NSNumber *fileSize = attr[NSURLFileSizeKey];
            _expectedSize = fileSize ? fileSize.unsignedIntegerValue : -1;
        }
```


预估文件大小。

还可以这么判断file url？网络上的url如何判断呢？


## 8. YYWebImageOperation.m

 - Path : /YYWebImage/YYWebImageOperation.m
 - Line : 516 - 532
 - Note : 

``` c
- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    @autoreleasepool {
        [_lock lock];
        BOOL canceled = [self isCancelled];
        [_lock unlock];
        if (canceled) return;
        
        if (data) [_data appendData:data];
        if (_progress) {
            [_lock lock];
            if (![self isCancelled]) {
                _progress(_data.length, _expectedSize);
            }
            [_lock unlock];
        }
        
        /*--------------------------- progressive ----------------------------*/
```


这里的progressive判断较多。实现还是比较精简。


## 9. YYWebImageManager.m

 - Path : /YYWebImage/YYWebImageManager.m
 - Line : 132 - 164
 - Note : 

``` c
+ (void)_delaySetActivity:(NSTimer *)timer {
    UIApplication *app = _YYSharedApplication();
    if (!app) return;
    
    NSNumber *visiable = timer.userInfo;
    if (app.networkActivityIndicatorVisible != visiable.boolValue) {
        [app setNetworkActivityIndicatorVisible:visiable.boolValue];
    }
    [timer invalidate];
}

+ (void)_changeNetworkActivityCount:(NSInteger)delta {
    if (!_YYSharedApplication()) return;
    
    void (^block)() = ^{
        _YYWebImageApplicationNetworkIndicatorInfo *info = [self _networkIndicatorInfo];
        if (!info) {
            info = [_YYWebImageApplicationNetworkIndicatorInfo new];
            [self _setNetworkIndicatorInfo:info];
        }
        NSInteger count = info.count;
        count += delta;
        info.count = count;
        [info.timer invalidate];
        info.timer = [NSTimer timerWithTimeInterval:kNetworkIndicatorDelay target:self selector:@selector(_delaySetActivity:) userInfo:@(info.count > 0) repeats:NO];
        [[NSRunLoop mainRunLoop] addTimer:info.timer forMode:NSRunLoopCommonModes];
    };
    if ([NSThread isMainThread]) {
        block();
    } else {
        dispatch_async(dispatch_get_main_queue(), block);
    }
}
```


可控制是否显示网络活动的标记。status bar中的网络indicator 。


## 10. YYImage.m

 - Path : /YYWebImage/Image/YYImage.m
 - Line : 57 - 84
 - Note : 

``` c
/**
 Return the path scale.
 
 e.g.
 <table>
 <tr><th>Path            </th><th>Scale </th></tr>
 <tr><td>"icon.png"      </td><td>1     </td></tr>
 <tr><td>"icon@2x.png"   </td><td>2     </td></tr>
 <tr><td>"icon@2.5x.png" </td><td>2.5   </td></tr>
 <tr><td>"icon@2x"       </td><td>1     </td></tr>
 <tr><td>"icon@2x..png"  </td><td>1     </td></tr>
 <tr><td>"icon@2x.png/"  </td><td>1     </td></tr>
 </table>
 */
static CGFloat _NSStringPathScale(NSString *string) {
    if (string.length == 0 || [string hasSuffix:@"/"]) return 1;
    NSString *name = string.stringByDeletingPathExtension;
    __block CGFloat scale = 1;
    
    NSRegularExpression *pattern = [NSRegularExpression regularExpressionWithPattern:@"@[0-9]+\\.?[0-9]*x$" options:NSRegularExpressionAnchorsMatchLines error:nil];
    [pattern enumerateMatchesInString:name options:kNilOptions range:NSMakeRange(0, name.length) usingBlock:^(NSTextCheckingResult *result, NSMatchingFlags flags, BOOL *stop) {
        if (result.range.location >= 3) {
            scale = [string substringWithRange:NSMakeRange(result.range.location + 1, result.range.length - 2)].doubleValue;
        }
    }];
    
    return scale;
}
```


从文件名获取scale


## 11. YYSpriteSheetImage.h

 - Path : /YYWebImage/Image/YYSpriteSheetImage.h
 - Line : 66 - 66
 - Note : 

``` c
@interface YYSpriteSheetImage : UIImage <YYAnimatedImage>
```


播放精灵动画，不错。


## 12. YYFrameImage.h

 - Path : /YYWebImage/Image/YYFrameImage.h
 - Line : 39 - 39
 - Note : 

``` c
@interface YYFrameImage : UIImage <YYAnimatedImage>
```


序列帧动画


## 13. YYImageCoder.m

 - Path : /YYWebImage/Image/YYImageCoder.m
 - Line : 1 - 1
 - Note : 

``` c
//
```


这个文件2k多行代码……细啊


## 14. UIImage+YYWebImage.m

 - Path : /YYWebImage/Categories/UIImage+YYWebImage.m
 - Line : 243 - 254
 - Note : 

``` c

+ (UIImage *)yy_imageWithColor:(UIColor *)color size:(CGSize)size {
    if (!color || size.width <= 0 || size.height <= 0) return nil;
    CGRect rect = CGRectMake(0.0f, 0.0f, size.width, size.height);
    UIGraphicsBeginImageContextWithOptions(rect.size, NO, 0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, color.CGColor);
    CGContextFillRect(context, rect);
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}
```


获取一个纯色的图片


## 15. UIImageView+YYWebImage.m

 - Path : /YYWebImage/Categories/UIImageView+YYWebImage.m
 - Line : 102 - 107
 - Note : 

``` c
    _YYWebImageSetter *setter = objc_getAssociatedObject(self, &_YYWebImageSetterKey);
    if (!setter) {
        setter = [_YYWebImageSetter new];
        objc_setAssociatedObject(self, &_YYWebImageSetterKey, setter, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    int32_t sentinel = [setter cancelWithNewURL:imageURL];
```


这个setter写法不错。先取消当前ImageView正在执行的operation。


## 16. _YYWebImageSetter.h

 - Path : /YYWebImage/Categories/_YYWebImageSetter.h
 - Line : 25 - 31
 - Note : 

``` c
static inline void _yy_dispatch_sync_on_main_queue(void (^block)()) {
    if (pthread_main_np()) {
        block();
    } else {
        dispatch_sync(dispatch_get_main_queue(), block);
    }
}
```


确保主线程sync


## 17. _YYWebImageSetter.m

 - Path : /YYWebImage/Categories/_YYWebImageSetter.m
 - Line : 80 - 91
 - Note : 

``` c
- (int32_t)cancelWithNewURL:(NSURL *)imageURL {
    int32_t sentinel;
    dispatch_semaphore_wait(_lock, DISPATCH_TIME_FOREVER);
    if (_operation) {
        [_operation cancel];
        _operation = nil;
    }
    _imageURL = imageURL;
    sentinel = OSAtomicIncrement32(&_sentinel);
    dispatch_semaphore_signal(_lock);
    return sentinel;
}
```


返回一个哨兵数字


## 18. _YYWebImageSetter.m

 - Path : /YYWebImage/Categories/_YYWebImageSetter.m
 - Line : 64 - 73
 - Note : 

``` c
    dispatch_semaphore_wait(_lock, DISPATCH_TIME_FOREVER);
    if (sentinel == _sentinel) {
        if (_operation) [_operation cancel];
        _operation = operation;
        sentinel = OSAtomicIncrement32(&_sentinel);
    } else {
        [operation cancel];
    }
    dispatch_semaphore_signal(_lock);
    return sentinel;
```


判断哨兵数字是否变化


## 19. UIImageView+YYWebImage.m

 - Path : /YYWebImage/Categories/UIImageView+YYWebImage.m
 - Line : 180 - 180
 - Note : 

``` c
            newSentinel = [setter setOperationWithSentinel:sentinel url:imageURL options:options manager:manager progress:_progress transform:transform completion:_completion];
```


把sentinel传入。表示当前操作。


## 20. _YYWebImageSetter.m

 - Path : /YYWebImage/Categories/_YYWebImageSetter.m
 - Line : 46 - 56
 - Note : 

``` c
- (int32_t)setOperationWithSentinel:(int32_t)sentinel
                                url:(NSURL *)imageURL
                            options:(YYWebImageOptions)options
                            manager:(YYWebImageManager *)manager
                           progress:(YYWebImageProgressBlock)progress
                          transform:(YYWebImageTransformBlock)transform
                         completion:(YYWebImageCompletionBlock)completion {
    if (sentinel != _sentinel) {
        if (completion) completion(nil, imageURL, YYWebImageFromNone, YYWebImageStageCancelled, nil);
        return _sentinel;
    }
```


如果传入的哨兵不是之前的哨兵，则说明重复调用了。



# Summarize




---
*Generated by [XSourceNote](https://github.com/everettjf/XSourceNote) at 2016-04-04 16:06:27 +0000*


