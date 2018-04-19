---
layout: post
title: YYCache note
categories: Skill
comments: true
---






# Basic Information
 - Name : YYCache
 - Site : <https://github.com/ibireme/YYCache>
 - Repo : <https://github.com/ibireme/YYCache>
 - Revision : f433c3455121bd0308cd6f551613c7ec629e937a
 - Description : 
在内存与磁盘上性能都不错的缓存库。

这是作者的设计思路介绍：<http://blog.ibireme.com/2015/10/26/yycache/>

<!-- more -->


# Global Note
作者的成长经历值得我们学习，在一年多的iOS开发中提高的很快。

# File Notes

## 0. YYMemoryCache.h

 - Path : /YYCache/YYMemoryCache.h
 - Line : 16 - 30
 - Note : 

``` c
/**
 YYMemoryCache is a fast in-memory cache that stores key-value pairs.
 In contrast to NSDictionary, keys are retained and not copied.
 The API and performance is similar to `NSCache`, all methods are thread-safe.
 
 YYMemoryCache objects differ from NSCache in a few ways:
 
 * It uses LRU (least-recently-used) to remove objects; NSCache's eviction method
   is non-deterministic.
 * It can be controlled by cost, count and age; NSCache's limits are imprecise.
 * It can be configured to automatically evict objects when receive memory 
   warning or app enter background.
 
 The time of `Access Methods` in YYMemoryCache is typically in constant time (O(1)).
 */
```


  - YYMemoryCache 是内存缓存。 
 - Key是retained，而不是copied。
 - 使用了LRU（最近最少使用）算法。 


## 1. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 15 - 15
 - Note : 

``` c
#import <QuartzCore/QuartzCore.h>
```


QuartzCore 这个框架需要研究下。
#TODO#


## 2. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 18 - 18
 - Note : 

``` c
#if __has_include("YYDispatchQueuePool.h")
```


可以这么判断是否包含了某个头文件。


## 3. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 32 - 45
 - Note : 

``` c
/**
 A node in linked map.
 Typically, you should not use this class directly.
 */
@interface _YYLinkedMapNode : NSObject {
    @package
    __unsafe_unretained _YYLinkedMapNode *_prev; // retained by dic
    __unsafe_unretained _YYLinkedMapNode *_next; // retained by dic
    id _key;
    id _value;
    NSUInteger _cost;
    NSTimeInterval _time;
}
@end
```


双向链表的节点。
cost以及time（最后使用时间）。
_prev 和 _next 是__unsafe_unretained 修饰，被外层的 CFMutableDictionaryRef retained。

@package 修饰符，在framework内部可访问，framework外部不可访问。


## 4. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 57 - 66
 - Note : 

``` c
@interface _YYLinkedMap : NSObject {
    @package
    CFMutableDictionaryRef _dic; // do not set object directly
    NSUInteger _totalCost;
    NSUInteger _totalCount;
    _YYLinkedMapNode *_head; // MRU, do not change it directly
    _YYLinkedMapNode *_tail; // LRU, do not change it directly
    BOOL _releaseOnMainThread;
    BOOL _releaseAsynchronously;
}
```


双向链表 定义。头、尾。dic用于存储元素，同时retain元素。


## 5. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 92 - 92
 - Note : 

``` c
    _dic = CFDictionaryCreateMutable(CFAllocatorGetDefault(), 0, &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
```


CFMutableDictionaryRef 用法mark。


## 6. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 101 - 154
 - Note : 

``` c

- (void)insertNodeAtHead:(_YYLinkedMapNode *)node {
    CFDictionarySetValue(_dic, (__bridge const void *)(node->_key), (__bridge const void *)(node));
    _totalCost += node->_cost;
    _totalCount++;
    if (_head) {
        node->_next = _head;
        _head->_prev = node;
        _head = node;
    } else {
        _head = _tail = node;
    }
}

- (void)bringNodeToHead:(_YYLinkedMapNode *)node {
    if (_head == node) return;
    
    if (_tail == node) {
        _tail = node->_prev;
        _tail->_next = nil;
    } else {
        node->_next->_prev = node->_prev;
        node->_prev->_next = node->_next;
    }
    node->_next = _head;
    node->_prev = nil;
    _head->_prev = node;
    _head = node;
}

- (void)removeNode:(_YYLinkedMapNode *)node {
    CFDictionaryRemoveValue(_dic, (__bridge const void *)(node->_key));
    _totalCost -= node->_cost;
    _totalCount--;
    if (node->_next) node->_next->_prev = node->_prev;
    if (node->_prev) node->_prev->_next = node->_next;
    if (_head == node) _head = node->_next;
    if (_tail == node) _tail = node->_prev;
}

- (_YYLinkedMapNode *)removeTailNode {
    if (!_tail) return nil;
    _YYLinkedMapNode *tail = _tail;
    CFDictionaryRemoveValue(_dic, (__bridge const void *)(_tail->_key));
    _totalCost -= _tail->_cost;
    _totalCount--;
    if (_head == _tail) {
        _head = _tail = nil;
    } else {
        _tail = _tail->_prev;
        _tail->_next = nil;
    }
    return tail;
}
```


双向链表的基本操作。好久不看算法了。贴着吧。


## 7. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 190 - 198
 - Note : 

``` c
- (void)_trimRecursively {
    __weak typeof(self) _self = self;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(_autoTrimInterval * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        [self _trimInBackground];
        [self _trimRecursively];
    });
}
```


简单的定时器。


## 8. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 208 - 218
 - Note : 

``` c
- (void)_trimToCost:(NSUInteger)costLimit {
    BOOL finish = NO;
    pthread_mutex_lock(&_lock);
    if (costLimit == 0) {
        [_lru removeAll];
        finish = YES;
    } else if (_lru->_totalCost <= costLimit) {
        finish = YES;
    }
    pthread_mutex_unlock(&_lock);
    if (finish) return;
```


这里老版本使用了OSSpinLock，现在已经更换为pthread_mutex_lock，原因见作者的文章， 
<http://blog.ibireme.com/2016/01/16/spinlock_is_unsafe_in_ios/>



## 9. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 220 - 233
 - Note : 

``` c
    NSMutableArray *holder = [NSMutableArray new];
    while (!finish) {
        if (pthread_mutex_trylock(&_lock) == 0) {
            if (_lru->_totalCost > costLimit) {
                _YYLinkedMapNode *node = [_lru removeTailNode];
                if (node) [holder addObject:node];
            } else {
                finish = YES;
            }
            pthread_mutex_unlock(&_lock);
        } else {
            usleep(10 * 1000); //10 ms
        }
    }
```


这里trylock，无法获得锁时，usleep。


## 10. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 344 - 345
 - Note : 

``` c
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_appDidReceiveMemoryWarningNotification) name:UIApplicationDidReceiveMemoryWarningNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_appDidEnterBackgroundNotification) name:UIApplicationDidEnterBackgroundNotification object:nil];
```


监听进入后台或者内存警告


## 11. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 406 - 416
 - Note : 

``` c
- (id)objectForKey:(id)key {
    if (!key) return nil;
    pthread_mutex_lock(&_lock);
    _YYLinkedMapNode *node = CFDictionaryGetValue(_lru->_dic, (__bridge const void *)(key));
    if (node) {
        node->_time = CACurrentMediaTime();
        [_lru bringNodeToHead:node];
    }
    pthread_mutex_unlock(&_lock);
    return node ? node->_value : nil;
}
```


注意锁。并把设置访问元素的最新访问时间。并把此元素放到双向链表的头部。这里时间复杂度都是常数。

学到了获取时间的一个函数 CACurrentMediaTime()。


## 12. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 478 - 478
 - Note : 

``` c
        } else if (_lru->_releaseOnMainThread && !pthread_main_np()) {
```


pthread_main_np 判断主线程。返回非零，则为主线程。


## 13. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 357 - 363
 - Note : 

``` c

- (NSUInteger)totalCount {
    pthread_mutex_lock(&_lock);
    NSUInteger count = _lru->_totalCount;
    pthread_mutex_unlock(&_lock);
    return count;
}
```


    pthread_mutex_init(&_lock, NULL);
    pthread_mutex_destroy(&_lock);
pthread mutex 基本使用方法。


## 14. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 291 - 291
 - Note : 

``` c
        if (pthread_mutex_trylock(&_lock) == 0) {
```


使用trylock避免阻塞


## 15. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 352 - 353
 - Note : 

``` c
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidReceiveMemoryWarningNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidEnterBackgroundNotification object:nil];
```


监听程序进入后台，以及系统内存不足。


## 16. YYMemoryCache.m

 - Path : /YYCache/YYMemoryCache.m
 - Line : 27 - 27
 - Note : 

``` c
static inline dispatch_queue_t YYMemoryCacheGetReleaseQueue() {
```


static inline 文件内，内联


## 17. YYDiskCache.h

 - Path : /YYCache/YYDiskCache.h
 - Line : 44 - 53
 - Note : 

``` c
/**
 If the object's data size (in bytes) is larger than this value, then object will
 be stored as a file, otherwise the object will be stored in sqlite.
 
 0 means all objects will be stored as separated files, NSUIntegerMax means all
 objects will be stored in sqlite. 
 
 The default value is 20480 (20KB).
 */
@property (readonly) NSUInteger inlineThreshold;
```


YYDiskCache 会判断这个阈值，20k以下会存放在sqlite中，否则以文件方式存储。



## 18. YYDiskCache.h

 - Path : /YYCache/YYDiskCache.h
 - Line : 139 - 140
 - Note : 

``` c
- (instancetype)init UNAVAILABLE_ATTRIBUTE;
+ (instancetype)new UNAVAILABLE_ATTRIBUTE;
```


声明不可用方法


## 19. YYDiskCache.m

 - Path : /YYCache/YYDiskCache.m
 - Line : 18 - 19
 - Note : 

``` c
#define Lock() dispatch_semaphore_wait(self->_lock, DISPATCH_TIME_FOREVER)
#define Unlock() dispatch_semaphore_signal(self->_lock)
```


信号量


## 20. YYDiskCache.m

 - Path : /YYCache/YYDiskCache.m
 - Line : 48 - 58
 - Note : 

``` c
/// weak reference for all instances
static NSMapTable *_globalInstances;
static dispatch_semaphore_t _globalInstancesLock;

static void _YYDiskCacheInitGlobal() {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _globalInstancesLock = dispatch_semaphore_create(1);
        _globalInstances = [[NSMapTable alloc] initWithKeyOptions:NSPointerFunctionsStrongMemory valueOptions:NSPointerFunctionsWeakMemory capacity:0];
    });
}
```


default is **weak**

The NSMapTable class is a mutable collection modeled after NSDictionary, with the following differences:
Overview
The major option is to have keys and/or values held “weakly” in a manner that entries are removed when one of the objects is reclaimed.
Its keys or values may be copied on input or may use pointer identity for equality and hashing.
It can contain arbitrary pointers (its contents are not constrained to being objects).
You can configure an NSMapTable instance to operate on arbitrary pointers and not just objects, although typically you are encouraged to use the C function API for void * pointers. (See Managing Map Tables for more information) The object-based API (such as setObject:forKey:) will not work for non-object pointers without type-casting.


## 21. YYDiskCache.m

 - Path : /YYCache/YYDiskCache.m
 - Line : 85 - 93
 - Note : 

``` c
- (void)_trimRecursively {
    __weak typeof(self) _self = self;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(_autoTrimInterval * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        [self _trimInBackground];
        [self _trimRecursively];
    });
}
```


先weak 再strong。
内部可以直接覆盖外部的self，用起来方便。


## 22. YYDiskCache.m

 - Path : /YYCache/YYDiskCache.m
 - Line : 155 - 155
 - Note : 

``` c
    @throw [NSException exceptionWithName:@"YYDiskCache init error" reason:@"YYDiskCache must be initialized with a path. Use 'initWithPath:' or 'initWithPath:inlineThreshold:' instead." userInfo:nil];
```


主动抛出异常


## 23. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 23 - 27
 - Note : 

``` c
static NSString *const kDBFileName = @"manifest.sqlite";
static NSString *const kDBShmFileName = @"manifest.sqlite-shm";
static NSString *const kDBWalFileName = @"manifest.sqlite-wal";
static NSString *const kDataDirectoryName = @"data";
static NSString *const kTrashDirectoryName = @"trash";
```


不知道shm 和 wal 啊。（看来以前一直只是用sqlite，但是没有仔细研究啊）


## 24. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 29 - 42
 - Note : 

``` c
/*
 SQL:
 create table if not exists manifest (
    key                 text,
    filename            text,
    size                integer,
    inline_data         blob,
    modification_time   integer,
    last_access_time    integer,
    extended_data       blob,
    primary key(key)
 ); 
 create index if not exists last_access_time_idx on manifest(last_access_time);
 */
```


 create index if not exists last_access_time_idx on manifest(last_access_time); 

创建索引（做了5年C++没用过这个呀）

primary key(key) 可以这样后续指定sqlite类型


## 25. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 83 - 83
 - Note : 

``` c
        NSLog(@"%s line:%d sqlite open failed (%d).", __FUNCTION__, __LINE__, result);
```


%s __FUNCTION__   %d __LINE__


## 26. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 78 - 80
 - Note : 

``` c
        CFDictionaryKeyCallBacks keyCallbacks = kCFCopyStringDictionaryKeyCallBacks;
        CFDictionaryValueCallBacks valueCallbacks = {0};
        _dbStmtCache = CFDictionaryCreateMutable(CFAllocatorGetDefault(), 0, &keyCallbacks, &valueCallbacks);
```


CFDictionaryCreateMutable 的使用。Core Foundation 的使用。


## 27. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 111 - 119
 - Note : 

``` c
        if (result == SQLITE_BUSY || result == SQLITE_LOCKED) {
            if (!stmtFinalized) {
                stmtFinalized = YES;
                sqlite3_stmt *stmt;
                while ((stmt = sqlite3_next_stmt(_db, nil)) != 0) {
                    sqlite3_finalize(stmt);
                    retry = YES;
                }
            }
```


busy 和 locked 时，结束所有的statement


## 28. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 138 - 142
 - Note : 

``` c
- (void)_dbCheckpoint {
    if (![self _dbIsReady]) return;
    // Cause a checkpoint to occur, merge `sqlite-wal` file to `sqlite` file.
    sqlite3_wal_checkpoint(_db, NULL);
}
```


wal checkpoint


## 29. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 158 - 172
 - Note : 

``` c
- (sqlite3_stmt *)_dbPrepareStmt:(NSString *)sql {
    if (![self _dbIsReady] || sql.length == 0 || !_dbStmtCache) return NULL;
    sqlite3_stmt *stmt = (sqlite3_stmt *)CFDictionaryGetValue(_dbStmtCache, (__bridge const void *)(sql));
    if (!stmt) {
        int result = sqlite3_prepare_v2(_db, sql.UTF8String, -1, &stmt, NULL);
        if (result != SQLITE_OK) {
            if (_errorLogsEnabled) NSLog(@"%s line:%d sqlite stmt prepare error (%d): %s", __FUNCTION__, __LINE__, result, sqlite3_errmsg(_db));
            return NULL;
        }
        CFDictionarySetValue(_dbStmtCache, (__bridge const void *)(sql), stmt);
    } else {
        sqlite3_reset(stmt);
    }
    return stmt;
}
```


sqlite3_stmt 根据sql缓存起来


## 30. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 192 - 216
 - Note : 

``` c
- (BOOL)_dbSaveWithKey:(NSString *)key value:(NSData *)value fileName:(NSString *)fileName extendedData:(NSData *)extendedData {
    NSString *sql = @"insert or replace into manifest (key, filename, size, inline_data, modification_time, last_access_time, extended_data) values (?1, ?2, ?3, ?4, ?5, ?6, ?7);";
    sqlite3_stmt *stmt = [self _dbPrepareStmt:sql];
    if (!stmt) return NO;
    
    int timestamp = (int)time(NULL);
    sqlite3_bind_text(stmt, 1, key.UTF8String, -1, NULL);
    sqlite3_bind_text(stmt, 2, fileName.UTF8String, -1, NULL);
    sqlite3_bind_int(stmt, 3, (int)value.length);
    if (fileName.length == 0) {
        sqlite3_bind_blob(stmt, 4, value.bytes, (int)value.length, 0);
    } else {
        sqlite3_bind_blob(stmt, 4, NULL, 0, 0);
    }
    sqlite3_bind_int(stmt, 5, timestamp);
    sqlite3_bind_int(stmt, 6, timestamp);
    sqlite3_bind_blob(stmt, 7, extendedData.bytes, (int)extendedData.length, 0);
    
    int result = sqlite3_step(stmt);
    if (result != SQLITE_DONE) {
        if (_errorLogsEnabled) NSLog(@"%s line:%d sqlite insert error (%d): %s", __FUNCTION__, __LINE__, result, sqlite3_errmsg(_db));
        return NO;
    }
    return YES;
}
```


(?1, ?2, ?3, ?4, ?5, ?6, ?7) 
问号后面可以有数字……


## 31. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 218 - 218
 - Note : 

``` c
- (BOOL)_dbUpdateAccessTimeWithKey:(NSString *)key {
```


更新单个访问时间


## 32. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 232 - 232
 - Note : 

``` c
- (BOOL)_dbUpdateAccessTimeWithKeys:(NSArray *)keys {
```


更新多个key的访问时间


## 33. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 603 - 606
 - Note : 

``` c
    CFUUIDRef uuidRef = CFUUIDCreate(NULL);
    CFStringRef uuid = CFUUIDCreateString(NULL, uuidRef);
    CFRelease(uuidRef);
    NSString *tmpPath = [_trashPath stringByAppendingPathComponent:(__bridge NSString *)(uuid)];
```


生成uuid


## 34. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 615 - 627
 - Note : 

``` c
- (void)_fileEmptyTrashInBackground {
    if (_invalidated) return;
    NSString *trashPath = _trashPath;
    dispatch_queue_t queue = _trashQueue;
    dispatch_async(queue, ^{
        NSFileManager *manager = [NSFileManager new];
        NSArray *directoryContents = [manager contentsOfDirectoryAtPath:trashPath error:NULL];
        for (NSString *path in directoryContents) {
            NSString *fullPath = [trashPath stringByAppendingPathComponent:path];
            [manager removeItemAtPath:fullPath error:NULL];
        }
    });
}
```


这里新建了FileManager。这里并没有设置代理之类的。?? 为何还要生成一个新的FileManager呢。


## 35. YYKVStorage.m

 - Path : /YYCache/YYKVStorage.m
 - Line : 831 - 860
 - Note : 

``` c

- (BOOL)removeItemsToFitSize:(int)maxSize {
    if (maxSize == INT_MAX) return YES;
    if (maxSize <= 0) return [self removeAllItems];
    
    int total = [self _dbGetTotalItemSize];
    if (total < 0) return NO;
    if (total <= maxSize) return YES;
    
    NSArray *items = nil;
    BOOL suc = NO;
    do {
        int perCount = 16;
        items = [self _dbGetItemSizeInfoOrderByTimeDescWithLimit:perCount];
        for (YYKVStorageItem *item in items) {
            if (total > maxSize) {
                if (item.filename) {
                    [self _fileDeleteWithName:item.filename];
                }
                suc = [self _dbDeleteItemWithKey:item.key];
                total -= item.size;
            } else {
                break;
            }
            if (!suc) break;
        }
    } while (total > maxSize && items.count > 0 && suc);
    if (suc) [self _dbCheckpoint];
    return suc;
}
```


 - 先获取总大小
 - 每次获取16个不经常访问的数据
 - 逐个删除（文件或数据库记录），看剩余大小是否满足目标大小

PS : 这里 Desc 是个bug。 应该是Asc 。见：<https://github.com/ibireme/YYCache/issues/37>



# Summarize




---
*Generated by [XSourceNote](https://github.com/everettjf/XSourceNote) at 2016-03-27 18:18:04 +0000*


