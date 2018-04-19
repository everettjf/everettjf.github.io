---
layout: post
title: SDWebImage note
categories: Skill
comments: true
---





# Basic Information
 - Name : SDWebImage
 - Site : <https://github.com/rs/SDWebImage>
 - Repo : <https://github.com/rs/SDWebImage>
 - Revision : 0da78a4ce6485d8d4c23d348d355fabad7c227f3
 - Description : 
经典的、异步下载图片的、带缓存的库

<!-- more -->

# Global Note


# File Notes

## 0. SDWebImageCompat.h

 - Path : /SDWebImage/SDWebImageCompat.h
 - Line : 60 - 72
 - Note : 

``` c
#define dispatch_main_sync_safe(block)\
    if ([NSThread isMainThread]) {\
        block();\
    } else {\
        dispatch_sync(dispatch_get_main_queue(), block);\
    }

#define dispatch_main_async_safe(block)\
    if ([NSThread isMainThread]) {\
        block();\
    } else {\
        dispatch_async(dispatch_get_main_queue(), block);\
    }
```


方便的dispatch_main 保证主线程运行


## 1. SDWebImageDownloader.m

 - Path : /SDWebImage/SDWebImageDownloader.m
 - Line : 33 - 33
 - Note : 

``` c
    if (NSClassFromString(@"SDNetworkActivityIndicator")) {
```


判断某个类是否存在


## 2. SDWebImageDownloader.m

 - Path : /SDWebImage/SDWebImageDownloader.m
 - Line : 35 - 38
 - Note : 

``` c
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
        id activityIndicator = [NSClassFromString(@"SDNetworkActivityIndicator") performSelector:NSSelectorFromString(@"sharedActivityIndicator")];
#pragma clang diagnostic pop
```


动态调用单例方法


## 3. SDWebImageDownloader.m

 - Path : /SDWebImage/SDWebImageDownloader.m
 - Line : 67 - 68
 - Note : 

``` c
        _downloadQueue = [NSOperationQueue new];
        _downloadQueue.maxConcurrentOperationCount = 6;
```


NSOperation相比GCD的优势，可配置并行最大线程数


## 4. SDWebImageDownloader.m

 - Path : /SDWebImage/SDWebImageDownloader.m
 - Line : 111 - 113
 - Note : 

``` c
- (void)setOperationClass:(Class)operationClass {
    _operationClass = operationClass ?: [SDWebImageDownloaderOperation class];
}
```


这么动态配置执行的Class。


## 5. SDWebImageDownloader.m

 - Path : /SDWebImage/SDWebImageDownloader.m
 - Line : 207 - 207
 - Note : 

``` c
    dispatch_barrier_sync(self.barrierQueue, ^{
```


        _barrierQueue = dispatch_queue_create("com.hackemist.SDWebImageDownloaderBarrierQueue", DISPATCH_QUEUE_CONCURRENT);

在并行queue中的很方便的同步方法。


## 6. SDWebImageDownloader.m

 - Path : /SDWebImage/SDWebImageDownloader.m
 - Line : 214 - 224
 - Note : 

``` c
        // Handle single download of simultaneous download request for the same URL
        NSMutableArray *callbacksForURL = self.URLCallbacks[url];
        NSMutableDictionary *callbacks = [NSMutableDictionary new];
        if (progressBlock) callbacks[kProgressCallbackKey] = [progressBlock copy];
        if (completedBlock) callbacks[kCompletedCallbackKey] = [completedBlock copy];
        [callbacksForURL addObject:callbacks];
        self.URLCallbacks[url] = callbacksForURL;

        if (first) {
            createCallback();
        }
```


每个URL对应多个回调地址。可能同时多次请求相同URL地址，避免重复下载。


## 7. SDWebImageDownloader.m

 - Path : /SDWebImage/SDWebImageDownloader.m
 - Line : 187 - 192
 - Note : 

``` c
        [wself.downloadQueue addOperation:operation];
        if (wself.executionOrder == SDWebImageDownloaderLIFOExecutionOrder) {
            // Emulate LIFO execution order by systematically adding new operations as last operation's dependency
            [wself.lastAddedOperation addDependency:operation];
            wself.lastAddedOperation = operation;
        }
```


启动下载。如果是Last In First Out，则把最后一个添加的任务的依赖设置为当前要添加的任务。


## 8. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 33 - 33
 - Note : 

``` c
@property (assign, nonatomic) UIBackgroundTaskIdentifier backgroundTaskId;
```


后台任务ID


## 9. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 77 - 92
 - Note : 

``` c
        Class UIApplicationClass = NSClassFromString(@"UIApplication");
        BOOL hasApplication = UIApplicationClass && [UIApplicationClass respondsToSelector:@selector(sharedApplication)];
        if (hasApplication && [self shouldContinueWhenAppEntersBackground]) {
            __weak __typeof__ (self) wself = self;
            UIApplication * app = [UIApplicationClass performSelector:@selector(sharedApplication)];
            self.backgroundTaskId = [app beginBackgroundTaskWithExpirationHandler:^{
                __strong __typeof (wself) sself = wself;

                if (sself) {
                    [sself cancel];

                    [app endBackgroundTask:sself.backgroundTaskId];
                    sself.backgroundTaskId = UIBackgroundTaskInvalid;
                }
            }];
        }
```


后台，保证任务取消


## 10. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 96 - 96
 - Note : 

``` c
        self.connection = [[NSURLConnection alloc] initWithRequest:self.request delegate:self startImmediately:NO];
```


发起下载操作的NSURLConnection


## 11. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 100 - 123
 - Note : 

``` c
    [self.connection start];

    if (self.connection) {
        if (self.progressBlock) {
            self.progressBlock(0, NSURLResponseUnknownLength);
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName:SDWebImageDownloadStartNotification object:self];
        });

        if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_5_1) {
            // Make sure to run the runloop in our background thread so it can process downloaded data
            // Note: we use a timeout to work around an issue with NSURLConnection cancel under iOS 5
            //       not waking up the runloop, leading to dead threads (see <https://github.com/rs/SDWebImage/issues/466)>
            CFRunLoopRunInMode(kCFRunLoopDefaultMode, 10, false);
        }
        else {
            CFRunLoopRun();
        }

        if (!self.isFinished) {
            [self.connection cancel];
            [self connection:self.connection didFailWithError:[NSError errorWithDomain:NSURLErrorDomain code:NSURLErrorTimedOut userInfo:@{NSURLErrorFailingURLErrorKey : self.request.URL}]];
        }
```


发起下载。NSRunLoopRun()  启动后台线程的runloop。NSURLConnection 依赖RunLoop。

SDWebImage是个古老的库，兼容iOS5.1以下。


## 12. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 155 - 167
 - Note : 

``` c
- (void)cancelInternalAndStop {
    if (self.isFinished) return;
    [self cancelInternal];
    CFRunLoopStop(CFRunLoopGetCurrent());
}

- (void)cancelInternal {
    if (self.isFinished) return;
    [super cancel];
    if (self.cancelBlock) self.cancelBlock();

    if (self.connection) {
        [self.connection cancel];
```


先cancel Connection，然后停止RunLoop。


## 13. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 196 - 200
 - Note : 

``` c
- (void)setFinished:(BOOL)finished {
    [self willChangeValueForKey:@"isFinished"];
    _finished = finished;
    [self didChangeValueForKey:@"isFinished"];
}
```


KVO


## 14. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 213 - 225
 - Note : 

``` c

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    
    //'304 Not Modified' is an exceptional one
    if (![response respondsToSelector:@selector(statusCode)] || ([((NSHTTPURLResponse *)response) statusCode] < 400 && [((NSHTTPURLResponse *)response) statusCode] != 304)) {
        NSInteger expected = response.expectedContentLength > 0 ? (NSInteger)response.expectedContentLength : 0;
        self.expectedSize = expected;
        if (self.progressBlock) {
            self.progressBlock(0, expected);
        }

        self.imageData = [[NSMutableData alloc] initWithCapacity:expected];
        self.response = response;
```


看来有个 304 Not Modified 坑。


## 15. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 231 - 239
 - Note : 

``` c
        NSUInteger code = [((NSHTTPURLResponse *)response) statusCode];
        
        //This is the case when server returns '304 Not Modified'. It means that remote image is not changed.
        //In case of 304 we need just cancel the operation and return cached image from the cache.
        if (code == 304) {
            [self cancelInternal];
        } else {
            [self.connection cancel];
        }
```


304 ,则直接返回缓存中的图片


## 16. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 252 - 253
 - Note : 

``` c
- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    [self.imageData appendData:data];
```


收到数据。self.imageData 是从didReceiveResponse中开辟。


## 17. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 256 - 266
 - Note : 

``` c
        // The following code is from <http://www.cocoaintheshell.com/2011/05/progressive-images-download-imageio/>
        // Thanks to the author @Nyx0uf

        // Get the total bytes downloaded
        const NSInteger totalSize = self.imageData.length;

        // Update the data source, we must pass ALL the data, not just the new bytes
        CGImageSourceRef imageSource = CGImageSourceCreateWithData((__bridge CFDataRef)self.imageData, NULL);

        if (width + height == 0) {
            CFDictionaryRef properties = CGImageSourceCopyPropertiesAtIndex(imageSource, 0, NULL);
```


渐进的加载图片……内存中绘制渐进效果的图片


## 18. SDWebImageDownloaderOperation.m

 - Path : /SDWebImage/SDWebImageDownloaderOperation.m
 - Line : 337 - 358
 - Note : 

``` c
+ (UIImageOrientation)orientationFromPropertyValue:(NSInteger)value {
    switch (value) {
        case 1:
            return UIImageOrientationUp;
        case 3:
            return UIImageOrientationDown;
        case 8:
            return UIImageOrientationLeft;
        case 6:
            return UIImageOrientationRight;
        case 2:
            return UIImageOrientationUpMirrored;
        case 4:
            return UIImageOrientationDownMirrored;
        case 5:
            return UIImageOrientationLeftMirrored;
        case 7:
            return UIImageOrientationRightMirrored;
        default:
            return UIImageOrientationUp;
    }
}
```


关于Orientation ，参考这篇文章 <http://feihu.me/blog/2015/how-to-handle-image-orientation-on-iOS/>


## 19. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 14 - 35
 - Note : 

``` c
// See <https://github.com/rs/SDWebImage/pull/1141> for discussion
@interface AutoPurgeCache : NSCache
@end

@implementation AutoPurgeCache

- (id)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(removeAllObjects) name:UIApplicationDidReceiveMemoryWarningNotification object:nil];
    }
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidReceiveMemoryWarningNotification object:nil];

}

@end
```


内存警告时清空缓存


## 20. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 38 - 53
 - Note : 

``` c
// PNG signature bytes and data (below)
static unsigned char kPNGSignatureBytes[8] = {0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
static NSData *kPNGSignatureData = nil;

BOOL ImageDataHasPNGPreffix(NSData *data);

BOOL ImageDataHasPNGPreffix(NSData *data) {
    NSUInteger pngSignatureLength = [kPNGSignatureData length];
    if ([data length] >= pngSignatureLength) {
        if ([[data subdataWithRange:NSMakeRange(0, pngSignatureLength)] isEqualToData:kPNGSignatureData]) {
            return YES;
        }
    }

    return NO;
}
```


png文件前缀


## 21. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 55 - 57
 - Note : 

``` c
FOUNDATION_STATIC_INLINE NSUInteger SDCacheCostForImage(UIImage *image) {
    return image.size.height * image.size.width * image.scale * image.scale;
}
```


FOUNDATION_STATIC_INLINE 可以学习用用。
图片的cost计算方式。


## 22. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 77 - 77
 - Note : 

``` c
        instance = [self new];
```


[self new] 学习了。可以研究下 与[XXXX new]的区别。


## 23. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 105 - 105
 - Note : 

``` c
        _memCache = [[AutoPurgeCache alloc] init];
```


内存的缓存是NSCache。


## 24. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 125 - 127
 - Note : 

``` c
        dispatch_sync(_ioQueue, ^{
            _fileManager = [NSFileManager new];
        });
```


ioQueue         

_ioQueue = dispatch_queue_create("com.hackemist.SDWebImageCache", DISPATCH_QUEUE_SERIAL);


## 25. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 177 - 189
 - Note : 

``` c
- (NSString *)cachedFileNameForKey:(NSString *)key {
    const char *str = [key UTF8String];
    if (str == NULL) {
        str = "";
    }
    unsigned char r[CC_MD5_DIGEST_LENGTH];
    CC_MD5(str, (CC_LONG)strlen(str), r);
    NSString *filename = [NSString stringWithFormat:@"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%@",
                          r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10],
                          r[11], r[12], r[13], r[14], r[15], [[key pathExtension] isEqualToString:@""] ? @"" : [NSString stringWithFormat:@".%@", [key pathExtension]]];

    return filename;
}
```


磁盘缓存文件名称


## 26. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 213 - 238
 - Note : 

``` c
            if (image && (recalculate || !data)) {
#if TARGET_OS_IPHONE
                // We need to determine if the image is a PNG or a JPEG
                // PNGs are easier to detect because they have a unique signature (http://www.w3.org/TR/PNG-Structure.html)
                // The first eight bytes of a PNG file always contain the following (decimal) values:
                // 137 80 78 71 13 10 26 10

                // If the imageData is nil (i.e. if trying to save a UIImage directly or the image was transformed on download)
                // and the image has an alpha channel, we will consider it PNG to avoid losing the transparency
                int alphaInfo = CGImageGetAlphaInfo(image.CGImage);
                BOOL hasAlpha = !(alphaInfo == kCGImageAlphaNone ||
                                  alphaInfo == kCGImageAlphaNoneSkipFirst ||
                                  alphaInfo == kCGImageAlphaNoneSkipLast);
                BOOL imageIsPng = hasAlpha;

                // But if we have an image data, we will look at the preffix
                if ([imageData length] >= [kPNGSignatureData length]) {
                    imageIsPng = ImageDataHasPNGPreffix(imageData);
                }

                if (imageIsPng) {
                    data = UIImagePNGRepresentation(image);
                }
                else {
                    data = UIImageJPEGRepresentation(image, (CGFloat)1.0);
                }
```


磁盘缓存时，且需要recalculate时，判断png。两种方法判断png。

- 是否有透明通道。alpha。
- 是否有png的格式magic number前缀。

PS：如果需要加载gif，这里注意不要recalculate，否则 再次从磁盘加载后就不是gif文件了（变为jpg文件）。


## 27. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 276 - 278
 - Note : 

``` c
    // this is an exception to access the filemanager on another queue than ioQueue, but we are using the shared instance
    // from apple docs on NSFileManager: The methods of the shared NSFileManager object can be called from multiple threads safely.
    exists = [[NSFileManager defaultManager] fileExistsAtPath:[self defaultCachePathForKey:key]];
```


sharedManager 线程安全的哦


## 28. SDWebImageCompat.m

 - Path : /SDWebImage/SDWebImageCompat.m
 - Line : 15 - 49
 - Note : 

``` c
inline UIImage *SDScaledImageForKey(NSString *key, UIImage *image) {
    if (!image) {
        return nil;
    }
    
    if ([image.images count] > 0) {
        NSMutableArray *scaledImages = [NSMutableArray array];

        for (UIImage *tempImage in image.images) {
            [scaledImages addObject:SDScaledImageForKey(key, tempImage)];
        }

        return [UIImage animatedImageWithImages:scaledImages duration:image.duration];
    }
    else {
        if ([[UIScreen mainScreen] respondsToSelector:@selector(scale)]) {
            CGFloat scale = [UIScreen mainScreen].scale;
            if (key.length >= 8) {
                NSRange range = [key rangeOfString:@"@2x."];
                if (range.location != NSNotFound) {
                    scale = 2.0;
                }
                
                range = [key rangeOfString:@"@3x."];
                if (range.location != NSNotFound) {
                    scale = 3.0;
                }
            }

            UIImage *scaledImage = [[UIImage alloc] initWithCGImage:image.CGImage scale:scale orientation:image.imageOrientation];
            image = scaledImage;
        }
        return image;
    }
}
```


缩放图片。本地存储时，存储缩放的图片


## 29. NSData+ImageContentType.m

 - Path : /SDWebImage/NSData+ImageContentType.m
 - Line : 11 - 40
 - Note : 

``` c
+ (NSString *)sd_contentTypeForImageData:(NSData *)data {
    uint8_t c;
    [data getBytes:&c length:1];
    switch (c) {
        case 0xFF:
            return @"image/jpeg";
        case 0x89:
            return @"image/png";
        case 0x47:
            return @"image/gif";
        case 0x49:
        case 0x4D:
            return @"image/tiff";
        case 0x52:
            // R as RIFF for WEBP
            if ([data length] < 12) {
                return nil;
            }

            NSString *testString = [[NSString alloc] initWithData:[data subdataWithRange:NSMakeRange(0, 12)] encoding:NSASCIIStringEncoding];
            if ([testString hasPrefix:@"RIFF"] && [testString hasSuffix:@"WEBP"]) {
                return @"image/webp";
            }

            return nil;
    }
    return nil;
}

```


从文件头判断图片类型


## 30. UIImage+GIF.m

 - Path : /SDWebImage/UIImage+GIF.m
 - Line : 14 - 57
 - Note : 

``` c
+ (UIImage *)sd_animatedGIFWithData:(NSData *)data {
    if (!data) {
        return nil;
    }

    CGImageSourceRef source = CGImageSourceCreateWithData((__bridge CFDataRef)data, NULL);

    size_t count = CGImageSourceGetCount(source);

    UIImage *animatedImage;

    if (count <= 1) {
        animatedImage = [[UIImage alloc] initWithData:data];
    }
    else {
        NSMutableArray *images = [NSMutableArray array];

        NSTimeInterval duration = 0.0f;

        for (size_t i = 0; i < count; i++) {
            CGImageRef image = CGImageSourceCreateImageAtIndex(source, i, NULL);
            if (!image) {
                continue;
            }

            duration += [self sd_frameDurationAtIndex:i source:source];

            [images addObject:[UIImage imageWithCGImage:image scale:[UIScreen mainScreen].scale orientation:UIImageOrientationUp]];

            CGImageRelease(image);
        }

        if (!duration) {
            duration = (1.0f / 10.0f) * count;
        }

        animatedImage = [UIImage animatedImageWithImages:images duration:duration];
    }

    CFRelease(source);

    return animatedImage;
}
```


使用CGImageSourceCreateWithData 读取Gif文件


## 31. SDWebImageDecoder.m

 - Path : /SDWebImage/SDWebImageDecoder.m
 - Line : 15 - 77
 - Note : 

``` c
+ (UIImage *)decodedImageWithImage:(UIImage *)image {
    // while downloading huge amount of images
    // autorelease the bitmap context
    // and all vars to help system to free memory
    // when there are memory warning.
    // on iOS7, do not forget to call
    // [[SDImageCache sharedImageCache] clearMemory];

    if (image == nil) { // Prevent "CGBitmapContextCreateImage: invalid context 0x0" error
        return nil;
    }

    @autoreleasepool{
        // do not decode animated images
        if (image.images) { return image; }
        
        CGImageRef imageRef = image.CGImage;
        
        CGImageAlphaInfo alpha = CGImageGetAlphaInfo(imageRef);
        BOOL anyAlpha = (alpha == kCGImageAlphaFirst ||
                         alpha == kCGImageAlphaLast ||
                         alpha == kCGImageAlphaPremultipliedFirst ||
                         alpha == kCGImageAlphaPremultipliedLast);
        
        if (anyAlpha) { return image; }
        
        // current
        CGColorSpaceModel imageColorSpaceModel = CGColorSpaceGetModel(CGImageGetColorSpace(imageRef));
        CGColorSpaceRef colorspaceRef = CGImageGetColorSpace(imageRef);
        
        bool unsupportedColorSpace = (imageColorSpaceModel == 0 || imageColorSpaceModel == -1 || imageColorSpaceModel == kCGColorSpaceModelCMYK || imageColorSpaceModel == kCGColorSpaceModelIndexed);
        if (unsupportedColorSpace)
            colorspaceRef = CGColorSpaceCreateDeviceRGB();
        
        size_t width = CGImageGetWidth(imageRef);
        size_t height = CGImageGetHeight(imageRef);
        NSUInteger bytesPerPixel = 4;
        NSUInteger bytesPerRow = bytesPerPixel * width;
        NSUInteger bitsPerComponent = 8;
        
        CGContextRef context = CGBitmapContextCreate(NULL,
                                                     width,
                                                     height,
                                                     bitsPerComponent,
                                                     bytesPerRow,
                                                     colorspaceRef,
                                                     kCGBitmapByteOrderDefault | kCGImageAlphaPremultipliedFirst);
        
        // Draw the image into the context and retrieve the new image, which will now have an alpha layer
        CGContextDrawImage(context, CGRectMake(0, 0, width, height), imageRef);
        CGImageRef imageRefWithAlpha = CGBitmapContextCreateImage(context);
        UIImage *imageWithAlpha = [UIImage imageWithCGImage:imageRefWithAlpha scale:image.scale orientation:image.imageOrientation];
        
        if (unsupportedColorSpace)
            CGColorSpaceRelease(colorspaceRef);
        
        CGContextRelease(context);
        CGImageRelease(imageRefWithAlpha);
        
        return imageWithAlpha;
    }
}
```


decode image，优化图片加载速度


## 32. SDImageCache.m

 - Path : /SDWebImage/SDImageCache.m
 - Line : 506 - 536
 - Note : 

``` c
        NSArray *resourceKeys = @[NSURLIsDirectoryKey, NSURLContentModificationDateKey, NSURLTotalFileAllocatedSizeKey];

        // This enumerator prefetches useful properties for our cache files.
        NSDirectoryEnumerator *fileEnumerator = [_fileManager enumeratorAtURL:diskCacheURL
                                                   includingPropertiesForKeys:resourceKeys
                                                                      options:NSDirectoryEnumerationSkipsHiddenFiles
                                                                 errorHandler:NULL];

        NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:-self.maxCacheAge];
        NSMutableDictionary *cacheFiles = [NSMutableDictionary dictionary];
        NSUInteger currentCacheSize = 0;

        // Enumerate all of the files in the cache directory.  This loop has two purposes:
        //
        //  1. Removing files that are older than the expiration date.
        //  2. Storing file attributes for the size-based cleanup pass.
        NSMutableArray *urlsToDelete = [[NSMutableArray alloc] init];
        for (NSURL *fileURL in fileEnumerator) {
            NSDictionary *resourceValues = [fileURL resourceValuesForKeys:resourceKeys error:NULL];

            // Skip directories.
            if ([resourceValues[NSURLIsDirectoryKey] boolValue]) {
                continue;
            }

            // Remove files that are older than the expiration date;
            NSDate *modificationDate = resourceValues[NSURLContentModificationDateKey];
            if ([[modificationDate laterDate:expirationDate] isEqualToDate:expirationDate]) {
                [urlsToDelete addObject:fileURL];
                continue;
            }
```


利用文件系统存储文件的时间、大小等元数据来清理文件


## 33. NSFileManager.h

 - Path : /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/System/Library/Frameworks/Foundation.framework/Headers/NSFileManager.h
 - Line : 442 - 442
 - Note : 

``` c
@interface NSDictionary<KeyType, ObjectType> (NSFileAttributes)
```


KeyType 和 ObjectType 。Objective C还有这个语法呀。类似泛型。


## 34. NSDictionary.h

 - Path : /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator.sdk/System/Library/Frameworks/Foundation.framework/Headers/NSDictionary.h
 - Line : 14 - 14
 - Note : 

``` c
@interface NSDictionary<__covariant KeyType, __covariant ObjectType> : NSObject <NSCopying, NSMutableCopying, NSSecureCoding, NSFastEnumeration>
```


NSDictionary的声明。泛型中的协变和逆变。

参考这篇文章：<http://blog.sunnyxx.com/2015/06/12/objc-new-features-in-2015/>

<https://msdn.microsoft.com/zh-cn/library/dd799517.aspx>


## 35. SDWebImageManager.m

 - Path : /SDWebImage/SDWebImageManager.m
 - Line : 131 - 134
 - Note : 

``` c
    BOOL isFailedUrl = NO;
    @synchronized (self.failedURLs) {
        isFailedUrl = [self.failedURLs containsObject:url];
    }
```


存储失败的url


## 36. SDWebImageManager.m

 - Path : /SDWebImage/SDWebImageManager.m
 - Line : 119 - 126
 - Note : 

``` c
    if ([url isKindOfClass:NSString.class]) {
        url = [NSURL URLWithString:(NSString *)url];
    }

    // Prevents app crashing on argument type error like sending NSNull instead of NSURL
    if (![url isKindOfClass:NSURL.class]) {
        url = nil;
    }
```


纠正参数类型。判断参数类型。NSNull。


## 37. SDWebImageManager.m

 - Path : /SDWebImage/SDWebImageManager.m
 - Line : 305 - 306
 - Note : 

``` c
        NSArray *copiedOperations = [self.runningOperations copy];
        [copiedOperations makeObjectsPerformSelector:@selector(cancel)];
```


NSArray竟然有这个方法，Objective C真的开发者友好啊。


## 38. UIImage+MultiFormat.m

 - Path : /SDWebImage/UIImage+MultiFormat.m
 - Line : 51 - 71
 - Note : 

``` c
+(UIImageOrientation)sd_imageOrientationFromImageData:(NSData *)imageData {
    UIImageOrientation result = UIImageOrientationUp;
    CGImageSourceRef imageSource = CGImageSourceCreateWithData((__bridge CFDataRef)imageData, NULL);
    if (imageSource) {
        CFDictionaryRef properties = CGImageSourceCopyPropertiesAtIndex(imageSource, 0, NULL);
        if (properties) {
            CFTypeRef val;
            int exifOrientation;
            val = CFDictionaryGetValue(properties, kCGImagePropertyOrientation);
            if (val) {
                CFNumberGetValue(val, kCFNumberIntType, &exifOrientation);
                result = [self sd_exifOrientationToiOSOrientation:exifOrientation];
            } // else - if it's not set it remains at up
            CFRelease((CFTypeRef) properties);
        } else {
            //NSLog(@"NO PROPERTIES, FAIL");
        }
        CFRelease(imageSource);
    }
    return result;
}
```


从Data获取orientation


## 39. UIView+WebCacheOperation.m

 - Path : /SDWebImage/UIView+WebCacheOperation.m
 - Line : 16 - 24
 - Note : 

``` c
- (NSMutableDictionary *)operationDictionary {
    NSMutableDictionary *operations = objc_getAssociatedObject(self, &loadOperationKey);
    if (operations) {
        return operations;
    }
    operations = [NSMutableDictionary dictionary];
    objc_setAssociatedObject(self, &loadOperationKey, operations, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    return operations;
}
```


每个UIView关联一个operation集合。（主要用于在Cell重用，或者对UIImageView重复加载url image时，取消之前的加载任务）


## 40. UIView+WebCacheOperation.m

 - Path : /SDWebImage/UIView+WebCacheOperation.m
 - Line : 43 - 43
 - Note : 

``` c
        } else if ([operations conformsToProtocol:@protocol(SDWebImageOperation)]){
```


conformsToProtocol:@protocol
 学习了。


## 41. UIImageView+WebCache.m

 - Path : /SDWebImage/UIImageView+WebCache.m
 - Line : 174 - 177
 - Note : 

``` c
- (void)addActivityIndicator {
    if (!self.activityIndicator) {
        self.activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:[self getIndicatorStyle]];
        self.activityIndicator.translatesAutoresizingMaskIntoConstraints = NO;
```


看来新版本SDWebImage集成了indicator功能。


## 42. UIImageView+WebCache.m

 - Path : /SDWebImage/UIImageView+WebCache.m
 - Line : 44 - 46
 - Note : 

``` c
- (void)sd_setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder options:(SDWebImageOptions)options progress:(SDWebImageDownloaderProgressBlock)progressBlock completed:(SDWebImageCompletionBlock)completedBlock {
    [self sd_cancelCurrentImageLoad];
    objc_setAssociatedObject(self, &imageURLKey, url, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
```


cancel掉之前对当前imageview的加载操作。



# Summarize




---
*Generated by [XSourceNote](https://github.com/everettjf/XSourceNote) at 2016-04-03 07:11:39 +0000*


