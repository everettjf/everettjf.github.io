---
layout: post
title: UITableView-FDTemplateLayoutCell note
categories: Skill
comments: true
---







# Basic Information
 - Name : UITableView-FDTemplateLayoutCell
 - Site : <https://github.com/forkingdog/UITableView-FDTemplateLayoutCell>
 - Repo : <https://github.com/forkingdog/UITableView-FDTemplateLayoutCell>
 - Revision : e3ee86ce419d18d3ff735056f1474f2863e43003
 - Description : 
简单易用的UITableViewCell自动高度。
作者的博客文章 <http://blog.sunnyxx.com/2015/05/17/cell-height-calculation/>

<!-- more -->

# Global Note
简单易用，但在一些复杂界面（例如聊天窗口）中使用时还是需要考虑更多优化问题。


# File Notes

## 0. UITableView+FDTemplateLayoutCell.h

 - Path : /Classes/UITableView+FDTemplateLayoutCell.h
 - Line : 35 - 35
 - Note : 

``` c
- (__kindof UITableViewCell *)fd_templateCellForReuseIdentifier:(NSString *)identifier;
```


__kindof XXXClass 可以这么用


## 1. UITableView+FDTemplateLayoutCell.h

 - Path : /Classes/UITableView+FDTemplateLayoutCell.h
 - Line : 28 - 28
 - Note : 

``` c
@interface UITableView (FDTemplateLayoutCell)
```


UITableView的extension


## 2. UITableView+FDTemplateLayoutCell.h

 - Path : /Classes/UITableView+FDTemplateLayoutCell.h
 - Line : 87 - 99
 - Note : 

``` c
@interface UITableViewCell (FDTemplateLayoutCell)

/// Indicate this is a template layout cell for calculation only.
/// You may need this when there are non-UI side effects when configure a cell.
/// Like:
///   - (void)configureCell:(FooCell *)cell atIndexPath:(NSIndexPath *)indexPath {
///       cell.entity = [self entityAtIndexPath:indexPath];
///       if (!cell.fd_isTemplateLayoutCell) {
///           [self notifySomething]; // non-UI side effects
///       }
///   }
///
@property (nonatomic, assign) BOOL fd_isTemplateLayoutCell;
```


使用 UITableViewCell 模板Cell计算高度，通过 fd_isTemplateLayoutCell 可在Cell内部判断当前是否是模板Cell。可以省去一些与高度无关的操作。


## 3. UITableView+FDTemplateLayoutCell.m

 - Path : /Classes/UITableView+FDTemplateLayoutCell.m
 - Line : 221 - 229
 - Note : 

``` c
@implementation UITableViewCell (FDTemplateLayoutCell)

- (BOOL)fd_isTemplateLayoutCell {
    return [objc_getAssociatedObject(self, _cmd) boolValue];
}

- (void)setFd_isTemplateLayoutCell:(BOOL)isTemplateLayoutCell {
    objc_setAssociatedObject(self, @selector(fd_isTemplateLayoutCell), @(isTemplateLayoutCell), OBJC_ASSOCIATION_RETAIN);
}
```


使用runtime增加属性的实现。

SEL类型的_cmd ， 每个方法内部都有，表示方法自身。
因此，可以NSStringFromSelector(_cmd)返回当前方法名称。

使用 get的SEL（也就是_cmd）作为objc_getAssociatedObject的key。值得学习。但要注意set中也要用相同的key，也就是@selector(fd_isTemplateLayoutCell)。





## 4. UITableView+FDTemplateLayoutCell.m

 - Path : /Classes/UITableView+FDTemplateLayoutCell.m
 - Line : 36 - 43
 - Note : 

``` c
        static const CGFloat systemAccessoryWidths[] = {
            [UITableViewCellAccessoryNone] = 0,
            [UITableViewCellAccessoryDisclosureIndicator] = 34,
            [UITableViewCellAccessoryDetailDisclosureButton] = 68,
            [UITableViewCellAccessoryCheckmark] = 40,
            [UITableViewCellAccessoryDetailButton] = 48
        };
        contentViewWidth -= systemAccessoryWidths[cell.accessoryType];
```


指定索引定义数组的方式。oc的小技巧真不少。


## 5. UITableView+FDTemplateLayoutCell.m

 - Path : /Classes/UITableView+FDTemplateLayoutCell.m
 - Line : 57 - 64
 - Note : 

``` c
        // Add a hard width constraint to make dynamic content views (like labels) expand vertically instead
        // of growing horizontally, in a flow-layout manner.
        NSLayoutConstraint *widthFenceConstraint = [NSLayoutConstraint constraintWithItem:cell.contentView attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1.0 constant:contentViewWidth];
        [cell.contentView addConstraint:widthFenceConstraint];
        
        // Auto layout engine does its math
        fittingHeight = [cell.contentView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize].height;
        [cell.contentView removeConstraint:widthFenceConstraint];
```


AutoLayout 计算Size的方法 systemLayoutSizeFittingSize。
这里新增一个宽度的约束，计算高度后再移除掉。 不错的想法。


## 6. UITableView+FDTemplateLayoutCell.m

 - Path : /Classes/UITableView+FDTemplateLayoutCell.m
 - Line : 79 - 81
 - Note : 

``` c
        // Try '- sizeThatFits:' for frame layout.
        // Note: fitting height should not include separator view.
        fittingHeight = [cell sizeThatFits:CGSizeMake(contentViewWidth, 0)].height;
```


不使用AutoLayout的情况下，使用sizeThatFits来获取大小。自定义cell需要实现这个函数。


## 7. UITableView+FDTemplateLayoutCell.m

 - Path : /Classes/UITableView+FDTemplateLayoutCell.m
 - Line : 100 - 121
 - Note : 

``` c
- (__kindof UITableViewCell *)fd_templateCellForReuseIdentifier:(NSString *)identifier {
    NSAssert(identifier.length > 0, @"Expect a valid identifier - %@", identifier);
    
    NSMutableDictionary<NSString *, UITableViewCell *> *templateCellsByIdentifiers = objc_getAssociatedObject(self, _cmd);
    if (!templateCellsByIdentifiers) {
        templateCellsByIdentifiers = @{}.mutableCopy;
        objc_setAssociatedObject(self, _cmd, templateCellsByIdentifiers, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    
    UITableViewCell *templateCell = templateCellsByIdentifiers[identifier];
    
    if (!templateCell) {
        templateCell = [self dequeueReusableCellWithIdentifier:identifier];
        NSAssert(templateCell != nil, @"Cell must be registered to table view for identifier - %@", identifier);
        templateCell.fd_isTemplateLayoutCell = YES;
        templateCell.contentView.translatesAutoresizingMaskIntoConstraints = NO;
        templateCellsByIdentifiers[identifier] = templateCell;
        [self fd_debugLog:[NSString stringWithFormat:@"layout cell created - %@", identifier]];
    }
    
    return templateCell;
}
```


关键的函数。

- 给当前TableView关联一个可变字典。
- 每一种 CellIdentifier 一个Key。
- 用于存储模板Cell。
- 模板Cell用于在内存中构建Cell，并对这个模板Cell计算高度。


## 8. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 26 - 26
 - Note : 

``` c
typedef NSMutableArray<NSMutableArray<NSNumber *> *> FDIndexPathHeightsBySection;
```


缓存高度。每个section一个数组。


## 9. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 29 - 30
 - Note : 

``` c
@property (nonatomic, strong) FDIndexPathHeightsBySection *heightsBySectionForPortrait;
@property (nonatomic, strong) FDIndexPathHeightsBySection *heightsBySectionForLandscape;
```


横屏竖屏各自缓存。


## 10. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 45 - 45
 - Note : 

``` c
    return UIDeviceOrientationIsPortrait([UIDevice currentDevice].orientation) ? self.heightsBySectionForPortrait: self.heightsBySectionForLandscape;
```


判断横竖屏


## 11. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 65 - 73
 - Note : 

``` c
- (CGFloat)heightForIndexPath:(NSIndexPath *)indexPath {
    [self buildCachesAtIndexPathsIfNeeded:@[indexPath]];
    NSNumber *number = self.heightsBySectionForCurrentOrientation[indexPath.section][indexPath.row];
#if CGFLOAT_IS_DOUBLE
    return number.doubleValue;
#else
    return number.floatValue;
#endif
}
```


CGFLOAT_IS_DOUBLE 注意这个。


## 12. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 124 - 124
 - Note : 

``` c
        [self methodSignatureForSelector:nil];
```


这个没看懂啊 NSMethodSignature


## 13. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 133 - 145
 - Note : 

``` c
// We just forward primary call, in crash report, top most method in stack maybe FD's,
// but it's really not our bug, you should check whether your table view's data source and
// displaying cells are not matched when reloading.
static void __FD_TEMPLATE_LAYOUT_CELL_PRIMARY_CALL_IF_CRASH_NOT_OUR_BUG__(void (^callout)(void)) {
    callout();
}
#define FDPrimaryCall(...) do {__FD_TEMPLATE_LAYOUT_CELL_PRIMARY_CALL_IF_CRASH_NOT_OUR_BUG__(^{__VA_ARGS__});} while(0)

@implementation UITableView (FDIndexPathHeightCacheInvalidation)

- (void)fd_reloadDataWithoutInvalidateIndexPathHeightCache {
    FDPrimaryCall([self fd_reloadData];);
}
```


一个奇技淫巧。看来这样可以在栈回朔中显示出这个“提示用的”方法名称。


## 14. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 147 - 168
 - Note : 

``` c
+ (void)load {
    // All methods that trigger height cache's invalidation
    SEL selectors[] = {
        @selector(reloadData),
        @selector(insertSections:withRowAnimation:),
        @selector(deleteSections:withRowAnimation:),
        @selector(reloadSections:withRowAnimation:),
        @selector(moveSection:toSection:),
        @selector(insertRowsAtIndexPaths:withRowAnimation:),
        @selector(deleteRowsAtIndexPaths:withRowAnimation:),
        @selector(reloadRowsAtIndexPaths:withRowAnimation:),
        @selector(moveRowAtIndexPath:toIndexPath:)
    };
    
    for (NSUInteger index = 0; index < sizeof(selectors) / sizeof(SEL); ++index) {
        SEL originalSelector = selectors[index];
        SEL swizzledSelector = NSSelectorFromString([@"fd_" stringByAppendingString:NSStringFromSelector(originalSelector)]);
        Method originalMethod = class_getInstanceMethod(self, originalSelector);
        Method swizzledMethod = class_getInstanceMethod(self, swizzledSelector);
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}
```


神奇的load方法。当第一次看到load方法，惊呼Objective C真是太灵活了。

load 文档参考如下：

```
Invoked whenever a class or category is added to the Objective-C runtime; implement this method to perform class-specific behavior upon loading.
The load message is sent to classes and categories that are both dynamically loaded and statically linked, but only if the newly loaded class or category implements a method that can respond.
The order of initialization is as follows:
All initializers in any framework you link to.
All +load methods in your image.
All C++ static initializers and C/C++ __attribute__(constructor) functions in your image.
All initializers in frameworks that link to you.
In addition:
A class’s +load method is called after all of its superclasses’ +load methods.
A category +load method is called after the class’s own +load method.
In a custom implementation of load you can therefore safely message other unrelated classes from the same image, but any load methods implemented by those classes may not have run yet.

```




## 15. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 162 - 166
 - Note : 

``` c
        SEL originalSelector = selectors[index];
        SEL swizzledSelector = NSSelectorFromString([@"fd_" stringByAppendingString:NSStringFromSelector(originalSelector)]);
        Method originalMethod = class_getInstanceMethod(self, originalSelector);
        Method swizzledMethod = class_getInstanceMethod(self, swizzledSelector);
        method_exchangeImplementations(originalMethod, swizzledMethod);
```


method_exchangeImplementations 可以交换两个Method。

类似做Windows开发时的API HOOK（detours、mhook），这Objective C的Runtime都给提供好了，更上层一些。

俗称“swizzle method”。


## 16. UITableView+FDKeyedHeightCache.m

 - Path : /Classes/UITableView+FDKeyedHeightCache.m
 - Line : 75 - 86
 - Note : 

``` c
@implementation UITableView (FDKeyedHeightCache)

- (FDKeyedHeightCache *)fd_keyedHeightCache {
    FDKeyedHeightCache *cache = objc_getAssociatedObject(self, _cmd);
    if (!cache) {
        cache = [FDKeyedHeightCache new];
        objc_setAssociatedObject(self, _cmd, cache, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return cache;
}

@end
```


每个TableView关联一个高度缓存


## 17. UITableView+FDTemplateLayoutCellDebug.h

 - Path : /Classes/UITableView+FDTemplateLayoutCellDebug.h
 - Line : 25 - 25
 - Note : 

``` c
@interface UITableView (FDTemplateLayoutCellDebug)
```


附加功能推荐用Category这种方式增加。



# Summarize




---
*Generated by [XSourceNote](https://github.com/everettjf/XSourceNote) at 2016-03-29 15:42:35 +0000*


