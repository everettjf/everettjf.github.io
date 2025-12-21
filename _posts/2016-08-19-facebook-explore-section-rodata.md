---
layout: post
title: Exploring Facebook iOS Client - Section RODATA
categories: Skill
comments: true
--- 



# Phenomenon

When using MachOView to view Facebook's iOS binary file, found several Sections different from most other Apps.

Image below is Facebook:

![Facebook](/media/14712760652964.jpg)

Image below is WeChat:

![](/media/14712762093391.jpg)

<!-- more -->

# Initial Analysis

```
    __TEXT
    The __TEXT segment contains our code to be run. It's mapped as read-only and executable. The process is allowed to execute the code, but not to modify it. The code can not alter itself, and these mapped pages can therefore never become dirty.
    __DATA
    The __DATA segment is mapped read/write but non-executable. It contains values that need to be updated.
    __RODATA   :  read only data ， still non-executable.
```

TEXT is code segment, DATA is data segment, RODATA is read-only data segment. Facebook moved some content from code segment to read-only segment, can know this content doesn't need to be executed, from image below can also see they're all constants.

![](/media/14712778296998.jpg)



# Why

Look at Facebook's segment sizes, as shown:

![](/media/14712790779062.jpg)

Moving TEXT segment content to RODATA segment, that is reduces TEXT segment size.

Check Apple's review requirements:

<https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SubmittingTheApp.html>

![](/media/14712795366819.jpg)

Can know, if want to support iOS 7.x or 8.x, TEXT segment's maximum size is 60MB (each architecture's TEXT segment). Facebook's TEXT segment is almost at 60MB.

# How to Do

If our App's TEXT size is almost at 60MB, how to handle like Facebook?

man ld:
![](/media/14712799872260.jpg)

Add linker options:

```
-Wl,-rename_section,__TEXT,__cstring,__RODATA,__cstring
-Wl,-rename_section,__TEXT,__gcc_except_tab,__RODATA,__gcc_except_tab
-Wl,-rename_section,__TEXT,__const,__RODATA,__const
-Wl,-rename_section,__TEXT,__objc_methname,__RODATA,__objc_methname
-Wl,-rename_section,__TEXT,__objc_classname,__RODATA,__objc_classname
-Wl,-rename_section,__TEXT,__objc_methtype,__RODATA,__objc_methtype
```

As shown:
![](/media/14712804570512.jpg)

![](/media/14712804466103.jpg)

# Does It Affect App Operation?

After testing in my own App, no impact at all.

# Is It Really OK?

There's a small worry, does Objective C Runtime have any relationship with these constants? Why does changing constant's segment name not affect program operation.

Code: <https://opensource.apple.com/tarballs/objc4/objc4-680.tar.gz>

Searching code for methname methtype found no related information, roughly guess runtime doesn't do targeted handling for getting these constants.

Search <https://github.com/llvm-mirror/llvm> for objc_methname or objc_methtype, objc_methtype only found in some tests. objc_methname besides test usage, also used in ARC optimizer.

Will modifying segment affect this optimizer?

![](/media/14712826297536.jpg)

Further find GlobalVariable::getSection() source.
getSection comes from GlobalVariable's parent class GlobalObject.

![](/media/14712828749695.jpg)

From current information, section's possible content is `__TEXT,__objc_methname` or `__RODATA,__objc_methname`, and code above is Section.find, searches in string, so can automatically adapt to segment modification.

Other segments probably use similar methods, can confirm no impact.

# How Much Can TEXT Segment Shrink

Using Facebook armv7 as example, RODATA segment size about 14MB.

![](/media/14713639408868.jpg)



# Historical Idea

Initially thought moving data in TEXT segment that doesn't need immediate loading to RODATA was to speed up App startup, but think about mmap's advantage is can quickly handle large files, loading together won't have performance impact.

# Reference Project

Code: <https://github.com/everettjf/Yolo/tree/master/FBInjectableTest>

![](/media/14717179771404.jpg)


# Additional Notes

Segment permissions can be changed to VM_PROT_READ via following linker parameters.

```
-Wl,-segprot,__RODATA,r,r
```


# Other Materials

- <http://stackoverflow.com/questions/4753100/max-size-of-an-ios-application>
- WWDC App Thinning: <https://developer.apple.com/videos/play/wwdc2015/404/>
- "Programmer's Self-Cultivation - Linking, Loading and Libraries"
- "Linkers and Loaders"
- <https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/MachOTopics/0-Introduction/introduction.html>
- OS X ABI Mach-O File Format Reference <https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/MachORuntime/index.html>





 



