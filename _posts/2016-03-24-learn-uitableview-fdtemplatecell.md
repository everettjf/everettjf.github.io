---
layout: post
title: UITableView-FDTemplateLayoutCell Learning Notes
categories: Skill
comments: true
---



# Basic Information
 - Name : UITableView-FDTemplateLayoutCell
 - Site : <https://github.com/forkingdog/UITableView-FDTemplateLayoutCell>
 - Repo : <https://github.com/forkingdog/UITableView-FDTemplateLayoutCell>
 - Revision : e3ee86ce419d18d3ff735056f1474f2863e43003
 - Description : 
Simple and easy-to-use UITableViewCell auto height.
Author's blog article <http://blog.sunnyxx.com/2015/05/17/cell-height-calculation/>

<!-- more -->

# Global Note
Simple and easy to use, but when used in some complex interfaces (such as chat windows), more optimization issues need to be considered.


# File Notes

## 0. UITableView+FDTemplateLayoutCell.h

 - Path : /Classes/UITableView+FDTemplateLayoutCell.h
 - Line : 35 - 35
 - Note : 

``` c
- (__kindof UITableViewCell *)fd_templateCellForReuseIdentifier:(NSString *)identifier;
```


__kindof XXXClass can be used this way


## 1. UITableView+FDTemplateLayoutCell.h

 - Path : /Classes/UITableView+FDTemplateLayoutCell.h
 - Line : 28 - 28
 - Note : 

``` c
@interface UITableView (FDTemplateLayoutCell)
```


UITableView extension


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


Using UITableViewCell template cell to calculate height, can check inside the cell if it's currently a template cell via fd_isTemplateLayoutCell. Can skip some operations unrelated to height.


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


Implementation of adding properties using runtime.

SEL type _cmd, exists inside each method, represents the method itself.
Therefore, NSStringFromSelector(_cmd) returns the current method name.

Using the getter's SEL (i.e., _cmd) as the key for objc_getAssociatedObject. Worth learning. But note that set must also use the same key, which is @selector(fd_isTemplateLayoutCell).




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


Specifying index to define array. OC has many tricks.


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


AutoLayout method to calculate Size: systemLayoutSizeFittingSize.
Here add a width constraint, calculate height, then remove it. Good idea.


## 6. UITableView+FDTemplateLayoutCell.m

 - Path : /Classes/UITableView+FDTemplateLayoutCell.m
 - Line : 79 - 81
 - Note : 

``` c
        // Try '- sizeThatFits:' for frame layout.
        // Note: fitting height should not include separator view.
        fittingHeight = [cell sizeThatFits:CGSizeMake(contentViewWidth, 0)].height;
```


When not using AutoLayout, use sizeThatFits to get size. Custom cells need to implement this function.


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


Key function.

- Associate a mutable dictionary with the current TableView.
- One Key for each CellIdentifier.
- Used to store template cells.
- Template cells are used to build cells in memory and calculate height for this template cell.


## 8. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 26 - 26
 - Note : 

``` c
typedef NSMutableArray<NSMutableArray<NSNumber *> *> FDIndexPathHeightsBySection;
```


Cache heights. One array per section.


## 9. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 29 - 30
 - Note : 

``` c
@property (nonatomic, strong) FDIndexPathHeightsBySection *heightsBySectionForPortrait;
@property (nonatomic, strong) FDIndexPathHeightsBySection *heightsBySectionForLandscape;
```


Separate cache for portrait and landscape.


## 10. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 45 - 45
 - Note : 

``` c
    return UIDeviceOrientationIsPortrait([UIDevice currentDevice].orientation) ? self.heightsBySectionForPortrait: self.heightsBySectionForLandscape;
```


Check portrait or landscape


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


Note CGFLOAT_IS_DOUBLE.


## 12. UITableView+FDIndexPathHeightCache.m

 - Path : /Classes/UITableView+FDIndexPathHeightCache.m
 - Line : 124 - 124
 - Note : 

``` c
        [self methodSignatureForSelector:nil];
```


Don't understand this NSMethodSignature


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


A clever trick. Looks like this can display this "hint" method name in stack traces.


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


Amazing load method. When I first saw the load method, exclaimed that Objective C is so flexible.

load documentation reference:

```
Invoked whenever a class or category is added to the Objective-C runtime; implement this method to perform class-specific behavior upon loading.
The load message is sent to classes and categories that are both dynamically loaded and statically linked, but only if the newly loaded class or category implements a method that can respond.
The order of initialization is as follows:
All initializers in any framework you link to.
All +load methods in your image.
All C++ static initializers and C/C++ __attribute__(constructor) functions in your image.
All initializers in frameworks that link to you.
In addition:
A class's +load method is called after all of its superclasses' +load methods.
A category +load method is called after the class's own +load method.
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


method_exchangeImplementations can exchange two Methods.

Similar to API HOOK when doing Windows development (detours, mhook), Objective C's Runtime provides this, more high-level.

Commonly called "swizzle method".


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


Associate a height cache with each TableView


## 17. UITableView+FDTemplateLayoutCellDebug.h

 - Path : /Classes/UITableView+FDTemplateLayoutCellDebug.h
 - Line : 25 - 25
 - Note : 

``` c
@interface UITableView (FDTemplateLayoutCellDebug)
```


Recommend using Category to add additional functionality.



# Summarize




---
*Generated by [XSourceNote](https://github.com/everettjf/XSourceNote) at 2016-03-29 15:42:35 +0000*

