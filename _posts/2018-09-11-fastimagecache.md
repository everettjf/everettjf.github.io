---
layout: post
title: "FastImageCache Principles"
categories:
  - Skill
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---


FastImageCache is a library that uses space for time to accelerate image loading/rendering. Official (<https://github.com/path/FastImageCache>) README explains principles in detail. This article combines source code to review most core parts again.


<!-- more -->

# Problem

Conventional file loading method is:

1. +[UIImage imageWithContentsOfFile:] uses Image I/O interface to create CGImageRef from read data. But at this time image is not decoded.
2. Assign to UIImageView.
3. Implicit CATransaction detects layer tree change.
4. Next main thread run loop, Core Animation will commit this implicit CATransaction, causing image data copy.

Depending on image, copy process may include following steps:

1. Allocate memory for file read/write and decompression.
2. Read file content from disk to memory.
3. Decompress image, normally decompression is CPU intensive (CPU intensive operation).
4. Core Animation uses decompressed data for rendering.


# Solution

## 1. Mapped Memory

FastImageCache's core is image table. Similar to sprite sheet in game development <http://en.wikipedia.org/wiki/Sprite_sheet#Sprites_by_CSS>

![](/media/15366783741626.jpg)

Map entire file to memory through mmap, then read image data from memory. mmap usage reduces data copy.

mmap was introduced in previous article, see <https://everettjf.github.io/2018/09/01/mmap/>


## 2. Uncompressed Image Data

To avoid expensive image decompression operations, image table directly stores decompressed image data. Image decompression only executes once, future reading images directly uses decompressed data.

Decompressed image data will occupy larger disk space.



## 3. Byte Alignment

When analyzing application using TimeProfiler, often find `CA::Render::copy_image` occupies large time consumption. This is usually because Core Animation needs a byte-aligned image, non-byte-aligned images cause Core Animation to copy image when rendering. Thus increases rendering time consumption.

image table will store a byte-aligned image, thus avoiding this time consumption.

Additionally, aligned bytes-per-row is 64, that is CGBitmapContextCreate's bytesPerRow parameter is multiple of 64.

```
CGContextRef __nullable CGBitmapContextCreate(void * __nullable data,
    size_t width, size_t height, size_t bitsPerComponent, size_t bytesPerRow,
    CGColorSpaceRef cg_nullable space, uint32_t bitmapInfo)
```

>  A properly aligned bytes-per-row value must be a multiple of 8 pixels × bytes per pixel. For a typical ARGB image, the aligned bytes-per-row value is a multiple of 64. 

# Implementation Code

## 1. mmap

FastImageCache's image table is a file, through mmap different positions to map to each Chunk. FICImageTableChunk's logic is to mmap different positions (current Chunk) in a large file

![](/media/15366809061033.jpg)

![](/media/15366814691967.jpg)

## 2. Decompress Image

(1) Write image to Chunk

In this method `-[FICImageTable setEntryForEntityUUID:sourceImageUUID:imageDrawingBlock:]` creates image data to mmap's corresponding entry.

![](/media/15366820880154.jpg)

One Chunk corresponds to multiple entries, one entry is one image's data.

![](/media/15366818435515.jpg)

FastImageCache provides block callback for us to provide drawing ourselves (original intent is for us to also do some processing, for example rounded corners).

![](/media/15366818611429.jpg)


(2) Read Image

Reading in `-[FICImageTable newImageForEntityUUID:sourceImageUUID:preheatData:]` 

![](/media/15366823635180.jpg)

Here most key is CGDataProviderCreateWithData, through this API can make CGImageRef's backing store be mmap mapped memory. Also utilizes mmap's advantages to load CGImageRef.

```
// Create CGImageRef whose backing store *is* the mapped image table entry. We avoid a memcpy this way.
GDataProviderRef dataProvider = CGDataProviderCreateWithData((__bridge_retained void *)entryData, [entryData bytes], [entryData imageLength], _FICReleaseImageData);
                    
```

## 3. Byte Alignment

Core Animation needs 64-byte aligned image data. Code below.

```
// Core Animation will make a copy of any image that a client application provides whose backing store isn't properly byte-aligned.
// This copy operation can be prohibitively expensive, so we want to avoid this by properly aligning any UIImages we're working with.
// To produce a UIImage that is properly aligned, we need to ensure that the backing store's bytes per row is a multiple of 64.

#pragma mark - Byte Alignment

inline size_t FICByteAlign(size_t width, size_t alignment) {
    return ((width + (alignment - 1)) / alignment) * alignment;
}

inline size_t FICByteAlignForCoreAnimation(size_t bytesPerRow) {
    return FICByteAlign(bytesPerRow, 64);
}

```

# Other Code

An interesting code,

```
- (void)preheat {
    int pageSize = [FICImageTable pageSize];
    void *bytes = [self bytes];
    NSUInteger length = [self length];
    
    // Read a byte off of each VM page to force the kernel to page in the data
    for (NSUInteger i = 0; i < length; i += pageSize) {
        *((volatile uint8_t *)bytes + i);
    }
}
```

Due to mmap's mechanism, corresponding memory only loads to page when reading, code above forces reading this memory, makes mmap's image data preload to memory (loading is on child thread), finally reduces main thread time consumption.


# References

- Getting Pixels onto the Screen <https://www.objc.io/issues/3-views/moving-pixels-onto-the-screen/>
- Optimizing 2D Graphics and Animation Performance
 <https://developer.apple.com/videos/play/wwdc2012/506/>
- iOS Image Loading Speed Ultimate Optimization—FastImageCache Analysis <http://blog.cnbang.net/tech/2578/>


# Summary


Personally feel, FastImageCache is too customized for Path app, some places that should be flexible (for example image size not fixed) not flexible, instead many other parameters especially many. For universality, also added MRU algorithm, file protection attributes, etc., causing code complex (messy) a lot.

If we only want to optimize App's home page loading speed, can have a super simplified version. If you need, then make one.


Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)


