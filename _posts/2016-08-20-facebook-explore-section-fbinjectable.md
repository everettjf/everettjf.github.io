---
layout: post
title: Facebook iOS Client - Section FBInjectable
categories: Skill
comments: true
--- 

---
 
# Phenomenon
 
 MachOView viewing Facebook's executable file, found FBInjectable and fbsessiongks data segments, this article explores FBInjectable data segment's generation and usage.
 
![](/media/14713701978671.jpg)

<!-- more -->

# How to Locate

Device: iPhone5 jailbroken iOS 8.4 armv7

## Decrypt

Clutch or dumpdecrypted, get unencrypted Facebook armv7 executable.

## Initial Search strings

Use strings to search keyword FBInjectable, can know can use strings as entry point.

![](/media/14713711043679.jpg)


## Use Hopper and IDA Analysis

Use Hopper and IDA for analysis. Both Apps have pros and cons, use together.

Analysis is slow, my MBP CPU 2.2 i7 analyzed over 1 hour.

After analysis complete can freely navigate arm.

## Initial Location in Hopper

Search string FBInjectable

![](/media/14713715442206.jpg)

View one with cross references

![](/media/14713716052181.jpg)

![](/media/14713716295066.jpg)

Jump to view, can know address at 0x0334cc1c, and FBInjectable is used as getsectiondata's third parameter.

![](/media/14713716878000.jpg)

getsectiondata's call address is 0x0334cc20.

getsectiondata's definition:

![](/media/14713897883425.jpg)

Disassembly:

![](/media/14713901424795.jpg)


Need to focus on r11 variable. Hopper's disassembly seems to lose some key r2 information. But after reading can roughly know here iterates through getsectiondata's return value, does some processing every 4 bytes.

If IDA has F5 disassembly function, can see image below. Here doesn't lose key information. v19 as return value, converted to DWORD pointer (familiar from Windows development, double word, word is two bytes, DWORD is four bytes), then dereferences this pointer.

That is treats first four bytes of getsectiondata's return value buffer as string's memory address.

![](/media/14713904842654.jpg)

## MachOView Confirm FBInjectable Meaning

Look at FBInjectable segment's first four bytes again, B8DB8404, due to little-endian, memory address is 0x0484DBB8.

![](/media/14715339253688.jpg)

Jump to this address in Hopper:
![](/media/14715347620860.jpg)

Other four bytes are all like this.




## lldb Confirm getsectiondata Return Value Meaning

To confirm if Facebook calls getsectiondata after startup and passes FBInjectable, can set conditional breakpoint first.

Use debugserver to start App:

```
everettjfs-iPhone:~ root# debugserver -x backboard *:1234 /var/mobile/Containers/Bundle/Application/A7811200-13B6-4053-BAED-8D3E8DE7C929/Facebook.app/Facebook
```

Add conditional breakpoint:

```
70 = F
95 = _

(lldb) br set -n getsectiondata -c '(int)*(char*)$r2 == 70'
```

Continue running, found can break.

Single step, print return value r0's data.
![](/media/14713916594647.jpg)

![](/media/14713916821535.jpg)

 Here we found a problem, different from FBInjectable section's data.
 
 ![](/media/14713917406057.jpg)

But found a pattern, every 4 bytes subtracted is exactly ASLR offset address. (For example: 0x0488bbb8 - 0x0484dbb8 = 0x3e000)

That is FBInjectable data segment's data was modified before calling getsectiondata. Here temporarily ignore modification method (will introduce a modification method below), continue exploring.

Print current method's return value.
![](/media/14713924113293.jpg)

Can see here is very similar to strings search FBInjectable results at start,
![](/media/14713711043679.jpg)

PS: This step using conditional breakpoint causes startup very slow. But conditional breakpoint's purpose is only to confirm if there's this call. Since debugging needs to start App multiple times, can also directly set breakpoint to target address. (At startup, first breakpoint to start, then image list to view ASLR offset address, then calculate getsectiondata's address, then br s -a ADDRESS)

## Initial Conclusion

From this can know, FBInjectable stores
![](/media/14713945376097.jpg)

These string addresses, armv7 (32-bit) each address takes 4 bytes, image above 18 addresses total 72 bytes. Through FBInjectable's data can get these 18 strings.


## class-dump View

Search fb_injectable in header files,

![](/media/14713926308331.jpg)


## Look at lldb Call Stack


![](/media/14713930823544.jpg)

Image shows many folly symbols, folly is Facebook's open source C++ Library focused on performance, but don't know why has such big impact on lldb's symbols. (Need to further understand how lldb finds symbols when there's time). But addresses are all correct. Can get file address by subtracting ASLR offset address from frame's address.

Based on call stack, can track to following location:

This span might be a bit large, but based on those frame addresses in call stack, easily see image below content (this is just one of 18 configurations).

![](/media/14713937815940.jpg)
![](/media/14713938170666.jpg)

General flow:

FBNavigationBarSearchFieldLayout class's

```
+ (float)_calculateLeftOffsetForController:(id)arg1 isRoot:(BOOL)arg2 hasLeftMessengerButton:(BOOL)arg3;
```

Calls FBIntegrationManager class's

```
+ (Class)classForProtocol:(id)arg1;
```

Further calls

```
+ (id)classesForProtocol_internal:(id)arg1;
```

classesForProtocol_internal will load FBInjectable's content on first call (dispatch_once) and get these 18 strings, then convert to corresponding classes.

classForProtocol's parameter is protocol FBNavigationBarConfiguration, through this protocol gets class FBNavigationBarDefaultConfiguration.

Finally calls static method,
![](/media/14715360284429.jpg)


## Look at Header Files Again

These 18 classes have several common points

1. All contain method fb_injectable.
2. All contain method integrationPriority.
3. All are static methods.
4. All implement a similarly named protocol. For example: FBNavigationBarDefaultConfiguration implements protocol FBNavigationBarConfiguration.
    ![](/media/14715363734149.jpg)

5. Protocols mentioned in point 4 all inherit another protocol FBIntegrationToOne.
    ![](/media/14715363409527.jpg)



# Conclusion

At this point, can basically know FBInjectable's function, can draw following conclusions.

FBInjectable section is used to change some configurations at packaging stage. These configurations may affect interface (UI), functionality (Policy), and other aspects.

```
FBNewAccountNUXPYMKVCFactory,
FBPersonContextualTimelineHeaderDataSourceDefaultConfiguration,
FBTimelineActionBarDefaultConfiguration,
FBTimelineActionBarNuxPresentersDefaultConfiguration,
FBTimelineNavTilesFriendsFollowersDefaultConfiguration,
FBGroupsModuleDefaultConfiguration,
FBGroupsLandingWildeCoordinator,
FBEventsModuleDefaultConfiguration,
FBEventMessageGuestsDefaultCapability,
FBPhotoModuleDefaultConfiguration,
FBGrowthModuleDefaultConfiguration,
FBEventComposerKitDefaultConfiguration,
FBComposerDestinationOptionsDefaultPolicy,
FBBookmarksDownloaderConfiguration,
FBGroupCreationViewControllerDefaultStepsFactory,
FBNavigationBarDefaultConfiguration,
FBPersonalAppSuiteDefinitionProvider,
WildeKeys
```

These classes have following common information:

1. +(void)fb_injectable method.
	- This method is just a marker.
	- Used to conveniently find this class.
2. All implement a protocol corresponding to current class.
	- For example: FBNewAccountNUXPYMKVCFactory class corresponds to FBNewAccountNUXPYMKVCFactory protocol.
	- Another example: FBNavigationBarDefaultConfiguration class corresponds to FBNavigationBarConfiguration protocol.
	- Another example: FBEventsModuleDefaultConfiguration class corresponds to FBEventsModuleConfiguration protocol.
3. This corresponding protocol must implement FBIntegrationToOne. That is current class also includes + (unsigned int)integrationPriority; method.
	- For example: FBNewAccountNUXPYMKVCFactory, FBNavigationBarConfiguration, FBEventsModuleConfiguration all inherit FBIntegrationToOne protocol. Causes FBNewAccountNUXPYMKVCFactory and other classes to also include + (unsigned int)integrationPriority; method.
	- This method is used to specify lookup priority.
	- FBIntegrationToOne from name, can only integrate 1. Means select 1 based on priority.

For example:

```
float __cdecl +[FBNavigationBarSearchFieldLayout _calculateLeftOffsetForController:isRoot:hasLeftMessengerButton:]

FBNavigationBarConfiguration

Loop through which class implements this protocol, finally find FBNavigationBarDefaultConfiguration, then get shouldShowBackButton.
```

# FBInjectable's Creation

Can use `__attribute((used,section("segmentname,sectionname")))` keyword to put a variable into special section. 

attribute reference <http://gcc.gnu.org/onlinedocs/gcc-3.2/gcc/Variable-Attributes.html>

For example:

```
char * kString1 __attribute((used,section("__DATA,FBInjectable"))) = "string 1";
char * kString2 __attribute((used,section("__DATA,FBInjectable"))) = "string 2";
char * kString3 __attribute((used,section("__DATA,FBInjectable"))) = "string 3";
```

PS: Article modification: Above code unused changed to used. No need to reference, can avoid being optimized away in release.


# Summary

Compile-time configuration selection mechanism.

At compile time select certain configuration classes to include in compilation (precisely, at link time select certain configuration class object files to include in linking) or configuration priority, App runtime gets all configuration classes through FBInjectable, and uses each configuration class's corresponding protocol to get currently used specific configuration.


# Examples and Further Explanation

Demo mimics this mechanism.

Code: <https://github.com/everettjf/Yolo/tree/master/FBInjectableTest>

![](/media/14717165824862.jpg)


Demo implements three configuration classes, each configuration class uses code similar to below to automatically create FBInjectable segment. (~~printf is only to prevent compiler optimization, should have other methods to prevent optimization, haven't found yet, if you know, please tell me~~, thanks to vr2d classmate in iOS reverse engineering group, attribute's first parameter changed to used, can avoid being optimized away in release. Need to be careful, when saw unused felt a bit strange, but didn't carefully look up meaning.)

```
#define FBInjectableDATA __attribute((used, section("__DATA,FBInjectable")))
```

```
char * kNoteDisplayDefaultConfiguration FBInjectableDATA = "+[NoteDisplayDefaultConfiguration(FBInjectable) fb_injectable]";

@implementation NoteDisplayDefaultConfiguration

+ (void)fb_injectable{
}
+ (NSUInteger)integrationPriority{
    return 0;
}

+ (BOOL)showDeleteButton{
    return YES;
}
+ (UIColor *)noteBackgroundColor{
    return [UIColor blackColor];
}

@end
```

Read FBInjectable segment:

```
        Dl_info info;
        dladdr(readConfigurationClasses, &info);
        
#ifndef __LP64__
//        const struct mach_header *mhp = _dyld_get_image_header(0); // both works as below line
        const struct mach_header *mhp = (struct mach_header*)info.dli_fbase;
        unsigned long size = 0;
        uint32_t *memory = (uint32_t*)getsectiondata(mhp, "__DATA", InjectableSectionName, & size);
#else /* defined(__LP64__) */
        const struct mach_header_64 *mhp = (struct mach_header_64*)info.dli_fbase;
        unsigned long size = 0;
        uint64_t *memory = (uint64_t*)getsectiondata(mhp, "__DATA", InjectableSectionName, & size);
#endif /* defined(__LP64__) */
```


Finally usage:

```
    Class config = [FBIntegrationManager classForProtocol:@protocol(NoteDisplayConfiguration)];
    NSLog(@"cls = %@",config);
    NSLog(@"color = %@",[config noteBackgroundColor]);
```

# What Are the Benefits

Configuration files can be scattered in their own files, saves unified registration code for configuration files. This makes configuration files easier to add and delete.

# Difficulties Encountered During Exploration

<http://iosre.com/t/facebook-app-fbinjectable-section/4685>

At that time didn't have Demo yet, thought needed manual modification, but during writing Demo suddenly realized.

# Summary

Above steps are just steps I reorganized after exploration, actual exploration process steps may interweave.

Strangely Facebook doesn't seem to mention this "configuration selection" small method in any articles. Twitter and Google both found no information about FBInjectable. Luckily can explore through reverse engineering.



